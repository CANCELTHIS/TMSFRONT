import React, { useState, useEffect } from "react";
import "../index.css";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import CustomPagination from "./CustomPagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ENDPOINTS } from "../utilities/endpoints";
import UnauthorizedPage from "./UnauthorizedPage";
import ServerErrorPage from "./ServerErrorPage";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [newVehicle, setNewVehicle] = useState({
    license_plate: "",
    model: "",
    capacity: "",
    source: "",
    rental_company: "",
    driver: "",
    status: "available",
    fuel_type: "",
    fuel_efficiency: "",
    libre_number: "", // updated
    motor_number: "", // updated
    chassis_number: "", // updated
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [viewVehicle, setViewVehicle] = useState(null);
  const [errorType, setErrorType] = useState(null); // "unauthorized" | "server" | null

  const token = localStorage.getItem("authToken");

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageVehicles = vehicles.slice(startIndex, endIndex);

  const fetchUsers = async () => {
    try {
      if (!token) {
        setErrorType("unauthorized");
        return [];
      }
      const response = await fetch(ENDPOINTS.AVAILABLE_DRIVERS, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setErrorType("unauthorized");
        } else {
          setErrorType("server");
        }
        return [];
      }

      const usersData = await response.json();
      return Array.isArray(usersData) ? usersData : usersData || [];
    } catch (error) {
      setErrorType("server");
      console.error("Error fetching users:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUsers();
        setDrivers(userData);
        await fetchVehicles();
      } catch (error) {
        // Already handled in fetchUsers/fetchVehicles
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const getDriverNameById = (driverId) => {
    const driver = drivers.find((driver) => driver.id === driverId);
    return driver ? driver.full_name : "No Driver Assigned";
  };

  const fetchVehicles = async () => {
    try {
      if (!token) {
        setErrorType("unauthorized");
        setVehicles([]);
        return;
      }
      const response = await axios.get(ENDPOINTS.VEHICLE_LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const vehiclesData = (response.data.results || []).map((vehicle) => ({
        ...vehicle,
        total_km: vehicle.total_kilometers,
      }));
      setVehicles(vehiclesData);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorType("unauthorized");
      } else {
        setErrorType("server");
      }
      setVehicles([]);
      console.error("Error fetching vehicles:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      license_plate,
      model,
      capacity,
      source,
      rental_company,
      driver,
      status,
      fuel_type,
      fuel_efficiency,
      libre_number,
      motor_number,
      chassis_number,
    } = newVehicle;

    // Validation
    if (
      !license_plate ||
      !model ||
      !capacity ||
      !source ||
      !driver ||
      !status ||
      !fuel_type ||
      !fuel_efficiency
    ) {
      setErrorMessage("Please fill in all required fields with valid data.");
      toast.error("Please fill in all required fields.");
      return;
    }

    const vehicleData = {
      license_plate,
      model,
      capacity: Number(capacity),
      source: source === "owned" ? "organization" : source,
      rental_company: source === "owned" ? null : rental_company,
      driver,
      status,
      fuel_type,
      fuel_efficiency: Number(fuel_efficiency),
      libre_number, // updated
      motor_number, // updated
      chassis_number, // updated
    };

    try {
      if (editingVehicle) {
        await axios.put(
          ENDPOINTS.EDIT_VEHICLE(editingVehicle.id), // Pass the id, not the whole object
          vehicleData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Vehicle updated successfully!");
        // Refresh the vehicles list after edit
        await fetchVehicles();
      } else {
        const response = await axios.post(ENDPOINTS.VEHICLE_LIST, vehicleData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Vehicle added successfully!");
        setVehicles((prev) => [...prev, response.data]);
      }
      setShowModal(false);
      setEditingVehicle(null);
      setNewVehicle({
        license_plate: "",
        model: "",
        capacity: "",
        source: "",
        rental_company: "",
        driver: "",
        status: "available",
        fuel_type: "",
        fuel_efficiency: "",
        libre_number: "", // updated
        motor_number: "", // updated
        chassis_number: "", // updated
      });
    } catch (error) {
      setErrorMessage(
        "An error occurred while saving the vehicle. Please try again."
      );
      toast.error("Failed to save the vehicle.");
    }
  };

  const handleSourceChange = (e) => {
    const source = e.target.value;
    setNewVehicle((prevState) => ({
      ...prevState,
      source,
      rental_company: source === "owned" ? "" : prevState.rental_company,
    }));
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setNewVehicle({
      license_plate: vehicle.license_plate,
      model: vehicle.model,
      capacity: vehicle.capacity,
      source: vehicle.source,
      rental_company: vehicle.rental_company || "",
      driver: vehicle.driver,
      status: vehicle.status || "available",
      fuel_type: vehicle.fuel_type || "",
      fuel_efficiency: vehicle.fuel_efficiency || "",
      libre_number: vehicle.libre_number || "", // updated
      motor_number: vehicle.motor_number || "", // updated
      chassis_number: vehicle.chassis_number || "", // updated
    });
    setShowModal(true);
  };

  const handleDeactivate = async (vehicleId) => {
    console.log("Deactivating vehicle with ID:", vehicleId);
    // Your deactivation logic here
  };

  const openAddVehicleModal = () => {
    setEditingVehicle(null);
    setNewVehicle({
      license_plate: "",
      model: "",
      capacity: "",
      source: "",
      rental_company: "",
      driver: "",
      status: "available",
      fuel_type: "",
      fuel_efficiency: "",
      libre_number: "", // default value from your JSON
      motor_number: "", // default value from your JSON
      chassis_number: "", // default value from your JSON
    });
    setShowModal(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (errorType === "unauthorized") {
    return <UnauthorizedPage />;
  }
  if (errorType === "server") {
    return <ServerErrorPage />;
  }

  return (
    <div className="container mt-4">
      <ToastContainer />
      <button
        className="btn addve"
        onClick={openAddVehicleModal}
        style={{ backgroundColor: "#0b455b", color: "#fff", width: "150px" }}
      >
        + Add Vehicle
      </button>

      <div className="table-responsive">
        <div className="d-flex justify-content-end mb-3 p-2">
          <select
            className="form-select"
            style={{ width: 220, maxWidth: "100%", fontWeight: "500" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="in_use">In Use</option>
            <option value="service">Service</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Driver</th>
              <th>License Plate</th>
              <th>Model</th>
              <th>Capacity</th>
              <th>Total KM</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles
              .filter(
                (vehicle) =>
                  statusFilter === "all" || vehicle.status === statusFilter
              )
              .slice(startIndex, endIndex)
              .map((vehicle, index) => (
                <tr key={vehicle.id}>
                  <td>{startIndex + index + 1}</td>
                  <td>{vehicle.driver_name}</td>
                  <td>{vehicle.license_plate}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.capacity}</td>
                  <td>
                    <span
                      style={{
                        color:
                          Number(vehicle.total_km) >= 5000
                            ? "red"
                            : Number(vehicle.total_km) >= 2500
                            ? "#b8860b"
                            : "green",
                        fontWeight: "bold",
                      }}
                    >
                      {vehicle.total_km || "0"}
                    </span>
                  </td>
                  <td>{vehicle.status}</td>
                  <td>
                    <button
                      className="btn btn-sm me-2"
                      onClick={() => handleEdit(vehicle)}
                      style={{ backgroundColor: "#0b455b", color: "#fff" }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleDeactivate(vehicle.id)}
                    >
                      Deactivate
                    </button>
                    <button
                      className="btn btn-sm"
                      onClick={() => setViewVehicle(vehicle)}
                      style={{ color: "#fff", backgroundColor: "#0bc55e" }}
                    >
                      View More
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100px" }}
        >
          <CustomPagination
            currentPage={currentPage}
            totalPages={Math.ceil(vehicles.length / itemsPerPage)}
            handlePageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div
              className="modal-content"
              style={{
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(44,62,80,0.18)",
                border: "none",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div
                className="modal-header"
                // style={{
                //   background:
                //     "linear-gradient(90deg, #0B455B 60%, #4e54c8 100%)",
                //   color: "#fff",
                //   borderTopLeftRadius: "20px",
                //   borderTopRightRadius: "20px",
                //   borderBottom: "none",
                //   position: "relative",
                // }}
              >
                <h5 className="mb-0">
                  {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "16px",
                    zIndex: 2,
                    background: "transparent",
                    border: "none",
                    fontSize: "1.5rem",
                  }}
                >
                  <IoMdClose size={24} />
                </button>
              </div>
              <div
                className="modal-body"
                // style={{ background: "#f4f7fa", padding: "2rem 2.5rem" }}
              >
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary">
                        Driver
                      </label>
                      <select
                        className="form-control"
                        value={newVehicle.driver}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            driver: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Driver</option>
                        {drivers.map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.full_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary">
                        License Plate
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newVehicle.license_plate}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            license_plate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary">
                        Model
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newVehicle.model}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            model: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary">
                        Capacity
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={newVehicle.capacity}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            capacity: e.target.value,
                          })
                        }
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary">
                        Source
                      </label>
                      <select
                        className="form-control"
                        value={newVehicle.source}
                        onChange={handleSourceChange}
                      >
                        <option value="">Select Source</option>
                        <option value="owned">Owned</option>
                        <option value="rented">Rented</option>
                      </select>
                    </div>
                    {newVehicle.source === "rented" && (
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-secondary">
                          Rental Company
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={newVehicle.rental_company}
                          onChange={(e) =>
                            setNewVehicle({
                              ...newVehicle,
                              rental_company: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary">
                        Fuel Type
                      </label>
                      <select
                        className="form-control"
                        value={newVehicle.fuel_type || ""}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            fuel_type: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Fuel Type</option>
                        <option value="benzene">Benzene</option>
                        <option value="naphtha">Naphtha</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary">
                        Fuel Efficiency (km/l)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={newVehicle.fuel_efficiency || ""}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            fuel_efficiency: e.target.value,
                          })
                        }
                        placeholder="Enter fuel efficiency (km/l)"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold text-secondary">
                        Libre Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newVehicle.libre_number}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            libre_number: e.target.value,
                          })
                        }
                        placeholder="Enter Libre Number"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold text-secondary">
                        Motor Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newVehicle.motor_number}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            motor_number: e.target.value,
                          })
                        }
                        placeholder="Enter Motor Number"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold text-secondary">
                        Chassis Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={newVehicle.chassis_number}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            chassis_number: e.target.value,
                          })
                        }
                        placeholder="Enter Chassis Number"
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-4 justify-content-end">
                    <button
                      type="submit"
                      style={{
                        backgroundColor: "#0B455B",
                        color: "#fff",
                        width: "150px",
                        fontWeight: "bold",
                        letterSpacing: "1px",
                        boxShadow: "0 2px 8px rgba(24,30,75,0.08)",
                      }}
                      className="btn shadow-sm"
                    >
                      {editingVehicle ? "Update" : "Save"}
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        width: "120px",
                        fontWeight: "bold",
                        boxShadow: "0 2px 8px rgba(220,53,69,0.08)",
                      }}
                      onClick={() =>
                        setNewVehicle({
                          license_plate: "",
                          model: "",
                          capacity: "",
                          source: "",
                          rental_company: "",
                          driver: "",
                          status: "available",
                          fuel_type: "",
                          fuel_efficiency: "",
                          libre_number: "LIBRE-001-XYZ", // default value from your JSON
                          motor_number: "MTR-001-XYZ", // default value from your JSON
                          chassis_number: "CHS-001-XYZ", // default value from your JSON
                        })
                      }
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View More Modal */}
      {viewVehicle && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div
              className="modal-content"
              style={{
                borderRadius: "20px",
                boxShadow: "0 8px 32px rgba(44,62,80,0.18)",
                border: "none",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div className="modal-header">
                <h5 className="mb-0">Vehicle Details</h5>
                <button
                  type="button"
                  onClick={() => setViewVehicle(null)}
                  aria-label="Close"
                >
                  <IoMdClose size={24} />
                </button>
              </div>
              <div
                className="modal-body"
                style={{ background: "#f4f7fa", padding: "2rem 2.5rem" }}
              >
                <div className="row mb-2">
                  <div className="col-md-6 mb-2">
                    <strong>Driver:</strong>{" "}
                    {getDriverNameById(viewVehicle.driver)}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>License Plate:</strong> {viewVehicle.license_plate}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Model:</strong> {viewVehicle.model}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Capacity:</strong> {viewVehicle.capacity}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Source:</strong> {viewVehicle.source}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Rental Company:</strong>{" "}
                    {viewVehicle.rental_company || "-"}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Status:</strong> {viewVehicle.status}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Fuel Type:</strong> {viewVehicle.fuel_type}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Fuel Efficiency:</strong>{" "}
                    {viewVehicle.fuel_efficiency}
                  </div>
                  <div className="col-md-6 mb-2">
                    <strong>Total KM:</strong> {viewVehicle.total_km}
                  </div>
                  <div className="col-md-4 mb-2">
                    <strong>Libre Number:</strong> {viewVehicle.libre_number}
                  </div>
                  <div className="col-md-4 mb-2">
                    <strong>Motor Number:</strong> {viewVehicle.motor_number}
                  </div>
                  <div className="col-md-4 mb-2">
                    <strong>Chassis Number:</strong>{" "}
                    {viewVehicle.chassis_number}
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setViewVehicle(null)}
                    style={{ minWidth: "110px" }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
