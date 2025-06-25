import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ENDPOINTS } from "../utilities/endpoints";
import { MdOutlineClose } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomPagination from "./CustomPagination";

const TMRefuelingTable = () => {
  const [refuelingRequests, setRefuelingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showFuelCostModal, setShowFuelCostModal] = useState(false);
  const [fuelType, setFuelType] = useState("Petrol");
  const [fuelCost, setFuelCost] = useState("");
  const [showCalculateModal, setShowCalculateModal] = useState(false);
  const [distance, setDistance] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [fuelEfficiency, setFuelEfficiency] = useState(15);
  const [totalCost, setTotalCost] = useState(null);

  // OTP-related states
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpAction, setOtpAction] = useState(null); // "forward" or "reject"

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(refuelingRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = refuelingRequests.slice(startIndex, endIndex);

  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  const fetchRefuelingRequests = async () => {
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
    try {
      const response = await fetch(ENDPOINTS.REFUELING_REQUEST_LIST, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch refueling requests");
      }
      const data = await response.json();
      setRefuelingRequests(data.results || []);
    } catch (error) {
      console.error("Error fetching refueling requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequestDetail = async (requestId) => {
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
    try {
      const response = await fetch(
        ENDPOINTS.REFUELING_REQUEST_DETAIL(requestId),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch refueling request details");
      }
      const requestData = await response.json();
      const vehicleResponse = await fetch(
        ENDPOINTS.VEHICLE_DETAIL(requestData.requesters_car),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!vehicleResponse.ok) {
        throw new Error("Failed to fetch vehicle details");
      }
      const vehicleData = await vehicleResponse.json();
      requestData.driver_name = vehicleData.driver_name;
      requestData.fuel_efficiency = parseFloat(vehicleData.fuel_efficiency);
      setSelectedRequest(requestData);
    } catch (error) {
      console.error("Error fetching refueling request details:", error);
      toast.error("Failed to fetch request details.");
    }
  };

  const handleFuelCostUpdate = async () => {
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
    if (!fuelCost) {
      toast.error("Please enter the fuel cost.");
      return;
    }
    try {
      const response = await fetch(ENDPOINTS.UPDATE_FUEL_COST, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fuel_type: fuelType,
          fuel_cost: parseFloat(fuelCost),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update fuel cost");
      }
      toast.success(`${fuelType} cost updated successfully!`);
      setShowFuelCostModal(false);
    } catch (error) {
      console.error("Error updating fuel cost:", error);
      toast.error("Failed to update fuel cost. Please try again.");
    }
  };

  const calculateTotalCost = async (
    requestId,
    estimatedDistance,
    fuelPrice
  ) => {
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
    if (!estimatedDistance || !fuelPrice) {
      toast.error("Please provide both estimated distance and fuel price.");
      return;
    }
    try {
      const payload = {
        estimated_distance_km: parseFloat(estimatedDistance),
        fuel_price_per_liter: parseFloat(fuelPrice),
      };
      const response = await fetch(
        ENDPOINTS.REFUELING_REQUEST_ESTIMATE(requestId),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from backend:", errorData);
        throw new Error("Failed to calculate total cost");
      }
      const data = await response.json();
      setTotalCost(data.total_cost.toFixed(2));
      toast.success(`Total cost calculated: ${data.total_cost.toFixed(2)} ETB`);
    } catch (error) {
      console.error("Error calculating total cost:", error);
      toast.error("Failed to calculate total cost. Please try again.");
    }
  };

  // OTP sending function
  const sendOtp = async () => {
    setOtpLoading(true);
    try {
      const accessToken = localStorage.getItem("authToken");
      const response = await fetch(ENDPOINTS.OTP_REQUEST, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }
      setOtpSent(true);
      toast.success("OTP sent to your phone");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle OTP verification and action (forward or reject)
  const handleOtpAction = async (otp, action) => {
    setOtpLoading(true);
    try {
      const accessToken = localStorage.getItem("authToken");
      let payload = { action, otp_code: otp };
      if (action === "forward") {
        if (!distance || !fuelPrice) {
          toast.error("Please provide both estimated distance and fuel price.");
          setOtpLoading(false);
          return;
        }
        payload.estimated_distance_km = parseFloat(distance);
        payload.fuel_price_per_liter = parseFloat(fuelPrice);
      }
      if (action === "reject") {
        payload.rejection_message = rejectionMessage;
      }
      const response = await fetch(
        ENDPOINTS.APPREJ_REFUELING_REQUEST(selectedRequest.id),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.detail || `Failed to ${action} refueling request`
        );
      }
      let successMessage = "";
      if (action === "forward") successMessage = "Request forwarded!";
      else if (action === "reject") successMessage = "Request rejected!";
      toast.success(successMessage);
      setSelectedRequest(null);
      setOtpModalOpen(false);
      setOtpValue("");
      setOtpSent(false);
      setOtpAction(null);
      setRejectionMessage("");
      setTotalCost(null);
      fetchRefuelingRequests();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchRefuelingRequests();
  }, []);

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center mb-4">Refueling Requests</h2>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading refueling requests...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Destination</th>
                <th>Driver</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.length > 0 ? (
                currentRequests.map((request, index) => (
                  <tr key={request.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{new Date(request.created_at).toLocaleDateString()}</td>
                    <td>{request.destination || "N/A"}</td>
                    <td>{request.requester_name || "N/A"}</td>
                    <td>{request.status || "N/A"}</td>
                    <td>
                      <button
                        className="btn btn-sm"
                        style={{ backgroundColor: "#181E4B", color: "white" }}
                        onClick={() => fetchRequestDetail(request.id)}
                      >
                        View Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No refueling requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100px" }}
          >
            <CustomPagination
              currentPage={currentPage}
              totalPages={Math.ceil(refuelingRequests.length / itemsPerPage)}
              handlePageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      )}
      {/* Modal for Viewing Details */}
      {selectedRequest && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Refueling Request Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setSelectedRequest(null);
                    setTotalCost(null);
                  }}
                >
                  <MdOutlineClose />
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Destination:</strong> {selectedRequest.destination}
                </p>
                <p>
                  <strong>Fuel Type:</strong> {selectedRequest.fuel_type}
                </p>
                <p>
                  <strong>Driver:</strong>{" "}
                  {selectedRequest.driver_name || "N/A"}
                </p>
                <div className="mb-3">
                  <label htmlFor="distanceInput" className="form-label">
                    Estimated Distance (in km)
                  </label>
                  <input
                    type="number"
                    id="distanceInput"
                    className="form-control"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="Enter estimated distance in kilometers"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fuelPriceInput" className="form-label">
                    Fuel Price (per liter)
                  </label>
                  <input
                    type="number"
                    id="fuelPriceInput"
                    className="form-control"
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(e.target.value)}
                    placeholder="Enter fuel price per liter"
                  />
                </div>
                {totalCost && (
                  <div className="alert alert-info mt-3">
                    <strong>Total Cost:</strong> {totalCost} ETB
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {!totalCost ? (
                  <button
                    style={{
                      backgroundColor: "#181E4B",
                      color: "white",
                      width: "150px",
                    }}
                    className="btn"
                    onClick={() =>
                      calculateTotalCost(
                        selectedRequest.id,
                        distance,
                        fuelPrice
                      )
                    }
                  >
                    Calculate Total
                  </button>
                ) : (
                  <>
                    <button
                      style={{ backgroundColor: "#181E4B", color: "white" }}
                      className="btn"
                      onClick={async () => {
                        setOtpAction("forward");
                        setOtpModalOpen(true);
                        await sendOtp();
                      }}
                    >
                      Forward 
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={async () => {
                        setOtpAction("reject");
                        setOtpModalOpen(true);
                        await sendOtp();
                      }}
                    >
                      Reject 
                    </button>
                  </>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedRequest(null);
                    setTotalCost(null);
                  }}
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
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Enter OTP to {otpAction === "forward" ? "forward" : "reject"} request
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setOtpModalOpen(false);
                    setOtpValue("");
                    setOtpSent(false);
                    setOtpAction(null);
                    setRejectionMessage("");
                  }}
                  disabled={otpLoading}
                >
                  <MdOutlineClose />
                </button>
              </div>
              <div className="modal-body">
                <p>
                  Enter the OTP code sent to your phone number.
                </p>
                <input
                  type="text"
                  className="form-control"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) =>
                    setOtpValue(e.target.value.replace(/\D/g, ""))
                  }
                  disabled={otpLoading}
                  placeholder="Enter OTP"
                />
                {otpAction === "reject" && (
                  <textarea
                    className="form-control mt-3"
                    rows={2}
                    value={rejectionMessage}
                    onChange={(e) => setRejectionMessage(e.target.value)}
                    placeholder="Reason for rejection"
                    disabled={otpLoading}
                  />
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-link"
                  onClick={() => sendOtp()}
                  disabled={otpLoading}
                >
                  Resend OTP
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setOtpModalOpen(false);
                    setOtpValue("");
                    setOtpSent(false);
                    setOtpAction(null);
                    setRejectionMessage("");
                  }}
                  disabled={otpLoading}
                >
                  Cancel
                </button>
                <button
                  className={`btn ${
                    otpAction === "forward" ? "btn-primary" : "btn-danger"
                  }`}
                  disabled={otpLoading || otpValue.length !== 6}
                  onClick={() => handleOtpAction(otpValue, otpAction)}
                >
                  {otpLoading
                    ? "Processing..."
                    : otpAction === "forward"
                    ? "Forward"
                    : "Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Fuel Cost Update Modal */}
      {showFuelCostModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Update Fuel Costs</h4>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowFuelCostModal(false)}
                >
                  <MdOutlineClose />
                </button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="fuelType" className="form-label">
                    Select Fuel Type
                  </label>
                  <select
                    id="fuelType"
                    className="form-select"
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="fuelCost" className="form-label">
                    {fuelType} Cost (per liter)
                  </label>
                  <input
                    type="number"
                    id="fuelCost"
                    className="form-control"
                    value={fuelCost}
                    onChange={(e) => setFuelCost(e.target.value)}
                    placeholder={`Enter ${fuelType.toLowerCase()} cost`}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowFuelCostModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleFuelCostUpdate}
                >
                  Update Cost
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TMRefuelingTable;