import React, { useState, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt, FaArrowLeft } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirecting

const Header = ({ role, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const navigate = useNavigate(); // Initialize navigate for redirection

  useEffect(() => {
    // Fetch user data
    axios.get(`/api/users/${userId}/`)
      .then(response => {
        setFormData({
          fullName: response.data.full_name,
          email: response.data.email,
          phoneNumber: response.data.phone_number,
          password: "",
        });
      })
      .catch(error => console.error("Error fetching user data:", error));
  }, [userId]);

  const handleLogout = () => {
    // Clear the token (for example, remove it from localStorage or sessionStorage)
    localStorage.removeItem("access_token"); // Assuming the token is stored in localStorage

    // Redirect to base URL or login page
    navigate("/"); // This will redirect the user to the base URL (you can change the route as per your app's structure)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/users/${userId}/`, formData)
      .then(response => {
        console.log("Profile updated successfully");
        setIsEditing(false);
      })
      .catch(error => console.error("Error updating profile:", error));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
      <span className="navbar-brand fw-bold text-primary">{role}</span>
      <div className="ms-auto d-flex align-items-center position-relative">
        <div className="user-menu" onClick={() => setIsEditing(!isEditing)}>
          <img
            src="https://via.placeholder.com/40" // Placeholder profile image
            alt="User Profile"
            className="rounded-circle me-2"
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
          />
        </div>
        {isEditing && (
          <div
            className="dropdown-menu show position-absolute end-0 mt-2 shadow rounded p-3 bg-white"
            style={{ zIndex: 1050, top: "100%", width: "280px" }}
          >
            <button
              type="button"
              className="btn btn-link text-dark d-flex align-items-center mb-3"
              onClick={() => setIsEditing(false)}
            >
              <FaArrowLeft size={16} className="me-2" />
              <span>Back</span>
            </button>
            <h5 className="mb-3 text-center" style={{ fontSize: "16px" }}>
              Edit Profile
            </h5>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-2">
                <label htmlFor="fullName" className="form-label" style={{ fontSize: "12px" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="email" className="form-label" style={{ fontSize: "12px" }}>
                  Email
                </label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="phoneNumber" className="form-label" style={{ fontSize: "12px" }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control form-control-sm"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="password" className="form-label" style={{ fontSize: "12px" }}>
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="d-flex justify-content-between mt-3">
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Changes
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn-link text-danger p-0"
                  style={{ fontSize: "12px" }}
                >
                  <FaSignOutAlt className="me-2" />
                  Logout
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
