import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ENDPOINTS } from "../utilities/endpoints";
import { IoClose } from "react-icons/io5";
import CustomPagination from "./CustomPagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/Logo.jpg"; // Import your logo here
import UnauthorizedPage from "./UnauthorizedPage";
import ServerErrorPage from "./ServerErrorPage";

const FinanceMaintenanceTable = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorType, setErrorType] = useState(null); // "unauthorized" | "server" | null

  const itemsPerPage = 5;
  const printDetailRef = useRef();

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageRequests = maintenanceRequests.slice(startIndex, endIndex);

  // Fetch maintenance requests
  const fetchMaintenanceRequests = async () => {
    const accessToken = localStorage.getItem("authToken");

    if (!accessToken) {
      setErrorType("unauthorized");
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
        if (response.status === 401) {
          setErrorType("unauthorized");
        } else {
          setErrorType("server");
        }
        throw new Error("Failed to fetch maintenance requests");
      }

      const data = await response.json();
      setMaintenanceRequests(data.results || []);
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
      toast.error("Failed to fetch maintenance requests.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintDetail = () => {
    window.print();
  };

  useEffect(() => {
    fetchMaintenanceRequests();
  }, []);

  if (errorType === "unauthorized") {
    return <UnauthorizedPage />;
  }
  if (errorType === "server") {
    return <ServerErrorPage />;
  }

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center mb-4">Maintenance Requests</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading maintenance requests...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Requester Name</th>
                <th>Requester's Car</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentPageRequests.map((request, index) => (
                <tr key={request.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
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
                      View Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CustomPagination
        currentPage={currentPage}
        totalPages={Math.ceil(maintenanceRequests.length / itemsPerPage)}
        handlePageChange={(page) => setCurrentPage(page)}
      />

      {/* Modal for Viewing Details */}
      {selectedRequest && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              {/* Print Logo and Title - Only Visible in Print */}
              <div className="modal-header d-print-none">
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
                  <h5 className="modal-title">Maintenance Request</h5>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedRequest(null)}
                >
                  <IoClose />
                </button>
              </div>
              <div className="modal-body" ref={printDetailRef}>
                {/* Print logo and title for print only */}
                <div className="d-none d-print-block text-center mb-3">
                  <img
                    src={Logo}
                    alt="Logo"
                    style={{ width: "150px", height: "100px" }}
                  />
                  <div
                    style={{
                      marginTop: "10px",
                      fontWeight: "bold",
                      fontSize: "1.3rem",
                    }}
                  >
                    Maintenance Request Details
                  </div>
                </div>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-6">
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(selectedRequest.date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Reason:</strong> {selectedRequest.reason}
                      </p>
                      <p>
                        <strong>Requester Name:</strong>{" "}
                        {selectedRequest.requester_name}
                      </p>
                      <p>
                        <strong>Requester's Car:</strong>{" "}
                        {selectedRequest.requesters_car_name}
                      </p>
                      <p>
                        <strong>Status:</strong> {selectedRequest.status}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Current Approver Role:</strong>{" "}
                        {selectedRequest.current_approver_role}
                      </p>
                      <p>
                        <strong>Maintenance Total Cost:</strong>{" "}
                        {selectedRequest.maintenance_total_cost} ETB
                      </p>
                      <p>
                        <strong>Maintenance Letter:</strong>{" "}
                        <a
                          href={selectedRequest.maintenance_letter}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Maintenance Letter
                        </a>
                      </p>
                      <p>
                        <strong>Receipt File:</strong>{" "}
                        <a
                          href={selectedRequest.receipt_file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Receipt
                        </a>
                      </p>
                      <p>
                        <strong>Rejection Message:</strong>{" "}
                        {selectedRequest.rejection_message || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Signature section for print only */}
                <div
                  className="d-none d-print-block mt-5"
                  style={{ width: "100%" }}
                >
                  <div className="row" style={{ marginTop: "60px" }}>
                    <div className="col-4 text-center">
                      <div>Requested By</div>
                      <div
                        style={{
                          borderBottom: "1px solid #000",
                          margin: "40px auto 0 auto",
                          width: "180px",
                        }}
                      ></div>
                      <div style={{ marginTop: "10px" }}>(Signature & Date)</div>
                    </div>
                    <div className="col-4 text-center">
                      <div>Checked By</div>
                      <div
                        style={{
                          borderBottom: "1px solid #000",
                          margin: "40px auto 0 auto",
                          width: "180px",
                        }}
                      ></div>
                      <div style={{ marginTop: "10px" }}>(Signature & Date)</div>
                    </div>
                    <div className="col-4 text-center">
                      <div>Approved By</div>
                      <div
                        style={{
                          borderBottom: "1px solid #000",
                          margin: "40px auto 0 auto",
                          width: "180px",
                        }}
                      ></div>
                      <div style={{ marginTop: "10px" }}>(Signature & Date)</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer d-print-none">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </button>
                <button className="btn btn-primary" onClick={handlePrintDetail}>
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Print styles for detail modal */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .modal-content, .modal-content * {
            visibility: visible !important;
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
          .btn, .pagination, .modal-footer, .Toastify__toast-container, .btn-close, .d-print-none, .modal-header.d-print-none {
            display: none !important;
          }
          .d-print-block {
            display: block !important;
          }
          /* Hide Vite/React print footer if present */
          [data-testid="vite-react-info"], .vite-powered, .vite-react-footer {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FinanceMaintenanceTable;
