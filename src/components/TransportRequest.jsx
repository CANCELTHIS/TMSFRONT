import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify"; // For toast messages
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/Logo.jpg"; // Import the logo image
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { useNotification } from "../context/NotificationContext"; // Adjust the path as needed
const TransportRequest = () => {
  const { decrementUnreadCount } = useNotification(); // Use the decrementUnreadCount function from the context
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]); // State for employees
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null); // Selected request for modal
  const [rejectionReason, setRejectionReason] = useState(""); // State for rejection reason
  const [showRejectionModal, setShowRejectionModal] = useState(false); // State for rejection modal
  const [showConfirmation, setShowConfirmation] = useState(false); // State for rejection confirmation dialog
  const [showApproveConfirmation, setShowApproveConfirmation] = useState(false); // State for approve confirmation dialog
  const [drivers, setDrivers] = useState([]); // State for available drivers
  const [vehicles, setVehicles] = useState([]); // State for available vehicles
  const [selectedDriver, setSelectedDriver] = useState(null); // State for selected driver
  const [selectedVehicle, setSelectedVehicle] = useState(null); // State for selected vehicle

  const accessToken = localStorage.getItem("authToken");

  useEffect(() => {
    fetchRequests();
    fetchUsers(); 
  }, []);

  const fetchRequests = async () => {
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }

    setLoading(true);
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
      setLoading(false);
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
      setUsers(data.results || []); // Set users data
    } catch (error) {
      console.error("Fetch Users Error:", error);
    }
  };

const fetchDrivers = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/available-drivers/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("Drivers data:", response.data);
    setDrivers(response.data || []); // Set fetched drivers to state
  } catch (error) {
    console.error("Error fetching drivers:", error.response?.data || error.message);
    setDrivers([]); // Reset drivers on error
  }
};

