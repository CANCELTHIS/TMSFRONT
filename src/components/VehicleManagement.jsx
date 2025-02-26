import React, { useState, useEffect } from "react";
import "../index.css";

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    plateNumber: "",
    driver: "",
    phoneNumber: "",
    capacity: "",
    status: "Active",
  });
  const [errorMessage, setErrorMessage] = useState("");

  // If editing a vehicle, pre-fill the form
  useEffect(() => {
    if (editingVehicle) {
      setNewVehicle(editingVehicle);
    }
  }, [editingVehicle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, plateNumber, driver, phoneNumber, capacity } = newVehicle;

    // Check if all fields are filled
    if (!name || !plateNumber || !driver || !phoneNumber || !capacity) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    // Check if capacity is a positive number
    if (capacity <= 0) {
      setErrorMessage("Capacity must be a positive number.");
      return;
    }

    // Check if phone number is 10 digits and starts with 09 or 07
    if (!/^(09|07)\d{8}$/.test(phoneNumber)) {
      setErrorMessage("Phone number must be exactly 10 digits and start with 09 or 07.");
      return;
    }

    // Clear error message if validation passes
    setErrorMessage("");
    if (editingVehicle) {
      // Update vehicle if editing
      setVehicles(
        vehicles.map((v) =>
          v.id === editingVehicle.id ? { ...newVehicle, id: editingVehicle.id } : v
        )
      );
    } else {
      // Add new vehicle
      setVehicles([...vehicles, { ...newVehicle, id: vehicles.length + 1 }]);
    }

    setShowModal(false);
    setEditingVehicle(null); // Reset editing state after saving
    setNewVehicle({
      name: "",
      plateNumber: "",
      driver: "",
      phoneNumber: "",
      capacity: "",
      status: "Active",
    });
  };

  const handleStatusChange = (id, status) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === id ? { ...vehicle, status } : vehicle
      )
    );
  };

  const handleEdit = (id) => {
    const vehicle = vehicles.find((v) => v.id === id);
    setEditingVehicle(vehicle); // Set the vehicle to be edited
    setShowModal(true); // Show the modal for editing
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
      <div className="d-flex flex-grow-1">
        <div className="flex-grow-1 p-4">
          <div className="container">
            <h1 className="mb-4">Vehicle Management</h1>

            {/* Add Vehicle Button */}
            <button
              className="btn"
              style={{ backgroundColor: "#14183E", color: "#fff" }}
              onClick={() => setShowModal(true)}
            >
              + Add Vehicle
            </button>

            {/* Vehicle Table */}
            <div className="card mt-4">
              <div className="card-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Vehicle Name</th>
                      <th>Plate Number</th>
                      <th>Driver</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle) => (
                      <tr key={vehicle.id}>
                        <td>{vehicle.name}</td>
                        <td>{vehicle.plateNumber}</td>
                        <td>{vehicle.driver}</td>
                        <td>{vehicle.status}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleEdit(vehicle.id)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Add/Edit Vehicle Form */}
      {showModal && (
        <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <h3 className="mb-4 text-center">{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</h3>

                {/* Error Message */}
                {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}

                <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-white">
                  <div className="mb-3">
                    <label htmlFor="vehicleName" className="form-label">Vehicle Name</label>
                    <input
                      type="text"
                      id="vehicleName"
                      className="form-control"
                      value={newVehicle.name}
                      onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="plateNumber" className="form-label">Plate Number</label>
                    <input
                      type="text"
                      id="plateNumber"
                      className="form-control"
                      value={newVehicle.plateNumber}
                      onChange={(e) => setNewVehicle({ ...newVehicle, plateNumber: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="driver" className="form-label">Driver</label>
                    <input
                      type="text"
                      id="driver"
                      className="form-control"
                      value={newVehicle.driver}
                      onChange={(e) => setNewVehicle({ ...newVehicle, driver: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">Driver's Phone Number</label>
                    <input
                      type="text"
                      id="phoneNumber"
                      className="form-control"
                      value={newVehicle.phoneNumber}
                      onChange={(e) => setNewVehicle({ ...newVehicle, phoneNumber: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="capacity" className="form-label">Capacity</label>
                    <input
                      type="number"
                      id="capacity"
                      className="form-control"
                      value={newVehicle.capacity}
                      onChange={(e) => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                      min="1"
                    />
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-sm"
                      style={{ backgroundColor: "#14183E", color: "#fff" }}
                    >
                      {editingVehicle ? "Update" : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="TransFooter"></div>
    </div>
  );
};

export default VehicleManagement;
