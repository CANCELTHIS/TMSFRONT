import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const MaintenanceRequest = () => {
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    driverName: "",
    vehicleModel: "",
    plateNumber: "",
    paymentPurpose: "",
    amount: "",
  });
  const [showForm, setShowForm] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRequests([...requests, { ...formData }]);
    setFormData({
      date: "",
      driverName: "",
      vehicleModel: "",
      plateNumber: "",
      paymentPurpose: "",
      amount: "",
    });
    setShowForm(false); // Close the popup after submission
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Maintenance Request</h2>
      
      {/* Button to Show Maintenance Form */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-primary" onClick={handleShowForm}>
          Maintenance Request
        </button>
      </div>

      {/* Modal for Maintenance Request Form */}
      {showForm && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Maintenance Request Form</h5>
                <button type="button" className="btn-close" onClick={handleCloseForm}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="date" className="form-label">
                      Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="driverName" className="form-label">
                      Driver Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="driverName"
                      name="driverName"
                      value={formData.driverName}
                      onChange={handleInputChange}
                      placeholder="Enter Full Name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="vehicleModel" className="form-label">
                      Model of Vehicle
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="vehicleModel"
                      name="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={handleInputChange}
                      placeholder="Enter Model of Vehicle"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="plateNumber" className="form-label">
                      Plate Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="plateNumber"
                      name="plateNumber"
                      value={formData.plateNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Plate Number"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="paymentPurpose" className="form-label">
                      Purpose of Payment
                    </label>
                    <textarea
                      className="form-control"
                      id="paymentPurpose"
                      name="paymentPurpose"
                      value={formData.paymentPurpose}
                      onChange={handleInputChange}
                      placeholder="Enter Purpose of Payment"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="amount" className="form-label">
                      Amount
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="Enter Amount"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table to Display Maintenance Requests */}
      {requests.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-3">Submitted Maintenance Requests</h4>
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Driver Name</th>
                <th>Vehicle Model</th>
                <th>Plate Number</th>
                <th>Purpose of Payment</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{request.date}</td>
                  <td>{request.driverName}</td>
                  <td>{request.vehicleModel}</td>
                  <td>{request.plateNumber}</td>
                  <td>{request.paymentPurpose}</td>
                  <td>{request.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MaintenanceRequest;
