import React, { useEffect, useState } from "react";
import { ENDPOINTS } from "../utilities/endpoints";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ListServiceRequestsTable = () => {
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [maintenanceLetter, setMaintenanceLetter] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [maintenanceTotalCost, setMaintenanceTotalCost] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(ENDPOINTS.LIST_SERVICE_REQUESTS, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        console.log("fatch", data);
        setServiceRequests(data.results || []);
      })
      .catch(() => setServiceRequests([]))
      .finally(() => setLoading(false));
  };

  const handleFileChange = (e, setter) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  // Only upload files and total cost
  const handleSubmitFiles = async (requestId) => {
    if (!maintenanceLetter || !receiptFile || !maintenanceTotalCost) {
      toast.error(
        "Please upload all required files and provide the total cost."
      );
      return;
    }

    setActionLoading(true);
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("service_letter", maintenanceLetter);
    formData.append("receipt_file", receiptFile);
    formData.append("service_total_cost", maintenanceTotalCost);

    try {
      const response = await fetch(ENDPOINTS.SUBMIT_SERVICE_FILES(requestId), {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to submit files.");
      }
      toast.success("Files submitted successfully!");
      fetchRequests();
    } catch (error) {
      toast.error(error.message || "Failed to submit files.");
    } finally {
      setActionLoading(false);
    }
  };

  // Only forward request if files and total cost are submitted
  const handleForward = async (requestId) => {
    if (!maintenanceLetter || !receiptFile || !maintenanceTotalCost) {
      toast.error(
        "Please submit all required files and total cost before forwarding."
      );
      setShowConfirmModal(false);
      return;
    }
    setActionLoading(true);
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        ENDPOINTS.SERVICE_REQUEST_ACTION(requestId),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "forward" }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to forward request.");
      }
      toast.success("Request forwarded successfully!");
      setSelectedRequest(null);
      setMaintenanceLetter(null);
      setReceiptFile(null);
      setMaintenanceTotalCost("");
      fetchRequests();
      setShowConfirmModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to forward request.");
    } finally {
      setActionLoading(false);
    }
  };

  // Fetch and log service request detail when "View Details" is clicked
  const handleViewDetails = async (req) => {
    setSelectedRequest(req);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(ENDPOINTS.SERVICE_REQUEST_DETAIL(req.id), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch request detail");
      const data = await response.json();
      console.log("SERVICE_REQUEST_DETAIL:", data);
      // Optionally, you can update selectedRequest with more detail here if needed
    } catch (error) {
      toast.error("Failed to fetch request detail.");
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Service Requests</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Vehicle</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {serviceRequests.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No service requests found.
                </td>
              </tr>
            ) : (
              serviceRequests.map((req, idx) => (
                <tr key={req.id}>
                  <td>{idx + 1}</td>
                  <td>
                    {req.created_at
                      ? new Date(req.created_at).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>{req.vehicle || "N/A"}</td>
                  <td>{req.status || "N/A"}</td>
                  <td>
                    <button
                      className="btn"
                      style={{
                        backgroundColor: "#14183E",
                        color: "#fff",
                        width: "120px",
                      }}
                      onClick={() => handleViewDetails(req)}
                    >
                      View Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for request details */}
      {selectedRequest && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Service Request Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedRequest(null)}
                >
                  ✖
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Date:</strong>{" "}
                  {selectedRequest.created_at
                    ? new Date(selectedRequest.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Requester's Car:</strong>{" "}
                  {selectedRequest.vehicle || "N/A"}
                </p>
                <div className="mb-3">
                  <label htmlFor="maintenanceLetter" className="form-label">
                    Service Letter (PDF) <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="maintenanceLetter"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, setMaintenanceLetter)}
                  />
                  {maintenanceLetter && (
                    <button
                      className="btn"
                      onClick={() =>
                        window.open(
                          URL.createObjectURL(maintenanceLetter),
                          "_blank"
                        )
                      }
                    >
                      View
                    </button>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="receiptFile" className="form-label">
                    Receipt File (PDF) <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="receiptFile"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, setReceiptFile)}
                  />
                  {receiptFile && (
                    <button
                      className="btn"
                      onClick={() =>
                        window.open(URL.createObjectURL(receiptFile), "_blank")
                      }
                    >
                      View
                    </button>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="maintenanceTotalCost" className="form-label">
                    Total Cost <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="maintenanceTotalCost"
                    value={maintenanceTotalCost}
                    onChange={(e) => setMaintenanceTotalCost(e.target.value)}
                    placeholder="Enter total cost"
                  />
                </div>
                <div className="mb-3 d-flex gap-2">
                  <button
                    className="btn btn-success"
                    onClick={() => handleSubmitFiles(selectedRequest.id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Submitting..." : "Submit"}
                  </button>
                  <button
                    className="btn "
                    style={{ backgroundColor: "#14183E", color: "#fff" }}
                    onClick={() => setShowConfirmModal(true)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : "Forward"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Forward Modal */}
      {showConfirmModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Forward</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                >
                  ✖
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to forward this request?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn"
                  style={{ backgroundColor: "#14183E", color: "#fff" }}
                  disabled={actionLoading}
                  onClick={() => handleForward(selectedRequest.id)}
                >
                  {actionLoading ? "Processing..." : "Forward"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default ListServiceRequestsTable;
