import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/Logo.jpg";
import { IoCloseSharp } from "react-icons/io5";
import { ENDPOINTS } from "../utilities/endpoints";
import CustomPagination from "./CustomPagination";

const BUHighCost = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // OTP
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpAction, setOtpAction] = useState(null); // "approve" | "reject"

  const itemsPerPage = 5;
  const accessToken = localStorage.getItem("authToken");

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line
  }, []);

  const fetchRequests = async () => {
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(ENDPOINTS.HIGH_COST_LIST, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch high-cost requests");
      const data = await response.json();
      setRequests(data.results || []);
    } catch (error) {
      console.error("Fetch Requests Error:", error);
      toast.error("Failed to fetch high-cost requests.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHighCostDetails = async (requestId) => {
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
    try {
      const response = await fetch(ENDPOINTS.HIGH_COST_DETAIL(requestId), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch high-cost request details");
      const data = await response.json();
      setSelectedRequest(data);
    } catch (error) {
      console.error("Fetch High-Cost Details Error:", error);
      toast.error("Failed to fetch high-cost request details.");
    }
  };

  const handleViewDetail = async (request) => {
    setSelectedRequest(null);
    await fetchHighCostDetails(request.id);
  };

  // OTP send
  const sendOtp = async (actionType) => {
    setOtpAction(actionType);
    setOtpValue("");
    setOtpModalOpen(true);
    setOtpLoading(true);
    try {
      const response = await fetch(ENDPOINTS.OTP_REQUEST, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error("Failed to send OTP");
      toast.success("OTP sent to your phone");
    } catch (err) {
      toast.error(err.message);
      setOtpModalOpen(false);
    } finally {
      setOtpLoading(false);
    }
  };

  // OTP approve/reject handler
  const handleOtpAction = async () => {
    setOtpLoading(true);
    try {
      if (otpAction === "approve") {
        // Approve (with OTP)
        const response = await fetch(ENDPOINTS.APPREJ_HIGHCOST_REQUEST(selectedRequest.id), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "approve",
            otp_code: otpValue,
          }),
        });
        if (!response.ok) throw new Error("Failed to approve request");
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === selectedRequest.id ? { ...req, status: "forwarded" } : req
          )
        );
        setSelectedRequest(null);
        toast.success("Request forwarded successfully!");
      } else if (otpAction === "reject") {
        if (!rejectionReason) {
          toast.error("Please provide a reason for rejection.");
          setOtpLoading(false);
          return;
        }
        // Reject (with OTP)
        const response = await fetch(ENDPOINTS.APPREJ_HIGHCOST_REQUEST(selectedRequest.id), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "reject",
            rejection_message: rejectionReason,
            otp_code: otpValue,
          }),
        });
        if (!response.ok) throw new Error("Failed to reject request");
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === selectedRequest.id ? { ...req, status: "rejected" } : req
          )
        );
        setSelectedRequest(null);
        setRejectionReason("");
        toast.success("Request rejected successfully!");
      }
      setOtpModalOpen(false);
      setOtpValue("");
      setOtpAction(null);
      setShowRejectionModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to process request.");
    } finally {
      setOtpLoading(false);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageRequests = requests.slice(startIndex, endIndex);

  return (
    <div className="container mt-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
      <ToastContainer />
      {loading ? (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading data...</p>
        </div>
      ) : (
        <div className="table-responsive" style={{ width: "100%", overflowX: "auto" }}>
          <table className="table table-hover align-middle">
            <thead className="table">
              <tr>
                <th>#</th>
                <th>Start Day</th>
                <th>Start Time</th>
                <th>Return Day</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPageRequests.length > 0 ? (
                currentPageRequests.map((request, index) => (
                  <tr key={request.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{request.start_day}</td>
                    <td>{request.start_time}</td>
                    <td>{request.return_day}</td>
                    <td>{request.destination}</td>
                    <td>{request.status}</td>
                    <td>
                      <button
                        className="btn btn-sm"
                        style={{ backgroundColor: "#181E4B", color: "white" }}
                        onClick={() => handleViewDetail(request)}
                      >
                        View Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No transport requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
        <CustomPagination
          currentPage={currentPage}
          totalPages={Math.ceil(requests.length / itemsPerPage)}
          handlePageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Modal for Viewing Details */}
      {selectedRequest && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <img src={Logo} alt="Logo" style={{ width: "100px", height: "70px", marginRight: "10px" }} />
                <h5 className="modal-title">Transport Request Details</h5>
                <button
                  type="button"
                  className="btn"
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    color: "#000",
                    marginLeft: "auto",
                  }}
                  onClick={() => setSelectedRequest(null)}
                  aria-label="Close"
                >
                  <IoCloseSharp />
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Requester:</strong> {selectedRequest.requester}</p>
                <p><strong>Employees:</strong> {selectedRequest.employees?.join(", ") || "N/A"}</p>
                <p><strong>Estimated Vehicle:</strong> {selectedRequest.estimated_vehicle || "N/A"}</p>
                <p><strong>Start Day:</strong> {selectedRequest.start_day}</p>
                <p><strong>Return Day:</strong> {selectedRequest.return_day}</p>
                <p><strong>Start Time:</strong> {selectedRequest.start_time}</p>
                <p><strong>Destination:</strong> {selectedRequest.destination}</p>
                <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                <p><strong>Status:</strong> {selectedRequest.status}</p>
                <p><strong>Vehicle Assigned:</strong> {selectedRequest.vehicle_assigned ? "Yes" : "No"}</p>
                <p><strong>Estimated Distance (km):</strong> {selectedRequest.estimated_distance_km || "N/A"}</p>
                <p><strong>Fuel Price per Liter:</strong> {selectedRequest.fuel_price_per_liter || "N/A"}</p>
                <p><strong>Fuel Needed (Liters):</strong> {selectedRequest.fuel_needed_liters || "N/A"}</p>
                <p><strong>Total Cost:</strong> {selectedRequest.total_cost || "N/A"} ETB</p>
                <p><strong>Created At:</strong> {new Date(selectedRequest.created_at).toLocaleString()}</p>
              </div>
              <div className="modal-footer">
                <button
  className="btn"
  style={{ backgroundColor: "#181E4B", color: "white" }}
  onClick={() => sendOtp("approve")}
>
  Approve 
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => setShowRejectionModal(true)}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {otpModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Enter OTP to {otpAction === "approve" ? "approve" : "reject"} request
                </h5>
                <button
                  type="button"
                  className="btn"
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    color: "#000",
                    marginLeft: "auto",
                  }}
                  onClick={() => {
                    setOtpModalOpen(false);
                    setOtpValue("");
                    setOtpAction(null);
                  }}
                  aria-label="Close"
                  disabled={otpLoading}
                >
                  <IoCloseSharp />
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  maxLength={6}
                  value={otpValue}
                  onChange={e => setOtpValue(e.target.value.replace(/\D/g, ""))}
                  disabled={otpLoading}
                  placeholder="Enter OTP"
                />
                {otpAction === "reject" && (
                  <textarea
                    className="form-control mt-3"
                    rows={2}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Reason for rejection"
                    disabled={otpLoading}
                  />
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-link"
                  onClick={() => sendOtp(otpAction)}
                  disabled={otpLoading}
                >
                  Resend OTP
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setOtpModalOpen(false);
                    setOtpValue("");
                    setOtpAction(null);
                  }}
                  disabled={otpLoading}
                >
                  Cancel
                </button>
                <button
  type="button"
  className="btn"
  style={{ backgroundColor: "#181E4B", color: "white" }}
  disabled={otpLoading || otpValue.length !== 6}
  onClick={handleOtpAction}
>
  {otpLoading
    ? "Processing..."
    : otpAction === "approve"
    ? "Approve"
    : "Reject"}
</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Request</h5>
                <button
                  type="button"
                  className="btn"
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    color: "#000",
                    marginLeft: "auto",
                  }}
                  onClick={() => setShowRejectionModal(false)}
                  aria-label="Close"
                >
                  <IoCloseSharp />
                </button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="rejectionReason" className="form-label">Rejection Reason</label>
                  <textarea
                    id="rejectionReason"
                    className="form-control"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide a reason for rejection"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    setShowRejectionModal(false);
                    sendOtp("reject");
                  }}
                >
                  Submit Rejection (with OTP)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BUHighCost;