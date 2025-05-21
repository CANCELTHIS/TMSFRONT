import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "#14183E",
  "#0B455B",
  "#F1A501",
  "#FF7152",
  "#8A79DF",
  "#34A853",
  "#EA4335",
];

const dummyMonthlyTrends = [
  { month: "Jan", Maintenance: 12, Refueling: 20, Service: 8 },
  { month: "Feb", Maintenance: 15, Refueling: 18, Service: 10 },
  { month: "Mar", Maintenance: 10, Refueling: 25, Service: 12 },
  { month: "Apr", Maintenance: 20, Refueling: 22, Service: 14 },
  { month: "May", Maintenance: 18, Refueling: 30, Service: 16 },
  { month: "Jun", Maintenance: 22, Refueling: 28, Service: 18 },
  { month: "Jul", Maintenance: 17, Refueling: 24, Service: 15 },
  { month: "Aug", Maintenance: 19, Refueling: 27, Service: 17 },
  { month: "Sep", Maintenance: 14, Refueling: 21, Service: 13 },
  { month: "Oct", Maintenance: 16, Refueling: 23, Service: 14 },
  { month: "Nov", Maintenance: 21, Refueling: 29, Service: 19 },
  { month: "Dec", Maintenance: 13, Refueling: 20, Service: 11 },
];

const dummyTopVehicles = [
  {
    plate: "AA1234",
    driver: "John Doe",
    km: 12000,
    fuel: 1500,
    maintenance: 3,
  },
  {
    plate: "BB5678",
    driver: "Jane Smith",
    km: 11000,
    fuel: 1400,
    maintenance: 2,
  },
  {
    plate: "CC9012",
    driver: "Mike Lee",
    km: 10500,
    fuel: 1350,
    maintenance: 4,
  },
  { plate: "DD3456", driver: "Sara Kim", km: 9800, fuel: 1200, maintenance: 1 },
  { plate: "EE7890", driver: "Ali Musa", km: 9500, fuel: 1100, maintenance: 2 },
];

