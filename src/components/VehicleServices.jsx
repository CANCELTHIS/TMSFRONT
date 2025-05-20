import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { ENDPOINTS } from "../utilities/endpoints";
import { toast } from "react-toastify";

const VehicleServices = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    month: "",
    kilometers_driven: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inlineError, setInlineError] = useState(""); // <-- Add this line
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [kilometerLogs, setKilometerLogs] = useState([]);

  useEffect(() => {
    const fetchVehicleServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(ENDPOINTS.ADD_MONTHLY_KILOMETERS, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        console.log("Vehicle services data:", response.data);
      } catch (error) {
        console.error("Error fetching vehicle services data:", error);
        setError("Failed to load vehicle services");
        if (error.response?.status === 403) {
          console.error("Access denied. Please check your permissions.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleServices();
  }, []);

  useEffect(() => {
    const fetchKilometerLogs = async () => {
      try {
        const response = await axios.get(ENDPOINTS.KILOMETER_LOGS, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        // Save results to state
        setKilometerLogs(response.data.results || []);
        console.log("data fetched from KILOMETER_LOGS:", response.data);
      } catch (error) {
        console.error("Error fetching kilometer logs:", error);
        if (error.response?.status === 403) {
          console.error(
            "Access denied to kilometer logs. Please check your permissions."
          );
        }
      }
    };
    fetchKilometerLogs();
  }, []);

  useEffect(() => {
    const fetchUserVehicles = async () => {
      try {
        const response = await axios.get(ENDPOINTS.CURRENT_USER_VEHICLES, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        // If the response is a single vehicle, wrap it in an array
        const vehiclesData = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setVehicles(vehiclesData);
        // Optionally set the first vehicle as selected by default
        if (vehiclesData.length > 0) setSelectedVehicleId(vehiclesData[0].id);

        // Log the fetched vehicles
        console.log("Current user vehicles:", vehiclesData);
      } catch (error) {
        console.error("Error fetching user vehicles:", error);
      }
    };
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

    // Check if already exists for this month
    const alreadyExists = kilometerLogs.some(
      (log) => log.month === formattedMonth
    );
    if (alreadyExists) {
      setInlineError(
        "You have already added a service request for this month."
      );
      return;
    } else {
      setInlineError(""); // Clear error if not duplicate
    }

    try {
      const response = await axios.post(
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
      console.log("Service added successfully:", response.data);
      setShowForm(false);
      setFormData({ month: "", kilometers_driven: "" });
      setInlineError(""); // Clear error on success
      // Optionally, refresh logs here
    } catch (error) {
      console.error("Error adding service:", error);
      if (error.response?.status === 403) {
        console.error(
          "Access denied. You don't have permission to add services."
        );
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Vehicle Kilometer Logs</h2>

      {loading && <div className="alert alert-info">Loading data...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="d-flex mb-4">
        <button
          className="btn"
          style={{ width: "300px", backgroundColor: "#181E4B", color: "white" }}
          onClick={() => setShowForm(true)}
        >
          Add Monthly Kilometers
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
                    setInlineError(""); // Clear error when closing
                  }}
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
                      onChange={(e) =>
                        setFormData({ ...formData, month: e.target.value })
                      }
                      required
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kilometers_driven: e.target.value,
                        })
                      }
                      placeholder="Enter kilometers driven"
                      required
                      min="0"
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
                  >
                    Submit
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
                  <td>{log.vehicle}</td>
                  <td>{log.recorded_by}</td>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
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
