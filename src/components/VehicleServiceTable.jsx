import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ENDPOINTS } from "../utilities/endpoints";

function VehicleServiceTable() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from SERVICE_LIST endpoint and set vehicles
  useEffect(() => {
    const fetchServiceList = async () => {
      try {
        const token =
          localStorage.getItem("accessToken") ||
          localStorage.getItem("authToken") ||
          localStorage.getItem("token");
        const response = await fetch(ENDPOINTS.SERVICE_LIST, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const data = await response.json();
        console.log("Fetched SERVICE_LIST data:", data);
        setVehicles(data.results || []);
      } catch (error) {
        console.error("Error fetching SERVICE_LIST:", error);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceList();
  }, []);

  // Mark vehicle as under service using the new endpoint
  const handleUnderService = async (id) => {
    try {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("token");
      const response = await fetch(ENDPOINTS.MARK_VEHICLE_SERVICE(id), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error("Failed to mark vehicle as under service");
      }
      setVehicles((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status: "under_service" } : v))
      );
      toast.info("Vehicle marked as Under Service");
    } catch (error) {
      toast.error("Failed to mark vehicle as Under Service");
      console.error(error);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Vehicles Service</h2>
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead>
            <tr>
              <th>Model/Plate No.</th>
              <th>Driver</th>
              <th>Kilometers</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center">
                  Loading...
                </td>
              </tr>
            ) : vehicles.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  No service request to display.
                </td>
              </tr>
            ) : (
              vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>
                    {vehicle.model}/{vehicle.license_plate}
                  </td>
                  <td>{vehicle.driver_name}</td>
                  <td>{vehicle.total_kilometers}</td>
                  <td>
                    <span
                      className={`badge ${
                        vehicle.status === "available"
                          ? "bg-success"
                          : vehicle.status === "under_service"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm px-3"
                      style={{
                        minWidth: "130px",
                        backgroundColor: "#14183E",
                        color: "#fff",
                      }}
                      onClick={() => handleUnderService(vehicle.id)}
                      disabled={vehicle.status === "under_service"}
                    >
                      Under Service
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
}

export default VehicleServiceTable;
