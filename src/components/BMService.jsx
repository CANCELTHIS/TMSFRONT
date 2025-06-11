import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ENDPOINTS } from "../utilities/endpoints";
import { IoClose } from "react-icons/io5";
import CustomPagination from "./CustomPagination";
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

  // Handle actions (approve, reject)
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

      const endpoint = ENDPOINTS.SERVICE_REQUEST_ACTION(id);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} the service request`);
      }

      await fetchRequests(); // Refresh the list after action
      setSelectedRequest(null);
      setRejectionMessage("");
      toast.success(
        `Request ${
          action === "approve" ? "approved" : "rejected"
        } successfully!`
      );
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
      toast.error(`Failed to ${action} the request.`);
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
      toast.error("Rejection message cannot be empty.");
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
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
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
                        ? new Date(
                            selectedRequest.created_at
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Vehicle:</strong>{" "}
                      {selectedRequest.vehicle || "N/A"}
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
                  className="btn btn-primary"
                  onClick={() => {
                    setPendingAction("approve");
                    setShowConfirmModal(true);
                  }}
                  disabled={actionLoading || detailLoading}
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setPendingAction("reject");
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
                  className="btn btn-primary"
                  onClick={handleConfirmAction}
                  disabled={actionLoading}
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
                <button
                  className="btn btn-danger"
                  onClick={handleRejectAction}
                  disabled={actionLoading}
                >
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

export default CEOService;
