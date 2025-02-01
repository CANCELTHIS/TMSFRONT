import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AccountPage = () => {
  const itemsPerPage = 5;
  const [accounts, setAccounts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roleMappings, setRoleMappings] = useState({});
  const [editAccount, setEditAccount] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("Unauthorized. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://127.0.0.1:8000/users/?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAccounts(response.data);
      setIsLoading(false);
    } catch (error) {
      setError("Failed to load users.");
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/departments/');
      setDepartments(response.data);
    } catch (error) {
      setError("Failed to load departments.");
    }
  };

  const fetchRoles = async () => {
    const roleData = {
      1: "Employee",
      2: "Department Manager",
      3: "Finance Manager",
      4: "Transport Manager",
      5: "CEO",
      6: "Driver",
      7: "System Admin",
    };
    setRoleMappings(roleData);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageAccounts = accounts.slice(startIndex, endIndex);

  const handleToggleStatus = async (id, isActive) => {
    const token = localStorage.getItem('authToken');
    const endpoint = isActive
      ? `http://127.0.0.1:8000/deactivate/${id}/`
      : `http://127.0.0.1:8000/activate/${id}/`;

    try {
      await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      setError("Failed to update status.");
    }
  };

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

      fetchUsers();
      setEditAccount(null);
    } catch (error) {
      setError("Failed to update role.");
    }
  };

  const handleCancelEdit = () => {
    setEditAccount(null); // Cancel the editing mode
  };

  const handleRoleChange = (e) => {
    setFormValues({ ...formValues, role: e.target.value });
  };

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
            <span className="rounded-circle border d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
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
                            <td>
                              {editAccount && editAccount.id === acc.id ? (
                                <select
                                  className="form-control"
                                  value={formValues.role}
                                  onChange={handleRoleChange}
                                >
                                  {Object.keys(roleMappings).map((roleId) => (
                                    <option key={roleId} value={roleId}>
                                      {roleMappings[roleId]}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                roleMappings[acc.role]
                              )}
                            </td>
                            <td>{departments.find(dep => dep.id === acc.department)?.name}</td>
                            <td>
                              <span className={`badge ${acc.is_active ? "bg-success" : "bg-secondary"}`}>
                                {acc.is_active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td>
                              {editAccount && editAccount.id === acc.id ? (
                                <>
                                  <button className="btn btn-primary btn-sm me-2" onClick={handleSaveEdit}>
                                    Save
                                  </button>
                                  <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(acc)}>
                                  Edit
                                </button>
                              )}
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

        <div className="d-flex justify-content-between align-items-center mt-3">
          <button className="btn btn-secondary btn-sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <small>
            Page {currentPage} of {Math.ceil(accounts.length / itemsPerPage)}
          </small>
          <button className="btn btn-secondary btn-sm" onClick={handleNextPage} disabled={currentPage * itemsPerPage >= accounts.length}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
