import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify"; // For toast messages
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/Logo.jpg"; // Import the logo image
import { IoMdClose } from "react-icons/io";
import { ENDPOINTS } from "../utilities/endpoints";
import CustomPagination from './CustomPagination';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { IoClose } from "react-icons/io5";

const TMhighcostrequests = () => {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]); // State for employees
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null); // Selected request for modal
  const [rejectionReason, setRejectionReason] = useState(""); // State for rejection reason
  const [showRejectionModal, setShowRejectionModal] = useState(false); // State for rejection modal
  const [showConfirmation, setShowConfirmation] = useState(false); // State for rejection confirmation dialog
  const [showApproveConfirmation, setShowApproveConfirmation] = useState(false); // State for approve confirmation dialog
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const [availableVehicles, setAvailableVehicles] = useState([]); // State for available vehicles
  const [selectedVehicleId, setSelectedVehicleId] = useState(""); // Initialize with an empty string
  const [estimatedDistance, setEstimatedDistance] = useState(""); // State for estimated distance
  const [fuelPrice, setFuelPrice] = useState(""); // State for fuel price per liter
  const [isCostCalculated, setIsCostCalculated] = useState(false); // State to track cost calculation
  const [showEstimateModal, setShowEstimateModal] = useState(false); // State for estimate modal

  // OTP states for Forward and Assign Vehicle
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpAction, setOtpAction] = useState(""); // "forward" or "assign"

  const accessToken = localStorage.getItem("authToken");
  useEffect(() => {
    fetchRequests();
    fetchUsers(); 
    fetchAvailableVehicles();
  }, []);

  const fetchRequests = async () => {
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
    setLoading(true);
    try {
      const highCostRequests = await fetchHighCostRequests();
      const highCostRequestsWithLabel = highCostRequests.map((request) => ({
        ...request,
        requestType: "High Cost",
      }));
      setRequests(highCostRequestsWithLabel);
    } catch (error) {
      console.error("Fetch Requests Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
    try {
      const response = await fetch(ENDPOINTS.USER_LIST, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data.results || []);
    } catch (error) {
      console.error("Fetch Users Error:", error);
    }
  };

  const fetchHighCostRequests = async () => {
    if (!accessToken) {
      console.error("No access token found.");
      return [];
    }
    try {
      const response = await fetch(ENDPOINTS.HIGH_COST_LIST, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch high-cost transport requests");
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Fetch High-Cost Requests Error:", error);
      return [];
    }
  };

  const fetchAvailableVehicles = async () => {
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
    try {
      const response = await fetch(ENDPOINTS.AVAILABLE_VEHICLES, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch available vehicles");
      const data = await response.json();
      setAvailableVehicles(data.results || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to fetch available vehicles.");
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

  const getEmployeeNames = (employeeIds) => {
    return employeeIds
      .map((id) => {
        const employee = users.find((user) => user.id === id);
        return employee ? employee.full_name : "Unknown";
      })
      .join(", ");
  };

  const handleViewDetail = (request) => {
    setSelectedRequest(request);
  };

  const handleCloseDetail = () => {
    setSelectedRequest(null);
    setRejectionReason(""); 
    setShowRejectionModal(false); 
    setShowConfirmation(false); 
    setShowApproveConfirmation(false); 
    setIsCostCalculated(false); 
    setOtpModalOpen(false);
    setOtpValue("");
    setOtpLoading(false);
    setOtpAction("");
  };

  // OTP flow for Forward and Assign Vehicle
  const sendOtp = async () => {
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
      toast.error("Failed to send OTP");
      setOtpModalOpen(false);
    } finally {
      setOtpLoading(false);
    }
  };

  // When Assign Vehicle is clicked
  const handleOpenAssignVehicle = async () => {
    setOtpAction("assign");
    await sendOtp();
    setOtpValue("");
    setOtpModalOpen(true);
  };

  // When Forward is clicked
  const handleOpenForwardOtp = async () => {
    setOtpAction("forward");
    await sendOtp();
    setOtpValue("");
    setOtpModalOpen(true);
  };

  // OTP handler for both Forward and Assign actions
  const handleOtpAction = async () => {
    setOtpLoading(true);
    try {
      if (otpAction === "assign") {
        const response = await fetch(ENDPOINTS.ASSIGN_VEHICLE(selectedRequest.id), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp_code: otpValue }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          const errorMessage = JSON.parse(errorText).error || "Failed to assign vehicle.";
          toast.error(errorMessage);
          return;
        }
        toast.success("Vehicle assigned and approved successfully!");
        setOtpModalOpen(false);
        setOtpValue("");
        setSelectedRequest(null);
        fetchRequests();
      } else if (otpAction === "forward") {
        const response = await fetch(ENDPOINTS.APPREJ_HIGHCOST_REQUEST(selectedRequest.id), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "forward", otp_code: otpValue }),
        });
        if (!response.ok) throw new Error("Failed to forward request");
        toast.success("Request forwarded successfully!");
        setOtpModalOpen(false);
        setOtpValue("");
        setSelectedRequest(null);
        fetchRequests();
      }
    } catch (error) {
      toast.error("Failed to process request.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleApproveReject = async (action) => {
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
    try {
      const response = await fetch(ENDPOINTS.APPREJ_HIGHCOST_REQUEST(selectedRequest.id), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: action, // "forward" or "reject"
          rejection_message: action === "reject" ? rejectionReason : undefined,
        }),
      });
      if (!response.ok) throw new Error(`Failed to ${action} request`);
      toast.success(`Request ${action === "forward" ? "forwarded" : "rejected"} successfully!`);
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      console.error(`${action === "forward" ? "Forward" : "Reject"} Error:`, error);
      toast.error(`Failed to ${action} request.`);
    }
  };

  const estimateCost = async () => {
    if (!selectedVehicleId || !fuelPrice || !estimatedDistance) {
      toast.error("Please provide all required inputs.");
      return;
    }
    try {
      const response = await fetch(ENDPOINTS.ESTIMATE_HIGH_COST(selectedRequest.id), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estimated_distance_km: estimatedDistance,
          fuel_price_per_liter: fuelPrice,
          estimated_vehicle_id: selectedVehicleId,
        }),
      });
      if (!response.ok) throw new Error("Failed to estimate cost");
      toast.success("Cost estimated successfully!");
      setShowEstimateModal(false);
      fetchHighCostDetails(selectedRequest.id);
      setIsCostCalculated(true);
    } catch (error) {
      console.error("Estimate Cost Error:", error);
      toast.error("Failed to estimate cost.");
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
                <th>Request Type</th>
                <th>Status</th>
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

      {/* Main Detail Modal */}
      {selectedRequest && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog" style={{ width: "90%", maxWidth: "1200px", margin: "0 auto" }}>
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex align-items-center">
                  <img src={Logo} alt="Logo" style={{ width: "100px", height: "70px", marginRight: "10px" }} />
                  <h5 className="modal-title">Estimate Cost and Assign Vehicle</h5>
                </div>
                <button type="button" className="btn-close" onClick={handleCloseDetail}>
                  <IoClose size={30} />
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Requester:</strong> {selectedRequest.requester}</p>
                <p><strong>Employees:</strong> {selectedRequest.employees?.join(", ") || "N/A"}</p>
                <p><strong>Start Day:</strong> {selectedRequest.start_day}</p>
                <p><strong>Return Day:</strong> {selectedRequest.return_day}</p>
                <p><strong>Destination:</strong> {selectedRequest.destination}</p>
                <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                {isCostCalculated && (
                  <>
                    <p><strong>Estimated Vehicle:</strong> {selectedRequest.estimated_vehicle}</p>
                    <p><strong>Estimated Distance (km):</strong> {selectedRequest.estimated_distance_km}</p>
                    <p><strong>Fuel Price per Liter:</strong> {selectedRequest.fuel_price_per_liter}</p>
                    <p><strong>Fuel Needed (Liters):</strong> {selectedRequest.fuel_needed_liters}</p>
                    <p><strong>Total Cost:</strong> {selectedRequest.total_cost} ETB</p>
                  </>
                )}
              </div>
              <div className="modal-footer">
                {selectedRequest.status === "forwarded" && !isCostCalculated && (
                  <Button style={{ color: "#ffffff", backgroundColor: "#1976d2", width: "150px" }} onClick={() => setShowEstimateModal(true)}>
                    Estimate Cost
                  </Button>
                )}
                {selectedRequest.status === "forwarded" && isCostCalculated && (
                  <Stack direction="row" spacing={2}>
                    <Button
                      style={{ color: "#ffffff", backgroundColor: "#1976d2" }}
                      onClick={handleOpenForwardOtp}
                    >
                      Forward
                    </Button>
                    <Button
                      style={{ color: "#ffffff", backgroundColor: "#d32f2f" }}
                      onClick={() => setShowRejectionModal(true)}
                    >
                      Reject
                    </Button>
                    <Button
                      style={{ color: "#ffffff", backgroundColor: "#ffa726" }}
                      onClick={() => setShowEstimateModal(true)}
                    >
                      Recalculate
                    </Button>
                  </Stack>
                )}
                {selectedRequest.status === "approved" && (
                  <Button
                    style={{ color: "#ffffff", backgroundColor: "#4caf50", width: "150px" }}
                    onClick={handleOpenAssignVehicle}
                  >
                    Assign Vehicle
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estimate Modal */}
      {showEstimateModal && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Estimate Cost</h5>
                <button className="btn-close" onClick={() => setShowEstimateModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="vehicleSelect" className="form-label">Select Vehicle</label>
                  <select
                    id="vehicleSelect"
                    className="form-select"
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                  >
                    <option value="">Select a vehicle</option>
                    {availableVehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.model} - {vehicle.license_plate}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="fuelPrice" className="form-label">Fuel Price per Liter</label>
                  <input
                    id="fuelPrice"
                    type="number"
                    className="form-control"
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="estimatedDistance" className="form-label">Estimated Distance (km)</label>
                  <input
                    id="estimatedDistance"
                    type="number"
                    className="form-control"
                    value={estimatedDistance}
                    onChange={(e) => setEstimatedDistance(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <Stack direction="row" spacing={2}>
                  <Button style={{ color: "#ffffff", backgroundColor: "#1976d2" }} onClick={estimateCost}>
                    Calculate
                  </Button>
                  <Button variant="outlined" style={{ color: "#d32f2f", borderColor: "#d32f2f" }} onClick={() => setShowEstimateModal(false)}>
                    Close
                  </Button>
                </Stack>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal for Assign Vehicle and Forward */}
      {otpModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {otpAction === "assign" ? "Enter OTP to Approve and Assign Vehicle" : "Enter OTP to Forward Request"}
                </h5>
                <button type="button" className="btn-close" onClick={() => { setOtpModalOpen(false); setOtpValue(""); setOtpAction(""); }} disabled={otpLoading}>
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                <p>Enter the OTP code sent to your phone number.</p>
                <div className="d-flex justify-content-center gap-2 mb-3">
                  {[...Array(6)].map((_, idx) => (
                    <input
                      key={idx}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="form-control text-center"
                      style={{
                        width: "40px",
                        height: "40px",
                        fontSize: "1.5rem",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        boxShadow: "none",
                      }}
                      value={otpValue[idx] || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        if (!val) return;
                        let newOtp = otpValue.split("");
                        newOtp[idx] = val;
                        if (val && idx < 5) {
                          const next = document.getElementById(`otp-input-${idx + 1}`);
                          if (next) next.focus();
                        }
                        setOtpValue(newOtp.join("").slice(0, 6));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otpValue[idx] && idx > 0) {
                          const prev = document.getElementById(`otp-input-${idx - 1}`);
                          if (prev) prev.focus();
                        }
                      }}
                      id={`otp-input-${idx}`}
                      disabled={otpLoading}
                    />
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <Button
                  className="btn"
                  style={{ backgroundColor: "#1976d2", color: "#fff", minWidth: "150px" }}
                  onClick={handleOtpAction}
                  disabled={otpLoading || otpValue.length !== 6}
                >
                  {otpLoading
                    ? "Processing..."
                    : otpAction === "assign"
                    ? "Approve & Assign"
                    : "Forward"}
                </Button>
                <Button
                  className="btn btn-secondary"
                  style={{ minWidth: "100px" }}
                  onClick={() => { setOtpModalOpen(false); setOtpValue(""); setOtpAction(""); }}
                  disabled={otpLoading}
                >
                  Cancel
                </Button>
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
                <button type="button" className="btn-close" onClick={() => setShowRejectionModal(false)}></button>
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
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    style={{ color: "#ffffff", backgroundColor: "#d32f2f" }}
                    onClick={() => handleApproveReject("reject")}
                  >
                    Submit Rejection
                  </Button>
                  <Button
                    variant="outlined"
                    style={{ color: "#1976d2", borderColor: "#1976d2" }}
                    onClick={() => setShowRejectionModal(false)}
                  >
                    Cancel
                  </Button>
                </Stack>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      {showConfirmation && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Rejection</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirmation(false)}>
                  <IoMdClose size={30}/>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to reject this request?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirmation(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmAction}>
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showApproveConfirmation && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Approval</h5>
                <button type="button" className="btn-close" onClick={() => setShowApproveConfirmation(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to forward this request to the transport manager?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowApproveConfirmation(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleConfirmApprove}>
                  Confirm Approval
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .otp-input {
          width: 40px;
          height: 40px;
          font-size: 1.5rem;
          text-align: center;
          border-radius: 6px;
          border: 1px solid #ccc;
          margin-right: 5px;
        }
      `}</style>
    </div>
  );
};

export default TMhighcostrequests;