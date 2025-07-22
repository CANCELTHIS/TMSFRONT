import React, { useEffect, useState } from "react";
import { ENDPOINTS } from "../utilities/endpoints";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UnauthorizedPage from "./UnauthorizedPage";
import ServerErrorPage from "./ServerErrorPage";
import { FaSync, FaSearch, FaFilePdf, FaWindowClose, FaForward, FaTimes } from "react-icons/fa";

const ListServiceRequestsTable = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [maintenanceLetter, setMaintenanceLetter] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [maintenanceTotalCost, setMaintenanceTotalCost] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // OTP integration
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpAction, setOtpAction] = useState(null); // "forward" or "reject"
  const [otpLoading, setOtpLoading] = useState(false);

  const [errorType, setErrorType] = useState(null); // "unauthorized" | "server" | null

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrorType("unauthorized");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(ENDPOINTS.LIST_SERVICE_REQUESTS, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            setErrorType("unauthorized");
          } else {
            setErrorType("server");
          }
          throw new Error("Failed to fetch");
        }
        return res.json();
      })
      .then((data) => {
        setServiceRequests(data.results || []);
      })
      .catch(() => setServiceRequests([]))
      .finally(() => setLoading(false));
  };

  const handleFileChange = (e, setter) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  // Standard submit files (NO OTP)
  const handleSubmitFiles = async (requestId) => {
    if (!maintenanceLetter || !receiptFile || !maintenanceTotalCost) {
      toast.error(
        "Please upload all required files and provide the total cost."
      );
      return;
    }
    setActionLoading(true);
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("service_letter", maintenanceLetter);
    formData.append("receipt_file", receiptFile);
    formData.append("service_total_cost", maintenanceTotalCost);

    try {
      const response = await fetch(ENDPOINTS.SUBMIT_SERVICE_FILES(requestId), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to submit files.");
      toast.success("Files submitted successfully!");
      fetchRequests();
    } catch (error) {
      toast.error(error.message || "Failed to submit files.");
    } finally {
      setActionLoading(false);
    }
  };

  // OTP: send OTP
  const sendOtp = async (actionType) => {
    setOtpAction(actionType);
    setOtpValue("");
    setOtpModalOpen(true);
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
      if (!response.ok) throw new Error("Failed to send OTP");
      toast.success("OTP sent to your phone");
    } catch (err) {
      toast.error(err.message);
      setOtpModalOpen(false);
    } finally {
      setOtpLoading(false);
    }
  };

  // OTP-protected forward request
  const handleOtpForward = async () => {
    setOtpLoading(true);
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        ENDPOINTS.SERVICE_REQUEST_ACTION(selectedRequest.id),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "forward", otp_code: otpValue }),
        }
      );
      if (!response.ok) throw new Error("Failed to forward request.");
      toast.success("Request forwarded successfully!");
      setSelectedRequest(null);
      setMaintenanceLetter(null);
      setReceiptFile(null);
      setMaintenanceTotalCost("");
      setOtpModalOpen(false);
      setShowConfirmModal(false);
      fetchRequests();
    } catch (error) {
      toast.error(error.message || "Failed to forward request.");
    } finally {
      setOtpLoading(false);
    }
  };

  // OTP-protected reject request
  const handleOtpReject = async () => {
    setOtpLoading(true);
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        ENDPOINTS.SERVICE_REQUEST_ACTION(selectedRequest.id),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "reject", otp_code: otpValue }),
        }
      );
      if (!response.ok) throw new Error("Failed to reject request.");
      toast.success("Request rejected successfully!");
      setSelectedRequest(null);
      setMaintenanceLetter(null);
      setReceiptFile(null);
      setMaintenanceTotalCost("");
      setOtpModalOpen(false);
      setShowConfirmModal(false);
      fetchRequests();
    } catch (error) {
      toast.error(error.message || "Failed to reject request.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle OTP modal submit actions
  const handleOtpSubmit = async () => {
    if (otpAction === "forward") {
      await handleOtpForward();
    } else if (otpAction === "reject") {
      await handleOtpReject();
    }
  };

  if (errorType === "unauthorized") {
    return <UnauthorizedPage />;
  }
  if (errorType === "server") {
    return <ServerErrorPage />;
  }

  return (
    <div className="container py-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0 d-flex align-items-center">
          <FaFilePdf className="me-2 text-success" />
          Service Requests
        </h1>
        <button
          className="btn btn-outline-success d-flex align-items-center"
          style={{ minWidth: "160px" }}
          onClick={fetchRequests}
        >
          <FaSync className="me-2" />
          Refresh
        </button>
      </div>
      <div className="card shadow-sm border-0 overflow-hidden">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Vehicle</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="spinner-border text-success" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="ms-3">Loading service requests...</span>
                      </div>
                    </td>
                  </tr>
                ) : serviceRequests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-5">
                      <div className="py-4">
                        <FaFilePdf className="fs-1 text-muted mb-3" />
                        <p className="mb-1 fw-medium fs-5">
                          No service requests found.
                        </p>
                        <small className="text-muted">
                          Create a new request or check back later.
                        </small>
                      </div>
                    </td>
                  </tr>
                ) : (
                  serviceRequests.map((req, idx) => (
                    <tr key={req.id}>
                      <td>{idx + 1}</td>
                      <td>
                        {req.created_at
                          ? new Date(req.created_at).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>{req.vehicle || "N/A"}</td>
                      <td>
                        <span className={`badge ${
                          req.status === "pending"
                            ? "bg-warning text-dark"
                            : req.status === "approved"
                            ? "bg-success"
                            : req.status === "rejected"
                            ? "bg-danger"
                            : "bg-secondary"
                        } py-2 px-3`}>
                          {req.status
                            ? req.status.charAt(0).toUpperCase() +
                              req.status.slice(1)
                            : ""}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-success d-flex align-items-center"
                          onClick={() => setSelectedRequest(req)}
                        >
                          <FaSearch className="me-1" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for request details */}
      {selectedRequest && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Maintenance Request Details</h5>
                <FaWindowClose
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    fontSize: "1.5rem",
                    color: "#888"
                  }}
                  onClick={() => setSelectedRequest(null)}
                />
              </div>
              <div className="modal-body">
                <p>
                  <strong>Date:</strong>{" "}
                  {selectedRequest.created_at
                    ? new Date(selectedRequest.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Requester's Car:</strong>{" "}
                  {selectedRequest.requesters_car_name || "N/A"}
                </p>
                <p>
                  <a href="http://lms.gdop.gov.et">
                    <strong>Message to service Provider</strong>
                  </a>
                </p>
                <div className="mb-3">
                  <label htmlFor="maintenanceLetter" className="form-label">
                    Service Letter (PDF) <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="maintenanceLetter"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, setMaintenanceLetter)}
                  />
                  {maintenanceLetter && (
                    <button
                      className="btn btn-outline-secondary mt-2"
                      onClick={() =>
                        window.open(
                          URL.createObjectURL(maintenanceLetter),
                          "_blank"
                        )
                      }
                    >
                      <FaFilePdf className="me-1" /> View
                    </button>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="receiptFile" className="form-label">
                    Receipt File (PDF) <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="receiptFile"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, setReceiptFile)}
                  />
                  {receiptFile && (
                    <button
                      className="btn btn-outline-secondary mt-2"
                      onClick={() =>
                        window.open(URL.createObjectURL(receiptFile), "_blank")
                      }
                    >
                      <FaFilePdf className="me-1" /> View
                    </button>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="maintenanceTotalCost" className="form-label">
                    Total Cost <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="maintenanceTotalCost"
                    value={maintenanceTotalCost}
                    onChange={(e) => setMaintenanceTotalCost(e.target.value)}
                    placeholder="Enter total cost"
                  />
                </div>
                <div className="mb-3 d-flex gap-2">
                  <button
                    className="btn btn-success"
                    style={{ minWidth: 120 }}
                    onClick={() => handleSubmitFiles(selectedRequest.id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Submitting..." : "Submit Files"}
                  </button>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button
                    className="btn"
                    style={{
                      backgroundColor: "#181E4B",
                      color: "white",
                      minWidth: 120,
                      border: "none",
                    }}
                    onClick={() => setShowConfirmModal(true)}
                    disabled={actionLoading}
                  >
                    <FaForward className="me-1" />
                    {actionLoading ? "Processing..." : "Forward"}
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ minWidth: 120 }}
                    onClick={() => sendOtp("reject")}
                    disabled={actionLoading}
                  >
                    <FaTimes className="me-1" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Forward Modal */}
      {showConfirmModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Forward</h5>
                <FaWindowClose
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    fontSize: "1.5rem",
                    color: "#888"
                  }}
                  onClick={() => setShowConfirmModal(false)}
                />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to forward this request?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn"
                  style={{ backgroundColor: "#181E4B", color: "white" }}
                  disabled={actionLoading}
                  onClick={() => {
                    setShowConfirmModal(false);
                    sendOtp("forward");
                  }}
                >
                  {actionLoading ? "Processing..." : " Forward"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {otpModalOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Enter OTP to {otpAction === "forward" ? "forward" : "reject"} request
                </h5>
                <FaWindowClose
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    fontSize: "1.5rem",
                    color: "#888"
                  }}
                  onClick={() => {
                    setOtpModalOpen(false);
                    setOtpValue("");
                    setOtpAction(null);
                  }}
                  disabled={otpLoading}
                />
              </div>
              <div className="modal-body">
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
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-link"
                  style={{ color: "#181E4B" }}
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
                  onClick={handleOtpSubmit}
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
      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .card {
          border-radius: 1rem;
          overflow: hidden;
        }
        .table th {
          background-color: #f8fafc;
          border-top: 1px solid #e9ecef;
          border-bottom: 2px solid #e9ecef;
        }
        .modal-header {
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default ListServiceRequestsTable;