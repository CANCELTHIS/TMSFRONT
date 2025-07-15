import { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoClose } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ENDPOINTS } from "../utilities/endpoints";
import UnauthorizedPage from "./UnauthorizedPage";
import ServerErrorPage from "./ServerErrorPage";

function formatDisplayMonth(monthString) {
  if (!monthString) return "";
  const [year, month] = monthString.split("-");
  const date = new Date(year, month - 1);
  return date.toLocaleString("default", { month: "long", year: "numeric" });
}

const MonthlyCouponTM = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refuelLogs, setRefuelLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [errorType, setErrorType] = useState(null); // "unauthorized" | "server" | null

  // Get current month in YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };
  const currentMonth = getCurrentMonth();

  // Fetch coupon requests
  const fetchRefuelLogs = useCallback(async () => {
    setLoadingLogs(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      setErrorType("unauthorized");
      setLoadingLogs(false);
      setRefuelLogs([]);
      return;
    }
    try {
      const logsResponse = await fetch(ENDPOINTS.COUPON_REQUEST_LIST, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (logsResponse.status === 401) {
        setErrorType("unauthorized");
        setRefuelLogs([]);
        setLoadingLogs(false);
        return;
      }
      if (!logsResponse.ok) {
        setErrorType("server");
        throw new Error("Failed to load coupon requests");
      }
      const logsData = await logsResponse.json();
      console.log("Transport Manager incoming coupon data:", logsData); // <-- log incoming data
      setRefuelLogs(Array.isArray(logsData.results) ? logsData.results : []);
    } catch (error) {
      setErrorType("server");
      setRefuelLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  useEffect(() => {
    fetchRefuelLogs();
  }, [fetchRefuelLogs]);

  if (errorType === "unauthorized") {
    return <UnauthorizedPage />;
  }
  if (errorType === "server") {
    return (
      <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "60vh", background: "#222", color: "#fff" }}>
        <h4 className="mb-4">Unable to load coupon requests.</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <ToastContainer position="top-center" autoClose={3000} />
      {/* REMOVE create button for transport manager */}
      {/* <button ...>Add Refueling Coupon</button> */}

      {/* Card Display */}
      <div className="row">
        <div className="col-12">
          {loadingLogs ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "200px" }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : refuelLogs.length === 0 ? (
            <div className="text-center text-muted">
              No refueling coupons found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Month</th>
                    <th>Requester</th>
                    <th>Vehicle</th>
                  </tr>
                </thead>
                <tbody>
                  {refuelLogs.map((log, idx) => (
                    <tr key={log.id}>
                      <td>{idx + 1}</td>
                      <td>{formatDisplayMonth(log.month)}</td>
                      {/* Use requester_name and vehicle_name instead of id */}
                      <td>{log.requester_name}</td>
                      <td>{log.vehicle_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyCouponTM;
