import React, { useState, useEffect } from "react";
import { FaSignOutAlt, FaArrowLeft, FaTimes } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../utilities/endpoints";
const Header = ({ role, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
  });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/users/${userId}/`)
      .then(response => {
        setFormData({
          fullName: response.data.full_name,
          phoneNumber: response.data.phone_number,
          password: "", 
        });
      })
      .catch(error => console.error("Error fetching user data:", error));

    fetchNotifications();
    fetchUnreadCount();
  }, [userId]);

  const fetchNotifications = () => {
    axios.get(ENDPOINTS.REQUEST_NOTIFICATIONS, { 
      params: { unread_only: false }, // Get all notifications
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    })
    .then(response => {
      console.log("Notifications fetched:", response.data);
      setNotifications(response.data.results); // Store notifications
      setUnreadCount(response.data.unread_count); // Store unread count
    })
    .catch(error => console.error("Error fetching notifications:", error));
  };
  

  const fetchUnreadCount = () => {
    axios.get(ENDPOINTS.UNREADOUNT, { 
      params: { user_id: userId },
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    })
      .then(response => {
        console.log("Unread count fetched:", response.data);
        setUnreadCount(response.data.unread_count);
      })
      .catch(error => console.error("Error fetching unread count:", error));
  };

  const handleNotificationClick = () => {
    if (!showNotifications) {
      fetchNotifications(); // Fetch notifications when the popup is opened
    }
    setShowNotifications(!showNotifications);
  };

  const markAllNotificationsAsRead = () => {
    axios.post(ENDPOINTS.MARKALL_READ, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then(() => {
        setUnreadCount(0); // Reset unread count
        fetchNotifications(); // Refresh notifications
      })
      .catch(error => console.error("Error marking notifications as read:", error));
  };
  const handleCloseNotifications = () => {
    markAllNotificationsAsRead(); // Mark all notifications as read
    setShowNotifications(false); // Close the notifications popup
  };

  const handleResubmit = (requestId) => {
    navigate(`/resubmit-request/${requestId}`); 
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await axios.post(ENDPOINTS.LOGOUT, { refresh: refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("authToken");
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
    axios.put(ENDPOINTS.USER_DETAIL, formData)
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
        <div className="position-relative">
          <IoIosNotificationsOutline 
            size={30} 
            className="me-3 cursor-pointer" 
            onClick={handleNotificationClick}
            style={{ cursor: "pointer" }}
          />
          {unreadCount > 0 && (
            <span className="position-absolute translate-middle badge rounded-pill" style={{ top: "7px", left: "27px",backgroundColor:"#121E4B" }}>
              {unreadCount}
            </span>
          )}
        </div>

        {showNotifications && (
  <div className="dropdown-menu show position-absolute end-0 mt-2 shadow rounded p-3 bg-white"
    style={{ zIndex: 1050, top: "100%", width: "350px" }}>
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="mb-0">Notifications</h5>
      <FaTimes 
        size={20} 
        className="cursor-pointer" 
        onClick={handleCloseNotifications}
        style={{ cursor: "pointer" }}
      />
    </div>
    {notifications.length > 0 ? (
      notifications.map(notification => (
        <div key={notification.id} className="mb-3 p-2 border-bottom">
          <h6 className="mb-1">{notification.title}</h6>
          <p className="mb-1">{notification.message}</p>
          <small className="text-muted">
            {new Date(notification.created_at).toLocaleString()}
          </small>
          {notification.metadata && (
            <div className="mt-2">
              <small>
                <strong>Request ID:</strong> {notification.metadata.request_id}<br />
                <strong>Destination:</strong> {notification.metadata.destination}<br />
                <strong>Requester ID:</strong> {notification.metadata.requester_id}
              </small>
            </div>
          )}
          {notification.notification_type === 'rejected' && (
            <button 
              className="btn btn-primary btn-sm mt-2"
              onClick={() => handleResubmit(notification.metadata.request_id)}
            >
              Resubmit
            </button>
          )}
        </div>
      ))
    ) : (
      <p>No new notifications</p>
    )}
  </div>
)}
        {/* Profile Icon */}
        <div className="user-menu" onClick={() => setIsEditing(!isEditing)}>
          <MdAccountCircle size={32} style={{ cursor: "pointer" }} />
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