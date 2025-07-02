import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify"; // For toast messages
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/Logo.jpg"; // Import the logo image
import { IoMdClose } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { ENDPOINTS } from "../utilities/endpoints";
import UnauthorizedPage from "./UnauthorizedPage";
import ServerErrorPage from "./ServerErrorPage";

const DepartementPage = () => {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]); // State for employees
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null); // Selected request for modal
  const [rejectionReason, setRejectionReason] = useState(""); // State for rejection reason
  const [showRejectionModal, setShowRejectionModal] = useState(false); // State for rejection modal
  const [showConfirmation, setShowConfirmation] = useState(false); // State for rejection confirmation dialog
  const [showApproveConfirmation, setShowApproveConfirmation] = useState(false); // State for approve confirmation dialog
  const [errorType, setErrorType] = useState(null); // "unauthorized" | "server" | null

  const accessToken = localStorage.getItem("authToken");

  // Fetch requests and users when the component mounts
  useEffect(() => {
    fetchRequests();
    fetchUsers(); // Fetch users
  }, []);

  const fetchRequests = async () => {
    if (!accessToken) {
      setErrorType("unauthorized");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(ENDPOINTS.REQUEST_LIST, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setErrorType("unauthorized");
        } else {
          setErrorType("server");
        }
        throw new Error("Failed to fetch transport requests");
      }

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
      setErrorType("unauthorized");
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.USER_LIST, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setErrorType("unauthorized");
        } else {
          setErrorType("server");
        }
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.results || []); // Set users data
    } catch (error) {
      console.error("Fetch Users Error:", error);
    }
  };

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

  const handleApprove = async (requestId) => {
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.TM_APPROVE_REJECT(requestId), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "forward",
        }),
      });

      if (!response.ok) throw new Error("Failed to forward transport request");

      // Remove the request from the table after approval
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId)
      );

      setSelectedRequest(null); // Close modal
      toast.success("Request forwarded to transport manager successfully!"); // Show success toast
    } catch (error) {
      console.error("Approve Error:", error);
      toast.error("Failed to forward request."); // Show error toast
    }
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
      const response = await fetch(ENDPOINTS.TM_APPROVE_REJECT(requestId), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reject",
          rejection_message: rejectionReason,
        }),
      });

      if (!response.ok) throw new Error("Failed to reject transport request");

      // Remove the request from the table after rejection
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId)
      );

      setSelectedRequest(null); // Close modal
      setRejectionReason(""); // Clear rejection reason
      setShowRejectionModal(false); // Close rejection modal
      toast.success("Request rejected successfully!"); // Show success toast
    } catch (error) {
      console.error("Reject Error:", error);
      toast.error("Failed to reject request."); // Show error toast
    }
  };

  const handleRejectClick = () => {
    setShowRejectionModal(true);
  };

  const handleConfirmReject = () => {
    setShowConfirmation(true);
  };

  const handleConfirmAction = () => {
    handleReject(selectedRequest.id);
    setShowConfirmation(false);
  };

  const handleApproveClick = () => {
    setShowApproveConfirmation(true);
  };

  const handleConfirmApprove = () => {
    handleApprove(selectedRequest.id); // Call handleApprove
    setShowApproveConfirmation(false); // Close approve confirmation dialog
  };

  if (errorType === "unauthorized") {
    return <UnauthorizedPage />;
  }
  if (errorType === "server") {
    return <ServerErrorPage />;
  }

  return (
    <div
      className="container mt-4"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}
    >
      <ToastContainer />
      {loading ? (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading data...</p>
        </div>
      ) : (
        <div
          className="table-responsive"
          style={{ width: "100%", overflowX: "auto" }}
        >
          <div style={{ overflowX: "auto" }}>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
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
          </div>
        </div>
      )}

      {selectedRequest && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <img
                  src={Logo}
                  alt="Logo"
                  style={{
                    width: "100px",
                    height: "70px",
                    marginRight: "10px",
                  }}
                />
                <h5 className="modal-title">Transport Request Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDetail}
                >
                  <IoCloseSharp size={24} />
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Start Day:</strong> {selectedRequest.start_day}
                </p>
                <p>
                  <strong>Start Time:</strong> {selectedRequest.start_time}
                </p>
                <p>
                  <strong>Return Day:</strong> {selectedRequest.return_day}
                </p>
                <p>
                  <strong>Employees:</strong>{" "}
                  {getEmployeeNames(selectedRequest.employees)}
                </p>
                <p>
                  <strong>Destination:</strong> {selectedRequest.destination}
                </p>
                <p>
                  <strong>Reason:</strong> {selectedRequest.reason}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: "#0B455B", color: "white" }}
                  onClick={handleApproveClick} // Show approve confirmation dialog
                >
                  Forward
                </button>
                <button
                  type="button"
                  className="btn"
                  style={{ backgroundColor: "#dc3545", color: "white" }}
                  onClick={handleRejectClick} // Show rejection modal
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectionModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Request</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRejectionModal(false)}
                >
                  <IoCloseSharp size={24} />
                </button>
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
                  className="btn btn-danger w-80"
                  onClick={handleConfirmReject} // Show confirmation dialog
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Rejection</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmation(false)}
                >
                  <IoCloseSharp size={24} />
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to reject this request?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmAction}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showApproveConfirmation && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Approval</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowApproveConfirmation(false)}
                >
                  <IoCloseSharp size={24} />
                </button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to forward this request to the transport
                  manager?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  style={{ backgroundColor: "#0B455B", color: "white" }}
                  className="btn"
                  onClick={handleConfirmApprove}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartementPage;
