import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios"; // Ensure axios is imported
import Lottie from 'lottie-react';
import animationData from "./Lottie Lego (1).json";
import { IoCloseSharp } from "react-icons/io5";

const AdminPage = () => {
  const [data, setData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [userToApprove, setUserToApprove] = useState(null);
  const [editAccount, setEditAccount] = useState(null);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: ''
  });
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
        setDepartments(result);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch departments.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

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

  const handleApprove = async () => {
    setShowApproveModal(false); // Close the modal immediately
    setIsProcessing(true); // Start showing the animation
    
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("You need to be logged in to approve users.");
        return;
      }
  
      const response = await fetch(
        `http://127.0.0.1:8000/approve/${userToApprove.id}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "approve" }),
        }
      );
  
      if (response.ok) {
        toast.success("User approved successfully!");
        fetchUsers(); // Refresh user list
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to approve user.");
      }
    } catch (error) {
      toast.error("An error occurred while approving the user.");
    } finally {
      setIsProcessing(false); // Stop animation after process completes
    }
  };
  

  const getRoleLabel = (roleId) => {
    const role = ROLE_CHOICES.find((role) => role.value === roleId);
    return role ? role.label : "Unknown Role";
  };

  const handleReject = (userId) => {
    setSelectedUserId(userId);
    setShowRejectModal(true);
  };

  const confirmRejection = () => {
    if (!rejectionReason) {
      toast.error("Please provide a rejection message.");
      return;
    }
    sendRejectionEmail(rejectionReason);
  };

  const sendRejectionEmail = async (rejectionReason) => {
    setIsProcessing(true); // Start animation
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
        setShowRejectModal(false);
        setRejectionReason("");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to reject user.");
      }
    } catch (error) {
      toast.error("An error occurred while rejecting the user.");
    } finally {
      setIsProcessing(false); // Stop animation
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    } else {
      fetchDepartments();
      fetchUsers();
    }
  }, [currentPage, navigate]);

  const handleEdit = (account) => {
    setEditAccount(account);
    setFormValues({
      name: account.full_name,
      email: account.email,
      phone: account.phone,
      role: account.role,
      department: account.department,
    });
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem('authToken');

    try {
      await axios.patch(
        `http://127.0.0.1:8000/update-role/${editAccount.id}/`,
        { role: formValues.role },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Role updated successfully!");
      fetchUsers();
      setEditAccount(null);
    } catch (error) {
      setError("Failed to update role.");
      toast.error("Failed to update role.");
    }
  };

  const handleCancelEdit = () => {
    setEditAccount(null);
  };

  const handleRoleChange = (e) => {
    setFormValues({ ...formValues, role: e.target.value });
  };

  return (
    <div className="admin-container d-flex flex-column mt-5">
      <div className="container-fluid">
        <div className="row mt-4">
          <div className="col-12 col-md-9 col-lg-10 admin-content p-4">
            {error && <p className="text-danger">{error}</p>}
            {isLoading && <p>Loading users...</p>}
            {isProcessing && (
  <div className="loading-overlay">
    <Lottie animationData={animationData} loop autoPlay style={{ width: 300, height: 300 }} />
  </div>
)}


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
                      <td>
                        {editAccount && editAccount.id === user.id ? (
                          <select
                            value={formValues.role}
                            onChange={handleRoleChange}
                          >
                            {ROLE_CHOICES.map(role => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          getRoleLabel(user.role)
                        )}
                      </td>
                      <td>{user.department}</td>
                      <td>{user.is_active ? "Active" : "Pending"}</td>
                      <td>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <button
                            className="btn btn-sm"
                            style={{backgroundColor:"#0b455b",color:"white"}}
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          {editAccount && editAccount.id === user.id && (
                            <div>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={handleSaveEdit}
                              >
                                Save
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                          {!user.is_active && (
                            <>
                              <button
                                className="btn btn-sm btn-success"
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
                            </>
                          )}
                        </div>
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
                <h5 className="modal-title">Approve User</h5>
                <button
  onClick={() => setShowApproveModal(false)} // Or setShowRejectModal(false)
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer"
  }}
>
<IoCloseSharp/>
</button>

              </div>
              <div className="modal-body">
                <p>Are you sure you want to approve {userToApprove?.full_name}?</p>
              </div>
              <div className="modal-footer" style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleApprove}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowApproveModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject User</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowRejectModal(false)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer"
                  }}
                >
                 <IoCloseSharp/>
                </button>
              </div>
              <div className="modal-body">
                <label htmlFor="rejectionReason">Rejection Reason:</label>
                <textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="4"
                  className="form-control"
                />
              </div>
              <div className="modal-footer" style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmRejection}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
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
