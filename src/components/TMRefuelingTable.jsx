import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ENDPOINTS } from "../utilities/endpoints";
import { MdOutlineClose } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomPagination from "./CustomPagination";
import UnauthorizedPage from "./UnauthorizedPage";
import ServerErrorPage from "./ServerErrorPage";
import { FaGasPump, FaSearch, FaSync, FaCheck, FaTimes } from "react-icons/fa";

const TMRefuelingTable = () => {
  const [refuelingRequests, setRefuelingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionMessage, setRejectionMessage] = useState("");

  // OTP-related states
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpAction, setOtpAction] = useState(null); // "forward" or "reject"

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" });

  const totalPages = Math.ceil(refuelingRequests.length / itemsPerPage);

  const [errorType, setErrorType] = useState(null); // "unauthorized" | "server" | null

  // Fetch refueling requests
  const fetchRefuelingRequests = async () => {
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      setErrorType("unauthorized");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(ENDPOINTS.REFUELING_REQUEST_LIST, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          setErrorType("unauthorized");
        } else {
          setErrorType("server");
        }
        throw new Error("Failed to fetch refueling requests");
      }
      const data = await response.json();
      setRefuelingRequests(data.results || []);
    } catch (error) {
      setErrorType("server");
      console.error("Error fetching refueling requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch request detail
  const fetchRequestDetail = async (requestId) => {
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      setErrorType("unauthorized");
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
        if (response.status === 401) {
          setErrorType("unauthorized");
        } else {
          setErrorType("server");
        }
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
        if (vehicleResponse.status === 401) {
          setErrorType("unauthorized");
        } else {
          setErrorType("server");
        }
        throw new Error("Failed to fetch vehicle details");
      }
      const vehicleData = await vehicleResponse.json();
      requestData.driver_name = vehicleData.driver_name;
      requestData.fuel_efficiency = parseFloat(vehicleData.fuel_efficiency);
      setSelectedRequest(requestData);
    } catch (error) {
      setErrorType("server");
      console.error("Error fetching refueling request details:", error);
      toast.error("Failed to fetch request details.");
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
        throw new Error(data.detail || `Failed to ${action} refueling request`);
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

  // Search, filter, and sort logic
  const filterRequests = () => {
    let filtered = refuelingRequests;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          (r.destination && r.destination.toLowerCase().includes(term)) ||
          (r.requester_name && r.requester_name.toLowerCase().includes(term)) ||
          (r.status && r.status.toLowerCase().includes(term)) ||
          (r.id && r.id.toString().includes(term))
      );
    }
    return filtered;
  };
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSearch className="text-muted ms-1" />;
    return sortConfig.direction === "asc" ? (
      <FaCheck className="text-primary ms-1" />
    ) : (
      <FaTimes className="text-primary ms-1" />
    );
  };
  const getSortedRequests = (requests) => {
    if (!sortConfig.key) return requests;
    return [...requests].sort((a, b) => {
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const filteredRequests = getSortedRequests(filterRequests());
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    fetchRefuelingRequests();
  }, []);

  if (errorType === "unauthorized") {
    return <UnauthorizedPage />;
  }
  if (errorType === "server") {
    return <ServerErrorPage />;
  }

  return (
    <div className="container py-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-0 d-flex align-items-center">
            <FaGasPump className="me-2 text-success" />
            Refueling Requests
          </h1>
        </div>
        <div className="d-flex gap-2">
          <div className="input-group shadow-sm" style={{ maxWidth: "300px" }}>
            <span className="input-group-text bg-white border-end-0">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn btn-outline-success d-flex align-items-center"
            onClick={fetchRefuelingRequests}
            disabled={loading}
          >
            <FaSync className={loading ? "me-2 spin" : "me-2"} />
            Refresh
          </button>
        </div>
      </div>
      <div className="card shadow-sm border-0 overflow-hidden">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th onClick={() => handleSort("created_at")} className="cursor-pointer">
                    <div className="d-flex align-items-center">
                      Date{getSortIcon("created_at")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("destination")} className="cursor-pointer">
                    <div className="d-flex align-items-center">
                      Destination{getSortIcon("destination")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("requester_name")} className="cursor-pointer">
                    <div className="d-flex align-items-center">
                      Driver{getSortIcon("requester_name")}
                    </div>
                  </th>
                  <th onClick={() => handleSort("status")} className="cursor-pointer">
                    <div className="d-flex align-items-center">
                      Status{getSortIcon("status")}
                    </div>
                  </th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="spinner-border text-success" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="ms-3">Loading refueling requests...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentRequests.length > 0 ? (
                  currentRequests.map((request, index) => (
                    <tr key={request.id}>
                      <td>{startIndex + index + 1}</td>
                      <td>{new Date(request.created_at).toLocaleDateString()}</td>
                      <td>{request.destination || "N/A"}</td>
                      <td>{request.requester_name || "N/A"}</td>
                      <td>
                        <span className={`badge ${
                          request.status === "pending"
                            ? "bg-warning text-dark"
                            : request.status === "approved"
                            ? "bg-success"
                            : request.status === "rejected"
                            ? "bg-danger"
                            : "bg-secondary"
                        } py-2 px-3`}>
                          {request.status
                            ? request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)
                            : ""}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-success d-flex align-items-center"
                          onClick={() => fetchRequestDetail(request.id)}
                        >
                          <FaSearch className="me-1" />
                          View Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-5">
                      <div className="py-4">
                        <FaGasPump className="fs-1 text-muted mb-3" />
                        <p className="mb-1 fw-medium fs-5">
                          {searchTerm
                            ? "No requests match your search"
                            : "No refueling requests found."}
                        </p>
                        <small className="text-muted">
                          {searchTerm
                            ? "Try adjusting your search term"
                            : "Check back later"}
                        </small>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-white d-flex justify-content-between align-items-center py-3 border-0">
          <div className="text-muted small">
            Showing{" "}
            <span className="fw-medium">{filteredRequests.length}</span>{" "}
            requests
            <span>
              {" "}
              of{" "}
              <span className="fw-medium">{refuelingRequests.length}</span>
            </span>
          </div>
          <div className="d-flex gap-2">
            {searchTerm && (
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Pagination */}
      {filteredRequests.length > itemsPerPage && (
        <div className="d-flex justify-content-center mt-4">
          <CustomPagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredRequests.length / itemsPerPage)}
            handlePageChange={setCurrentPage}
          />
        </div>
      )}
      {/* Modal for Viewing Details */}
      {selectedRequest && (
        <div
          className="modal fade show d-block"
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
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Enter OTP to {otpAction === "forward" ? "forward" : "reject"}{" "}
                  request
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
                        // Move to next input if not last
                        if (val && idx < 5) {
                          const next = document.getElementById(
                            `otp-input-${idx + 1}`
                          );
                          if (next) next.focus();
                        }
                        setOtpValue(newOtp.join("").slice(0, 6));
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Backspace" &&
                          !otpValue[idx] &&
                          idx > 0
                        ) {
                          const prev = document.getElementById(
                            `otp-input-${idx - 1}`
                          );
                          if (prev) prev.focus();
                        }
                      }}
                      id={`otp-input-${idx}`}
                      disabled={otpLoading}
                    />
                  ))}
                </div>
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
      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .card {
          border-radius: 1rem;
          overflow: hidden;
        }
        .table th {
          background-color: #f8fafc;
          border-top: 1px solid #e9ecef;
          border-bottom: 2px solid #e9ecef;
        }
      `}</style>
    </div>
  );
};

export default TMRefuelingTable;