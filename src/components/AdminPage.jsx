import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Rejection from "./Rejection"; // Import the Rejection modal component

const AdminPage = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

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

  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("You need to be logged in to approve users.");
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/approve/${userId}/`, {
        method: "PATCH",
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

  const handleReject = (userId) => {
    setSelectedUserId(userId); // Store the user ID for rejection
    setShowRejectModal(true); // Open the rejection modal
  };

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
          method: "PATCH",
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

  const handleRoleChange = async (userId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("You need to be logged in to update user roles.");
        return;
      }
  
      const response = await fetch(
        `http://127.0.0.1:8000/users/${userId}/update_role/`,
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
  
        // Update the UI without refreshing
        setData((prevData) =>
          prevData.map((user) =>
            user.id === userId ? { ...user, role: selectedRole } : user
          )
        );
  
        setEditingRoleId(null); // Exit editing mode
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update user role.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the role.");
    }
  };
  
  const roles = [
    { id: 1, label: "Staff" },
    { id: 2, label: "Department Manager" },
    { id: 3, label: "Finance Manager" },
    { id: 4, label: "Transport Manager" },
    { id: 5, label: "CEO" },
    { id: 6, label: "Driver" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [currentPage, navigate]);

  return (
    <div className="admin-container d-flex flex-column">
      <Header username="Admin" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-3 col-lg-2 admin-sidebar bg-light">
            <Sidebar />
          </div>
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
      onChange={(e) => setSelectedRole(Number(e.target.value))}
      className="form-select form-select-sm"
    >
      {roles.map((role) => (
        <option key={role.id} value={role.id}>
          {role.label}
        </option>
      ))}
    </select>
  ) : (
    user.role_display || roles.find((r) => r.id === user.role)?.label || "Staff"
  )}
</td>
                      <td>{user.department || "N/A"}</td>
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

            <div>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-warning me-2"
                style={{ backgroundColor: "#0B455B", color: "#fff" }}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="btn btn-warning"
                style={{ backgroundColor: "#0B455B", color: "#fff" }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showRejectModal && (
        <Rejection
          setModalOpen={setShowRejectModal}
          sendRejectionEmail={sendRejectionEmail}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default AdminPage;
