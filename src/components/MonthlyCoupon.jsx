import { useState, useEffect, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { IoClose } from "react-icons/io5";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ENDPOINTS } from "../utilities/endpoints";

function formatDisplayMonth(monthString) {
  if (!monthString) return "";
  const [year, month] = monthString.split("-");
  const date = new Date(year, month - 1);
  return date.toLocaleString("default", { month: "long", year: "numeric" });
}

const MonthlyCoupon = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refuelLogs, setRefuelLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userVehicles, setUserVehicles] = useState([]);

  // Get current month in YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };
  const currentMonth = getCurrentMonth();

  // Fetch current user
  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    try {
      const res = await fetch(ENDPOINTS.CURRENT_USER, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const user = await res.json();
        console.log("Current user:::::::::::", user);

        setCurrentUser(user);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Fetch coupon requests
  const fetchRefuelLogs = useCallback(async () => {
    setLoadingLogs(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("You are not authorized. Please log in.");
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
        toast.error("You are not authorized. Please log in.");
        setRefuelLogs([]);
        return;
      }
      if (!logsResponse.ok) throw new Error("Failed to load coupon requests");
      const logsData = await logsResponse.json();
      // logsData.results is the array you want
      setRefuelLogs(Array.isArray(logsData.results) ? logsData.results : []);
      console.log("Fetched coupon requests:", logsData);
    } catch (error) {
      toast.error(error.message || "Error loading coupon requests");
      setRefuelLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  useEffect(() => {
    fetchRefuelLogs();
  }, [fetchRefuelLogs]);

  // Fetch current user vehicles
  const fetchUserVehicles = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    try {
      const res = await fetch(ENDPOINTS.CURRENT_USER_VEHICLES, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const vehicles = await res.json();
        console.log("User vehicles:::::::::::", vehicles);

        setUserVehicles(vehicles.license_plate);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchUserVehicles();
  }, [fetchUserVehicles]);

  // Helper to get vehicle string by id

  // Submit new coupon request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if coupon for current month already exists
    const alreadyRequested = refuelLogs.some(
      (log) => log.month === currentMonth
    );
    if (alreadyRequested) {
      toast.error("Coupon request already added for this month.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("You are not authorized. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const payload = { month: currentMonth };
      const response = await fetch(ENDPOINTS.CREATE_COUPON_REQUEST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        toast.error("You are not authorized. Please log in.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        // Try to get backend error message
        let errorMsg = "Failed to submit coupon";
        try {
          const errData = await response.json();
          errorMsg =
            typeof errData === "string"
              ? errData
              : errData.detail || JSON.stringify(errData);
        } catch {}
        toast.error(errorMsg);
        setLoading(false);
        return;
      }
      toast.success("Refueling coupon submitted!");
      setShowForm(false);
      fetchRefuelLogs();
    } catch (error) {
      toast.error(error.message || "Failed to submit coupon");
    } finally {
      setLoading(false);
    }
  };

  // Filter logs for current user
  const userCoupons = currentUser
    ? refuelLogs.filter((log) => log.requester === currentUser.id)
    : [];

  return (
    <div className="container mt-5">
      <ToastContainer position="top-center" autoClose={3000} />
      <button
        className="btn mb-4"
        style={{
          width: "200px",
          backgroundColor: "rgba(31, 41, 55, 0.9)",
          color: "#fff",
        }}
        onClick={() => setShowForm(true)}
      >
        Add Refueling Coupon
      </button>

      {/* Modal Form */}
      {showForm && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header d-flex justify-content-between align-items-start">
                  <h5 className="modal-title">Add Refueling Coupon</h5>
                  <button
                    type="button"
                    className="btn p-0"
                    aria-label="Close"
                    onClick={() => setShowForm(false)}
                    style={{
                      border: "none",
                      background: "none",
                      fontSize: "1.5rem",
                      lineHeight: 1,
                      position: "absolute",
                      top: "16px",
                      right: "20px",
                    }}
                  >
                    <IoClose />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="mb-3 text-center">
                    <h3>{formatDisplayMonth(currentMonth)}</h3>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    style={{
                      backgroundColor: "rgba(31, 41, 55, 0.9)",
                      color: "#fff",
                    }}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
          ) : !currentUser ? (
            <div className="text-center text-muted">Loading user info...</div>
          ) : userCoupons.length === 0 ? (
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
                  {userCoupons.map((log, idx) => (
                    <tr key={log.id}>
                      <td>{idx + 1}</td>
                      <td>{formatDisplayMonth(log.month)}</td>
                      <td>{currentUser.full_name}</td>
                      <td>{userVehicles}</td>
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

export default MonthlyCoupon;
