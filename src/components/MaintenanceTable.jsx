import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ENDPOINTS } from "../utilities/endpoints";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomPagination from "./CustomPagination";
import { useLanguage } from "../context/LanguageContext";

const MaintenanceManagement = () => {
  // State variables
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // OTP-related states
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpAction, setOtpAction] = useState(null); // "forward" or "reject"
  const [rejectionMessage, setRejectionMessage] = useState("");

  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageRequests = maintenanceRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const { mylanguage } = useLanguage();

  // Fetch data
  const fetchData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    setLoading(true);
    try {
      // Fetch maintenance requests
      const requestsRes = await fetch(ENDPOINTS.LIST_MAINTENANCE_REQUESTS, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const requestsData = await requestsRes.json();
      setMaintenanceRequests(requestsData.results || []);
    } catch (err) {
      toast.error(
        mylanguage === "EN"
          ? "Failed to load data"
          : "ዳታ ማምጣት አልተቻለም"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
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

  // Handle OTP verification and action (forward, reject)
  const handleOtpAction = async () => {
    setOtpLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      let payload = { action: otpAction, otp_code: otpValue };

      if (otpAction === "reject") {
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
              ? `Failed to ${otpAction} request`
              : `ጥያቄ ላይ ${otpAction} አልተቻለም`)
        );
      }

      // Success message based on action
      let successMessage = "";
      if (otpAction === "forward") {
        successMessage =
          mylanguage === "EN" ? "Request forwarded!" : "ጥያቄ ተቀድሷል!";
      } else if (otpAction === "reject") {
        successMessage =
          mylanguage === "EN" ? "Request rejected!" : "ጥያቄ ተቀባይነት አላገኘም!";
      }

      toast.success(successMessage);

      // Reset states
      setSelectedRequest(null);
      setOtpModalOpen(false);
      setOtpValue("");
      setOtpSent(false);
      setOtpAction(null);
      setRejectionMessage("");

      // Refresh the data
      fetchData();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-center" autoClose={5000} />
      <h2 className="text-center mb-4">
        {mylanguage === "EN" ? "Maintenance Requests" : "የጥገና ጥያቄዎች"}
      </h2>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
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
                      <span className={`badge ${
                        request.status === 'pending' ? 'bg-warning text-dark' :
                        request.status === 'approved' ? 'bg-success' :
                        request.status === 'rejected' ? 'bg-danger' : 'bg-secondary'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
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
      )}
      <CustomPagination
        currentPage={currentPage}
        totalPages={Math.ceil(maintenanceRequests.length / itemsPerPage)}
        handlePageChange={setCurrentPage}
      />

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title">
                  {mylanguage === "EN"
                    ? "Maintenance Request Details"
                    : "የጥገና ጥያቄ ዝርዝሮች"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedRequest(null)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Card-style layout, clean with no blue color */}
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <div className="mb-2">
                      <span className="fw-bold">{mylanguage === "EN" ? "Requester:" : "ለማን፡"}</span>
                      <span className="ms-2">{selectedRequest.requester_name}</span>
                    </div>
                    <div className="mb-2">
                      <span className="fw-bold">{mylanguage === "EN" ? "Vehicle:" : "መኪና፡"}</span>
                      <span className="ms-2">{selectedRequest.requesters_car_name}</span>
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div className="mb-2">
                      <span className="fw-bold">{mylanguage === "EN" ? "Date:" : "ቀን፡"}</span>
                      <span className="ms-2">{new Date(selectedRequest.date).toLocaleDateString()}</span>
                    </div>
                    <div className="mb-2">
                      <span className="fw-bold">{mylanguage === "EN" ? "Status:" : "ሁኔታ፡"}</span>
                      <span className={`badge ms-2 ${
                        selectedRequest.status === 'pending' ? 'bg-warning text-dark' :
                        selectedRequest.status === 'approved' ? 'bg-success' :
                        selectedRequest.status === 'rejected' ? 'bg-danger' : 'bg-secondary'
                      }`}>
                        {selectedRequest.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <h6 className="fw-bold">{mylanguage === "EN" ? "Request Details" : "የጥያቄ ዝርዝሮች"}</h6>
                  <div className="border rounded p-3 bg-light">
                    {selectedRequest.reason || (
                      mylanguage === "EN"
                        ? "No details provided"
                        : "ዝርዝሮች አልተሰጡም"
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                {selectedRequest.status === 'pending' && (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={async () => {
                        setOtpAction("forward");
                        setOtpModalOpen(true);
                        await sendOtp();
                      }}
                      disabled={otpLoading}
                    >
                      {mylanguage === "EN" ? "Forward" : "ላክ"}
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={async () => {
                        setOtpAction("reject");
                        setOtpModalOpen(true);
                        await sendOtp();
                      }}
                      disabled={otpLoading}
                    >
                      {mylanguage === "EN" ? "Reject" : "አትቀበል"}
                    </button>
                  </>
                )}
                <button
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
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header  text-black">
                <h5 className="modal-title">
                  {mylanguage === "EN"
                    ? "Enter OTP and choose action"
                    : "OTP ያስገቡ እና ድርጊት ይምረጡ"}
                </h5>
                <button
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

                {otpAction === "reject" && (
                  <div className="mt-3">
                    <label className="form-label">
                      {mylanguage === "EN"
                        ? "Reason for rejection:"
                        : "ለመቀባያ ምክንያት፡"}
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={rejectionMessage}
                      onChange={(e) => setRejectionMessage(e.target.value)}
                      placeholder={
                        mylanguage === "EN"
                          ? "Enter reason for rejection..."
                          : "ለመቀባያ ምክንያት ያስገቡ..."
                      }
                      disabled={otpLoading}
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-link"
                  onClick={sendOtp}
                  disabled={otpLoading}
                >
                  {mylanguage === "EN" ? "Resend OTP" : "OTP ደግመው ይላኩ"}
                </button>
                <button
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
                <button
                  className="btn btn-success"
                  onClick={handleOtpAction}
                  disabled={
                    otpLoading ||
                    otpValue.length !== 6 ||
                    (otpAction === "reject" && !rejectionMessage.trim())
                  }
                >
                  {otpLoading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : null}
                  {mylanguage === "EN" ? "Confirm" : "አረጋግጥ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceManagement;