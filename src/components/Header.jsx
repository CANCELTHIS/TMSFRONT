import React, { useState, useEffect } from "react";
import { FaSignOutAlt, FaArrowLeft } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Header = ({ role, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
  });

  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    axios.get(`/api/users/${userId}/`)
      .then(response => {
        setFormData({
          fullName: response.data.full_name,
          phoneNumber: response.data.phone_number,
          password: "", // Don't show password initially
        });
      })
      .catch(error => console.error("Error fetching user data:", error));
  }, [userId]);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await axios.post("http://127.0.0.1:8000/api/logout/", { refresh: refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/users/${userId}/`, formData)
      .then(() => {
        console.log("Profile updated successfully");
        setIsEditing(false);
      })
      .catch(error => console.error("Error updating profile:", error));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
      <div className="ms-auto d-flex align-items-center position-relative">
        {/* Notification Icon */}
        <IoIosNotificationsOutline size={24} className="me-3 cursor-pointer" />
        
        {/* Profile Icon */}
        <div className="user-menu" onClick={() => setIsEditing(!isEditing)}>
          <MdAccountCircle size={32} className="cursor-pointer" />
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
