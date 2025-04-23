import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ENDPOINTS } from "../utilities/endpoints";
import { IoClose } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify"; // Import toast for notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const MaintenanceRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showForm, setShowForm] = useState(false); 
  const [formData, setFormData] = useState({ date: "", reason: "" }); 

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
      setRequests(data.results || []);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
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

      if (!response.ok) {
        throw new Error("Failed to create maintenance request");
      }

      const newRequest = await response.json();
      setRequests((prevRequests) => [newRequest, ...prevRequests]);
      setFormData({ date: "", reason: "" });
      setShowForm(false);

      // Display success toast message
      toast.success("Your request has been sent to the transport manager successfully!");
    } catch (error) {
      console.error("Error creating maintenance request:", error);
      toast.error("Failed to send the maintenance request. Please try again.");
    }
  };

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  return (
    <div className="container mt-5">
      <ToastContainer /> {/* Add this to display toast messages */}
      <h2 className="text-center mb-4">Maintenance Requests</h2>

      <div className="d-flex mb-4">
        <button
          className="btn"
          style={{ width: "300px", backgroundColor: "#181E4B", color: "white" }}
          onClick={() => setShowForm(true)}
        >
          New Maintenance Request
        </button>
      </div>

      {showForm && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Maintenance Request</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowForm(false)}
                >
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                      Date
                    </label>
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
                    <label htmlFor="reason" className="form-label">
                      Reason
                    </label>
                    <textarea
                      className="form-control"
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      placeholder="Enter the reason for maintenance"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    style={{ width: "300px", backgroundColor: "#181E4B", color: "white" }}
                    className="btn"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

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
                
                <th>Requester's Car</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={request.id}>
                  <td>{index + 1}</td>
                  <td>{new Date(request.date).toLocaleDateString()}</td>
                  
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

      {selectedRequest && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
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
                <p><strong>Date:</strong> {new Date(selectedRequest.date).toLocaleDateString()}</p>
                <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                <p><strong>Requester Name:</strong> {selectedRequest.requester_name}</p>
                <p><strong>Requester's Car:</strong> {selectedRequest.requesters_car_name}</p>
                <p><strong>Status:</strong> {selectedRequest.status}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceRequest;
