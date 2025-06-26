import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ENDPOINTS } from "../utilities/endpoints";
import { IoClose } from "react-icons/io5";
import CustomPagination from "./CustomPagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BUmaintenance = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpAction, setOtpAction] = useState(null); // "forward" or "reject"
  const [otpSent, setOtpSent] = useState(false);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageRequests = maintenanceRequests.slice(startIndex, endIndex);

  // Fetch maintenance requests
  const fetchMaintenanceRequests = async () => {
    const accessToken = localStorage.getItem("authToken");

    if (!accessToken) {
      console.error("No access token found.");
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.LIST_MAINTENANCE_REQUESTS, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch maintenance requests");
      }

      const data = await response.json();
      console.log("Fetched maintenance requests:", data.results);
      setMaintenanceRequests(data.results || []);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      toast.error("Failed to fetch maintenance requests.");
    } finally {
      setLoading(false);
    }
  };

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

  // Handle OTP verification and action (forward or reject)
  const handleOtpAction = async (otp, action) => {
    setOtpLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      let payload = { action, otp_code: otp };
      if (action === "reject") {
        if (!rejectionMessage.trim()) {
          toast.error("Rejection message cannot be empty.");
          setOtpLoading(false);
          return;
        }
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
        throw new Error(data.detail || `Failed to ${action} request`);
      }

      toast.success(
        action === "approve" ? "Request approved!" : "Request rejected!"
      );

      setSelectedRequest(null);
      setOtpModalOpen(false);
      setOtpValue("");
      setOtpSent(false);
      setOtpAction(null);
      setRejectionMessage("");
      fetchMaintenanceRequests();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle actions (forward, reject)
  const handleAction = async (id, action) => {
    const accessToken = localStorage.getItem("authToken");

    if (!accessToken) {
      console.error("No access token found.");
      return;
    }

    setActionLoading(true);
    try {
      const body = { action };
      if (action === "reject") {
        body.rejection_message = rejectionMessage;
      }

      const response = await fetch(ENDPOINTS.MAINTENANCE_REQUEST_ACTION(id), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} the maintenance request`);
      }

      fetchMaintenanceRequests(); // Refresh the list after action
      setSelectedRequest(null);
      toast.success(
        `Request ${
          action === "approve" ? "approved" : "rejected"
        } successfully!`
      ); // Success toast
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
      toast.error(`Failed to ${action} the request.`); // Error toast
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmAction = () => {
    if (pendingAction && selectedRequest) {
      handleAction(selectedRequest.id, pendingAction);
    }
    setShowConfirmModal(false);
  };

  const handleRejectAction = () => {
    if (rejectionMessage.trim() && selectedRequest) {
      handleAction(selectedRequest.id, "reject");
      setShowRejectModal(false);
    } else {
      toast.error("Rejection message cannot be empty."); // Error toast
    }
  };

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center mb-4">Maintenance Requests</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading maintenance requests...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Requester Name</th>
                <th>Requester's Car</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPageRequests.map((request, index) => (
                <tr key={request.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{new Date(request.date).toLocaleDateString()}</td>
                  <td>{request.requester_name || "N/A"}</td>
                  <td>{request.requesters_car_name || "N/A"}</td>
                  <td>{request.status || "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: "#181E4B", color: "white" }}
                      onClick={() => setSelectedRequest(request)}
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

      <CustomPagination
        currentPage={currentPage}
        totalPages={Math.ceil(maintenanceRequests.length / itemsPerPage)}
        handlePageChange={(page) => setCurrentPage(page)}
      />

      {/* Modal for Viewing Details */}
      {selectedRequest && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Maintenance Request Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedRequest(null)}
                >
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedRequest.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Reason:</strong> {selectedRequest.reason}
                </p>
                <p>
                  <strong>Requester Name:</strong>{" "}
                  {selectedRequest.requester_name}
                </p>
                <p>
                  <strong>Requester's Car:</strong>{" "}
                  {selectedRequest.requesters_car_name}
                </p>
                <p>
                  <strong>Status:</strong> {selectedRequest.status}
                </p>
                <p>
                  <strong>Current Approver Role:</strong>{" "}
                  {selectedRequest.current_approver_role}
                </p>
                <p>
                  <strong>Maintenance Total Cost:</strong>{" "}
                  {selectedRequest.maintenance_total_cost} ETB
                </p>
                <p>
                  <strong>Maintenance Letter:</strong>{" "}
                  <a
                    href={selectedRequest.maintenance_letter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Maintenance Letter
                  </a>
                </p>
                <p>
                  <strong>Receipt File:</strong>{" "}
                  <a
                    href={selectedRequest.receipt_file}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Receipt
                  </a>
                </p>
                <p>
                  <strong>Rejection Message:</strong>{" "}
                  {selectedRequest.rejection_message || "N/A"}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn"
style={{
                    backgroundColor: "rgba(31, 41, 55, 0.9)",
                    color: "white",
                  }}                 
onClick={async () => {
                    setOtpAction("approve");
                    setOtpModalOpen(true);
                    await sendOtp();
                  }}
                  disabled={actionLoading}
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    setOtpAction("reject");
                    setOtpModalOpen(true);
                    await sendOtp();
                  }}
                  disabled={actionLoading}
                >
                  Reject
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
                  Enter OTP and confirm{" "}
                  {otpAction === "approve" ? "approval" : "rejection"}
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
                <div className="d-flex justify-content-center gap-2 mb-3">
                  {[...Array(6)].map((_, idx) => (
                    <input
                      key={idx}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="form-control text-center"
                      style={{
                        width: "40px",
                        height: "40px",
                        fontSize: "1.5rem",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        boxShadow: "none",
                      }}
                      value={otpValue[idx] || ""}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (!val) return;
                        let newOtp = otpValue.split("");
                        newOtp[idx] = val;
                        // Move to next input if not last
                        if (val && idx < 5) {
                          const next = document.getElementById(`otp-input-${idx + 1}`);
                          if (next) next.focus();
                        }
                        setOtpValue(newOtp.join("").slice(0, 6));
                      }}
                      onKeyDown={e => {
                        if (e.key === "Backspace" && !otpValue[idx] && idx > 0) {
                          const prev = document.getElementById(`otp-input-${idx - 1}`);
                          if (prev) prev.focus();
                        }
                      }}
                      id={`otp-input-${idx}`}
                      disabled={otpLoading}
                    />
                  ))}
                </div>
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
                  className="btn btn-primary"
                  disabled={otpLoading || otpValue.length !== 6}
                  onClick={() => handleOtpAction(otpValue, otpAction)}
                >
                  {otpAction === "approve" ? "Approve" : "Reject"}
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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Action</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                >
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to approve this request?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleConfirmAction}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
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
                  className="btn btn-secondary"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleRejectAction}>
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BUmaintenance;
