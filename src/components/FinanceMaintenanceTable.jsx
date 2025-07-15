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
      console.log("main",data);
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
              {/* Modal Header */}
              <div className="modal-header d-print-none">
                <div className="d-flex ">
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
              {/* Modal Body */}
              <div className="modal-body" ref={printDetailRef}>
                {/* Print-only Amharic content */}
                <div className="d-none d-print-block" style={{ textAlign: "center" }}>
                  <img
                    src={Logo}
                    alt="Logo"
                    style={{ width: "150px", height: "100px", display: "block", margin: "0 auto 0px auto" }}
                  />
                  
                  <div style={{ display: "flex", justifyContent: "start" }}>
                    <div style={{ textAlign: "left", minWidth: "350px" }}>
                      <p>
                        <strong>ቀን:</strong> {new Date(selectedRequest.date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>ምክንያት:</strong> {selectedRequest.reason}
                      </p>
                      <p>
                        <strong>የጠያቂው ስም:</strong> {selectedRequest.requester_name}
                      </p>
                      <p>
                        <strong>የጠያቂው መኪና:</strong> {selectedRequest.requesters_car_name}
                      </p>
                      <p>
                        <strong>የጥገና ጠቅላላ ወጪ:</strong> {selectedRequest.maintenance_total_cost} ብር
                      </p>
                    </div>
                  </div>
                  {/* Signature section for print only */}
                  <div className="mt-5" style={{ width: "100%", textAlign: "center" }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} style={{ marginBottom: "30px", display: "flex", justifyContent: "center", alignItems: "center", gap: "40px" }}>
                        <div style={{ fontWeight: "bold", minWidth: "220px", textAlign: "left" ,marginLeft: "50px"}}>
                          {i === 1 && "የጠያቂው ክፍል ሰራተኛ"}
                          {i === 2 && "የደገፈው ሃላፊ "}
                          {i === 3 && "ያፀደቀው ኃላፊ "}
                        </div>
                        <div>
                          <span>ስም:</span>
                          <div
                            style={{
                              borderBottom: "1px solid #000",
                              width: "120px",
                              height: "24px",
                              margin: "0 0 0 10px",
                              display: "inline-block",
                              verticalAlign: "middle",
                            }}
                          ></div>
                        </div>
                        <div>
                          <span>ፊርማ:</span>
                          <div
                            style={{
                              borderBottom: "1px solid #000",
                              width: "120px",
                              height: "24px",
                              margin: "0 0 0 10px",
                              display: "inline-block",
                              verticalAlign: "middle",
                            }}
                          ></div>
                        </div>
                        <div>
                          <span>ቀን:</span>
                          <div
                            style={{
                              borderBottom: "1px solid #000",
                              width: "80px",
                              height: "24px",
                              margin: "0 0 0 10px",
                              display: "inline-block",
                              verticalAlign: "middle",
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Normal view detail content (English, not print) */}
                <div className="d-print-none">
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
                      </div>
                      <div className="col-md-6">
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
                      </div>
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
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 700px !important;
            max-width: 95vw !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .btn, .pagination, .modal-footer, .Toastify__toast-container, .btn-close, .d-print-none, .modal-header.d-print-none {
            display: none !important;
          }
          .d-print-block {
            display: block !important;
            text-align: center !important;
            width: 100% !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .d-print-block * {
            text-align: left !important;
            margin-left: auto !important;
            margin-right: auto !important;
            font-family: "Noto Sans Ethiopic", "Arial", sans-serif !important;
          }
          .container-fluid, .row, .col-md-6 {
            width: 100% !important;
            display: block !important;
            text-align: left !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          p, div, img, h2, h5 {
            text-align: left !important;
            margin-left: auto !important;
            margin-right: auto !important;
            font-family: "Noto Sans Ethiopic", "Arial", sans-serif !important;
          }
          a {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FinanceMaintenanceTable;
