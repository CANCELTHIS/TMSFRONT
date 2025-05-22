import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import {
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Dummy monthly data for chart (per request type)
const monthlyData = [
  {
    month: "Jan",
    "Car Request": { requests: 10, cost: 3000, Owned: 6, Rented: 3, Leased: 1 },
    "Maintenance Request": {
      requests: 8,
      cost: 4000,
      Owned: 5,
      Rented: 2,
      Leased: 1,
    },
    "Service Request": {
      requests: 12,
      cost: 2500,
      Owned: 7,
      Rented: 4,
      Leased: 1,
    },
    "Refueling Request": {
      requests: 10,
      cost: 1500,
      Owned: 5,
      Rented: 4,
      Leased: 1,
    },
  },
  {
    month: "Feb",
    "Car Request": { requests: 12, cost: 3500, Owned: 7, Rented: 4, Leased: 1 },
    "Maintenance Request": {
      requests: 9,
      cost: 4200,
      Owned: 6,
      Rented: 2,
      Leased: 1,
    },
    "Service Request": {
      requests: 13,
      cost: 2600,
      Owned: 8,
      Rented: 4,
      Leased: 1,
    },
    "Refueling Request": {
      requests: 16,
      cost: 1800,
      Owned: 8,
      Rented: 7,
      Leased: 1,
    },
  },
  {
    month: "Mar",
    "Car Request": { requests: 15, cost: 4000, Owned: 8, Rented: 6, Leased: 1 },
    "Maintenance Request": {
      requests: 10,
      cost: 4500,
      Owned: 7,
      Rented: 2,
      Leased: 1,
    },
    "Service Request": {
      requests: 14,
      cost: 2700,
      Owned: 9,
      Rented: 4,
      Leased: 1,
    },
    "Refueling Request": {
      requests: 21,
      cost: 2000,
      Owned: 10,
      Rented: 10,
      Leased: 1,
    },
  },
  {
    month: "Apr",
    "Car Request": { requests: 13, cost: 3700, Owned: 7, Rented: 5, Leased: 1 },
    "Maintenance Request": {
      requests: 11,
      cost: 4700,
      Owned: 8,
      Rented: 2,
      Leased: 1,
    },
    "Service Request": {
      requests: 15,
      cost: 2800,
      Owned: 10,
      Rented: 4,
      Leased: 1,
    },
    "Refueling Request": {
      requests: 16,
      cost: 1700,
      Owned: 8,
      Rented: 7,
      Leased: 1,
    },
  },
  {
    month: "May",
    "Car Request": {
      requests: 18,
      cost: 5000,
      Owned: 10,
      Rented: 7,
      Leased: 1,
    },
    "Maintenance Request": {
      requests: 12,
      cost: 5000,
      Owned: 9,
      Rented: 2,
      Leased: 1,
    },
    "Service Request": {
      requests: 18,
      cost: 3000,
      Owned: 12,
      Rented: 5,
      Leased: 1,
    },
    "Refueling Request": {
      requests: 24,
      cost: 2200,
      Owned: 12,
      Rented: 11,
      Leased: 1,
    },
  },
  {
    month: "Jun",
    "Car Request": { requests: 16, cost: 4800, Owned: 9, Rented: 6, Leased: 1 },
    "Maintenance Request": {
      requests: 13,
      cost: 5200,
      Owned: 10,
      Rented: 2,
      Leased: 1,
    },
    "Service Request": {
      requests: 17,
      cost: 3200,
      Owned: 11,
      Rented: 5,
      Leased: 1,
    },
    "Refueling Request": {
      requests: 19,
      cost: 2100,
      Owned: 10,
      Rented: 8,
      Leased: 1,
    },
  },
];

// Dummy table data
const dummyTopVehicles = [
  {
    plate: "AA1234",
    driver: "John Doe",
    km: 12000,
    fuel: 1500,
    maintenance: 3,
    type: "Car Request",
    cost: 5000,
  },
  {
    plate: "BB5678",
    driver: "Jane Smith",
    km: 11000,
    fuel: 1400,
    maintenance: 2,
    type: "Maintenance Request",
    cost: 3200,
  },
  {
    plate: "CC9012",
    driver: "Mike Lee",
    km: 10500,
    fuel: 1350,
    maintenance: 4,
    type: "Service Request",
    cost: 4100,
  },
  {
    plate: "DD3456",
    driver: "Sara Kim",
    km: 9800,
    fuel: 1200,
    maintenance: 1,
    type: "Refueling Request",
    cost: 1800,
  },
  {
    plate: "EE7890",
    driver: "Ali Musa",
    km: 9500,
    fuel: 1100,
    maintenance: 2,
    type: "Car Request",
    cost: 2500,
  },
];

const requestTypes = [
  "All",
  "Car Request",
  "Maintenance Request",
  "Service Request",
  "Refueling Request",
];

const chartViews = [
  { key: "requests", label: "Number of Requests" },
  { key: "cost", label: "Cost" },
  { key: "source", label: "Source of Cars" },
];

const COLORS = ["#14183E", "#F1A501", "#34A853", "#FF7152"];

const ReportPage = () => {
  const [maintFilter, setMaintFilter] = useState("All");
  const [chartView, setChartView] = useState("requests");
  const [chartReqType, setChartReqType] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { mylanguage } = useLanguage();

  // Table filter
  const filteredVehicles =
    maintFilter === "All"
      ? dummyTopVehicles
      : dummyTopVehicles.filter((v) => v.type === maintFilter);

  // Prepare chart data based on selection
  let chartData = [];
  if (chartReqType === "All") {
    // For "All", merge all types for requests/cost/source
    chartData = monthlyData.map((m) => ({
      month: m.month,
      "Car Request": m["Car Request"].requests,
      "Maintenance Request": m["Maintenance Request"].requests,
      "Service Request": m["Service Request"].requests,
      "Refueling Request": m["Refueling Request"].requests,
      "Car Request Cost": m["Car Request"].cost,
      "Maintenance Request Cost": m["Maintenance Request"].cost,
      "Service Request Cost": m["Service Request"].cost,
      "Refueling Request Cost": m["Refueling Request"].cost,
      "Car Request Owned": m["Car Request"].Owned,
      "Car Request Rented": m["Car Request"].Rented,
      "Car Request Leased": m["Car Request"].Leased,
      "Maintenance Request Owned": m["Maintenance Request"].Owned,
      "Maintenance Request Rented": m["Maintenance Request"].Rented,
      "Maintenance Request Leased": m["Maintenance Request"].Leased,
      "Service Request Owned": m["Service Request"].Owned,
      "Service Request Rented": m["Service Request"].Rented,
      "Service Request Leased": m["Service Request"].Leased,
      "Refueling Request Owned": m["Refueling Request"].Owned,
      "Refueling Request Rented": m["Refueling Request"].Rented,
      "Refueling Request Leased": m["Refueling Request"].Leased,
    }));
  } else {
    chartData = monthlyData.map((m) => ({
      month: m.month,
      requests: m[chartReqType].requests,
      cost: m[chartReqType].cost,
      Owned: m[chartReqType].Owned,
      Rented: m[chartReqType].Rented,
      Leased: m[chartReqType].Leased,
    }));
  }

  // Localization object (shortened for brevity)
  const t = {
    reportPage: "Report Page",
    topVehicles: "Top Vehicles (by KM)",
    driver: "Driver",
    kilometers: "Kilometers",
    fuel: "Fuel (L)",

    cost: "Cost",
    type: "Type",
    filter: "Filter",
    chart: "Chart",
    numberOfRequests: "Number of Requests",
    costChart: "Cost",
    source: "Source of Cars",
    owned: "Owned",
    rented: "Rented",
    leased: "Leased",
    selectReq: "Request Type",
    selectChart: "Chart Data",
  };

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

  if (loading) return <p>{t.loading}</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div
      className="container"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fc",
        marginTop: "100px",
      }}
    >
      <h2 className="h4 mb-4" style={{ color: "#14183E", fontWeight: 700 }}>
        {t.reportPage}
      </h2>

      {/* Chart Section */}
      <div className="card shadow-sm mb-5">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4">
              <label className="form-label">{t.selectChart}:</label>
              <select
                className="form-select form-select-sm"
                value={chartView}
                onChange={(e) => setChartView(e.target.value)}
              >
                {chartViews.map((view) => (
                  <option key={view.key} value={view.key}>
                    {view.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">{t.selectReq}:</label>
              <select
                className="form-select form-select-sm"
                value={chartReqType}
                onChange={(e) => setChartReqType(e.target.value)}
              >
                {requestTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* Chart rendering logic */}
              {chartView === "requests" &&
                (chartReqType === "All" ? (
                  <>
                    <Line
                      type="monotone"
                      dataKey="Car Request"
                      stroke={COLORS[0]}
                      name="Car Request"
                      strokeWidth={4}
                    />
                    <Line
                      type="monotone"
                      dataKey="Maintenance Request"
                      stroke={COLORS[1]}
                      name="Maintenance Request"
                      strokeWidth={4}
                    />
                    <Line
                      type="monotone"
                      dataKey="Service Request"
                      stroke={COLORS[2]}
                      name="Service Request"
                      strokeWidth={4}
                    />
                    <Line
                      type="monotone"
                      dataKey="Refueling Request"
                      stroke={COLORS[3]}
                      name="Refueling Request"
                      strokeWidth={4}
                    />
                  </>
                ) : (
                  <Line
                    type="monotone"
                    dataKey="requests"
                    stroke={COLORS[0]}
                    name={chartReqType}
                    strokeWidth={4}
                  />
                ))}
              {chartView === "cost" &&
                (chartReqType === "All" ? (
                  <>
                    <Line
                      type="monotone"
                      dataKey="Car Request Cost"
                      stroke={COLORS[0]}
                      name="Car Request Cost"
                      strokeWidth={4}
                    />
                    <Line
                      type="monotone"
                      dataKey="Maintenance Request Cost"
                      stroke={COLORS[1]}
                      name="Maintenance Request Cost"
                      strokeWidth={4}
                    />
                    <Line
                      type="monotone"
                      dataKey="Service Request Cost"
                      stroke={COLORS[2]}
                      name="Service Request Cost"
                      strokeWidth={4}
                    />
                    <Line
                      type="monotone"
                      dataKey="Refueling Request Cost"
                      stroke={COLORS[3]}
                      name="Refueling Request Cost"
                      strokeWidth={4}
                    />
                  </>
                ) : (
                  <Line
                    type="monotone"
                    dataKey="cost"
                    stroke={COLORS[0]}
                    name={chartReqType + " Cost"}
                    strokeWidth={4}
                  />
                ))}
              {chartView === "source" &&
                (chartReqType === "All" ? null : (
                  <>
                    <Line
                      type="monotone"
                      dataKey="Owned"
                      stroke={COLORS[0]}
                      name="Owned"
                      strokeWidth={4}
                    />
                    <Line
                      type="monotone"
                      dataKey="Rented"
                      stroke={COLORS[1]}
                      name="Rented"
                      strokeWidth={4}
                    />
                    <Line
                      type="monotone"
                      dataKey="Leased"
                      stroke={COLORS[2]}
                      name="Leased"
                      strokeWidth={4}
                    />
                  </>
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section */}
      <div className="card shadow-sm mb-5">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Plate</th>
                  <th>{t.driver}</th>
                  <th>{t.kilometers}</th>
                  <th>{t.fuel}</th>
                  {/* Maint. column with filter */}
                  <th>
                    <div className="d-flex align-items-center">
                      <span>{t.maint}</span>
                      <select
                        className="form-select form-select-sm ms-2"
                        style={{ width: "140px" }}
                        value={maintFilter}
                        onChange={(e) => setMaintFilter(e.target.value)}
                      >
                        {requestTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                  </th>
                  <th>{t.cost}</th>
                  <th>{t.type}</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No data found.
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((v, idx) => (
                    <tr key={v.plate}>
                      <td>{idx + 1}</td>
                      <td>{v.plate}</td>
                      <td>{v.driver}</td>
                      <td>{v.km}</td>
                      <td>{v.fuel}</td>
                      <td>{v.maintenance}</td>
                      <td>{v.cost} ETB</td>
                      <td>{v.type}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="d-flex justify-content-end mt-2">
              <button
                className="btn btn-sm"
                style={{ backgroundColor: "#14183E", color: "#fff" }}
                onClick={() => window.print()}
              >
                Print Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
