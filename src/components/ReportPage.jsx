import React, { useState, useEffect } from "react";
import axios from "axios";
import { ENDPOINTS } from "../utilities/endpoints";
import { useLanguage } from "../context/LanguageContext";

const ReportPage = () => {
  const [reportData, setReportData] = useState({
    totalMaintenanceCost: 0,
    totalRefuelingCost: 0,
    totalServiceCost: 0,
    totalHighCost: 0,
    totalVehicleRequests: 0,
    totalMaintenanceRequests: 0,
    totalRefuelingRequests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null); // State for selected report
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const { mylanguage } = useLanguage(); // Get the current language

  // Localization object
  const localization = {
    EN: {
      reportPage: "Report Page",
      maintenanceCost: "Maintenance Cost",
      refuelingCost: "Refueling Cost",
      serviceCost: "Service Cost",
      highCost: "High-Cost Vehicle Requests",
      vehicleRequests: "Vehicle Requests",
      maintenanceRequests: "Maintenance Requests",
      refuelingRequests: "Refueling Requests",
      viewDetails: "View Details",
      loading: "Loading...",
      error: "Failed to fetch report data.",
      print: "Print",
      close: "Close",
    },
    AM: {
      reportPage: "የሪፖርት ገጽ",
      maintenanceCost: "የጥገና ክፍያ",
      refuelingCost: "የነዳጅ ክፍያ",
      serviceCost: "የአገልግሎት ክፍያ",
      highCost: "ውድ የተሽከርካሪ ጥያቄዎች",
      vehicleRequests: "የተሽከርካሪ ጥያቄዎች",
      maintenanceRequests: "የጥገና ጥያቄዎች",
      refuelingRequests: "የነዳጅ ጥያቄዎች",
      viewDetails: "ዝርዝር እይ",
      loading: "በመጫን ላይ...",
      error: "የሪፖርት መረጃን ማግኘት አልተቻለም።",
      print: "አትም",
      close: "ዝጋ",
    },
  };

  const t = localization[mylanguage]; // Get translations for the current language

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("User not authenticated");
        }

        const response = await axios.get(ENDPOINTS.REPORT_DATA, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReportData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching report data:", err);
        setError(t.error);
        setLoading(false);
      }
    };

    fetchReportData();
  }, [t.error]);

  const handleViewDetails = (reportType) => {
    setSelectedReport(reportType);
    setShowModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <p>{t.loading}</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
      <h2 className="h5 mb-4">{t.reportPage}</h2>

      <div className="row">
        {/* Vehicle Requests Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">{t.vehicleRequests}</h5>
              <p className="card-text display-6">{reportData.totalVehicleRequests}</p>
              <button
                className="btn btn-primary"
                onClick={() => handleViewDetails(t.vehicleRequests)}
              >
                {t.viewDetails}
              </button>
            </div>
          </div>
        </div>

        {/* Maintenance Requests Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">{t.maintenanceRequests}</h5>
              <p className="card-text display-6">{reportData.totalMaintenanceRequests}</p>
              <button
                className="btn btn-primary"
                onClick={() => handleViewDetails(t.maintenanceRequests)}
              >
                {t.viewDetails}
              </button>
            </div>
          </div>
        </div>

        {/* Refueling Requests Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">{t.refuelingRequests}</h5>
              <p className="card-text display-6">{reportData.totalRefuelingRequests}</p>
              <button
                className="btn btn-primary"
                onClick={() => handleViewDetails(t.refuelingRequests)}
              >
                {t.viewDetails}
              </button>
            </div>
          </div>
        </div>

        {/* Maintenance Cost Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">{t.maintenanceCost}</h5>
              <p className="card-text display-6">{reportData.totalMaintenanceCost}</p>
              <button
                className="btn btn-primary"
                onClick={() => handleViewDetails(t.maintenanceCost)}
              >
                {t.viewDetails}
              </button>
            </div>
          </div>
        </div>

        {/* Refueling Cost Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">{t.refuelingCost}</h5>
              <p className="card-text display-6">{reportData.totalRefuelingCost}</p>
              <button
                className="btn btn-primary"
                onClick={() => handleViewDetails(t.refuelingCost)}
              >
                {t.viewDetails}
              </button>
            </div>
          </div>
        </div>

        {/* Service Cost Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">{t.serviceCost}</h5>
              <p className="card-text display-6">{reportData.totalServiceCost}</p>
              <button
                className="btn btn-primary"
                onClick={() => handleViewDetails(t.serviceCost)}
              >
                {t.viewDetails}
              </button>
            </div>
          </div>
        </div>

        {/* High-Cost Vehicle Requests Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">{t.highCost}</h5>
              <p className="card-text display-6">{reportData.totalHighCost}</p>
              <button
                className="btn btn-primary"
                onClick={() => handleViewDetails(t.highCost)}
              >
                {t.viewDetails}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Viewing Details */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedReport}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Detailed information about <strong>{selectedReport}</strong> will go here.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  {t.close}
                </button>
                <button className="btn btn-primary" onClick={handlePrint}>
                  {t.print}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
