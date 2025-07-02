import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/Logo.jpg";
import { IoMdClose } from "react-icons/io";
import { ENDPOINTS } from "../utilities/endpoints";
import CustomPagination from "./CustomPagination";
import UnauthorizedPage from "./UnauthorizedPage";
import ServerErrorPage from "./ServerErrorPage";

const FIHighCost = () => {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showApproveConfirmation, setShowApproveConfirmation] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [errorType, setErrorType] = useState(null); // "unauthorized" | "server" | null

  const printDetailRef = useRef();

  const accessToken = localStorage.getItem("authToken");
  useEffect(() => {
    fetchRequests();
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchRequests = async () => {
    if (!accessToken) {
      setErrorType("unauthorized");
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
      if (error.message && error.message.toLowerCase().includes("401")) {
        setErrorType("unauthorized");
      } else {
        setErrorType("server");
      }
      console.error("Fetch Requests Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!accessToken) {
      setErrorType("unauthorized");
      return;
    }
    try {
      const response = await fetch(ENDPOINTS.USER_LIST, {
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
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.results || []);
    } catch (error) {
      console.error("Fetch Users Error:", error);
    }
  };

  const fetchHighCostRequests = async () => {
    if (!accessToken) {
      setErrorType("unauthorized");
      return [];
    }
    try {
      const response = await fetch(ENDPOINTS.HIGH_COST_LIST, {
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
        throw new Error("Failed to fetch high-cost transport requests");
      }
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Fetch High-Cost Requests Error:", error);
      return [];
    }
  };

  const fetchHighCostDetail = async (requestId) => {
    if (!accessToken) {
      setErrorType("unauthorized");
      return;
    }
    try {
      const response = await fetch(ENDPOINTS.HIGH_COST_DETAIL(requestId), {
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
        throw new Error("Failed to fetch high-cost request details");
      }
      const data = await response.json();
      setSelectedRequest(data);
    } catch (error) {
      console.error("Error fetching high-cost request details:", error);
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
    fetchHighCostDetail(request.id);
  };

  const handleCloseDetail = () => {
    setSelectedRequest(null);
    setRejectionReason("");
    setShowRejectionModal(false);
    setShowConfirmation(false);
    setShowApproveConfirmation(false);
  };

  const handleApprove = async (requestId) => {
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
    try {
      const response = await fetch(
        ENDPOINTS.APPREJ_HIGHCOST_REQUEST(requestId),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "approve",
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to approve transport request");
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: "approved" } : req
        )
      );
      setSelectedRequest(null);
      toast.success("Request approved successfully!");
    } catch (error) {
      console.error("Approve Error:", error);
      toast.error("Failed to approve request.");
    }
  };

  const handleReject = async (requestId) => {
    if (!accessToken) {
      console.error("No access token found.");
      return;
    }
    if (!rejectionReason) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    try {
      const response = await fetch(
        ENDPOINTS.APPREJ_HIGHCOST_REQUEST(requestId),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "reject",
            rejection_message: rejectionReason,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to reject transport request");
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: "rejected" } : req
        )
      );
      setSelectedRequest(null);
      setRejectionReason("");
      setShowRejectionModal(false);
      toast.success("Request rejected successfully!");
    } catch (error) {
      console.error("Reject Error:", error);
      toast.error("Failed to reject request.");
    }
  };

  const handleRejectClick = () => setShowRejectionModal(true);

  const handleConfirmReject = () => setShowConfirmation(true);

  const handleConfirmAction = () => {
    handleReject(selectedRequest.id);
    setShowConfirmation(false);
  };

  const handleApproveClick = () => setShowApproveConfirmation(true);

  const handleConfirmApprove = () => {
    handleApprove(selectedRequest.id);
    setShowApproveConfirmation(false);
  };

  // Print handler for detail view
  const handlePrintDetail = () => {
    window.print();
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageRequests = requests.slice(startIndex, endIndex);

  if (errorType === "unauthorized") {
    return <UnauthorizedPage />;
  }
  if (errorType === "server") {
    return <ServerErrorPage />;
  }

  return (
    <div
      className="container mt-4"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}
    >
      <ToastContainer />
      {loading ? (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading data...</p>
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
                <th>Start Day</th>
                <th>Start Time</th>
                <th>Return Day</th>
                <th>Destination</th>
                <th>Request Type</th>
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
        <>
          {/* PRINTABLE DETAIL VIEW */}
          <div
            ref={printDetailRef}
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <img
                    src={Logo}
                    alt="Logo"
                    style={{
                      width: "100px",
                      height: "70px",
                      marginRight: "10px",
                    }}
                  />
                  <h5 className="modal-title">High-Cost Request Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseDetail}
                  >
                    <IoMdClose />
                  </button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(selectedRequest.created_at).toLocaleString()}
                  </p>
                  <p>
                    <strong>Updated At:</strong>{" "}
                    {new Date(selectedRequest.updated_at).toLocaleString()}
                  </p>
                  <p>
                    <strong>Requester:</strong> {selectedRequest.requester}
                  </p>
                  <p>
                    <strong>Destination:</strong> {selectedRequest.destination}
                  </p>
                  <p>
                    <strong>Employees:</strong>{" "}
                    {selectedRequest.employees.join(", ")}
                  </p>
                  <p>
                    <strong>Estimated Distance (km):</strong>{" "}
                    {selectedRequest.estimated_distance_km}
                  </p>
                  <p>
                    <strong>Estimated Vehicle:</strong>{" "}
                    {selectedRequest.estimated_vehicle}
                  </p>
                  <p>
                    <strong>Fuel Needed (liters):</strong>{" "}
                    {selectedRequest.fuel_needed_liters}
                  </p>
                  <p>
                    <strong>Fuel Price Per Liter:</strong>{" "}
                    {selectedRequest.fuel_price_per_liter}
                  </p>
                  <p>
                    <strong>Total Cost:</strong> {selectedRequest.total_cost}
                  </p>
                  <p>
                    <strong>Start Day:</strong> {selectedRequest.start_day}
                  </p>
                  <p>
                    <strong>Start Time:</strong> {selectedRequest.start_time}
                  </p>
                  <p>
                    <strong>Return Day:</strong> {selectedRequest.return_day}
                  </p>
                  <p>
                    <strong>Vehicle:</strong> {selectedRequest.vehicle}
                  </p>
                  {/* Print Button (screen only) */}
                  <div className="mt-3 d-print-none text-end">
                    <button
                      className="btn btn-primary"
                      onClick={handlePrintDetail}
                    >
                      Print
                    </button>
                  </div>
                  {/* Signature section for print only */}
                  <div
                    className="d-none d-print-block mt-5"
                    style={{ width: "100%" }}
                  >
                    <div style={{ marginTop: "60px", textAlign: "center" }}>
                      <div>Signature</div>
                      <div
                        style={{
                          borderBottom: "1px solid #000",
                          margin: "40px auto 0 auto",
                          width: "300px",
                        }}
                      ></div>
                      <div style={{ marginTop: "10px" }}>
                        (Signature & Date)
                      </div>
                    </div>
                  </div>
                  {/* Logo for print only, centered above */}
                  <div className="d-none d-print-block text-center mb-3">
                    <img
                      src={Logo}
                      alt="Logo"
                      style={{ width: "150px", height: "100px" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showRejectionModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(184, 113, 113, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Request</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRejectionModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="rejectionReason" className="form-label">
                    Rejection Reason
                  </label>
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
                  onClick={handleConfirmReject}
                >
                  Submit Rejection
                </button>
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
                <h5 className="modal-title">Confirm Rejection</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmation(false)}
                >
                  <IoMdClose size={30} />
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to reject this request?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmAction}
                >
                  Confirm Rejection
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
                <h5 className="modal-title">Confirm Approval</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowApproveConfirmation(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to Approve This request?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowApproveConfirmation(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConfirmApprove}
                >
                  Confirm Approval
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Print styles for cleaner printout */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .modal-content, .modal-content * {
            visibility: visible;
          }
          .modal-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            background: white;
            box-shadow: none;
            border: none;
          }
          .btn, .pagination, .modal-footer, .Toastify__toast-container, .btn-close, .d-print-none {
            display: none !important;
          }
          .d-print-block {
            display: block !important;
          }
        }
        @page {
          size: auto;
          margin: 20mm;
        }
      `}</style>
    </div>
  );
};

export default FIHighCost;
