import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ENDPOINTS } from "../utilities/endpoints";
import { IoClose } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/Logo.jpg";
import UnauthorizedPage from "./UnauthorizedPage";
import ServerErrorPage from "./ServerErrorPage";
import { FaWrench, FaSearch, FaSync } from "react-icons/fa";

const MaintenanceRequest = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ date: "", reason: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const [errorType, setErrorType] = useState(null);

  // Fetch maintenance requests
  const fetchMaintenanceRequests = async () => {
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      setErrorType("unauthorized");
      return;
    }
    try {
      const response = await fetch(ENDPOINTS.MY_MAINTENANCE_REQUESTS, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        if (response.status === 401) setErrorType("unauthorized");
        else setErrorType("server");
        throw new Error("Failed to fetch maintenance requests");
      }
      const data = await response.json();
      setRequests(data.results || []);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
    }
  };

  // Fetch current user
  const fetchCurrentUser = async () => {
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      setErrorType("unauthorized");
      return;
    }
    try {
      const response = await fetch(ENDPOINTS.CURRENT_USER, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        if (response.status === 401) setErrorType("unauthorized");
        else setErrorType("server");
        throw new Error("Failed to fetch current user data");
      }
      const userData = await response.json();
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error fetching current user data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
    try {
      const response = await fetch(ENDPOINTS.CREATE_MAINTENANCE_REQUEST, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formData.date,
          reason: formData.reason,
        }),
      });
      if (!response.ok) throw new Error("Failed to create maintenance request");
      const newRequest = await response.json();
      if (currentUser && newRequest.requester_name === currentUser.full_name) {
        setRequests((prev) => [newRequest, ...prev]);
      }
      setFormData({ date: "", reason: "" });
      setShowForm(false);
      toast.success("Your maintenance request has been created successfully!");
    } catch (error) {
      console.error("Error creating maintenance request:", error);
      toast.error("Failed to create the maintenance request. Please try again.");
    }
  };

  useEffect(() => {
    fetchMaintenanceRequests();
    fetchCurrentUser();
  }, []);

  if (errorType === "unauthorized") return <UnauthorizedPage />;
  if (errorType === "server") return <ServerErrorPage />;

  return (
    <div className="container py-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-0 d-flex align-items-center">
            <FaWrench className="me-2 text-success" />
            Maintenance Requests
          </h1>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-success d-flex align-items-center"
            style={{ minWidth: "200px" }}
            onClick={fetchMaintenanceRequests}
          >
            <FaSync className="me-2" />
            Refresh
          </button>
        </div>
      </div>
      <div className="d-flex mb-4">
        <button
          className="btn"
          style={{ minWidth: "250px", backgroundColor: "#181E4B", color: "white" }}
          onClick={() => setShowForm(true)}
        >
          New Maintenance Request
        </button>
      </div>
      {/* New Maintenance Request Modal */}
      {showForm && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Maintenance Request</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}>
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="reason" className="form-label">Reason</label>
                    <textarea
                      className="form-control"
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      placeholder="Enter the reason for maintenance"
                      required
                      style={{ minHeight: "80px" }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      width: "100%",
                      backgroundColor: "#181E4B",
                      color: "white",
                    }}
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Requests Table */}
      <div className="card shadow-sm border-0 overflow-hidden">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Requester's Car</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.length > 0 ? (
                  requests.map((request, index) => (
                    <tr key={request.id}>
                      <td>{index + 1}</td>
                      <td>{new Date(request.date).toLocaleDateString()}</td>
                      <td>{request.requesters_car_name || "N/A"}</td>
                      <td>
                        <span className={`badge ${
                          request.status === "pending"
                            ? "bg-warning text-dark"
                            : request.status === "approved"
                            ? "bg-success"
                            : request.status === "rejected"
                            ? "bg-danger"
                            : "bg-secondary"
                        } py-2 px-3`}>
                          {request.status
                            ? request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)
                            : ""}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-success d-flex align-items-center"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <FaSearch className="me-1" />
                          View Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-5">
                      <div className="py-4">
                        <FaWrench className="fs-1 text-muted mb-3" />
                        <p className="mb-1 fw-medium fs-5">
                          No maintenance requests found.
                        </p>
                        <small className="text-muted">
                          Create a new request or check back later.
                        </small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Details Modal */}
      {selectedRequest && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex align-items-center">
                  <img
                    src={Logo}
                    alt="Logo"
                    style={{ width: "80px", height: "50px", marginRight: "10px" }}
                  />
                  <h5 className="modal-title">Maintenance Request Details</h5>
                </div>
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
                  <strong>Date:</strong> {new Date(selectedRequest.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Reason:</strong> {selectedRequest.reason}
                </p>
                <p>
                  <strong>Requester Name:</strong> {selectedRequest.requester_name}
                </p>
                <p>
                  <strong>Requester's Car:</strong> {selectedRequest.requesters_car_name}
                </p>
                <p>
                  <strong>Status:</strong> {selectedRequest.status}
                </p>
              </div>
              <div className="modal-footer">
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
      `}</style>
    </div>
  );
};

export default MaintenanceRequest;