import React, { useState, useEffect } from "react";
import { FaSignOutAlt, FaArrowLeft, FaTimes } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../utilities/endpoints";
import "../index.css"; // Ensure you have the correct path to your CSS file
const Header = ({ setRole, onResubmit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    password: "",
  });
  const [signature, setSignature] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [initialUserData, setInitialUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();

  // Fetch current user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(ENDPOINTS.CURRENT_USER, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const user = response.data;
        setInitialUserData(user);

        if (setRole) setRole(user.role);

        // Prefill form data with user info
        setFormData({
          full_name: user.full_name || "",
          phone_number: user.phone_number || "",
          password: "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserData();
    fetchNotifications();
    fetchUnreadCount();
    // eslint-disable-next-line
  }, []);

  // Helper function to construct full signature URL
  const getFullSignatureUrl = (signaturePath) => {
    if (!signaturePath) return null;
    if (signaturePath.startsWith("http")) return signaturePath;
    if (signaturePath.startsWith("/")) {
      return `https://tms-api-23gs.onrender.com${signaturePath}`;
    }
    return `https://tms-api-23gs.onrender.com/${signaturePath}`;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle signature upload and preview
  const handleSignatureChange = (e) => {
    const file = e.target.files[0];
    setSignature(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSignaturePreview(
        initialUserData?.signature_image
          ? getFullSignatureUrl(initialUserData.signature_image)
          : null
      );
    }
  };

  // Handle form submission with FormData for file upload
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("full_name", formData.full_name);
      formDataToSend.append("phone_number", formData.phone_number);

      if (formData.password) {
        formDataToSend.append("password", formData.password);
      }

      if (signature) {
        formDataToSend.append("signature_image", signature);
      }

      const response = await axios.put(ENDPOINTS.CURRENT_USER, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const updatedUser = response.data;
      setInitialUserData(updatedUser);

      setSignaturePreview(
        updatedUser.signature_image
          ? getFullSignatureUrl(updatedUser.signature_image)
          : null
      );

      setIsEditing(false);
      setSignature(null);
      setFormData((prev) => ({
        ...prev,
        password: "",
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  // --- Notification logic ---
  const fetchNotifications = () => {
    axios
      .get(ENDPOINTS.REQUEST_NOTIFICATIONS, {
        params: { unread_only: false },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        setNotifications(response.data.results || []);
        setUnreadCount(response.data.unread_count || 0);
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  };

  const fetchUnreadCount = () => {
    axios
      .get(ENDPOINTS.UNREADOUNT, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        setUnreadCount(response.data.unread_count || 0);
      })
      .catch((error) => console.error("Error fetching unread count:", error));
  };

  const handleNotificationClick = () => {
    if (!showNotifications) {
      fetchNotifications();
    }
    setShowNotifications(!showNotifications);
  };

  const markAllNotificationsAsRead = () => {
    axios
      .post(
        ENDPOINTS.MARKALL_READ,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      .then(() => {
        setUnreadCount(0);
        fetchNotifications();
      })
      .catch((error) =>
        console.error("Error marking notifications as read:", error)
      );
  };

  const handleCloseNotifications = () => {
    markAllNotificationsAsRead();
    setShowNotifications(false);
  };

  const handleResubmit = (requestId) => {
    if (onResubmit) onResubmit(requestId);
    setShowNotifications(false);
  };

  const renderNotificationContent = (notification) => {
    const notificationDate = new Date(notification.created_at);
    const formattedDate = notificationDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = notificationDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    let notificationClass = "mb-3 p-3 border-bottom";
    if (notification.notification_type === "forwarded") {
      notificationClass += " bg-light";
    } else if (notification.notification_type === "approved") {
      notificationClass += " bg-success bg-opacity-10";
    } else if (notification.notification_type === "rejected") {
      notificationClass += " bg-danger bg-opacity-10";
    } else if (notification.notification_type === "new_maintenance") {
      notificationClass += " bg-warning bg-opacity-10";
    } else if (notification.notification_type === "service_due") {
      notificationClass += " bg-info bg-opacity-10";
    }

    return (
      <div key={notification.id} className={notificationClass}>
        <h6 className="fw-bold mb-1">{notification.title || "Service Due"}</h6>
        <div className="small text-muted">
          {notification.notification_type === "service_due" &&
            notification.metadata && (
              <>
                <div className="d-flex justify-content-between">
                  <strong>Vehicle:</strong>{" "}
                  <span>{notification.metadata.vehicle_model}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <strong>Plate:</strong>{" "}
                  <span>{notification.metadata.license_plate}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <strong>Kilometer:</strong>{" "}
                  <span>{notification.metadata.kilometer}</span>
                </div>
              </>
            )}
          {notification.metadata &&
            notification.notification_type !== "service_due" && (
              <>
                {notification.metadata.requester && (
                  <div className="d-flex justify-content-between">
                    <strong>Requester:</strong>{" "}
                    <span>{notification.metadata.requester}</span>
                  </div>
                )}
                {notification.metadata.destination && (
                  <div className="d-flex justify-content-between">
                    <strong>Destination:</strong>{" "}
                    <span>{notification.metadata.destination}</span>
                  </div>
                )}
                {notification.metadata.passengers && (
                  <div className="d-flex justify-content-between">
                    <strong>Passengers:</strong>{" "}
                    <span>{notification.metadata.passengers}</span>
                  </div>
                )}
                {notification.notification_type === "rejected" &&
                  notification.metadata.rejection_reason && (
                    <div className="d-flex justify-content-between">
                      <strong>Reason:</strong>{" "}
                      <span>{notification.metadata.rejection_reason}</span>
                    </div>
                  )}
              </>
            )}
        </div>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <small className="text-muted">
            {formattedDate} at {formattedTime}
          </small>
          {notification.notification_type === "rejected" &&
            notification.metadata.request_id && (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleResubmit(notification.metadata.request_id)}
              >
                Resubmit
              </button>
            )}
        </div>
        {notification.notification_type === "service_due" && (
          <div
            className="alert alert-warning mt-2 mb-0 py-2 px-3"
            style={{ fontSize: "0.95em" }}
          >
            {notification.message}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
      <div className="ms-auto d-flex align-items-center position-relative">
        {/* Notification Bell */}
        <div className="position-relative">
          <IoIosNotificationsOutline
            size={30}
            className="me-3 cursor-pointer"
            onClick={handleNotificationClick}
            style={{ cursor: "pointer" }}
          />
          {unreadCount > 0 && (
            <span
              onClick={handleNotificationClick}
              className="position-absolute translate-middle badge d-flex align-items-center justify-content-center"
              style={{
                textAlign: "center",
                width: "22px",
                height: "22px",
                top: "7px",
                left: "25px",
                backgroundColor: "red",
                borderRadius: "50%",
                fontSize: "12px",
                color: "white",
                cursor: "pointer",
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div
            className="dropdown-menu show position-absolute end-0 mt-2 shadow rounded p-3 bg-white"
            style={{
              zIndex: 1050,
              top: "100%",
              width: "350px",
              maxHeight: "500px",
              overflowY: "auto",
            }}
          >
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
              notifications.map((notification) =>
                renderNotificationContent(notification)
              )
            ) : (
              <div className="text-center py-3">
                <p className="text-muted">No new notifications</p>
              </div>
            )}
          </div>
        )}

        {/* Profile Icon with user info */}
        <div
          className="user-menu d-flex align-items-center"
          onClick={() => setIsEditing(!isEditing)}
          style={{ cursor: "pointer" }}
        >
          <MdAccountCircle size={32} className="me-2" />
          {initialUserData && (
            <span className="d-none d-md-inline">
              {initialUserData.full_name || "My Account"}
            </span>
          )}
        </div>

        {/* Edit Profile Dropdown */}
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
                <label
                  htmlFor="full_name"
                  className="form-label"
                  style={{ fontSize: "12px" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="phone_number"
                  className="form-label"
                  style={{ fontSize: "12px" }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control form-control-sm"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="form-label"
                  style={{ fontSize: "12px" }}
                >
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  placeholder="Leave blank to keep current"
                />
              </div>

              <div className="mb-2">
                <label
                  htmlFor="signature_image"
                  className="form-label"
                  style={{ fontSize: "12px" }}
                >
                  Signature (Image)
                </label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  id="signature_image"
                  name="signature_image"
                  accept="image/*"
                  onChange={handleSignatureChange}
                />
                {signaturePreview && (
                  <div className="mt-2 text-center">
                    <img
                      src={signaturePreview}
                      alt="Signature preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "80px",
                        border: "1px solid #ddd",
                      }}
                      onError={(e) => {
                        console.error("Error loading signature image");
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-between mt-3">
                <button
                  type="submit"
                  style={{ backgroundColor: "#0B455B" }}
                  className="btn w-90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn-link text-danger p-0"
                  style={{ fontSize: "12px" }}
                  type="button"
                >
                  <FaSignOutAlt className="me-2" />
                  Logout
                </button>
              </div>
              <div className="d-flex justify-content-center mt-2"></div>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
