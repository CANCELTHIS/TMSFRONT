import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "./Header";

const AdminPage = () => {
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState(""); // To store the rejection message
  const [showApproveModal, setShowApproveModal] = useState(false); // To control approve modal visibility
  const [userToApprove, setUserToApprove] = useState(null); // To store the user that needs approval
  const navigate = useNavigate();

  const ROLE_CHOICES = [
    { value: 1, label: 'Employee' },
    { value: 2, label: 'Department Manager' },
    { value: 3, label: 'Finance Manager' },
    { value: 4, label: 'Transport Manager' },
    { value: 5, label: 'CEO' },
    { value: 6, label: 'Driver' },
    { value: 7, label: 'System Admin' }
  ];

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token is missing. Please log in again.");
      }

      const response = await fetch(`http://127.0.0.1:8000/departments/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setDepartments(result); // Assuming the response contains an array of departments
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch departments.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch users with pagination
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Token is missing. Please log in again.");
      }

      const response = await fetch(
        `http://127.0.0.1:8000/users/?page=${currentPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch users.");
      }
    } catch (error) {
      setError(error.message);
      if (error.message === "Unauthorized. Token might be expired.") {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle approving a user
  const handleApprove = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("You need to be logged in to approve users.");
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/approve/${userToApprove.id}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "approve" }),
      });

      if (response.ok) {
        toast.success("User approved successfully!");
        setShowApproveModal(false); // Close modal
        fetchUsers();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to approve user.");
      }
    } catch (error) {
      toast.error("An error occurred while approving the user.");
    }
  };

  // Get role label from ROLE_CHOICES
  const getRoleLabel = (roleId) => {
    const role = ROLE_CHOICES.find((role) => role.value === roleId);
    return role ? role.label : "Unknown Role";
  };

  // Handle reject action
  const handleReject = (userId) => {
    setSelectedUserId(userId); // Store the user ID for rejection
    setShowRejectModal(true); // Open the rejection modal
  };

  // Confirm rejection action
  const confirmRejection = () => {
    if (!rejectionReason) {
      toast.error("Please provide a rejection message.");
      return;
    }
    sendRejectionEmail(rejectionReason); // Call to send rejection email
  };

  // Send rejection email
  const sendRejectionEmail = async (rejectionReason) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("You need to be logged in to reject users.");
        return;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/approve/${selectedUserId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "reject",
            rejection_message: rejectionReason,
          }),
        }
      );

      if (response.ok) {
        toast.success("User rejected successfully!");
        fetchUsers();
        setShowRejectModal(false); // Close the rejection modal after submission
        setRejectionReason(""); // Reset rejection message
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to reject user.");
      }
    } catch (error) {
      toast.error("An error occurred while rejecting the user.");
    }
  };

  // Fetch users on initial load and when page changes
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    } else {
      fetchDepartments(); // Fetch departments on page load
      fetchUsers();
    }
  }, [currentPage, navigate]);

  return (
    <div className="admin-container d-flex flex-column mt-5">
      <Header username="Admin" />
      <div className="container-fluid">
        <div className="row mt-4">
          <div className="col-12 col-md-9 col-lg-10 admin-content p-4">
            {error && <p className="text-danger">{error}</p>}
            {isLoading && <p>Loading users...</p>}

            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((user) => (
                    <tr key={user.id}>
                      <td>{user.full_name || "N/A"}</td>
                      <td>{user.email}</td>
                      <td>{getRoleLabel(user.role)}</td>
                      <td>{user.department}</td>
                      <td>{user.is_active ? "Active" : "Pending"}</td>
                      <td>
                        {!user.is_active && (
                          <div style={{display:"flex", gap:"30px",alignItems:"center",justifyContent:"center"}}>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => {
                                setUserToApprove(user);
                                setShowApproveModal(true);
                              }}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleReject(user.id)}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="modal show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Approval</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowApproveModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to approve this user?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowApproveModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleApprove}
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="modal show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Rejection</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRejectModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  placeholder="Provide rejection reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmRejection}
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

export default AdminPage;
