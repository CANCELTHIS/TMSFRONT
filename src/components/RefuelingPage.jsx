import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const RefuelingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [refuelData, setRefuelData] = useState([]);
  const [form, setForm] = useState({
    vehicle: "",
    fuelType: "",
    amount: "",
    date: "",
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRefuelData([...refuelData, form]);
    setForm({ vehicle: "", fuelType: "", amount: "", date: "" });
    handleClose();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Refueling Records</h2>
      <Button variant="primary" onClick={handleShow}>Add Refueling</Button>
      
      {/* Modal Form */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Refueling Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle</Form.Label>
              <Form.Control type="text" name="vehicle" value={form.vehicle} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fuel Type</Form.Label>
              <Form.Control as="select" name="fuelType" value={form.fuelType} onChange={handleChange} required>
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount (Liters)</Form.Label>
              <Form.Control type="number" name="amount" value={form.amount} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" value={form.date} onChange={handleChange} required />
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button
                variant="success"
                type="submit"
                style={{
                  backgroundColor: "#0B455B",
                  borderColor: "#0B455B"
                }}
              >
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Table */}
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Vehicle</th>
            <th>Fuel Type</th>
            <th>Amount (Liters)</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {refuelData.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.vehicle}</td>
              <td>{entry.fuelType}</td>
              <td>{entry.amount}</td>
              <td>{entry.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RefuelingPage;