import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ENDPOINTS } from "../utilities/endpoints";
import {
  FaCar,
  FaWrench,
  FaSearch,
  FaSync,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUser,
} from "react-icons/fa";
import UnauthorizedPage from "./UnauthorizedPage";
import ServerErrorPage from "./ServerErrorPage";

function VehicleServiceManager() {
  const [maintenanceVehicles, setMaintenanceVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "model",
    direction: "asc",
  });

  // Error handling
  const [errorType, setErrorType] = useState(null); // "unauthorized" | "server" | null

  // Helper function to get auth token
  const getAuthToken = () => {
    return (
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("token")
    );
  };

  // Handle API responses consistently
  const handleApiResponse = async (response) => {
    if (!response.ok) {
      if (response.status === 401) {
        setErrorType("unauthorized");
      } else {
        setErrorType("server");
      }
      let errorMsg = "Server error";
      try {
        const data = await response.json();
        errorMsg = data.detail || JSON.stringify(data);
      } catch {
        // ignore
      }
      throw new Error(errorMsg);
    }
    if (response.status === 204) return {};
    return response.json();
  };

  // Fetch vehicles under maintenance
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        const response = await fetch(ENDPOINTS.MAINTENANCE_REQUESTS_MAINTAINED_VEHICLES, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const data = await handleApiResponse(response);
        console.log("undermaintanace", data);
        setMaintenanceVehicles(data.results || data || []);
      } catch (error) {
        toast.error("Failed to load vehicles: " + error.message);
        setMaintenanceVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refetchTrigger]);

  // Helper function to display status text
  const getStatusDisplay = (status) => {
    switch (status) {
      case "available":
        return "Available";
      case "maintenance":
      case "under_maintenance":
      case "under-maintenance":
        return "Under Maintenance";
      default:
        return status
          ? status.charAt(0).toUpperCase() + status.slice(1)
          : "";
    }
  };

  // Update vehicle status
  const updateVehicleStatus = async (vehicleId, statusType) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      let endpoint = "";
      
      if (statusType === "maintenance") {
        endpoint = ENDPOINTS. MARK_AS_MAINTENANCE(vehicleId);
      } else if (statusType === "available") {
        endpoint = ENDPOINTS.MARK_MAINTENANCE_VEHICLE_AVAILABLE(vehicleId);
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({}),
      });

      await handleApiResponse(response);
      setRefetchTrigger((prev) => prev + 1);
      toast.success(
        statusType === "maintenance"
          ? "Vehicle marked as Under Maintenance"
          : "Vehicle marked as Available"
      );
    } catch (error) {
      toast.error("Failed to update vehicle status: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter vehicles based on search term
  const filterVehicles = () => {
    let filtered = maintenanceVehicles;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          (v.model && v.model.toLowerCase().includes(term)) ||
          (v.license_plate && v.license_plate.toLowerCase().includes(term)) ||
          (v.driver_name && v.driver_name.toLowerCase().includes(term))
      );
    }
    return filtered;
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  // Apply sorting to filtered vehicles
  const getSortedVehicles = (vehicles) => {
    if (!sortConfig.key) return vehicles;
    return [...vehicles].sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Get filtered and sorted vehicles
  const filteredVehicles = getSortedVehicles(filterVehicles());

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case "available":
        return "bg-success";
      case "maintenance":
      case "under_maintenance":
      case "under-maintenance":
        return "bg-warning text-dark";
      default:
        return "bg-secondary";
    }
  };

  // Get sort icon for column
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="text-muted ms-1" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="text-primary ms-1" />
    ) : (
      <FaSortDown className="text-primary ms-1" />
    );
  };

  if (errorType === "unauthorized") {
    return <UnauthorizedPage />;
  }
  if (errorType === "server") {
    return <ServerErrorPage />;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-0 d-flex align-items-center">
            <FaCar className="me-2 text-primary" />
            Vehicle Maintenance Management
          </h1>
        </div>
        <div className="d-flex gap-2">
          <div className="input-group shadow-sm" style={{ maxWidth: "300px" }}>
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn btn-outline-primary d-flex align-items-center"
            onClick={() => setRefetchTrigger((prev) => prev + 1)}
            disabled={loading}
          >
            <FaSync className={loading ? "me-2 spin" : "me-2"} />
            Refresh
          </button>
        </div>
      </div>

      <div className="card shadow-sm border-0 overflow-hidden">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th
                    onClick={() => handleSort("model")}
                    className="cursor-pointer"
                  >
                    <div className="d-flex align-items-center">
                      Vehicle{getSortIcon("model")}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("license_plate")}
                    className="cursor-pointer"
                  >
                    <div className="d-flex align-items-center">
                      Plate No.{getSortIcon("license_plate")}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("driver_name")}
                    className="cursor-pointer"
                  >
                    <div className="d-flex align-items-center">
                      Driver{getSortIcon("driver_name")}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("total_kilometers")}
                    className="cursor-pointer text-end"
                  >
                    <div className="d-flex align-items-center justify-content-end">
                      Total KM{getSortIcon("total_kilometers")}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("last_service_kilometers")}
                    className="cursor-pointer text-end"
                  >
                    <div className="d-flex align-items-center justify-content-end">
                      Last Service KM{getSortIcon("last_service_kilometers")}
                    </div>
                  </th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <div className="d-flex justify-content-center align-items-center">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="ms-3">
                          Loading maintenance vehicles...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-5">
                      <div className="py-4">
                        <FaCar className="fs-1 text-muted mb-3" />
                        <p className="mb-1 fw-medium fs-5">
                          {searchTerm
                            ? "No vehicles match your search"
                            : "No vehicles currently under maintenance"}
                        </p>
                        <small className="text-muted">
                          {searchTerm
                            ? "Try adjusting your search term"
                            : "Check back later"}
                        </small>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded p-2 me-3">
                            <FaCar className="fs-4 text-primary" />
                          </div>
                          <div>
                            <div className="fw-medium">{vehicle.model}</div>
                            <small className="text-muted">
                              ID: {vehicle.id}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border px-2 py-1 fw-normal">
                          {vehicle.license_plate}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded-circle p-2 me-2">
                            <FaUser className="fs-5" />
                          </div>
                          <span>{vehicle.driver_name || "Unassigned"}</span>
                        </div>
                      </td>
                      <td className="text-end fw-medium">
                        {vehicle.total_kilometers
                          ? `${vehicle.total_kilometers.toLocaleString()} km`
                          : "N/A"}
                      </td>
                      <td className="text-end">
                        {vehicle.last_service_kilometers
                          ? `${vehicle.last_service_kilometers.toLocaleString()} km`
                          : "N/A"}
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusClass(
                            vehicle.status
                          )} py-2 px-3`}
                        >
                          {getStatusDisplay(vehicle.status)}
                        </span>
                      </td>
                      <td className="text-center">
                        {vehicle.status === "available" ? (
                          <button
                            className="btn btn-sm btn-outline-warning d-flex align-items-center"
                            onClick={() =>
                              updateVehicleStatus(vehicle.id, "maintenance")
                            }
                            disabled={loading}
                          >
                            <FaWrench className="me-1" /> Maintenance
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-success d-flex align-items-center"
                            onClick={() =>
                              updateVehicleStatus(vehicle.id, "available")
                            }
                            disabled={loading}
                          >
                            <FaCar className="me-1" /> Available
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3 border-0">
          <div className="text-muted small">
            Showing{" "}
            <span className="fw-medium">{filteredVehicles.length}</span>{" "}
            vehicles
            <span>
              {" "}
              of{" "}
              <span className="fw-medium">{maintenanceVehicles.length}</span>
            </span>
          </div>
          <div className="d-flex gap-2">
            {searchTerm && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

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
}

export default VehicleServiceManager;