const dummyBreakdown = [
  { type: "Owned", vehicles: 15, requests: 120 },
  { type: "Rented", vehicles: 8, requests: 60 },
  { type: "Leased", vehicles: 5, requests: 40 },
];

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
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { mylanguage } = useLanguage();

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
      monthlyTrends: "Monthly Request Trends",
      topVehicles: "Top Vehicles (by KM)",
      breakdown: "Vehicle Source Breakdown",
      vehicles: "Vehicles",
      requests: "Requests",
      driver: "Driver",
      kilometers: "Kilometers",
      fuel: "Fuel (L)",
      maint: "Maint.",
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
      monthlyTrends: "ወርሃዊ ትዕዛዞች እንቅስቃሴ",
      topVehicles: "ምርጥ ተሽከርካሪዎች (በኪ.ሜ)",
      breakdown: "የተሽከርካሪ ምንጭ ክፍል በኩል",
      vehicles: "ተሽከርካሪዎች",
      requests: "ጥያቄዎች",
      driver: "አሽከርካሪ",
      kilometers: "ኪ.ሜ",
      fuel: "ነዳጅ (ሊትር)",
      maint: "ጥገና",
    },
  };

  const t = localization[mylanguage];

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("User not authenticated");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching report data:", err);
        setError(t.error);
        setLoading(false);
      }
    };
    fetchReportData();
  }, [t.error]);
  const pieData = [
    { name: t.maintenanceRequests, value: 42 },
    { name: t.refuelingRequests, value: 58 },
    { name: t.vehicleRequests, value: 75 },
    { name: t.highCost, value: 12 },
  ];

  const barData = [
    { name: t.maintenanceCost, value: 32000 },
    { name: t.refuelingCost, value: 21000 },
    { name: t.serviceCost, value: 15000 },
  ];

  const handleViewDetails = (reportType) => {
    setSelectedReport(reportType);
    setShowModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <p>{t.loading}</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div
      className="container"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fc",
        marginTop: "200px",
      }}
    >
      <div className="row mb-5">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5
                className="card-title text-center mb-4"
                style={{ color: "#14183E" }}
              >
                {t.maintenanceRequests}, {t.refuelingRequests},{" "}
                {t.vehicleRequests}, {t.highCost}
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#14183E"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5
                className="card-title text-center mb-4"
                style={{ color: "#14183E" }}
              >
                {t.maintenanceCost}, {t.refuelingCost}, {t.serviceCost}
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#14183E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends Line Chart */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5
                className="card-title text-center mb-4"
                style={{ color: "#14183E" }}
              >
                {t.monthlyTrends}
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dummyMonthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Maintenance"
                    stroke="#14183E"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Refueling"
                    stroke="#F1A501"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="Service"
                    stroke="#34A853"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Source Breakdown Stacked Bar */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5
                className="card-title text-center mb-4"
                style={{ color: "#14183E" }}
              >
                {t.breakdown}
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dummyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="vehicles"
                    stackId="a"
                    fill="#14183E"
                    name={t.vehicles}
                  />
                  <Bar
                    dataKey="requests"
                    stackId="a"
                    fill="#F1A501"
                    name={t.requests}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Top Vehicles Table */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5
                className="card-title text-center mb-4"
                style={{ color: "#14183E" }}
              >
                {t.topVehicles}
              </h5>
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Plate</th>
                      <th>{t.driver}</th>
                      <th>{t.kilometers}</th>
                      <th>{t.fuel}</th>
                      <th>{t.maint}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyTopVehicles.map((v, idx) => (
                      <tr key={v.plate}>
                        <td>{idx + 1}</td>
                        <td>{v.plate}</td>
                        <td>{v.driver}</td>
                        <td>{v.km}</td>
                        <td>{v.fuel}</td>
                        <td>{v.maintenance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="row">
        {/* Vehicle Requests Card */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">{t.vehicleRequests}</h5>
              <p className="card-text display-6">
                {reportData.totalVehicleRequests || 75}
              </p>
              <button
                className="btn"
                style={{
                  backgroundColor: "#14183E",
                  color: "#fff",
                  width: "150px",
                }}
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
              <p className="card-text display-6">
                {reportData.totalMaintenanceRequests || 42}
              </p>
              <button
                className="btn"
                style={{
                  backgroundColor: "#14183E",
                  color: "#fff",
                  width: "150px",
                }}
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
              <p className="card-text display-6">
                {reportData.totalRefuelingRequests || 58}
              </p>
              <button
                className="btn"
                style={{
                  backgroundColor: "#14183E",
                  color: "#fff",
                  width: "150px",
                }}
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
              <p className="card-text display-6">
                {reportData.totalMaintenanceCost || 32000}
              </p>
              <button
                className="btn"
                style={{
                  backgroundColor: "#14183E",
                  color: "#fff",
                  width: "150px",
                }}
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
              <p className="card-text display-6">
                {reportData.totalRefuelingCost || 21000}
              </p>
              <button
                className="btn"
                style={{
                  backgroundColor: "#14183E",
                  color: "#fff",
                  width: "150px",
                }}
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
              <p className="card-text display-6">
                {reportData.totalServiceCost || 15000}
              </p>
              <button
                className="btn"
                style={{
                  backgroundColor: "#14183E",
                  color: "#fff",
                  width: "150px",
                }}
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
              <p className="card-text display-6">
                {reportData.totalHighCost || 12}
              </p>
              <button
                className="btn"
                style={{
                  backgroundColor: "#14183E",
                  color: "#fff",
                  width: "150px",
                }}
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
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
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
                  Detailed information about <strong>{selectedReport}</strong>{" "}
                  will go here.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn"
                  style={{ backgroundColor: "#14183E", color: "#fff" }}
                  onClick={() => setShowModal(false)}
                >
                  {t.close}
                </button>
                <button
                  className="btn"
                  style={{ backgroundColor: "#14183E", color: "#fff" }}
                  onClick={handlePrint}
                >
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
