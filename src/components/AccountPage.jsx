import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer";

const AccountPage = () => {
  const itemsPerPage = 5; // Number of items to display per page
  const [accounts, setAccounts] = useState([]);

  const [editAccount, setEditAccount] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
  });
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from the endpoint
  const fetchUsers = async () => {
    const token = localStorage.getItem('authToken'); // Get token from storage
    if (!token) {
      setError("Unauthorized. Please log in.");
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await axios.get("http://127.0.0.1:8000/status-history/", {
        headers: { Authorization: `Bearer ${token}` }, // Include token
      });
  
      setAccounts(response.data);
      setIsLoading(false);
    } catch (error) {
      setError("Failed to load users.");
      setIsLoading(false);
    }
  };
  

  // Calculate start and end index for pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageAccounts = accounts.slice(startIndex, endIndex);

  // Toggle user active/inactive status
  const handleToggleStatus = async (id, isActive) => {
    const token = localStorage.getItem('authToken');
    const endpoint = isActive
      ? `http://127.0.0.1:8000/deactivate/${id}/`
      : `http://127.0.0.1:8000/activate/${id}/`;
  
    try {
      await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      fetchUsers(); // Refresh user list after change
    } catch (error) {
      setError("Failed to update status.");
    }
  };
  

  // Handle editing of user role
  const handleEdit = (account) => {
    setEditAccount(account);
    setFormValues({
      name: account.name,
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
  
      fetchUsers();
      setEditAccount(null);
    } catch (error) {
      setError("Failed to update role.");
    }
  };
  

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage * itemsPerPage < accounts.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="d-flex mt-5" style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
      <div className="flex-grow-1 mt-2">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h5">Account Management</h2>
          <div className="d-flex align-items-center">
            <span className="me-2">Hello, Admin</span>
            <span
              className="rounded-circle border d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px" }}
            >
              &#x1F464;
            </span>
          </div>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="container py-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
  {Array.isArray(currentPageAccounts) && currentPageAccounts.length > 0 ? (
    currentPageAccounts.map((acc, index) => (
      <tr key={acc.id}>
        <td>{index + 1}</td>
        <td>{acc.full_name}</td>
<td>{acc.email}</td>
<td>{acc.phone_number}</td>
<td>{acc.role}</td>
<td>{acc.department}</td>

        <td>
          <span className={`badge ${acc.is_active ? "bg-success" : "bg-secondary"}`}>
            {acc.is_active ? "Active" : "Inactive"}
          </span>
        </td>
        <td>
          <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(acc)}>
            Edit
          </button>
          <button
            className={`btn btn-sm ${acc.is_active ? "btn-danger" : "btn-success"}`}
            onClick={() => handleToggleStatus(acc.id, acc.is_active)}
          >
            {acc.is_active ? "Deactivate" : "Activate"}
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8" className="text-center">
        No accounts found.
      </td>
    </tr>
  )}
</tbody>

                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button
            className="btn btn-secondary btn-sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <small>
            Page {currentPage} of {Math.ceil(accounts.length / itemsPerPage)}
          </small>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleNextPage}
            disabled={currentPage * itemsPerPage >= accounts.length}
          >
            Next
          </button>
        </div>

        {/* Edit Account Modal */}
        {editAccount && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Account</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setEditAccount(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formValues.name}
                      onChange={(e) =>
                        setFormValues({ ...formValues, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formValues.email}
                      onChange={(e) =>
                        setFormValues({ ...formValues, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formValues.phone}
                      onChange={(e) =>
                        setFormValues({ ...formValues, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formValues.role}
                      onChange={(e) =>
                        setFormValues({ ...formValues, role: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Department</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formValues.department}
                      onChange={(e) =>
                        setFormValues({ ...formValues, department: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditAccount(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveEdit}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default AccountPage;
