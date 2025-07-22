import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { ENDPOINTS } from "../utilities/endpoints";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UnauthorizedPage from "./UnauthorizedPage";
import ServerErrorPage from "./ServerErrorPage";
import { FaCarSide, FaSearch, FaSync } from "react-icons/fa";

const VehicleServices = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    month: "",
    kilometers_driven: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inlineError, setInlineError] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [kilometerLogs, setKilometerLogs] = useState([]);
  const [errorType, setErrorType] = useState(null);

  // Fetch kilometer logs
  const fetchKilometerLogs = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setErrorType("unauthorized");
        return;
      }
      const response = await axios.get(ENDPOINTS.KILOMETER_LOGS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setKilometerLogs(response.data.results || []);
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorType("unauthorized");
      } else if (error.response?.status === 403) {
        toast.error("Access denied to kilometer logs");
      } else {
        setErrorType("server");
      }
      console.error("Error fetching kilometer logs:", error);
    }
  };

  // Fetch user vehicles
  const fetchUserVehicles = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setErrorType("unauthorized");
        return;
      }
      const response = await axios.get(ENDPOINTS.CURRENT_USER_VEHICLES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const vehiclesData = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setVehicles(vehiclesData);
      if (vehiclesData.length > 0) setSelectedVehicleId(vehiclesData[0].id);
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorType("unauthorized");
      } else {
        setErrorType("server");
      }
      console.error("Error fetching user vehicles:", error);
      toast.error("Failed to load vehicles");
    }
  };

  useEffect(() => {
    fetchKilometerLogs();
    fetchUserVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert "2025-05" to "May 2025"
    const [year, monthNum] = formData.month.split("-");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const formattedMonth = `${monthNames[parseInt(monthNum, 10) - 1]} ${year}`;

    // Check for duplicate month
    if (kilometerLogs.some((log) => log.month === formattedMonth)) {
      setInlineError("You have already added a log for this month");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        ENDPOINTS.ADD_MONTHLY_KILOMETERS(selectedVehicleId),
        {
          month: formattedMonth,
          kilometers_driven: parseInt(formData.kilometers_driven, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Refetch the updated logs to get complete data
      await fetchKilometerLogs();

      setShowForm(false);
      setFormData({ month: "", kilometers_driven: "" });
      setInlineError("");
      toast.success("Kilometer log added successfully!");
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error("Failed to add kilometer log");
      if (error.response?.status === 403) {
        toast.error("You don't have permission to add logs");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (errorType === "unauthorized") {
    return <UnauthorizedPage />;
  }
  if (errorType === "server") {
    return <ServerErrorPage />;
  }

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-0 d-flex align-items-center">
            <FaCarSide className="me-2 text-success" />
            Vehicle Kilometer Logs
          </h1>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-success d-flex align-items-center"
            style={{ minWidth: "200px" }}
            onClick={fetchKilometerLogs}
            disabled={loading}
          >
            <FaSync className={loading ? "me-2 spin" : "me-2"} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="d-flex mb-4">
        <button
          className="btn"
          style={{ minWidth: "250px", backgroundColor: "#181E4B", color: "white" }}
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          {loading ? "Processing..." : "Add Monthly Kilometers"}
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Monthly Kilometers</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowForm(false);
                    setInlineError("");
                  }}
                  disabled={loading}
                >
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="month" className="form-label">
                      Month
                    </label>
                    <input
                      type="month"
                      className="form-control"
                      id="month"
                      name="month"
                      value={formData.month}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="kilometers_driven" className="form-label">
                      Kilometers Driven
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="kilometers_driven"
                      name="kilometers_driven"
                      value={formData.kilometers_driven}
                      onChange={handleInputChange}
                      placeholder="Enter kilometers driven"
                      required
                      min="0"
                      disabled={loading}
                    />
                  </div>

                  {inlineError && (
                    <div className="alert alert-warning py-2">
                      {inlineError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn"
                    style={{
                      width: "100%",
                      backgroundColor: "#181E4B",
                      color: "white",
                    }}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card shadow-sm border-0 overflow-hidden">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Month</th>
                  <th>Kilometers Driven</th>
                  <th>Vehicle</th>
                  <th>Recorded By</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {kilometerLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-5">
                      <div className="py-4">
                        <FaCarSide className="fs-1 text-muted mb-3" />
                        <p className="mb-1 fw-medium fs-5">
                          No kilometer logs found.
                        </p>
                        <small className="text-muted">
                          Add a new log or check back later.
                        </small>
                      </div>
                    </td>
                  </tr>
                ) : (
                  kilometerLogs.map((log, idx) => (
                    <tr key={log.id}>
                      <td>{idx + 1}</td>
                      <td>{log.month}</td>
                      <td>{log.kilometers_driven}</td>
                      <td>{log.vehicle || "Loading..."}</td>
                      <td>{log.recorded_by || "Loading..."}</td>
                      <td>
                        {log.created_at
                          ? new Date(log.created_at).toLocaleString()
                          : "Loading..."}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .card {
          border-radius: 1rem;
          overflow: hidden;
        }
        .table th {
          background-color: #f8fafc;
          border-top: 1px solid #e9ecef;
          border-bottom: 2px solid #e9ecef;
        }
      `}</style>
    </div>
  );
};

export default VehicleServices;