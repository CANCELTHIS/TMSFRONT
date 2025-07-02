import { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ENDPOINTS } from "../utilities/endpoints";
import CustomPagination from "./CustomPagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../context/LanguageContext";
import "../index.css";
import UnauthorizedPage from "./UnauthorizedPage";
import ServerErrorPage from "./ServerErrorPage";

const MaintenanceTable = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpAction, setOtpAction] = useState(null); // "forward", "reject", or "approve"
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [errorType, setErrorType] = useState(null); // "unauthorized" | "server" | null

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageRequests = maintenanceRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const { mylanguage } = useLanguage();

  // Fetch maintenance requests
  const fetchMaintenanceRequests = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrorType("unauthorized");
      toast.error(
        mylanguage === "EN" ? "Authentication required" : "ማረጋገጫ ያስፈልጋል"
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.LIST_MAINTENANCE_REQUESTS, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setErrorType("unauthorized");
        } else {
          setErrorType("server");
        }
        throw new Error(
          mylanguage === "EN"
            ? "Failed to fetch requests"
            : "ጥያቄዎችን ማግኘት አልተቻለም"
        );
      }

      const data = await response.json();
      setMaintenanceRequests(data.results || []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [mylanguage]);

  // Send OTP using backend endpoint
  const sendOtp = async () => {
    setOtpLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(ENDPOINTS.OTP_REQUEST, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(
          mylanguage === "EN" ? "Failed to send OTP" : "OTP መላክ አልተቻለም"
        );
      }

      setOtpSent(true);
      toast.success(
        mylanguage === "EN" ? "OTP sent to your phone" : "OTP ወደ ስልክዎ ተልኳል"
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle OTP verification and action (forward, reject, or approve)
  const handleOtpAction = async (otp, action) => {
    setOtpLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      let payload = { action, otp_code: otp };

      if (action === "reject") {
        payload.rejection_message = rejectionMessage;
      }

      const response = await fetch(
        ENDPOINTS.MAINTENANCE_REQUEST_ACTION(selectedRequest.id),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.detail ||
            (mylanguage === "EN"
              ? `Failed to ${action} request`
              : `ጥያቄ ላይ ${action} አልተቻለም`)
        );
      }

      // Success message based on action
      let successMessage = "";
      if (action === "forward") {
        successMessage =
          mylanguage === "EN" ? "Request forwarded!" : "ጥያቄ ተቀድሷል!";
      } else if (action === "reject") {
        successMessage =
          mylanguage === "EN" ? "Request rejected!" : "ጥያቄ ተቀባይነት አላገኘም!";
      } else if (action === "approve") {
        successMessage =
          mylanguage === "EN" ? "Request approved!" : "ጥያቄ ተፈቅዷል!";
      }

      toast.success(successMessage);

      // Reset states
      setSelectedRequest(null);
      setOtpModalOpen(false);
      setOtpValue("");
      setOtpSent(false);
      setOtpAction(null);
      setRejectionMessage("");

      // Refresh the requests list
      fetchMaintenanceRequests();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Fetch maintenance requests on mount
  useEffect(() => {
    fetchMaintenanceRequests();
  }, [fetchMaintenanceRequests]);

  if (errorType === "unauthorized") {
    return <UnauthorizedPage />;
  }
  if (errorType === "server") {
    return <ServerErrorPage />;
  }

  return (
    <div className="container mt-5">
      <ToastContainer position="top-center" autoClose={5000} />

      <h2 className="text-center mb-4">
        {mylanguage === "EN" ? "Maintenance Requests" : "የጥገና ጥያቄዎች"}
      </h2>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              {mylanguage === "EN" ? "Loading..." : "በመጫን ላይ..."}
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{mylanguage === "EN" ? "Date" : "ቀን"}</th>
                  <th>{mylanguage === "EN" ? "Requester" : "ለማን"}</th>
                  <th>{mylanguage === "EN" ? "Vehicle" : "መኪና"}</th>
                  <th>{mylanguage === "EN" ? "Status" : "ሁኔታ"}</th>
                  <th>{mylanguage === "EN" ? "Actions" : "ድርጊቶች"}</th>
                </tr>
              </thead>
              <tbody>
                {currentPageRequests.length > 0 ? (
                  currentPageRequests.map((request, index) => (
                    <tr key={request.id}>
                      <td>{startIndex + index + 1}</td>
                      <td>{new Date(request.date).toLocaleDateString()}</td>
                      <td>{request.requester_name}</td>
                      <td>{request.requesters_car_name}</td>
                      <td>
                        <span>{request.status}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm"
                          style={{ backgroundColor: "#14183E", color: "#fff" }}
                          onClick={() => setSelectedRequest(request)}
                        >
                          {mylanguage === "EN" ? "View" : "እይታ"}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      {mylanguage === "EN"
                        ? "No maintenance requests found"
                        : "የጥገና ጥያቄዎች አልተገኙም"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {maintenanceRequests.length > 0 && (
            <CustomPagination
              currentPage={currentPage}
              totalPages={Math.ceil(maintenanceRequests.length / itemsPerPage)}
              handlePageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {mylanguage === "EN"
                    ? "Maintenance Request Details"
                    : "የጥገና ጥያቄ ዝርዝሮች"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedRequest(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>
                        {mylanguage === "EN" ? "Request ID:" : "የጥያቄ መለያ፡"}
                      </strong>{" "}
                      {selectedRequest.id}
                    </p>
                    <p>
                      <strong>{mylanguage === "EN" ? "Date:" : "ቀን፡"}</strong>{" "}
                      {new Date(selectedRequest.date).toLocaleString()}
                    </p>
                    <p>
                      <strong>
                        {mylanguage === "EN" ? "Requester:" : "ለማን፡"}
                      </strong>{" "}
                      {selectedRequest.requester_name}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>
                        {mylanguage === "EN" ? "Vehicle:" : "መኪና፡"}
                      </strong>{" "}
                      {selectedRequest.requesters_car_name}
                    </p>
                    <p>
                      <strong>
                        {mylanguage === "EN" ? "Status:" : "ሁኔታ፡"}
                      </strong>{" "}
                      {selectedRequest.status}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <h5>
                    {mylanguage === "EN" ? "Request Details" : "የጥያቄ ዝርዝሮች"}
                  </h5>
                  <div className="border p-3 rounded bg-light">
                    {selectedRequest.reason ||
                      (mylanguage === "EN"
                        ? "No details provided"
                        : "ዝርዝሮች አልተሰጡም")}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: "#14183E", color: "#fff" }}
                  onClick={async () => {
                    setOtpAction("forward");
                    setOtpModalOpen(true);
                    await sendOtp();
                  }}
                  disabled={otpLoading}
                >
                  {mylanguage === "EN" ? "Send OTP" : "OTP ይላኩ"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedRequest(null)}
                  disabled={otpLoading}
                >
                  {mylanguage === "EN" ? "Close" : "ዝጋ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {otpModalOpen && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {mylanguage === "EN"
                    ? "Enter OTP and choose action"
                    : "OTP ያስገቡ እና ድርጊት ይምረጡ"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => {
                    setOtpModalOpen(false);
                    setOtpValue("");
                    setOtpSent(false);
                    setOtpAction(null);
                    setRejectionMessage("");
                  }}
                  disabled={otpLoading}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  {mylanguage === "EN"
                    ? "Enter the OTP code sent to your phone number."
                    : "ወደ ስልክዎ የተላከውን OTP ያስገቡ።"}
                </p>
                <input
                  type="text"
                  className="form-control"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) =>
                    setOtpValue(e.target.value.replace(/\D/g, ""))
                  }
                  disabled={otpLoading}
                  placeholder={mylanguage === "EN" ? "Enter OTP" : "OTP ያስገቡ"}
                />
                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn flex-fill"
                    style={{ backgroundColor: "#14183E", color: "#fff" }}
                    disabled={otpLoading || otpValue.length !== 6}
                    onClick={() => handleOtpAction(otpValue, "forward")}
                  >
                    {mylanguage === "EN" ? "Forward" : "ቀጥል"}
                  </button>
                  <button
                    className="btn btn-danger flex-fill"
                    disabled={otpLoading || otpValue.length !== 6}
                    onClick={() => handleOtpAction(otpValue, "reject")}
                  >
                    {mylanguage === "EN" ? "Reject" : "አትቀበል"}
                  </button>
                </div>
                {otpAction === "reject" && (
                  <textarea
                    className="form-control mt-3"
                    rows={2}
                    value={rejectionMessage}
                    onChange={(e) => setRejectionMessage(e.target.value)}
                    placeholder={
                      mylanguage === "EN"
                        ? "Reason for rejection"
                        : "የመቀበል ምክንያት"
                    }
                    disabled={otpLoading}
                  />
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => sendOtp()}
                  disabled={otpLoading}
                >
                  {mylanguage === "EN" ? "Resend OTP" : "OTP ደግመው ይላኩ"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setOtpModalOpen(false);
                    setOtpValue("");
                    setOtpSent(false);
                    setOtpAction(null);
                    setRejectionMessage("");
                  }}
                  disabled={otpLoading}
                >
                  {mylanguage === "EN" ? "Cancel" : "ይቅር"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceTable;
