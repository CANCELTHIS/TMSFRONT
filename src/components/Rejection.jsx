import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const Rejection = ({ setModalOpen, sendRejectionEmail }) => {
  const [rejectionReason, setRejectionReason] = useState("");

  const handleSubmit = () => {
    if (rejectionReason.trim() === "") {
      alert("Rejection reason cannot be empty.");
      return;
    }
    sendRejectionEmail(rejectionReason);
    setModalOpen(false);
  };

  return (
    <>
      <div className="modal-overlay" onClick={() => setModalOpen(false)}></div>
      <div className="rejection-modal">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Reason for Rejection</h5>
          <button className="btn" onClick={() => setModalOpen(false)}>
            <IoClose size={30} />
          </button>
        </div>
        <textarea
          className="form-control mb-3"
          rows="3"
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Write the reason for rejection here..."
        ></textarea>
        <div className="d-flex justify-content-end">
          <button
            className="btn btn-primary btn-sm me-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default Rejection;
