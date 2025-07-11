import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ENDPOINTS } from "../utilities/endpoints";
import { IoClose } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../assets/Logo.jpg";
import UnauthorizedPage from "./UnauthorizedPage";
import ServerErrorPage from "./ServerErrorPage";

const RefuelingTable = () => {
  const [refuelingRequests, setRefuelingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [errorType, setErrorType] = useState(null); // "unauthorized" | "server" | null

  // Fetches the list of requests
  const fetchRefuelingRequests = async () => {
    const accessToken = localStorage.getItem("authToken");

    if (!accessToken) {
      setErrorType("unauthorized");
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
      console.error("Error fetching refueling requests:", error);
      toast.error("Failed to fetch refueling requests.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch detail for a single request
  const fetchRequestDetail = async (id) => {
    const accessToken = localStorage.getItem("authToken");
    if (!accessToken) {
      setErrorType("unauthorized");
      return;
    }

    setDetailLoading(true);
    try {
      const response = await fetch(ENDPOINTS.REFUELING_REQUEST_DETAIL(id), {
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
        throw new Error("Failed to fetch refueling request detail");
      }
      const data = await response.json();
      setSelectedRequest(data);
    } catch (error) {
      console.error("Error fetching request details:", error);
      toast.error("Failed to fetch request details.");
    } finally {
      setDetailLoading(false);
    }
  };

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
              {refuelingRequests.map((request, index) => (
                <tr key={request.id}>
                  <td>{index + 1}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Viewing Details */}
      {selectedRequest && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              {/* Modal Header (not printed) */}
              <div className="modal-header d-print-none">
                <img
                  src={Logo}
                  alt="Logo"
                  style={{
                    width: "100px",
                    height: "70px",
                    marginRight: "10px",
                  }}
                />
                <h5 className="modal-title">Refueling Request Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedRequest(null)}
                >
                  <IoClose />
                </button>
              </div>
              <div className="modal-body">
                {/* Print header for print only */}
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
                    Refueling Request Details
                  </div>
                </div>
                {detailLoading ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading details...</p>
                  </div>
                ) : (
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <strong>Request Date:</strong>{" "}
                          {new Date(
                            selectedRequest.created_at
                          ).toLocaleString()}
                        </p>
                        <p>
                          <strong>Driver:</strong>{" "}
                          {selectedRequest.requester_name || "N/A"}
                        </p>
                        <p>
                          <strong>Vehicle:</strong>{" "}
                          {selectedRequest.requesters_car_name || "N/A"}
                        </p>
                        <p>
                          <strong>Destination:</strong>{" "}
                          {selectedRequest.destination || "N/A"}
                        </p>
                        <p>
                          <strong>Estimated Distance:</strong>{" "}
                          {selectedRequest.estimated_distance_km ?? "N/A"} km
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <strong>Fuel Type:</strong>{" "}
                          {selectedRequest.fuel_type || "N/A"}
                        </p>
                        <p>
                          <strong>Fuel Efficiency:</strong>{" "}
                          {selectedRequest.fuel_efficiency ?? "N/A"} km/L
                        </p>
                        <p>
                          <strong>Fuel Needed:</strong>{" "}
                          {selectedRequest.fuel_needed_liters ?? "N/A"} L
                        </p>
                        <p>
                          <strong>Fuel Price per Liter:</strong>{" "}
                          {selectedRequest.fuel_price_per_liter ?? "N/A"}
                        </p>
                        <p>
                          <strong>Total Cost:</strong>{" "}
                          {selectedRequest.total_cost ?? "N/A"}
                        </p>
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
                )}
              </div>
              <div className="modal-footer d-print-none">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => window.print()}
                >
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

export default RefuelingTable;
