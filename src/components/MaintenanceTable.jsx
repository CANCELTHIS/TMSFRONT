import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../assets/Logo.jpg";
import { Modal, Button, Image, Form } from "react-bootstrap";

const MaintenanceTable = () => {
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [formData, setFormData] = useState({
    date: "2024-08-20",
    paidTo: "",
    purpose: "",
    amount: "",
    sourceOfBudget: "",
    budgetApprovedBy: "",
    budgetRequestedBy: "",
    certifiedBy: "",
    approvedBy: "",
    authorizedBy: "",
  });
  const [errors, setErrors] = useState({});

  // Open Maintenance Details Modal
  const handleShowDetails = (maintenance) => {
    setSelectedMaintenance(maintenance);
    setShowDetailsModal(true);
  };

  // Close Maintenance Details Modal
  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedMaintenance(null);
  };

  // Open Cush Request Modal (and close details modal first)
  const handleShowRequestModal = () => {
    setShowDetailsModal(false); // Close Maintenance Details modal
    setTimeout(() => {
      setShowRequestModal(true);
    }, 300); // Small delay to ensure smooth transition
  };

  // Close Cush Request Modal
  const handleCloseRequestModal = () => {
    setShowRequestModal(false);
    setFormData({
      date: "2024-08-20",
      paidTo: "",
      purpose: "",
      amount: "",
      sourceOfBudget: "",
      budgetApprovedBy: "",
      budgetRequestedBy: "",
      certifiedBy: "",
      approvedBy: "",
      authorizedBy: "",
    });
  };

  // Handle form data change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form
  const validateForm = () => {
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmitRequest = () => {
    if (validateForm()) {
      alert("Cush request submitted successfully!");
      handleCloseRequestModal();
    }
  };

  const maintenanceRecords = Array(10).fill({
    driverName: "John Doe",
    vehicleName: "Toyota Corolla",
    plateNumber: "ABC-1234",
    issue: "Brake pad replacement needed",
    dateReported: "2025-02-21",
  });

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
      <div className="flex-grow-1">
        <div className="container py-4">
          <h2 className="h5">Maintenance Records</h2>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Driver Name</th>
                  <th>Vehicle Name</th>
                  <th>Plate Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceRecords.map((record, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{record.driverName}</td>
                    <td>{record.vehicleName}</td>
                    <td>{record.plateNumber}</td>
                    <td>
                      <button
                        className="btn btn-sm"
                        style={{ backgroundColor: "#0B455B", color: "#fff" }}
                        onClick={() => handleShowDetails(record)}
                      >
                        View More
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Maintenance Details Modal */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <Image src={Logo} alt="Logo" fluid style={{ width: "50px", marginRight: "10px" }} />
            Maintenance Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMaintenance && (
            <div>
              <p><strong>Driver Name:</strong> {selectedMaintenance.driverName}</p>
              <p><strong>Vehicle Name:</strong> {selectedMaintenance.vehicleName}</p>
              <p><strong>Plate Number:</strong> {selectedMaintenance.plateNumber}</p>
              <p><strong>Issue:</strong> {selectedMaintenance.issue}</p>
              <p><strong>Date Reported:</strong> {selectedMaintenance.dateReported}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>Close</Button>
          <Button variant="primary" onClick={handleShowRequestModal}>Cush Request</Button>
        </Modal.Footer>
      </Modal>

      {/* Cush Request Form Modal */}
      <Modal show={showRequestModal} onHide={handleCloseRequestModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cush Request Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="text" value={formData.date} readOnly />
            </Form.Group>
            {[
              { label: "Paid To", name: "paidTo" },
              { label: "Purpose Of Payment", name: "purpose" },
              { label: "Amount", name: "amount", type: "number" },
              { label: "Source Of Budget", name: "sourceOfBudget" },
              { label: "Budget Approved By", name: "budgetApprovedBy" },
              { label: "Budget Requested By", name: "budgetRequestedBy" },
              { label: "Certified By", name: "certifiedBy" },
              { label: "Approved By", name: "approvedBy" },
              { label: "Authorized By", name: "authorizedBy" },
            ].map(({ label, name, type = "text" }) => (
              <Form.Group className="mb-3" key={name}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={`Enter ${label}`}
                  isInvalid={!!errors[name]}
                />
                <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRequestModal}>Cancel</Button>
          <Button variant="success" onClick={handleSubmitRequest}>Submit Request</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MaintenanceTable;
