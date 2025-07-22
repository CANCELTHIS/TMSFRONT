import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ENDPOINTS } from "../utilities/endpoints";
import { IoClose } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UnauthorizedPage from "./UnauthorizedPage";
import ServerErrorPage from "./ServerErrorPage";
import { FaPlus, FaCar, FaInfoCircle } from "react-icons/fa";

const RefuelingRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({ date: "", destination: "" });
  const [errorType, setErrorType] = useState(null);

  const getAuthToken = () =>
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token");

  const fetchRefuelingRequests = async () => {
    const accessToken = getAuthToken();
    if (!accessToken) {
      setErrorType("unauthorized");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(ENDPOINTS.MY_REFUELING_REQUESTS, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) setErrorType("unauthorized");
        else setErrorType("server");
        throw new Error("Failed to fetch refueling requests");
      }

      const data = await response.json();
      setRequests(data.results || []);
    } catch (error) {
      console.error("Error fetching refueling requests:", error);
      toast.error("Could not load your requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const accessToken = getAuthToken();

    if (!accessToken) {
      toast.error("You are not authorized. Please log in again.");
      setFormLoading(false);
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.CREATE_REFUELING_REQUEST, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create refueling request");
      }

      const newRequest = await response.json();
      setRequests((prevRequests) => [newRequest, ...prevRequests].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)));
      setFormData({ date: "", destination: "" });
      setShowForm(false);
      toast.success("Refueling request created successfully!");
    } catch (error) {
      console.error("Error creating refueling request:", error);
      toast.error(error.message || "Failed to create refueling request.");
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    fetchRefuelingRequests();
  }, []);

  if (errorType === "unauthorized") return <UnauthorizedPage />;
  if (errorType === "server") return <ServerErrorPage />;

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-warning text-dark";
      case "approved":
      case "forwarded":
        return "bg-success";
      case "rejected":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0 d-flex align-items-center">
          <FaCar className="me-2 text-primary" />
          My Refueling Requests
        </h1>
        <button
          className="btn btn-primary d-flex align-items-center shadow-sm"
          onClick={() => setShowForm(true)}
        >
          <FaPlus className="me-2" />
          New Request
        </button>
      </div>

      {/* Refueling Requests Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-3">#</th>
                  <th>Date</th>
                  <th>Destination</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <span className="ms-3">Loading your requests...</span>
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-5">
                       <div className="py-4">
                            <FaCar className="fs-1 text-muted mb-3" />
                            <p className="mb-1 fw-medium fs-5">
                              No requests found
                            </p>
                            <small className="text-muted">
                              Click "New Request" to get started.
                            </small>
                          </div>
                    </td>
                  </tr>
                ) : (
                  requests.map((request, index) => (
                    <tr key={request.id}>
                      <td className="px-3">{index + 1}</td>
                      <td>{new Date(request.created_at).toLocaleDateString()}</td>
                      <td>{request.destination || "N/A"}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(request.status)} py-2 px-3`}>
                          {request.status ? request.status.charAt(0).toUpperCase() + request.status.slice(1) : "N/A"}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <FaInfoCircle className="me-1" />
                          View Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
         <div className="card-footer bg-white d-flex justify-content-end align-items-center py-3 border-0">
          <div className="text-muted small">
            Total Requests: <span className="fw-medium">{requests.length}</span>
          </div>
        </div>
      </div>

      {/* New Request Modal Form */}
      {showForm && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Refueling Request</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)} disabled={formLoading}>
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
                      disabled={formLoading}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="destination" className="form-label">Destination</label>
                    <input
                      type="text"
                      className="form-control"
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="e.g., Main Office"
                      required
                      disabled={formLoading}
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary" disabled={formLoading}>
                      {formLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Submitting...
                        </>
                      ) : "Submit Request"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedRequest && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request Details</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedRequest(null)}>
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                 <div className="row">
                    <div className="col-md-6">
                        <p><strong>Request ID:</strong> {selectedRequest.id}</p>
                        <p><strong>Request Date:</strong> {new Date(selectedRequest.created_at).toLocaleString()}</p>
                        <p><strong>Destination:</strong> {selectedRequest.destination}</p>
                        <p><strong>Status:</strong> 
                           <span className={`ms-2 badge ${getStatusBadge(selectedRequest.status)}`}>
                               {selectedRequest.status}
                           </span>
                        </p>
                    </div>
                     <div className="col-md-6">
                        <p><strong>Vehicle:</strong> {selectedRequest.requesters_car_name || "N/A"}</p>
                        <p><strong>Fuel Needed:</strong> {selectedRequest.fuel_needed_liters ? `${selectedRequest.fuel_needed_liters} L` : "N/A"}</p>
                        <p><strong>Estimated Cost:</strong> {selectedRequest.total_cost ? `ETB ${selectedRequest.total_cost}` : "N/A"}</p>
                    </div>
                 </div>
                 {selectedRequest.rejection_message && (
                    <div className="alert alert-danger mt-3">
                        <strong>Rejection Reason:</strong> {selectedRequest.rejection_message}
                    </div>
                 )}
              </div>
              <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setSelectedRequest(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
       <style jsx>{`
        .card {
          border-radius: 1rem;
          overflow: hidden;
        }
        .table th {
          background-color: #f8fafc;
          border-top: 1px solid #e9ecef;
          border-bottom: 2px solid #e9ecef;
          font-weight: 600;
        }
        .btn-primary {
            background-color: #181E4B;
            border-color: #181E4B;
        }
        .btn-primary:hover, .btn-primary:focus {
            background-color: #101433;
            border-color: #101433;
        }
      `}</style>
    </div>
  );
};

export default RefuelingRequest;
