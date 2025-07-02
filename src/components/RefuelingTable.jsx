import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ENDPOINTS } from "../utilities/endpoints";
import { IoClose } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/Logo.jpg";
import UnauthorizedPage from "./UnauthorizedPage";
import ServerErrorPage from "./ServerErrorPage";

const RefuelingTable = () => {
  const [refuelingRequests, setRefuelingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  // OTP states
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpAction, setOtpAction] = useState(null); // "forward" or "reject"

  const [errorType, setErrorType] = useState(null); // "unauthorized" | "server" | null

  const fetchRefuelingRequests = async () => {
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      setErrorType("unauthorized");
      return;
    }
    try {
      const response = await fetch(ENDPOINTS.REFUELING_REQUEST_LIST, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setErrorType("unauthorized");
        } else {
          setErrorType("server");
        }
        throw new Error("Failed to fetch refueling requests");
      }

      const data = await response.json();
      setRefuelingRequests(data.results || []);
    } catch (error) {
      console.error("Error fetching refueling requests:", error);
      toast.error("Failed to fetch refueling requests.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestDetail = async (id) => {
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }

    setDetailLoading(true);
    try {
      const response = await fetch(ENDPOINTS.REFUELING_REQUEST_DETAIL(id), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch refueling request detail");
      }
      const data = await response.json();
      setSelectedRequest(data);
    } catch (error) {
      console.error("Error fetching request details:", error);
      toast.error("Failed to fetch request details.");
    } finally {
      setDetailLoading(false);
    }
  };

  // Send OTP using backend endpoint
  const sendOtp = async () => {
    setOtpLoading(true);
    try {
      const accessToken = localStorage.getItem("authToken");
      const response = await fetch(ENDPOINTS.OTP_REQUEST, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      setOtpSent(true);
      toast.success("OTP sent to your phone");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle OTP verification and action (forward/reject)
  const handleOtpAction = async (otp, action) => {
    setOtpLoading(true);
    try {
      const accessToken = localStorage.getItem("authToken");
      let payload = { action, otp_code: otp };
      if (action === "reject") {
        payload.rejection_message = rejectionMessage;
      }
      const response = await fetch(
        ENDPOINTS.APPREJ_REFUELING_REQUEST(selectedRequest.id),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.detail || `Failed to ${action} the refueling request`
        );
      }
      await fetchRefuelingRequests();
      setSelectedRequest(null);
      setRejectionMessage("");
      setOtpModalOpen(false);
      setOtpValue("");
      setOtpSent(false);
      setOtpAction(null);
      toast.success(
        `Request ${
          action === "forward" ? "forwarded" : "rejected"
        } successfully!`
      );
    } catch (error) {
      toast.error(`Failed to ${action} the request.`);
    } finally {
      setOtpLoading(false);
      setActionLoading(false);
    }
  };

  // Show OTP modal and send OTP
  const handleActionWithOtp = async (actionType) => {
    setOtpAction(actionType);
    setOtpModalOpen(true);
    await sendOtp();
  };

  useEffect(() => {
    fetchRefuelingRequests();
    // eslint-disable-next-line
  }, []);

  if (errorType === "unauthorized") {
    return <UnauthorizedPage />;
  }
  if (errorType === "server") {
    return <ServerErrorPage />;
  }

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center mb-4">Refueling Requests</h2>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading refueling requests...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Destination</th>
                <th>Driver</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {refuelingRequests.map((request, index) => (
                <tr key={request.id}>
                  <td>{index + 1}</td>
                  <td>{new Date(request.created_at).toLocaleDateString()}</td>
                  <td>{request.destination || "N/A"}</td>
                  <td>{request.requester_name || "N/A"}</td>
                  <td>{request.status || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: "#181E4B", color: "white" }}
                      onClick={() => fetchRequestDetail(request.id)}
                    >
                      View Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Viewing Details */}
      {selectedRequest && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <img
                  src={Logo}
                  alt="Logo"
                  style={{
                    width: "100px",
                    height: "70px",
                    marginRight: "10px",
                  }}
                />
                <h5 className="modal-title">Refueling Request Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedRequest(null)}
                >
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                {detailLoading ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading details...</p>
                  </div>
                ) : (
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Request Date:</strong>{" "}
                          {new Date(
                            selectedRequest.created_at
                          ).toLocaleString()}
                        </p>
                        <p>
                          <strong>Driver:</strong>{" "}
                          {selectedRequest.requester_name || "N/A"}
                        </p>
                        <p>
                          <strong>Vehicle:</strong>{" "}
                          {selectedRequest.requesters_car_name || "N/A"}
                        </p>
                        <p>
                          <strong>Destination:</strong>{" "}
                          {selectedRequest.destination || "N/A"}
                        </p>
                        <p>
                          <strong>Estimated Distance:</strong>{" "}
                          {selectedRequest.estimated_distance_km ?? "N/A"} km
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Fuel Type:</strong>{" "}
                          {selectedRequest.fuel_type || "N/A"}
                        </p>
                        <p>
                          <strong>Fuel Efficiency:</strong>{" "}
                          {selectedRequest.fuel_efficiency ?? "N/A"} km/L
                        </p>
                        <p>
                          <strong>Fuel Needed:</strong>{" "}
                          {selectedRequest.fuel_needed_liters ?? "N/A"} L
                        </p>
                        <p>
                          <strong>Fuel Price per Liter:</strong>{" "}
                          {selectedRequest.fuel_price_per_liter ?? "N/A"}
                        </p>
                        <p>
                          <strong>Total Cost:</strong>{" "}
                          {selectedRequest.total_cost ?? "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn"
                  style={{ backgroundColor: "#181E4B", color: "white" }}
                  onClick={() => handleActionWithOtp("forward")}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Forward "}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleActionWithOtp("reject")}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Reject"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {otpModalOpen && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Enter OTP to {otpAction === "forward" ? "forward" : "reject"}{" "}
                  request
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setOtpModalOpen(false);
                    setOtpValue("");
                    setOtpSent(false);
                    setOtpAction(null);
                    setRejectionMessage("");
                  }}
                  disabled={otpLoading}
                >
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                <p>Enter the OTP code sent to your phone number.</p>
                <input
                  type="text"
                  className="form-control"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) =>
                    setOtpValue(e.target.value.replace(/\D/g, ""))
                  }
                  disabled={otpLoading}
                  placeholder="Enter OTP"
                />
                {otpAction === "reject" && (
                  <textarea
                    className="form-control mt-3"
                    rows={2}
                    value={rejectionMessage}
                    onChange={(e) => setRejectionMessage(e.target.value)}
                    placeholder="Reason for rejection"
                    disabled={otpLoading}
                  />
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-link"
                  onClick={() => sendOtp()}
                  disabled={otpLoading}
                >
                  Resend OTP
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
                  Cancel
                </button>
                <button
                  className={`btn ${
                    otpAction === "forward" ? "" : "btn-danger"
                  }`}
                  style={
                    otpAction === "forward"
                      ? { backgroundColor: "#181E4B", color: "white" }
                      : {}
                  }
                  disabled={otpLoading || otpValue.length !== 6}
                  onClick={() => handleOtpAction(otpValue, otpAction)}
                >
                  {otpLoading
                    ? "Processing..."
                    : otpAction === "forward"
                    ? "Forward"
                    : "Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal (deprecated if using OTP for reject) */}

      {showRejectModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Request</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRejectModal(false)}
                >
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  placeholder="Enter rejection reason"
                  value={rejectionMessage}
                  onChange={(e) => setRejectionMessage(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-danger"
                  onClick={handleRejectAction}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Processing..." : "Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefuelingTable;
