import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../assets/Logo.jpg";

const DepartementPage = () => {
  const [showRefuelForm, setShowRefuelForm] = useState(false); // State for showing the modal
  const [selectedRequest, setSelectedRequest] = useState(null); // State to store selected request details
  const [showConfirmApproval, setShowConfirmApproval] = useState(false); // State for showing confirmation dialog
  const [showRejectForm, setShowRejectForm] = useState(false); // State for showing the reject reason form
  const [rejectionReason, setRejectionReason] = useState(""); // State to store rejection reason

  const handleCloseForm = () => setShowRefuelForm(false);
  const handleShowForm = (request) => {
    setSelectedRequest(request);  // Set the selected request to show in the modal
    setShowRefuelForm(true);
  };

  const handleApprove = () => {
    setShowConfirmApproval(true); // Show confirmation dialog when approve button is clicked
  };

  const handleConfirmApprove = () => {
    alert(`Request from ${selectedRequest.name} has been approved.`);
    setShowRefuelForm(false);
    setShowConfirmApproval(false); // Close the modal and confirmation dialog
  };

  const handleReject = () => {
    setShowRejectForm(true); // Show the rejection reason form
  };

  const handleRejectConfirm = () => {
    alert(`Request from ${selectedRequest.name} has been rejected for the following reason: ${rejectionReason}`);
    setShowRefuelForm(false);
    setShowRejectForm(false); // Close the reject form and request modal
    setRejectionReason(""); // Clear the rejection reason
  };

  const handleRejectCancel = () => {
    setShowRejectForm(false); // Close the reject reason form without rejecting
    setRejectionReason(""); // Clear the rejection reason if cancelled
  };

  const requests = Array(10).fill({
    name: "John Doe",
    email: "johndoe@example.com",
    startDate: "20/03/2024",
    startTime: "8:00 AM",
    returnDate: "23/03/2024",
    schedules: 5,
  });

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
      {/* Main Content */}
      <div className="flex-grow-1">
        <div className="container py-4">
          <h2 className="h5">Requests</h2>
          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Start Date</th>
                  <th>Start Time</th>
                  <th>Return Date</th>
                  <th>PO Schedules</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div>
                          <div>{request.name}</div>
                          <small className="text-muted">{request.email}</small>
                        </div>
                      </div>
                    </td>
                    <td>{request.startDate}</td>
                    <td>{request.startTime}</td>
                    <td>{request.returnDate}</td>
                    <td>{request.schedules}</td>
                    <td>
                      <button
                        className="btn btn-sm"
                        style={{ backgroundColor: "#0B455B", color: "#fff" }}
                        onClick={() => handleShowForm(request)} // Open modal on click
                      >
                        View More
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button className="btn btn-secondary btn-sm">Previous</button>
            <small>Page 1 of 10</small>
            <button className="btn btn-secondary btn-sm">Next</button>
          </div>
        </div>

        {/* Modal for displaying request details */}
        {selectedRequest && (
          <div className={`modal fade ${showRefuelForm ? "show" : ""}`} tabIndex="-1" style={{ display: showRefuelForm ? "block" : "none" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <img src={Logo} alt="Logo" className="img-fluid" style={{ maxWidth: "50px" }} />
                  <h5 className="modal-title ms-2">Request Details</h5>
                  <button type="button" className="btn-close" onClick={handleCloseForm}></button>
                </div>
                <div className="modal-body">
                  <h6>Name: {selectedRequest.name}</h6>
                  <p>Email: {selectedRequest.email}</p>
                  <p>Start Date: {selectedRequest.startDate}</p>
                  <p>Start Time: {selectedRequest.startTime}</p>
                  <p>Return Date: {selectedRequest.returnDate}</p>
                  <p>PO Schedules: {selectedRequest.schedules}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={handleReject}>Reject</button>
                  <button type="button" className="btn btn-success" onClick={handleApprove}>Approve</button>
                  <button type="button" className="btn btn-secondary" onClick={handleCloseForm}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Dialog for Approving */}
        {showConfirmApproval && (
          <div className="modal fade show" tabIndex="-1" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Are you sure?</h5>
                  <button type="button" className="btn-close" onClick={() => setShowConfirmApproval(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to approve the request from {selectedRequest.name}?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={() => setShowConfirmApproval(false)}>No</button>
                  <button type="button" className="btn btn-success" onClick={handleConfirmApprove}>Yes</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reject Reason Form */}
        {showRejectForm && (
          <div className="modal fade show" tabIndex="-1" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Rejection Reason</h5>
                  <button type="button" className="btn-close" onClick={handleRejectCancel}></button>
                </div>
                <div className="modal-body">
                  <textarea
                    className="form-control"
                    placeholder="Enter rejection reason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows="4"
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleRejectCancel}>Cancel</button>
                  <button type="button" className="btn btn-danger" onClick={handleRejectConfirm}>Confirm Rejection</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartementPage;
