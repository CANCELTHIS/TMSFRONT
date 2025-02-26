import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../assets/Logo.jpg"; // Import the logo image

const EmployeePage = () => {
  const [showForm, setShowForm] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]); // State for user list
  const [formData, setFormData] = useState({
    startDay: "",
    startTime: "",
    returnDay: "",
    employees: [], // Store employee IDs (numbers)
    employeeName: "", // Store selected employee ID
    destination: "",
    reason: "",
  });
  const [selectedRequest, setSelectedRequest] = useState(null); // State for selected request details

  const accessToken = localStorage.getItem("authToken");

  // Fetch data when the component mounts
  useEffect(() => {
    fetchRequests();
    fetchUsers(); // Fetch users
  }, []);

  const fetchRequests = async () => {
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }

    setLoading(true); // Show loading state
    try {
      const response = await fetch("http://127.0.0.1:8000/transport-requests/list/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch transport requests");

      const data = await response.json();
      setRequests(data.results || []); // Set fetched data to state
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const fetchUsers = async () => {
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:8000/users-list/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) throw new Error("Failed to fetch users");
  
      const data = await response.json();
      console.log("Users:", data); // Log the response structure
  
      setUsers(data.results || []); // Ensure only the results array is stored
    } catch (error) {
      console.error("Fetch Users Error:", error);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddEmployee = () => {
    const selectedEmployeeId = parseInt(formData.employeeName, 10);
    if (!isNaN(selectedEmployeeId)) {
      setFormData((prev) => ({
        ...prev,
        employees: [...prev.employees, selectedEmployeeId], // Add employee ID
        employeeName: "", // Reset the dropdown
      }));
    }
  };

  const handleRemoveEmployee = (employeeId) => {
    setFormData((prev) => ({
      ...prev,
      employees: prev.employees.filter((id) => id !== employeeId), // Remove employee ID
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accessToken) {
      console.error("No access token found.");
      return;
    }

    const payload = {
      start_day: formData.startDay,
      start_time: formData.startTime,
      return_day: formData.returnDay,
      employees: formData.employees, // Send employee IDs (numbers)
      destination: formData.destination,
      reason: formData.reason,
    };

    setSubmitting(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/transport-requests/create/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create transport request");

      const responseData = await response.json();
      setRequests((prevRequests) => [responseData, ...prevRequests]);

      setFormData({
        startDay: "",
        startTime: "",
        returnDay: "",
        employees: [],
        employeeName: "",
        destination: "",
        reason: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error("Submit Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  // Get employee names from IDs
  const getEmployeeNames = (employeeIds) => {
    return employeeIds
      .map((id) => {
        const employee = users.find((user) => user.id === id);
        return employee ? employee.full_name : "Unknown";
      })
      .join(", ");
  };

  // Handle view detail click
  const handleViewDetail = (request) => {
    setSelectedRequest(request);
  };

  // Close detail modal
  const handleCloseDetail = () => {
    setSelectedRequest(null);
  };

  return (
    <div className="container mt-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
      <button
        onClick={() => setShowForm(true)}
        className="btn btn mb-3"
        style={{ backgroundColor: "#181E4B", color: "#fff" }}
      >
        Request Transport
      </button>

      {showForm && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content" style={{width:"550px"}}>
              <div className="modal-header d-flex justify-content-center align-items-center">
                <h5 className="modal-title d-flex">Transport Request Form</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit} style={{marginBottom:"-40px",marginTop:"-15px"}}>
                  <div className="d-flex gap-5 justify-content-center align-items-center">
                  <div className="mb-3" style={{width:"42%"}}>
                    <label className="form-label">Start Day:</label>
                    <input
                      type="date"
                      name="startDay"
                      value={formData.startDay}
                      onChange={handleInputChange}
                      className="form-control"
                      min={today}
                      required
                    />
                  </div>
                  <div className="mb-3" style={{width:"42%"}}>
                    <label className="form-label">Start Time:</label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  </div>
                  <div className="d-flex gap-5 justify-content-center align-items-center">
                  <div className="mb-3">
                    <label className="form-label">Return Day:</label>
                    <input
                      type="date"
                      name="returnDay"
                      value={formData.returnDay}
                      onChange={handleInputChange}
                      className="form-control"
                      min={today}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Destination:</label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  </div>
                  <div className="d-flex gap-5 justify-content-center align-items-center">
                  <div className="mb-3">
                    <label className="form-label">List of Employees:</label>
                    <select
                      name="employeeName"
                      value={formData.employeeName}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select an employee</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.full_name}
                        </option>
                      ))}
                    </select>
                    <button type="button" className="btn mt-2" onClick={handleAddEmployee} style={{ backgroundColor: "#181E4B", color: "#fff" }}>
                      Add
                    </button>
                    <div className="mt-2 d-flex flex-wrap gap-2">
                      {formData.employees.map((employeeId) => {
                        const employee = users.find((user) => user.id === employeeId);
                        return (
                          <div key={employeeId} className="badge bg-primary d-flex align-items-center">
                            <span>{employee ? employee.full_name : "Unknown"}</span>
                            <button
                              type="button"
                              className="btn-close btn-close-white ms-2"
                              aria-label="Close"
                              onClick={() => handleRemoveEmployee(employeeId)}
                            ></button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Reason:</label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn" style={{ backgroundColor: "#181E4B", color: "#fff" }} disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading data...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered mt-4">
            <thead className="table">
              <tr>
                <th>Start Day</th>
                <th>Start Time</th>
                <th>Return Day</th>
                
                <th>Destination</th>
                
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.start_day}</td>
                  <td>{request.start_time}</td>
                  <td>{request.return_day}</td>
                  <td>{request.destination}</td>
                  <td>{request.status}</td>
                  <td>
                    <button
                      className="btn btn-sm"
                      style={{backgroundColor:"#181E4B",color:"white"}}
                      onClick={() => handleViewDetail(request)}
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
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <img src={Logo} alt="Logo" style={{ width: "100px", height: "70px", marginRight: "10px" }} />
                <h5 className="modal-title">Transport Request Details</h5>
                <button type="button" className="btn-close" onClick={handleCloseDetail}></button>
              </div>
              <div className="modal-body">
                <p><strong>Start Day:</strong> {selectedRequest.start_day}</p>
                <p><strong>Start Time:</strong> {selectedRequest.start_time}</p>
                <p><strong>Return Day:</strong> {selectedRequest.return_day}</p>
                <p><strong>Employees:</strong> {getEmployeeNames(selectedRequest.employees)}</p>
                <p><strong>Destination:</strong> {selectedRequest.destination}</p>
                <p><strong>Reason:</strong> {selectedRequest.reason}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseDetail}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePage;