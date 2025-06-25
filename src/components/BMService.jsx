import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ENDPOINTS } from "../utilities/endpoints";
import { IoClose } from "react-icons/io5";
import CustomPagination from './CustomPagination';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CEOService = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // OTP
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpAction, setOtpAction] = useState(null); // "approve" | "reject"
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageRequests = requests.slice(startIndex, endIndex);

  // Fetch service requests
  const fetchRequests = async () => {
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(ENDPOINTS.LIST_SERVICE_REQUESTS, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch service requests");
      }

      const data = await response.json();
      setRequests(data.results || []);
    } catch (error) {
      console.error("Error fetching service requests:", error);
      toast.error("Failed to fetch service requests.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch request detail
  const fetchRequestDetail = async (id) => {
    setDetailLoading(true);
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      console.error("No access token found.");
      setDetailLoading(false);
      return;
    }
    try {
      const endpoint = ENDPOINTS.SERVICE_REQUEST_DETAIL(id);
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch request details");
      const data = await response.json();
      setSelectedRequest(data);
    } catch (error) {
      toast.error("Failed to fetch request details.");
      setSelectedRequest(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // Send OTP for approve or reject
  const sendOtp = async (actionType) => {
    setOtpAction(actionType);
    setOtpValue("");
    setOtpModalOpen(true);
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
      if (!response.ok) throw new Error("Failed to send OTP");
      toast.success("OTP sent to your phone");
    } catch (err) {
      toast.error(err.message);
      setOtpModalOpen(false);
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle OTP verification and action (approve, reject)
  const handleOtpAction = async () => {
    setOtpLoading(true);
    try {
      const accessToken = localStorage.getItem("authToken");
      let body = { action: otpAction, otp_code: otpValue };
      if (otpAction === "reject") {
        body.rejection_message = rejectionMessage;
      }
      const endpoint = ENDPOINTS.SERVICE_REQUEST_ACTION(selectedRequest.id);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${otpAction} the service request`);
      }

      await fetchRequests();
      setSelectedRequest(null);
      setRejectionMessage("");
      setOtpModalOpen(false);
      setOtpValue("");
      setOtpAction(null);
      toast.success(`Request ${otpAction === "approve" ? "approved" : "rejected"} successfully!`);
    } catch (error) {
      toast.error(`Failed to ${otpAction} the request.`);
    } finally {
      setOtpLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // Reset page on refresh
    fetchRequests();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center mb-4">Service Requests</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading service requests...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Requester's Car</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPageRequests.map((request, index) => (
                <tr key={request.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{new Date(request.created_at).toLocaleDateString()}</td>
                  <td>{request.vehicle || "N/A"}</td>
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

      <CustomPagination
        currentPage={currentPage}
        totalPages={Math.ceil(requests.length / itemsPerPage)}
        handlePageChange={setCurrentPage}
      />

      {/* Modal for Viewing Details */}
      {selectedRequest && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Service Request Details</h5>
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
                  <>
                    <p>
                      <strong>Created At:</strong>{" "}
                      {selectedRequest.created_at
                        ? new Date(selectedRequest.created_at).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Vehicle:</strong> {selectedRequest.vehicle || "N/A"}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedRequest.status}
                    </p>
                    <p>
                      <strong>Total Cost:</strong>{" "}
                      {selectedRequest.service_total_cost} ETB
                    </p>
                    {selectedRequest.service_letter && (
                      <p>
                        <strong>Service Letter:</strong>{" "}
                        <a
                          href={selectedRequest.service_letter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Service Letter
                        </a>
                      </p>
                    )}
                    {selectedRequest.receipt_file && (
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
                    )}
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </button>
                <button
  className="btn"
  style={{ backgroundColor: "#181E4B", color: "white" }}
  onClick={() => {
    setOtpAction("approve");
    sendOtp("approve");
  }}
  disabled={actionLoading || detailLoading}
>
  Approve 
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setShowRejectModal(true);
                  }}
                  disabled={actionLoading || detailLoading}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {otpModalOpen && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Enter OTP to {otpAction === "approve" ? "approve" : "reject"} request
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setOtpModalOpen(false);
                    setOtpValue("");
                    setOtpAction(null);
                  }}
                  disabled={otpLoading}
                >
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  maxLength={6}
                  value={otpValue}
                  onChange={e => setOtpValue(e.target.value.replace(/\D/g, ""))}
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
                  onClick={() => sendOtp(otpAction)}
                  disabled={otpLoading}
                >
                  Resend OTP
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setOtpModalOpen(false);
                    setOtpValue("");
                    setOtpAction(null);
                  }}
                  disabled={otpLoading}
                >
                  Cancel
                </button>
                <button
  className="btn"
  style={{ backgroundColor: "#181E4B", color: "white" }}
  disabled={otpLoading || otpValue.length !== 6}
  onClick={handleOtpAction}
>
  {otpLoading
    ? "Processing..."
    : otpAction === "approve"
    ? "Approve"
    : "Reject"}
</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
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
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setShowRejectModal(false);
                    setOtpAction("reject");
                    sendOtp("reject");
                  }}
                  disabled={actionLoading}
                >
                  Reject (with OTP)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CEOService;