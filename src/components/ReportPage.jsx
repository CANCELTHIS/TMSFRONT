import { useState, useEffect } from "react";
import Logo from "../assets/Logo.jpg";
import { ENDPOINTS } from "../utilities/endpoints";
import { useLanguage } from "../context/LanguageContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const to2dp = (v) => Number(v || 0).toFixed(2);

const totalTypes = [
  { key: "All", label: "All" },
  { key: "Maintenance Request", label: "Maintenance" },
  { key: "Service Request", label: "Service" },
  { key: "Refueling Request", label: "Refueling" },
  { key: "HighCost Request", label: "High Cost" },
];

const apiTypeMap = {
  "Car Request": "Transport",
  "Maintenance Request": "Maintenance",
  "Service Request": "Service",
  "Refueling Request": "Refueling",
  "HighCost Request": "HighCost",
};

const monthOptions = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const typeDisplayNames = {
  Transport: "Transport",
  Maintenance: "Maintenance",
  Refueling: "Refueling",
  HighCost: "HighCost",
  Service: "Service",
};

const ReportPage = () => {
  const { mylanguage } = useLanguage();
  const [maintFilter, setMaintFilter] = useState("All");
  const [totalType, setTotalType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableDataRaw, setTableDataRaw] = useState(null);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("All");

  const [filteredTotals, setFilteredTotals] = useState({
    requests: 0,
    cost: 0,
  });

  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = 2022; y <= currentYear; y++) yearOptions.push(y);

  // Fetch table data when year/month changes
  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      setError(null);

      const accessToken =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        localStorage.getItem("token");
      if (!accessToken) {
        setError("You are not authorized. Please log in.");
        setLoading(false);
        setTableData([]);
        setTableDataRaw(null);
        return;
      }

      try {
        let url;
        if (selectedMonth === "All") {
          url = ENDPOINTS.REPORT_LIST;
        } else {
          const monthNum = (
            "0" +
            (monthOptions.indexOf(selectedMonth) + 1)
          ).slice(-2);
          url = ENDPOINTS.REPORT_BY_MONTH(selectedYear, monthNum);
        }
        const res = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (res.status === 401) {
          setError("Session expired or unauthorized. Please log in again.");
          setLoading(false);
          setTableData([]);
          setTableDataRaw(null);
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch report table data.");
        const tableJson = await res.json();
        setTableDataRaw(tableJson);
        const vehicles = tableJson.results?.vehicles || [];
        const flatTable = [];
        vehicles.forEach((v) => {
          v.requests.forEach((req) => {
            flatTable.push({
              plate: req.plate,
              driver: req.driver,
              km: req.kilometers,
              fuel: req.fuel_liters,
              maintenance: req.request_type_count,
              type: req.request_type,
              cost: req.cost,
            });
          });
        });
        setTableData(flatTable);
      } catch (err) {
        setError("Failed to fetch report data.");
        setTableData([]);
        setTableDataRaw(null);
      }
      setLoading(false);
    };
    fetchTableData();
    // eslint-disable-next-line
  }, [selectedYear, selectedMonth]);

  // Fetch filtered totals by type
  useEffect(() => {
    // Calculate totals based on tableData and totalType filter
    let filtered = tableData;
    if (totalType !== "All") {
      filtered = tableData.filter((row) =>
        totalType === "HighCost Request"
          ? row.type === "HighCost"
          : row.type === apiTypeMap[totalType] || row.type === totalType
      );
    }
    const totalRequests = filtered.reduce(
      (sum, v) => sum + (Number(v.maintenance) || 0),
      0
    );
    const totalCost = filtered.reduce(
      (sum, v) => sum + (Number(v.cost) || 0),
      0
    );
    setFilteredTotals({ requests: totalRequests, cost: totalCost });
  }, [tableData, totalType]);

  // Table filter (by type)
  const filteredVehicles =
    maintFilter === "All"
      ? tableData
      : tableData.filter((v) =>
          maintFilter === "HighCost Request"
            ? v.type === "HighCost"
            : v.type === apiTypeMap[maintFilter] || v.type === maintFilter
        );

  // Group and aggregate tableData by plate, driver, and request type
  const groupedTable = {};
  tableData
    .filter((req) => {
      if (maintFilter === "All") return true;
      if (maintFilter === "HighCost Request") return req.type === "HighCost";
      return req.type === apiTypeMap[maintFilter] || req.type === maintFilter;
    })
    .forEach((req) => {
      const key = `${req.plate}_${req.driver}_${req.type}`;
      if (!groupedTable[key]) {
        groupedTable[key] = {
          plate: req.plate,
          driver: req.driver,
          type: req.type,
          km: 0,
          fuel: 0,
          maintenance: 0,
          cost: 0,
        };
      }
      groupedTable[key].km += Number(req.km) || 0;
      groupedTable[key].fuel += Number(req.fuel) || 0;
      groupedTable[key].maintenance += Number(req.maintenance) || 0;
      groupedTable[key].cost += Number(req.cost) || 0;
    });
  const groupedRows = Object.values(groupedTable);

  // Totals for detailed report
  const totalsByType = {};
  groupedRows.forEach((row) => {
    const type = row.type;
    if (!totalsByType[type]) {
      totalsByType[type] = { count: 0, cost: 0 };
    }
    totalsByType[type].count += row.maintenance || 0;
    totalsByType[type].cost += Number(row.cost) || 0;
  });
  const reportTypesOrder = [
    "Transport",
    "HighCost",
    "Maintenance",
    "Refueling",
    "Service",
  ];
  const overallTotalCount = reportTypesOrder.reduce(
    (sum, type) => sum + (totalsByType[type]?.count || 0),
    0
  );
  const overallTotalCost = reportTypesOrder.reduce(
    (sum, type) => sum + (totalsByType[type]?.cost || 0),
    0
  );

  // Prepare data for the graph
  const graphData = reportTypesOrder
    .filter((type) => totalsByType[type])
    .map((type) => ({
      name: typeDisplayNames[type] || type,
      Requests: totalsByType[type].count,
      Cost: Number(totalsByType[type].cost),
    }));

  const t = {
    reportPage: mylanguage === "EN" ? "Report Page" : "ሪፖርት ገፅ",
    driver: "Driver",
    kilometers: "Kilometers",
    fuel: "Fuel",
    cost: "Cost",
    type: "Type",
    loading: "Loading...",
  };

  if (loading) return <p>{t.loading}</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  // Print only the table section WITH LOGO at the top of the page
  const handlePrintTable = () => {
    const tableContent = document.getElementById(
      "print-table-section"
    ).innerHTML;
    const logoImg = Logo.startsWith("data:") ? Logo : Logo;

    const printWindow = window.open("", "", "width=900,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Report Table</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
            th { background: #f8f9fc; }
            .logo-header { text-align: center; margin-bottom: 30px; }
            .logo-header img { max-width: 200px; max-height: 120px; }
          </style>
        </head>
        <body>
          <div class="logo-header">
            <img src="${logoImg}" alt="Logo" />
          </div>
          ${tableContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

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

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">
            {mylanguage === "EN"
              ? "Requests and Cost by Type"
              : "ጥያቄዎች እና ወጪ በአይነት"}
          </h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={graphData}
              margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                yAxisId="left"
                label={{
                  value: "Requests",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Cost (ETB)",
                  angle: 90,
                  position: "insideRight",
                }}
              />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="Requests" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="Cost" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cards for total requests and total cost with filter */}
      <div className="row mb-4 align-items-end">
        <div className="col-md-3 mb-2">
          <span className="me-2">Filter Totals By:</span>
          <select
            className="form-select form-select-sm"
            style={{ width: "200px", display: "inline-block" }}
            value={totalType}
            onChange={(e) => setTotalType(e.target.value)}
          >
            {totalTypes.map((type) => (
              <option key={type.key} value={type.key}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-2">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h6 className="mb-1">Total Requests</h6>
              <span className="display-6">{filteredTotals.requests}</span>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-2">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h6 className="mb-1">Total Cost</h6>
              <span className="display-6">
                {to2dp(filteredTotals.cost)} ETB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="card shadow-sm mb-5">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-2">
              <label className="form-label">Year:</label>
              <select
                className="form-select form-select-sm"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Month:</label>
              <select
                className="form-select form-select-sm"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="All">All</option>
                {monthOptions.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Year/Month</th>
                  <th>Plate</th>
                  <th>Driver</th>
                  <th>Request Type</th>
                  <th>Request Count</th>
                  <th>Kilometers</th>
                  <th>Fuel (L)</th>
                  <th>Cost (ETB)</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center">
                      No data found.
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((req, idx) => (
                    <tr key={req.plate + req.driver + req.type + idx}>
                      <td>{idx + 1}</td>
                      <td>
                        {selectedYear}/
                        {selectedMonth === "All"
                          ? "All"
                          : (
                              "0" +
                              (monthOptions.indexOf(selectedMonth) + 1)
                            ).slice(-2)}
                      </td>
                      <td>{req.plate}</td>
                      <td>{req.driver}</td>
                      <td>{req.type}</td>
                      <td>{req.maintenance}</td>
                      <td>
                        {req.km !== null && req.km !== undefined
                          ? Number(req.km).toFixed(2)
                          : "-"}
                      </td>
                      <td>
                        {req.fuel !== null && req.fuel !== undefined
                          ? Number(req.fuel).toFixed(2)
                          : "-"}
                      </td>
                      <td>
                        {req.cost !== null && req.cost !== undefined
                          ? Number(req.cost).toFixed(2)
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Grouped Table Section (with type filter) */}
      <div className="card shadow-sm mb-5">
        <div className="card-body">
          <div className="d-flex mb-3 align-items-center">
            <label className="me-2">Filter Detailed Report By Type:</label>
            <select
              className="form-select form-select-sm"
              style={{ width: "200px", display: "inline-block" }}
              value={maintFilter}
              onChange={(e) => setMaintFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Car Request">Car Request</option>
              <option value="Maintenance Request">Maintenance</option>
              <option value="Service Request">Service</option>
              <option value="Refueling Request">Refueling</option>
              <option value="HighCost Request">High Cost</option>
            </select>
          </div>
          <h5 className="mb-3">Detailed Report</h5>
          <div className="table-responsive" id="print-table-section">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Plate</th>
                  <th>{t.driver}</th>
                  <th>{t.kilometers}</th>
                  <th>{t.fuel}</th>
                  <th>{t.type}</th>
                  <th>{t.cost}</th>
                </tr>
              </thead>
              <tbody>
                {groupedRows.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No data found.
                    </td>
                  </tr>
                ) : (
                  groupedRows.map((v, idx) => (
                    <tr key={v.plate + v.driver + v.type}>
                      <td>{idx + 1}</td>
                      <td>{v.plate}</td>
                      <td>{v.driver}</td>
                      <td>{Number(v.km).toFixed(2)}</td>
                      <td>{Number(v.fuel).toFixed(2)}</td>
                      <td>{v.type}</td>
                      <td>{to2dp(v.cost)} ETB</td>
                    </tr>
                  ))
                )}
                {/* Totals by request type */}
                {reportTypesOrder.map((type) =>
                  totalsByType[type] ? (
                    <tr
                      key={type}
                      style={{ fontWeight: "bold", background: "#f8f9fc" }}
                    >
                      <td colSpan={5} className="text-end">
                        Total for {typeDisplayNames[type] || type}:
                      </td>
                      <td>{totalsByType[type].count}</td>
                      <td colSpan={2}>{to2dp(totalsByType[type].cost)} ETB</td>
                    </tr>
                  ) : null
                )}
                {/* Overall total */}
                <tr style={{ fontWeight: "bold", background: "#e0e7ef" }}>
                  <td colSpan={5} className="text-end">
                    Overall Total:
                  </td>
                  <td>{overallTotalCount}</td>
                  <td colSpan={2}>{to2dp(overallTotalCost)} ETB</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-end mt-2">
            <button
              className="btn"
              style={{
                backgroundColor: "#14183E",
                color: "#fff",
                width: "130px",
              }}
              onClick={handlePrintTable}
            >
              Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
