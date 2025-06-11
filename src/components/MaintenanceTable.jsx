import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ENDPOINTS } from "../utilities/endpoints";
import { IoClose } from "react-icons/io5";
import CustomPagination from "./CustomPagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/Logo.jpg"; // Import the logo
import { useLanguage } from "../context/LanguageContext";
const MaintenanceTable = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null); // State for selected request details
  const [actionLoading, setActionLoading] = useState(false); // State for approve/reject actions
  const [rejectionMessage, setRejectionMessage] = useState(""); // State for rejection message
  const [showConfirmModal, setShowConfirmModal] = useState(false); // State for confirmation modal
  const [showRejectModal, setShowRejectModal] = useState(false); // State for rejection modal
  const [pendingAction, setPendingAction] = useState(null); // State for pending action
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageRequests = maintenanceRequests.slice(startIndex, endIndex);
  const { mylanguage } = useLanguage(); // Use the language context
  // Fetch maintenance requests
  const fetchMaintenanceRequests = async () => {
    const accessToken = localStorage.getItem("authToken");

    if (!accessToken) {
      console.error("No access token found.");
      return;
    }

    try {
      const response = await fetch(ENDPOINTS.LIST_MAINTENANCE_REQUESTS, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch maintenance requests");
      }

      const data = await response.json();
      setMaintenanceRequests(data.results || []); // Update state with fetched data
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  // Handle actions (forward, reject)
  const handleAction = async (id, action) => {
    const accessToken = localStorage.getItem("authToken");

    if (!accessToken) {
      console.error("No access token found.");
      toast.error("No access token found.");
      return;
    }

    setActionLoading(true);
    try {
      const body = { action };
      if (action === "reject") {
        body.rejection_message = rejectionMessage; // Include rejection message for rejection action
      }

      const response = await fetch(ENDPOINTS.MAINTENANCE_REQUEST_ACTION(id), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), // Send the correct payload
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} the maintenance request`);
      }

      fetchMaintenanceRequests(); // Refresh the list after action
      setSelectedRequest(null); // Close the detail view
      toast.success(
        `Request successfully ${
          action === "forward" ? "forwarded" : "rejected"
        }.`
      );
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
      toast.error(`Failed to ${action} the request. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmAction = () => {
    if (pendingAction && selectedRequest) {
      handleAction(selectedRequest.id, pendingAction);
    }
    setShowConfirmModal(false);
  };

  const handleRejectAction = () => {
    if (rejectionMessage.trim() && selectedRequest) {
      handleAction(selectedRequest.id, "reject"); // Use the correct `id` from the selected request
      setShowRejectModal(false);
    } else {
      alert("Rejection message cannot be empty.");
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">
        {mylanguage === "EN" ? "Maintenance Requests" : "የጥገና ጥያቄዎች"}
      </h2>

      <ToastContainer />

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              {mylanguage === "EN" ? "Loading..." : "በመጫን ላይ..."}
            </span>
          </div>
          <p>
            {mylanguage === "EN"
              ? "Loading maintenance requests..."
              : "የጥገና ጥያቄዎችን በመጫን ላይ..."}
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>{mylanguage === "EN" ? "Date" : "ቀን"}</th>
                <th>{mylanguage === "EN" ? "Requester Name" : "የጠየቀው ስም"}</th>
                <th>{mylanguage === "EN" ? "Requester's Car" : "የጠየቀው መኪና"}</th>
                <th>{mylanguage === "EN" ? "Status" : "ሁኔታ"}</th>
                <th>{mylanguage === "EN" ? "Action" : "ተግባር"}</th>
              </tr>
            </thead>
            <tbody>
              {currentPageRequests.length > 0 ? (
                currentPageRequests.map((request, index) => (
                  <tr key={request.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>{" "}
                    <td>{new Date(request.date).toLocaleDateString()}</td>
                    <td>{request.requester_name || "N/A"}</td>
                    <td>{request.requesters_car_name || "N/A"}</td>
                    <td>{request.status || "N/A"}</td>
                    <td>
                      <button
                        className="btn btn-sm"
                        style={{ backgroundColor: "#181E4B", color: "white" }}
                        onClick={() => setSelectedRequest(request)}
                      >
                        {mylanguage === "EN" ? "View Detail" : "ዝርዝር ይመልከቱ"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    {mylanguage === "EN"
                      ? "No maintenance requests found."
                      : "ምንም የጥገና ጥያቄዎች አልተገኙም።"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100px" }}
      >
        <CustomPagination
          currentPage={currentPage}
          totalPages={Math.ceil(maintenanceRequests.length / itemsPerPage)}
          handlePageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Modal for Viewing Details */}
      {selectedRequest && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex align-items-center">
                  <img
                    src={Logo}
                    alt="Logo"
                    style={{
                      width: "100px",
                      height: "70px",
                      marginRight: "10px",
                    }}
                  />
                  <h5 className="modal-title">
                    {mylanguage === "EN"
                      ? "Maintenance Request Details"
                      : "የጥገና ጥያቄ ዝርዝሮች"}
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedRequest(null)}
                >
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>{mylanguage === "EN" ? "Date:" : "ቀን:"}</strong>{" "}
                  {new Date(selectedRequest.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>{mylanguage === "EN" ? "Reason:" : "ምክንያት:"}</strong>{" "}
                  {selectedRequest.reason}
                </p>
                <p>
                  <strong>
                    {mylanguage === "EN" ? "Requester Name:" : "የጠየቀው ስም:"}
                  </strong>{" "}
                  {selectedRequest.requester_name}
                </p>
                <p>
                  <strong>
                    {mylanguage === "EN" ? "Requester's Car:" : "የጠየቀው መኪና:"}
                  </strong>{" "}
                  {selectedRequest.requesters_car_name}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn"
                  style={{ backgroundColor: "#181E4B", color: "white" }}
                  onClick={() => {
                    setPendingAction("forward");
                    setShowConfirmModal(true);
                  }}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? mylanguage === "EN"
                      ? "Processing..."
                      : "በሂደት ላይ..."
                    : mylanguage === "EN"
                    ? "Forward"
                    : "ወደ ፊት ላክ"}
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => setShowRejectModal(true)}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? mylanguage === "EN"
                      ? "Processing..."
                      : "በሂደት ላይ..."
                    : mylanguage === "EN"
                    ? "Reject"
                    : "አልቅ"}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedRequest(null)}
                >
                  {mylanguage === "EN" ? "Close" : "ዝጋ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {mylanguage === "EN" ? "Confirm Action" : "እርግጠኛ ይሁኑ"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmModal(false)}
                >
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                <p>
                  {mylanguage === "EN"
                    ? "Are you sure you want to forward this request?"
                    : "ይህን ጥያቄ ወደ ፊት ላክ ማድረግ እርግጠኛ ነዎት?"}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmModal(false)}
                >
                  {mylanguage === "EN" ? "Cancel" : "ይቅር"}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleConfirmAction}
                >
                  {mylanguage === "EN" ? "Confirm" : "አረጋግጥ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {mylanguage === "EN" ? "Reject Request" : "ጥያቄ አልቅ"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRejectModal(false)}
                >
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  placeholder={
                    mylanguage === "EN"
                      ? "Enter rejection reason"
                      : "የማትቀበል ምክንያት ያስገቡ"
                  }
                  value={rejectionMessage}
                  onChange={(e) => setRejectionMessage(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowRejectModal(false)}
                >
                  {mylanguage === "EN" ? "Cancel" : "ይቅር"}
                </button>
                <button className="btn btn-danger" onClick={handleRejectAction}>
                  {mylanguage === "EN" ? "Reject" : "አልቅ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceTable;
