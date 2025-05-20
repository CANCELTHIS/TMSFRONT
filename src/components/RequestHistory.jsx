import React, { useState, useEffect } from "react";
import { ENDPOINTS } from "../utilities/endpoints";

const RequestHistory = () => {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [detailModal, setDetailModal] = useState({
    open: false,
    data: null,
    loading: false,
    error: null,
  });

  // Update filter options to match backend values
  const filterOptions = [
    { label: "All", value: "all" },
    { label: "Refueling Request", value: "refuelingrequest" },
    { label: "Maintenance Request", value: "maintenancerequest" },
    { label: "High-Cost Request", value: "highcosttransportrequest" },
    { label: "Transport Request", value: "transportrequest" },
  ];

  useEffect(() => {
    const fetchHistoryRecords = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await fetch(ENDPOINTS.ACTION_LOGS_LIST, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched history records:", data);
        setHistoryRecords(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching history records:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryRecords();
  }, []);

  // Filter logic (use request_type directly)
  const filteredRequests = historyRecords.filter((record) => {
    if (filter === "all") return true;
    return record.request_type === filter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageRequests = filteredRequests.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Reset to first page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // View detail handler
  const handleViewDetail = async (pk) => {
    setDetailModal({ open: true, data: null, loading: true, error: null });
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(ENDPOINTS.ACTION_LOGS_DETAIL(pk), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched detail data:", data);
      setDetailModal({ open: true, data, loading: false, error: null });
    } catch (err) {
      setDetailModal({
        open: true,
        data: null,
        loading: false,
        error: err.message,
      });
    }
  };

  const handleCloseModal = () => {
    setDetailModal({ open: false, data: null, loading: false, error: null });
  };

  // UI
  if (loading) {
    return (
      <div
        className="container py-4"
        style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}
      >
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-3">Loading history records...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="container py-4"
        style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}
      >
        <div className="alert alert-danger" role="alert">
          Error loading history records: {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className="container py-4"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}
    >
      <h2 className="h5 mb-4"> History</h2>

      {/* Filter Dropdown */}
      <div className="d-flex justify-content-end mb-3">
        <select
          id="filterDropdown"
          className="form-select form-select-sm w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {filterOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {/* Responsive Table */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Request Type</th>

                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentPageRequests.length > 0 ? (
                  currentPageRequests.map((record, index) => (
                    <tr key={record.id || index}>
                      <td>{startIndex + index + 1}</td>
                      <td>{record.role_display || record.name || "N/A"}</td>
                      <td>{record.request_type || "N/A"}</td>

                      <td>
                        {record.timestamp
                          ? new Date(record.timestamp).toLocaleString()
                          : record.date || "N/A"}
                      </td>
                      <td
                        className={
                          record.status_at_time === "approved"
                            ? "text-success fw-bold"
                            : record.status_at_time === "rejected"
                            ? "text-danger fw-bold"
                            : "text-muted fw-bold"
                        }
                      >
                        {record.status_at_time
                          ? record.status_at_time.charAt(0).toUpperCase() +
                            record.status_at_time.slice(1)
                          : "Pending"}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm"
                          style={{ backgroundColor: "#0B455B", color: "#fff" }}
                          onClick={() => handleViewDetail(record.id)}
                        >
                          View Detail
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No history records available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      {filteredRequests.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button
            className="btn btn-secondary btn-sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <small>
            Page {currentPage} of {totalPages}
          </small>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {detailModal.open && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.3)" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">History Record Detail</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                {detailModal.loading && <div>Loading...</div>}
                {detailModal.error && (
                  <div className="alert alert-danger">{detailModal.error}</div>
                )}
                {detailModal.data && (
                  <div>
                    <p>
                      <strong>Request Type:</strong>{" "}
                      {detailModal.data.request_type || "N/A"}
                    </p>

                    <p>
                      <strong>Date:</strong>{" "}
                      {detailModal.data.timestamp
                        ? new Date(detailModal.data.timestamp).toLocaleString()
                        : detailModal.data.date
                        ? new Date(detailModal.data.date).toLocaleString()
                        : "N/A"}
                    </p>

                    {/* --- Show request_object details if present --- */}
                    {detailModal.data.request_object && (
                      <div className="mt-3">
                        <p>
                          <strong>Created At:</strong>{" "}
                          {detailModal.data.request_object.created_at
                            ? new Date(
                                detailModal.data.request_object.created_at
                              ).toLocaleString()
                            : "N/A"}
                        </p>
                        <p>
                          <strong>Updated At:</strong>{" "}
                          {detailModal.data.request_object.updated_at
                            ? new Date(
                                detailModal.data.request_object.updated_at
                              ).toLocaleString()
                            : "N/A"}
                        </p>

                        <p>
                          <strong>Destination:</strong>{" "}
                          {detailModal.data.request_object.destination ?? "N/A"}
                        </p>
                        <p>
                          <strong>Start Day:</strong>{" "}
                          {detailModal.data.request_object.start_day ?? "N/A"}
                        </p>
                        <p>
                          <strong>Start Time:</strong>{" "}
                          {detailModal.data.request_object.start_time ?? "N/A"}
                        </p>
                        <p>
                          <strong>Return Day:</strong>{" "}
                          {detailModal.data.request_object.return_day ?? "N/A"}
                        </p>
                        <p>
                          <strong>Employees:</strong>{" "}
                          {Array.isArray(
                            detailModal.data.request_object.employees
                          )
                            ? detailModal.data.request_object.employees.join(
                                ", "
                              )
                            : detailModal.data.request_object.employees ??
                              "N/A"}
                        </p>

                        <p>
                          <strong>Reason:</strong>{" "}
                          {detailModal.data.request_object.reason ?? "N/A"}
                        </p>

                        <p>
                          <strong>Trip Completed:</strong>{" "}
                          {detailModal.data.request_object.trip_completed ===
                          true
                            ? "Yes"
                            : "No"}
                        </p>
                        {detailModal.data.request_object.rejection_message && (
                          <p>
                            <strong>Rejection Message:</strong>{" "}
                            {detailModal.data.request_object.rejection_message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestHistory;
