import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer";
import axios from "axios"; // For API requests

const AdminDepartmentPage = () => {
  const [departments, setDepartments] = useState([]);  // Ensure it's always an array
  const [users, setUsers] = useState([]); // State for users
  const [showModal, setShowModal] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    manager: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Get the token from localStorage
  const token = localStorage.getItem("authToken");

  // Set Authorization header if token exists
  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch departments and users when the component loads
  useEffect(() => {
    const fetchDepartmentsAndUsers = async () => {
      try {
        // Fetch departments
        const departmentResponse = await axiosInstance.get("http://127.0.0.1:8000/departments/");
        const userResponse = await axiosInstance.get("http://127.0.0.1:8000/users/"); // Endpoint for users
        
        // Check if the data is valid
        if (Array.isArray(departmentResponse.data) && Array.isArray(userResponse.data)) {
          const fetchedDepartments = departmentResponse.data;
          const fetchedUsers = userResponse.data;

          // Sort users by department and role to find the Department Manager
          const sortedDepartments = fetchedDepartments.map(department => {
            // Find the department manager by filtering users based on department and role
            const departmentManager = fetchedUsers.find(
              user => user.department === department.name && user.role === 2 // Role 2 is Department Manager
            );

            return {
              ...department,
              manager: departmentManager ? departmentManager.full_name : "", // Set manager name if exists
            };
          });

          setDepartments(sortedDepartments);
          setUsers(fetchedUsers);
        } else {
          console.error("API response is not an array", departmentResponse.data, userResponse.data);
          setDepartments([]); // Default to empty array if response is not an array
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setDepartments([]); // Default to empty array in case of error
        setUsers([]);
      }
    };

    fetchDepartmentsAndUsers();
  }, []);

  const validateInput = () => {
    const errors = {};
    if (!formValues.name) errors.name = "Department name is required.";
    if (!formValues.manager) errors.manager = "Manager name is required.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddOrEdit = async () => {
    if (!validateInput()) return;

    try {
      let response;
      if (currentDepartment) {
        // Edit existing department
        response = await axiosInstance.put(
          `http://127.0.0.1:8000/departments/${currentDepartment.id}/`,
          formValues
        );
        setDepartments((prev) =>
          prev.map((dept) =>
            dept.id === currentDepartment.id ? { ...dept, ...formValues } : dept
          )
        );
      } else {
        // Add new department
        response = await axiosInstance.post(
          "http://127.0.0.1:8000/departments/",
          formValues
        );
        setDepartments((prev) => [...prev, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving department:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormValues({ name: "", manager: "" });
    setFormErrors({});
    setCurrentDepartment(null);
  };

  const handleEdit = (department) => {
    setCurrentDepartment(department);
    setFormValues(department);
    setShowModal(true);
  };

  return (
    <div className="d-flex mt-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
          <h2 className="h5">Department Management</h2>
        </div>

        <div className="container py-4">
          <div className="d-flex justify-content-start align-items-center mb-4">
            <button className="btn" style={{backgroundColor:"#0b455b",color:"#fff"}} onClick={() => setShowModal(true)}>
              + Add Department
            </button>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Department Name</th>
                      <th>Manager</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.length > 0 ? (
                      departments.map((dept, index) => (
                        <tr key={dept.id}>
                          <td>{index + 1}</td>
                          <td>{dept.name}</td>
                          <td>{dept.department_manager}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No departments added yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{currentDepartment ? "Edit Department" : "Add Department"}</h5>
                  <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Department Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formValues.name}
                      onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                    />
                    {formErrors.name && <small className="text-danger">{formErrors.name}</small>}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Manager</label>
                    <input
                      type="text"
                      className="form-control"
                      name="manager"
                      value={formValues.manager}
                      onChange={(e) => setFormValues({ ...formValues, manager: e.target.value })}
                    />
                    {formErrors.manager && <small className="text-danger">{formErrors.manager}</small>}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleAddOrEdit}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDepartmentPage;
