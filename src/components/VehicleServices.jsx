import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { ENDPOINTS } from "../utilities/endpoints";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UnauthorizedPage from "./UnauthorizedPage";
import ServerErrorPage from "./ServerErrorPage";

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
  const [errorType, setErrorType] = useState(null); // "unauthorized" | "server" | null

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
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-center mb-4">Vehicle Kilometer Logs</h2>

      {loading && <div className="alert alert-info">Loading data...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex mb-4">
        <button
          className="btn"
          style={{ width: "300px", backgroundColor: "#181E4B", color: "white" }}
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          {loading ? "Processing..." : "Add Monthly Kilometers"}
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
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

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
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
                <td colSpan="6" className="text-center">
                  No kilometer logs found.
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
  );
};

export default VehicleServices;
