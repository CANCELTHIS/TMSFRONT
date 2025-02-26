import React from 'react';

const VehicleTable = ({ vehicles, handleStatusChange, handleEdit }) => {
  return (
    <div className="table-responsive mt-4">
      <table className="table table-bordered table-striped">
        <thead className="table-light">
          <tr>
            <th>Vehicle Name</th>
            <th>Plate Number</th>
            <th>Driver</th>
            <th>Capacity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.name}</td>
              <td>{vehicle.plateNumber}</td>
              <td>{vehicle.driver}</td>
              <td>{vehicle.capacity}</td>
              <td>
                <div className="d-flex align-items-center">
                  <select
                    value={vehicle.status}
                    onChange={(e) => handleStatusChange(vehicle.id, e.target.value)}
                    className="form-select form-select-sm me-2"
                  >
                    <option value="Active">Active</option>
                    <option value="Service">Service</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleEdit(vehicle.id)}
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;
