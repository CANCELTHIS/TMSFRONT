import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ENDPOINTS } from "../utilities/endpoints";

const MaintenanceRequest = () => {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    reason: "",
  });
  const [showForm, setShowForm] = useState(false);

  // Fetch maintenance requests
  const fetchMaintenanceRequests = async () => {
    const accessToken = localStorage.getItem("authToken");

    if (!accessToken) {
      console.error("No access token found.");
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.MENTENANCE_REQUEST_LIST, {
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
      console.log("Maintenance Requests:", data);
      setRequests(data.results || []);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
    }
  };

  // Create a new maintenance request
  const createMaintenanceRequest = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("authToken");

    if (!accessToken) {
      console.error("No access token found.");
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.CREATE_MENTENANCE_REQUEST, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create maintenance request");
      }

      const newRequest = await response.json();
      console.log("New Maintenance Request:", newRequest);

      // Add the new request to the list
      setRequests((prevRequests) => [newRequest, ...prevRequests]);

      // Reset the form and close it
      setFormData({ date: "", reason: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating maintenance request:", error);
    }
  };

  // Fetch maintenance requests when the component mounts
  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Maintenance Requests</h2>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-primary" onClick={handleShowForm}>
          New Maintenance Request
        </button>
      </div>

      {/* Maintenance Request Form */}
      {showForm && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Maintenance Request</h5>
                <button type="button" className="btn-close" onClick={handleCloseForm}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={createMaintenanceRequest}>
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
                  <button type="submit" className="btn btn-primary w-100">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table to Display Maintenance Requests */}
      {requests.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-3">Submitted Maintenance Requests</h4>
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={request.id}>
                  <td>{index + 1}</td>
                  <td>{new Date(request.date).toLocaleDateString()}</td>
                  <td>{request.reason}</td>
                  <td>{request.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MaintenanceRequest;
