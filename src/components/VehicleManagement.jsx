import React, { useState, useEffect } from "react";
import "../index.css";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import CustomPagination from "./CustomPagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ENDPOINTS } from "../utilities/endpoints";

const VehicleManagement = () => {
  const token = localStorage.getItem("authToken");

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
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageVehicles = vehicles.slice(startIndex, endIndex);

  const fetchUsers = async () => {
    try {
      const response = await fetch(ENDPOINTS.AVAILABLE_DRIVERS, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const usersData = await response.json();
      console.log("Drivers fetched:", usersData);
      return Array.isArray(usersData) ? usersData : usersData || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUsers();
        console.log("Drivers state:", userData);
        setDrivers(userData);
        await fetchVehicles();
      } catch (error) {
        console.error("Error fetching data:", error);
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
      const response = await axios.get(ENDPOINTS.VEHICLE_LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Map total_kilometers from API to total_km for consistency in your table and form
      const vehiclesData = (response.data.results || []).map((vehicle) => ({
        ...vehicle,
        total_km: vehicle.total_kilometers, // map for table/form usage
      }));
      setVehicles(vehiclesData);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setVehicles([]);
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
    });
    setShowModal(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
          <span
            style={{
              fontWeight: statusFilter === "all" ? "bold" : "normal",
              cursor: "pointer",
              marginRight: "10px",
            }}
            onClick={() => setStatusFilter("all")}
          >
            All
          </span>
          <span
            style={{
              fontWeight: statusFilter === "available" ? "bold" : "normal",
              cursor: "pointer",
              marginRight: "10px",
            }}
            onClick={() => setStatusFilter("available")}
          >
            Available
          </span>
          <span
            style={{
              fontWeight: statusFilter === "in_use" ? "bold" : "normal",
              cursor: "pointer",
            }}
            onClick={() => setStatusFilter("in_use")}
          >
            In Use
          </span>
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
            {currentPageVehicles
              .filter(
                (vehicle) =>
                  statusFilter === "all" || vehicle.status === statusFilter
              )
              .map((vehicle, index) => (
                <tr key={vehicle.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
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
                            ? "#b8860b" // yellow/darkgoldenrod
                            : "green",
                        fontWeight:
                          Number(vehicle.total_km) >= 5000
                            ? "bold"
                            : Number(vehicle.total_km) >= 2500
                            ? "bold"
                            : "bold",
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
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeactivate(vehicle.id)}
                    >
                      Deactivate
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
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                >
                  <IoMdClose size={30} />
                </button>
              </div>
              <div className="modal-body">
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label>Driver</label>
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
                      <label>License Plate</label>
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
                      <label>Model</label>
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
                      <label>Capacity</label>
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
                      <label>Source</label>
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
                        <label>Rental Company</label>
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
                      <label>Fuel Type</label>
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
                        <option value="benzene">benzene</option>
                        <option value="naphtha">naphtha</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label>Fuel Efficiency (km/l)</label>
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

                  <button
                    type="submit"
                    style={{ backgroundColor: "#0B455B", color: "#fff" }}
                    className="btn w-100"
                  >
                    {editingVehicle ? "Update" : "Save"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
