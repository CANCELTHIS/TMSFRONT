import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify"; // For toast messages
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/Logo.jpg"; // Import the logo image
import { IoMdClose } from "react-icons/io";
import { ENDPOINTS } from "../utilities/endpoints";
import CustomPagination from "./CustomPagination";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { IoClose } from "react-icons/io5";
import { useLanguage } from "../context/LanguageContext";
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
  const { mylanguage } = useLanguage(); // Use the language context
  const accessToken = localStorage.getItem("authToken");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpAction, setOtpAction] = useState(null); // "forward", "approve", "reject"
  const [otpSent, setOtpSent] = useState(false);

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
      // Fetch high-cost requests
      const highCostRequests = await fetchHighCostRequests();

      // Add a "requestType" property to high-cost requests
      const highCostRequestsWithLabel = highCostRequests.map((request) => ({
        ...request,
        requestType: "High Cost", // Label as high-cost
      }));

      console.log("High-Cost Requests:", highCostRequestsWithLabel); // Debugging log
      setRequests(highCostRequestsWithLabel); // Set high-cost requests to state
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
      setUsers(data.results || []); // Set users data
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

      if (!response.ok)
        throw new Error("Failed to fetch high-cost transport requests");

      const data = await response.json();
      console.log("High-Cost Requests:", data.results); // Debugging log
      return data.results || []; // Return fetched high-cost requests
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
      setAvailableVehicles(data.results || []); // Set available vehicles
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

      if (!response.ok)
        throw new Error("Failed to fetch high-cost request details");

      const data = await response.json();
      setSelectedRequest(data); // Set the fetched data to state
    } catch (error) {
      console.error("Fetch High-Cost Details Error:", error);
      toast.error("Failed to fetch high-cost request details.");
    }
  };
  // Get employee names from IDs
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
  };

  const handleApproveReject = async (action) => {
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }

    try {
      const response = await fetch(
        ENDPOINTS.APPREJ_HIGHCOST_REQUEST(selectedRequest.id),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: action, // "forward" or "reject"
            rejection_message:
              action === "reject" ? rejectionReason : undefined, // Include rejection reason if rejecting
          }),
        }
      );

      if (!response.ok) throw new Error(`Failed to ${action} request`);

      toast.success(
        `Request ${
          action === "forward" ? "forwarded" : "rejected"
        } successfully!`
      );
      setSelectedRequest(null); // Close the modal
      fetchRequests(); // Refresh the list of requests
    } catch (error) {
      console.error(
        `${action === "forward" ? "Forward" : "Reject"} Error:`,
        error
      );
      toast.error(`Failed to ${action} request.`);
    }
  };

  const estimateCost = async () => {
    if (!selectedVehicleId || !fuelPrice || !estimatedDistance) {
      toast.error("Please provide all required inputs.");
      return;
    }

    try {
      const response = await fetch(
        ENDPOINTS.ESTIMATE_HIGH_COST(selectedRequest.id),
        {
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
        }
      );

      if (!response.ok) throw new Error("Failed to estimate cost");

      toast.success("Cost estimated successfully!");
      setShowEstimateModal(false); // Close the estimate modal
      fetchHighCostDetails(selectedRequest.id); // Refresh details in the first modal
      setIsCostCalculated(true); // Mark cost as calculated
    } catch (error) {
      console.error("Estimate Cost Error:", error);
      toast.error("Failed to estimate cost.");
    }
  };

  const assignVehicle = async () => {
    try {
      const response = await fetch(
        ENDPOINTS.ASSIGN_VEHICLE(selectedRequest.id),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        const errorMessage =
          JSON.parse(errorText).error || "Failed to assign vehicle.";
        toast.error(errorMessage);
        return;
      }

      toast.success("Vehicle assigned successfully!");
      fetchHighCostDetails(selectedRequest.id); // Refresh details
    } catch (error) {
      console.error("Assign Vehicle Error:", error);
      toast.error("Failed to assign vehicle.");
    }
  };

  // Send OTP using backend endpoint
  const sendOtp = async () => {
    setOtpLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(ENDPOINTS.OTP_REQUEST, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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

  // Handle OTP verification and action (forward, approve, reject)
  const handleOtpAction = async (otp, action) => {
    setOtpLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      let payload = { action, otp_code: otp };
      if (action === "reject") {
        if (!rejectionReason.trim()) {
          toast.error("Rejection message cannot be empty.");
          setOtpLoading(false);
          return;
        }
        payload.rejection_message = rejectionReason;
      }

      const response = await fetch(
        ENDPOINTS.APPREJ_HIGHCOST_REQUEST(selectedRequest.id),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || `Failed to ${action} request`);
      }

      toast.success(
        action === "approve"
          ? "Request approved!"
          : action === "forward"
          ? "Request forwarded!"
          : "Request rejected!"
      );

      setSelectedRequest(null);
      setOtpModalOpen(false);
      setOtpValue("");
      setOtpSent(false);
      setOtpAction(null);
      setRejectionReason("");
      fetchRequests();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageRequests = requests.slice(startIndex, endIndex);

  return (
    <div
      className="container mt-4"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}
    >
      <ToastContainer />
      {loading ? (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">
              {mylanguage === "EN" ? "Loading data..." : "በመጫን ላይ..."}
            </span>
          </div>
        </div>
      ) : (
        <div
          className="table-responsive"
          style={{ width: "100%", overflowX: "auto" }}
        >
          <table className="table table-hover align-middle">
            <thead className="table">
              <tr>
                <th>#</th>
                <th>{mylanguage === "EN" ? "Start Day" : "የመጀመሪያ ቀን"}</th>
                <th>{mylanguage === "EN" ? "Start Time" : "የመጀመሪያ ሰዓት"}</th>
                <th>{mylanguage === "EN" ? "Return Day" : "የመመለሻ ቀን"}</th>
                <th>{mylanguage === "EN" ? "Destination" : "መድረሻ"}</th>
                <th>{mylanguage === "EN" ? "Request Type" : "የጥያቄ አይነት"}</th>
                <th>{mylanguage === "EN" ? "Status" : "ሁኔታ"}</th>
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
                        {mylanguage === "EN" ? "View Detail" : "ዝርዝር ይመልከቱ"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    {mylanguage === "EN"
                      ? "No transport requests found."
                      : "ምንም የትራንስፖርት ጥያቄዎች አልተገኙም።"}
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
          totalPages={Math.ceil(requests.length / itemsPerPage)}
          handlePageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {selectedRequest && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className="modal-dialog"
            style={{
              width: "90%",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
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
                      ? "Estimate Cost and Assign Vehicle"
                      : "ወጪ ይቅዱና ተሽከርካሪ ይመድቡ"}
                  </h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDetail}
                >
                  <IoClose size={30} />
                </button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>
                    {mylanguage === "EN" ? "Requester:" : "ጠየቀው ሰው:"}
                  </strong>{" "}
                  {selectedRequest.requester}
                </p>
                <p>
                  <strong>
                    {mylanguage === "EN" ? "Employees:" : "ሰራተኞች:"}
                  </strong>{" "}
                  {selectedRequest.employees?.join(", ") ||
                    (mylanguage === "EN" ? "N/A" : "አልተገኙም")}
                </p>
                <p>
                  <strong>
                    {mylanguage === "EN" ? "Start Day:" : "የመጀመሪያ ቀን:"}
                  </strong>{" "}
                  {selectedRequest.start_day}
                </p>
                <p>
                  <strong>
                    {mylanguage === "EN" ? "Return Day:" : "የመመለሻ ቀን:"}
                  </strong>{" "}
                  {selectedRequest.return_day}
                </p>
                <p>
                  <strong>
                    {mylanguage === "EN" ? "Destination:" : "መድረሻ:"}
                  </strong>{" "}
                  {selectedRequest.destination}
                </p>
                <p>
                  <strong>{mylanguage === "EN" ? "Reason:" : "ምክንያት:"}</strong>{" "}
                  {selectedRequest.reason}
                </p>

                {/* Display cost details if available */}
                {isCostCalculated && (
                  <>
                    <p>
                      <strong>
                        {mylanguage === "EN"
                          ? "Estimated Vehicle:"
                          : "ተገመተው የተመደበ ተሽከርካሪ:"}
                      </strong>{" "}
                      {selectedRequest.estimated_vehicle}
                    </p>
                    <p>
                      <strong>
                        {mylanguage === "EN"
                          ? "Estimated Distance (km):"
                          : "ተገመተው ርቀት (ኪ.ሜ):"}
                      </strong>{" "}
                      {selectedRequest.estimated_distance_km}
                    </p>
                    <p>
                      <strong>
                        {mylanguage === "EN"
                          ? "Fuel Price per Liter:"
                          : "የነዳጅ ዋጋ በሊትር:"}
                      </strong>{" "}
                      {selectedRequest.fuel_price_per_liter}
                    </p>
                    <p>
                      <strong>
                        {mylanguage === "EN"
                          ? "Fuel Needed (Liters):"
                          : "የሚያስፈልገው ነዳጅ (ሊትር):"}
                      </strong>{" "}
                      {selectedRequest.fuel_needed_liters}
                    </p>
                    <p>
                      <strong>
                        {mylanguage === "EN" ? "Total Cost:" : "ጠቅላላ ወጪ:"}
                      </strong>{" "}
                      {selectedRequest.total_cost} ETB
                    </p>
                  </>
                )}
              </div>

              <div className="modal-footer">
                {/* Conditionally render buttons based on status and cost calculation */}
                {selectedRequest.status === "forwarded" &&
                  !isCostCalculated && (
                    <Button
                      style={{
                        color: "#ffffff",
                        backgroundColor: "#1976d2",
                        width: "150px",
                      }}
                      onClick={() => setShowEstimateModal(true)}
                    >
                      {mylanguage === "EN" ? "Estimate Cost" : "ወጪ ይቅዱ"}
                    </Button>
                  )}

                {selectedRequest.status === "forwarded" && isCostCalculated && (
                  <Stack direction="row" spacing={2}>
                    <Button
                      style={{ color: "#ffffff", backgroundColor: "#1976d2" }}
                      onClick={async () => {
                        setOtpAction("forward");
                        setOtpModalOpen(true);
                        await sendOtp();
                      }}
                    >
                      {mylanguage === "EN" ? "Forward" : "ወደ ፊት ያስቀምጡ"}
                    </Button>
                    <Button
                      style={{ color: "#ffffff", backgroundColor: "#d32f2f" }}
                      onClick={async () => {
                        setOtpAction("reject");
                        setOtpModalOpen(true);
                        await sendOtp();
                      }}
                    >
                      {mylanguage === "EN" ? "Reject" : "አትቀበሉ"}
                    </Button>
                    <Button
                      style={{ color: "#ffffff", backgroundColor: "#ffa726" }}
                      onClick={() => setShowEstimateModal(true)}
                    >
                      {mylanguage === "EN" ? "Recalculate" : "ዳግም ይቅዱ"}
                    </Button>
                  </Stack>
                )}

                {selectedRequest.status === "approved" && (
                  <Button
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#4caf50",
                      width: "150px",
                    }}
                    onClick={async () => {
                      setOtpAction("approve");
                      setOtpModalOpen(true);
                      await sendOtp();
                    }}
                  >
                    {mylanguage === "EN" ? "Assign Vehicle" : "ተሽከርካሪ ይመድቡ"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showEstimateModal && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {mylanguage === "EN" ? "Estimate Cost" : "ወጪ ይቅዱ"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowEstimateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="vehicleSelect" className="form-label">
                    {mylanguage === "EN" ? "Select Vehicle" : "ተሽከርካሪ ይምረጡ"}
                  </label>
                  <select
                    id="vehicleSelect"
                    className="form-select"
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                  >
                    <option value="">
                      {mylanguage === "EN" ? "Select a vehicle" : "ተሽከርካሪ ይምረጡ"}
                    </option>
                    {availableVehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.model} - {vehicle.license_plate}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="fuelPrice" className="form-label">
                    {mylanguage === "EN"
                      ? "Fuel Price per Liter"
                      : "የነዳጅ ዋጋ በሊትር"}
                  </label>
                  <input
                    id="fuelPrice"
                    type="number"
                    className="form-control"
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="estimatedDistance" className="form-label">
                    {mylanguage === "EN"
                      ? "Estimated Distance (km)"
                      : "ተገመተው ርቀት (ኪ.ሜ)"}
                  </label>
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
                  <Button
                    style={{ color: "#ffffff", backgroundColor: "#1976d2" }}
                    onClick={estimateCost}
                  >
                    {mylanguage === "EN" ? "Calculate" : "አስላክ"}
                  </Button>
                  <Button
                    variant="outlined"
                    style={{ color: "#d32f2f", borderColor: "#d32f2f" }}
                    onClick={() => setShowEstimateModal(false)}
                  >
                    {mylanguage === "EN" ? "Close" : "ዝጋ"}
                  </Button>
                </Stack>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectionModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {mylanguage === "EN" ? "Reject Request" : "ጥያቄ አትቀበሉ"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRejectionModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="rejectionReason" className="form-label">
                    {mylanguage === "EN"
                      ? "Rejection Reason"
                      : "የመቀበል መክሰስ ምክንያት"}
                  </label>
                  <textarea
                    id="rejectionReason"
                    className="form-control"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder={
                      mylanguage === "EN"
                        ? "Provide a reason for rejection"
                        : "የመቀበል መክሰስ ምክንያት ያስገቡ"
                    }
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
                    {mylanguage === "EN" ? "Submit Rejection" : "መክሰስ ያስገቡ"}
                  </Button>
                  <Button
                    variant="outlined"
                    style={{ color: "#1976d2", borderColor: "#1976d2" }}
                    onClick={() => setShowRejectionModal(false)}
                  >
                    {mylanguage === "EN" ? "Cancel" : "ይቅር"}
                  </Button>
                </Stack>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {mylanguage === "EN" ? "Confirm Rejection" : "መክሰስ ያረጋግጡ"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmation(false)}
                >
                  <IoMdClose size={30} />
                </button>
              </div>
              <div className="modal-body">
                <p>
                  {mylanguage === "EN"
                    ? "Are you sure you want to reject this request?"
                    : "ይህን ጥያቄ ለመክሰስ እርግጠኛ ነዎት?"}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmation(false)}
                >
                  {mylanguage === "EN" ? "Cancel" : "ይቅር"}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmAction}
                >
                  {mylanguage === "EN" ? "Confirm Rejection" : "መክሰስ ያረጋግጡ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showApproveConfirmation && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {mylanguage === "EN" ? "Confirm Approval" : "ማጽደቅ ያረጋግጡ"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowApproveConfirmation(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  {mylanguage === "EN"
                    ? "Are you sure you want to forward this request to the transport manager?"
                    : "ይህን ጥያቄ ወደ ትራንስፖርት አስተዳዳሪ ለመላክ እርግጠኛ ነዎት?"}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowApproveConfirmation(false)}
                >
                  {mylanguage === "EN" ? "Cancel" : "ይቅር"}
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConfirmApprove}
                >
                  {mylanguage === "EN" ? "Confirm Approval" : "ማጽደቅ ያረጋግጡ"}
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
                  Enter OTP and confirm{" "}
                  {otpAction === "approve"
                    ? "approval"
                    : otpAction === "forward"
                    ? "forward"
                    : "rejection"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setOtpModalOpen(false);
                    setOtpValue("");
                    setOtpSent(false);
                    setOtpAction(null);
                    setRejectionReason("");
                  }}
                  disabled={otpLoading}
                >
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                <p>Enter the OTP code sent to your phone number.</p>
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
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Reason for rejection"
                    disabled={otpLoading}
                  />
                )}
              </div>
              <div className="modal-footer">
                <Button
                  variant="text"
                  onClick={() => sendOtp()}
                  disabled={otpLoading}
                >
                  Resend OTP
                </Button>
                <Button
                  variant="contained"
                  style={{ backgroundColor: "#1976d2", color: "#fff" }}
                  disabled={otpLoading || otpValue.length !== 6}
                  onClick={() => handleOtpAction(otpValue, otpAction)}
                >
                  Confirm{" "}
                  {otpAction === "approve"
                    ? "Approval"
                    : otpAction === "forward"
                    ? "Forward"
                    : "Rejection"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setOtpModalOpen(false);
                    setOtpValue("");
                    setOtpSent(false);
                    setOtpAction(null);
                    setRejectionReason("");
                  }}
                  disabled={otpLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TMhighcostrequests;
