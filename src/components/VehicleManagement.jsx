import React, { useState, useEffect } from "react";
import "../index.css";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
const VehicleManagement = () => {
    const token = localStorage.getItem("authToken");

    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);
    const [newVehicle, setNewVehicle] = useState({
        license_plate: "",
        model: "",
        capacity: "",
        source: "",
        rental_company: "",
        driver: "",
        status: "available", // Add status field
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
        try {
          const response = await fetch("https://tms-api-23gs.onrender.com/available-drivers/", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
      
          const usersData = await response.json();
          console.log("Drivers fetched:", usersData); // Debugging: Log the fetched drivers
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
            console.log("Drivers state:", userData); // Debugging: Log the drivers state
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
          const response = await axios.get("https://tms-api-23gs.onrender.com/vehicles/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Vehicles fetched:", response.data.results); // Debugging: Log the vehicles data
          setVehicles(response.data.results || []);
        } catch (error) {
          console.error("Error fetching vehicles:", error);
          setVehicles([]);
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { license_plate, model, capacity, source, rental_company, driver, status } = newVehicle;

        // Validation
        if (!license_plate || !model || !capacity || !source || !driver || !status) {
            setErrorMessage("Please fill in all required fields with valid data.");
            return;
        }

        if (capacity <= 0) {
            setErrorMessage("Capacity must be a positive number.");
            return;
        }

        if (source === "rented" && !rental_company) {
            setErrorMessage("Please provide the rental company name.");
            return;
        }

        setErrorMessage("");

        const vehicleData = {
            license_plate,
            model,
            capacity: Number(capacity),
            source: source === "owned" ? "organization" : source,
            rental_company: source === "owned" ? null : rental_company,
            driver,
            status, // Include status in the payload
        };

        try {
            if (editingVehicle) {
                await axios.put(`https://tms-api-23gs.onrender.com/vehicles/${editingVehicle.id}/`, vehicleData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post("https://tms-api-23gs.onrender.com/vehicles/", vehicleData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            fetchVehicles();
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
            });
        } catch (error) {
            setErrorMessage("An error occurred while saving the vehicle. Please try again.");
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
            status: vehicle.status || "available", // Set status when editing
        });
        setShowModal(true);
    };

    const handleDeactivate = async (vehicleId) => {
        if (window.confirm("Are you sure you want to deactivate this vehicle?")) {
            try {
                await axios.patch(`https://tms-api-23gs.onrender.com/vehicles/${vehicleId}/`, {
                    is_available: false,
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchVehicles();
            } catch (error) {
                console.error("Error deactivating vehicle:", error);
                setErrorMessage("An error occurred while deactivating the vehicle.");
            }
        }
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
        });
        setShowModal(true);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <h1>Vehicle Management</h1>
            <button className="btn" onClick={openAddVehicleModal} style={{backgroundColor:"#0b455b",color:"#fff"}}>
                + Add Vehicle
            </button>
            <table className="table table-bordered mt-4">
                <thead>
                    <tr>
                        <th>Driver</th>
                        <th>License Plate</th>
                        <th>Model</th>
                        <th>Capacity</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
  {Array.isArray(vehicles) && vehicles.length > 0 ? (
    vehicles.map((vehicle) => (
      <tr key={vehicle.id}>
        <td>{getDriverNameById(vehicle.driver)}</td>
        <td>{vehicle.license_plate}</td>
        <td>{vehicle.model}</td>
        <td>{vehicle.capacity}</td>
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
    ))
  ) : (
    <tr>
      <td colSpan="6">No vehicles available</td>
    </tr>
  )}
</tbody>
            </table>

            {showModal && (
                <div className="modal show" style={{ display: "block" }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5>{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}>
                                    <IoMdClose size={30} />
                                </button>
                            </div>
                            <div className="modal-body">
                                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label>Driver</label>
                                            <select
  className="form-control"
  value={newVehicle.driver}
  onChange={(e) => setNewVehicle({ ...newVehicle, driver: e.target.value })}
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
                                                onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value })}
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
                                                onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label>Capacity</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={newVehicle.capacity}
                                                onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
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
                                                    onChange={(e) => setNewVehicle({ ...newVehicle, rental_company: e.target.value })}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label>Status</label>
                                            <select
                                                className="form-control"
                                                value={newVehicle.status}
                                                onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })}
                                            >
                                                <option value="available">Available</option>
                                                <option value="in_use">In Use</option>
                                                <option value="service">Service</option>
                                                <option value="maintenance">Maintenance</option>
                                            </select>
                                        </div>
                                        
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">
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