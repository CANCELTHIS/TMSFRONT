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
  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("You need to be logged in to approve users.");
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/approve/${userId}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "approve" }),
      });

      if (response.ok) {
        toast.success("User approved successfully!");
        fetchUsers();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to approve user.");
      }
    } catch (error) {
      toast.error("An error occurred while approving the user.");
    }
  };

  // Handle role change
  const handleRoleChange = async (userId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("You need to be logged in to update user roles.");
        return;
      }
      const response = await fetch(
        `http://127.0.0.1:8000/update-role/${userId}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: selectedRole }),
        }
      );
      if (response.ok) {
        toast.success("User role updated successfully!");

        // After successful update, refetch users to reflect the updated data
        fetchUsers();

        setEditingRoleId(null); // Exit editing mode
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update user role.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the role.");
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

  // Handle rejection email sending
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
                      <td>
                        {editingRoleId === user.id ? (
                          <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="form-select"
                          >
                            {ROLE_CHOICES.map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          getRoleLabel(user.role) // Display role label dynamically
                        )}
                      </td>
                      <td>
                        {user.department
                          ? departments.find((dep) => dep.id === user.department)?.name
                          : "N/A"}
                      </td>
                      <td>{user.is_active ? "Active" : "Pending"}</td>
                      <td>
                        {editingRoleId === user.id ? (
                          <>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => handleRoleChange(user.id)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => setEditingRoleId(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={() => {
                                setEditingRoleId(user.id);
                                setSelectedRole(user.role);
                              }}
                            >
                              Edit Role
                            </button>
                            {!user.is_active && (
                              <>
                                <button
                                  className="btn btn-sm btn-success me-2"
                                  onClick={() => handleApprove(user.id)}
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
                          </>
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
    </div>
  );
};

export default AdminPage;