const fetchVehicles = async () => {
  if (drivers.length === 0) {
    console.log("Drivers are not loaded yet.");
    return;
  }

  try {
    const response = await axios.get("http://127.0.0.1:8000/vehicles/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const vehiclesData = response.data.results || [];
    console.log("Vehicles data::::::::::::::::::::::::::::::", vehiclesData);
    const availableVehicles = vehiclesData.filter(vehicle => vehicle.status !== "in_use"); // Filter out vehicles that are in use

    const vehiclesWithDriverNames = availableVehicles.map((vehicle) => {
      const driver = drivers.find(driver => driver.id === vehicle.driver); // Find driver by ID
      return {
        ...vehicle,
        driver_name: driver ? driver.full_name : "No Driver Assigned", // Assign driver name or "No Driver Assigned"
      };
    });

    setVehicles(vehiclesWithDriverNames); // Update state with available vehicles and driver names
  } catch (error) {
    console.error("Error fetching vehicles:", error.response?.data || error.message);
    setVehicles([]); // Reset vehicles on error
  }
};


// Use Effect to fetch data when approval modal is opened
useEffect(() => {
  if (showApproveConfirmation) {
    fetchDrivers();
  }
}, [showApproveConfirmation]);

// Once drivers are fetched, fetch vehicles
useEffect(() => {
  if (drivers.length > 0) {
    fetchVehicles();
  }
}, [drivers]); // Trigger vehicles fetch only after drivers are available




  // Call fetchDrivers and fetchVehicles when the approval modal is opened
  useEffect(() => {
    if (showApproveConfirmation) {
      fetchDrivers();
      fetchVehicles();
    }
  }, [showApproveConfirmation]);

  // Get employee names from IDs
  const getEmployeeNames = (employeeIds) => {
    return employeeIds
      .map((id) => {
        const employee = users.find((user) => user.id === id);
        return employee ? employee.full_name : "Unknown";
      })
      .join(", ");
  };

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseDetail = () => {
    setSelectedRequest(null);
    setRejectionReason(""); // Clear rejection reason
    setShowRejectionModal(false); // Close rejection modal
    setShowConfirmation(false); // Close rejection confirmation dialog
    setShowApproveConfirmation(false); // Close approve confirmation dialog
  };

  const handleApproveClick = () => {
    setShowApproveConfirmation(true); 
  };

  const handleVehicleChange = (e) => {
    const vehicleId = e.target.value;
    const vehicle = vehicles.find(vehicle => vehicle.id.toString() === vehicleId);
  
    if (vehicle) {
      // Find the driver that is assigned to this vehicle
      const driver = drivers.find(driver => driver.id === vehicle.driver);
      setSelectedVehicle(vehicle);
      setSelectedDriver(driver || { full_name: "No Driver Assigned" });
    } else {
      setSelectedVehicle(null);
      setSelectedDriver(null);
    }
  };
  


  const handleConfirmApprove = async (requestId) => {
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
  
    if (!selectedDriver || !selectedVehicle) {
      toast.error("Please select a driver and vehicle before approving.");
      return;
    }
  
    try {
      await axios.patch(
        `http://127.0.0.1:8000/vehicles/${selectedVehicle.id}/`,
        { status: "in_use" },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
  
      const response = await fetch(`http://127.0.0.1:8000/transport-requests/${requestId}/action/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "forward",
          driver: selectedDriver.id,
          vehicle: selectedVehicle.id,
        }),
      });
  
      if (!response.ok) throw new Error("Failed to approve transport request");
  
      // Update the status locally after approval
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: "approved", driver: selectedDriver, vehicle: selectedVehicle } : req
        )
      );
  
      setSelectedRequest(null); // Close modal
      setSelectedDriver(null); // Clear selected driver
      setSelectedVehicle(null); // Clear selected vehicle
      setShowApproveConfirmation(false); // Close approval modal
      toast.success("Request approved successfully!"); // Show success toast
  
      // Decrease the notification count
      decrementUnreadCount();
    } catch (error) {
      console.error("Approve Error:", error);
      toast.error("Failed to approve request."); // Show error toast
    }
  };

  const handleRejectClick = () => {
    setShowRejectionModal(true); // Show rejection modal
  };

  const handleConfirmReject = () => {
    setShowConfirmation(true); // Show rejection confirmation dialog
  };

  const handleConfirmAction = () => {
    handleReject(selectedRequest.id); // Call handleReject
    setShowConfirmation(false); // Close rejection confirmation dialog
  };

  const handleReject = async (requestId) => {
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
  
    if (!rejectionReason) {
      toast.error("Please provide a reason for rejection."); // Show error toast
      return;
    }
  
    try {
      const response = await fetch(`http://127.0.0.1:8000/transport-requests/${requestId}/action/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reject",
          rejection_message: rejectionReason, // Use the provided reason
        }),
      });
  
      if (!response.ok) throw new Error("Failed to reject transport request");
  
      // Update the status locally after rejection
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: "rejected" } : req
        )
      );
  
      setSelectedRequest(null); // Close modal
      setRejectionReason(""); // Clear rejection reason
      setShowRejectionModal(false); // Close rejection modal
      toast.success("Request rejected successfully!"); // Show success toast
  
      // Decrease the notification count
      decrementUnreadCount();
    } catch (error) {
      console.error("Reject Error:", error);
      toast.error("Failed to reject request."); // Show error toast
    }
  };
  return (
    <div className="container mt-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
      <ToastContainer /> {/* Toast container for notifications */}
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
                      style={{ backgroundColor: "#181E4B", color: "white" }}
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
                <button type="button" className="btn-close" onClick={handleCloseDetail}><IoClose/></button>
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
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: "#28a745", color: "white" }}
                  onClick={handleApproveClick} 
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: "#dc3545", color: "white" }}
                  onClick={handleRejectClick} // Show rejection modal
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: "#0b455b", color: "white" }}
                  onClick={console.log("forward")} // Show rejection modal
                >
                  Forward
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectionModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Request</h5>
                <button type="button" onClick={() => setShowRejectionModal(false)}><IoMdClose size={30}/></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="rejectionReason" className="form-label">
                    Rejection Reason
                  </label>
                  <textarea
                    id="rejectionReason"
                    className="form-control"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a reason for rejection"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmReject} // Show confirmation dialog
                > 
                  Submit Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Rejection</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmation(false)}>
                  <IoMdClose size={30}/>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to reject this request?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmation(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmAction}>
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showApproveConfirmation && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign Driver and Vehicle</h5>
                <button type="button" className="btn-close" onClick={() => setShowApproveConfirmation(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Start Day:</strong> {selectedRequest.start_day}</p>
                <p><strong>Start Time:</strong> {selectedRequest.start_time}</p>
                <p><strong>Return Day:</strong> {selectedRequest.return_day}</p>
                <p><strong>Employees:</strong> {getEmployeeNames(selectedRequest.employees)}</p>
                <p><strong>Destination:</strong> {selectedRequest.destination}</p>
                <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                <div className="mb-3">
  <label htmlFor="vehicleSelect" className="form-label">Select Vehicle:</label>
<select
  id="vehicleSelect"
  className="form-control"
  value={selectedVehicle ? selectedVehicle.id : ""}
  onChange={handleVehicleChange}
>
  <option value="">Select a vehicle</option>
  {vehicles.map((vehicle) => (
    <option key={vehicle.id} value={vehicle.id}>
      {`Plate Number-${vehicle.license_plate}, Driver-${vehicle.driver || "No Driver Assigned"}, Capacity-${vehicle.capacity}`}
    </option>
  ))}
</select>

</div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowApproveConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleConfirmApprove(selectedRequest.id)}
                >
                  Confirm Approval
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportRequest;