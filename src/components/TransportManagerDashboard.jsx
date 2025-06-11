import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { useSpring, animated } from '@react-spring/web';

const REQUEST_TYPES = [
  { key: 'refueling', label: 'Refueling Requests', color: '#36A2EB', icon: '⛽' },
  { key: 'maintenance', label: 'Maintenance Requests', color: '#FF6384', icon: '🛠️' },
  { key: 'hicost', label: 'High Cost Requests', color: '#FFCE56', icon: '💰' },
  { key: 'service', label: 'Service Requests', color: '#4BC0C0', icon: '🧰' },
];

// Dummy summary data
const summaryData = {
  refueling: 124,
  maintenance: 32,
  hicost: 8,
  service: 46,
};

// Vehicle status summary data
const vehicleStatusData = {
  active: 117,
  underMaintenance: 14,
  underService: 9,
  rental: 75,
};

const monthsList = [
  "All", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
  "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Bar chart data (monthly trends)
const barData = [
  { month: 'Jan', refueling: 10, maintenance: 5, hicost: 1, service: 3 },
  { month: 'Feb', refueling: 12, maintenance: 4, hicost: 2, service: 6 },
  { month: 'Mar', refueling: 14, maintenance: 7, hicost: 1, service: 4 },
  { month: 'Apr', refueling: 16, maintenance: 3, hicost: 0, service: 5 },
  { month: 'May', refueling: 11, maintenance: 8, hicost: 2, service: 7 },
  { month: 'Jun', refueling: 18, maintenance: 5, hicost: 1, service: 6 },
  { month: 'Jul', refueling: 13, maintenance: 6, hicost: 1, service: 5 },
  { month: 'Aug', refueling: 9, maintenance: 7, hicost: 2, service: 4 },
  { month: 'Sep', refueling: 15, maintenance: 6, hicost: 1, service: 6 },
  { month: 'Oct', refueling: 17, maintenance: 5, hicost: 0, service: 7 },
  { month: 'Nov', refueling: 10, maintenance: 8, hicost: 2, service: 8 },
  { month: 'Dec', refueling: 13, maintenance: 7, hicost: 1, service: 5 },
];

// Pie chart data (annual proportions)
const getAnnualPieData = () => REQUEST_TYPES.map(rt => ({
  name: rt.label,
  value: barData.reduce((sum, monthObj) => sum + (monthObj[rt.key] || 0), 0),
}));

// Pie chart data (monthly proportions)
const getMonthlyPieData = (month) => {
  const found = barData.find(d => d.month === month);
  if (!found) return [];
  return REQUEST_TYPES.map(rt => ({
    name: rt.label,
    value: found[rt.key] || 0,
  }));
};

// Recent vehicles table data
const recentVehicles = [
  { id: 1, vehicle: 'Toyota Camry', type: 'refueling', status: 'Completed', date: '2025-06-08' },
  { id: 2, vehicle: 'Nissan Altima', type: 'maintenance', status: 'In Progress', date: '2025-06-07' },
  { id: 3, vehicle: 'Honda Accord', type: 'hicost', status: 'Pending', date: '2025-06-06' },
  { id: 4, vehicle: 'Ford Focus', type: 'service', status: 'Completed', date: '2025-06-05' },
  { id: 5, vehicle: 'Kia Rio', type: 'maintenance', status: 'Pending', date: '2025-06-04' },
];

const COLORS = REQUEST_TYPES.map(rt => rt.color);

const ProgressBar = ({ value, color = '#007bff' }) => {
  const props = useSpring({
    width: `${value}%`,
    from: { width: '0%' },
    config: { tension: 200, friction: 20 },
  });

  return (
    <div style={{ background: "#e9ecef", borderRadius: 6, overflow: 'hidden', height: 18 }}>
      <animated.div
        style={{
          ...props,
          background: color,
          height: 18,
          color: "#fff",
          fontWeight: "bold",
          textAlign: "center",
        }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {value}%
      </animated.div>
    </div>
  );
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12px" fontWeight="bold">
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

const Dashboard = () => {
  // Month filter state for bar chart
  const [selectedMonth, setSelectedMonth] = useState("All");
  // Pie chart filter type: "Annual" or "Monthly"
  const [pieFilter, setPieFilter] = useState("Annual");
  // Month filter for pie chart (if Monthly selected)
  const [pieMonth, setPieMonth] = useState("Jan");

  // Filter data based on month selection for bar chart
  const filteredBarData = selectedMonth === "All"
    ? barData
    : barData.filter(item => item.month === selectedMonth);

  // Pie data selection logic
  let pieChartData;
  if (pieFilter === "Annual") {
    pieChartData = getAnnualPieData();
  } else {
    pieChartData = getMonthlyPieData(pieMonth);
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Dashboard Overview</h2>

      {/* Vehicle Status Summary Cards */}
      <div className="row text-center mb-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <span style={{ fontSize: 32 }}>🚗</span>
              <h5 className="card-title mt-2">Active Vehicles</h5>
              <h3 style={{ fontWeight: 'bold', color: '#36A2EB' }}>{vehicleStatusData.active}</h3>
              <button className="btn btn-outline-primary btn-sm mt-2">View More</button>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <span style={{ fontSize: 32 }}>🛠️</span>
              <h5 className="card-title mt-2">Under Maintenance</h5>
              <h3 style={{ fontWeight: 'bold', color: '#FF6384' }}>{vehicleStatusData.underMaintenance}</h3>
              <button className="btn btn-outline-primary btn-sm mt-2">View More</button>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <span style={{ fontSize: 32 }}>🧰</span>
              <h5 className="card-title mt-2">Under Service</h5>
              <h3 style={{ fontWeight: 'bold', color: '#4BC0C0' }}>{vehicleStatusData.underService}</h3>
              <button className="btn btn-outline-primary btn-sm mt-2">View More</button>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <span style={{ fontSize: 32 }}>🚙</span>
              <h5 className="card-title mt-2">Total Rental Vehicles</h5>
              <h3 style={{ fontWeight: 'bold', color: '#FFCE56' }}>{vehicleStatusData.rental}</h3>
              <button className="btn btn-outline-primary btn-sm mt-2">View More</button>
            </div>
          </div>
        </div>
      </div>

      {/* Request Summary Cards */}
      <div className="row text-center">
        {REQUEST_TYPES.map((rt) => (
          <div className="col-md-3 mb-3" key={rt.key}>
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <span style={{ fontSize: 32 }}>{rt.icon}</span>
                <h5 className="card-title mt-2">{rt.label}</h5>
                <h3 style={{ fontWeight: 'bold', color: rt.color }}>{summaryData[rt.key]}</h3>
                <button className="btn btn-primary mt-2 btn-sm">View More</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar and Pie Charts */}
      <div className="row mt-4">
        <div className="col-md-7">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="card-title mb-0">Monthly Request Trends</h5>
                {/* Month filter dropdown */}
                <select
                  className="form-select form-select-sm"
                  style={{ width: 140 }}
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {monthsList.map(m => (
                    <option value={m} key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={filteredBarData}>
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  {REQUEST_TYPES.map((rt) => (
                    <Bar key={rt.key} dataKey={rt.key} name={rt.label} fill={rt.color} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="card-title mb-0">Request Type Distribution</h5>
                <div className="d-flex align-items-center gap-2">
                  <select
                    className="form-select form-select-sm me-2"
                    style={{ width: 80 }}
                    value={pieFilter}
                    onChange={(e) => setPieFilter(e.target.value)}
                  >
                    <option value="Annual">Annual</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                  {pieFilter === "Monthly" && (
                    <select
                      className="form-select form-select-sm"
                      style={{ width: 80 }}
                      value={pieMonth}
                      onChange={(e) => setPieMonth(e.target.value)}
                    >
                      {barData.map(d => (
                        <option value={d.month} key={d.month}>{d.month}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie 
                    data={pieChartData}
                    dataKey="value"
                    outerRadius={110}
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Vehicles Table */}
      <div className="card shadow-sm border-0 mt-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="card-title mb-0">Recent Vehicles</h5>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentVehicles.map(vehicle => (
                  <tr key={vehicle.id}>
                    <td>{vehicle.vehicle}</td>
                    <td>
                      <span className="me-1" style={{ color: REQUEST_TYPES.find(rt => rt.key === vehicle.type).color }}>
                        {REQUEST_TYPES.find(rt => rt.key === vehicle.type).icon}
                      </span>
                      {REQUEST_TYPES.find(rt => rt.key === vehicle.type).label}
                    </td>
                    <td>
                      <span className={`badge ${vehicle.status === 'Completed' ? 'bg-success' : vehicle.status === 'Pending' ? 'bg-warning' : 'bg-info'}`}>
                        {vehicle.status}
                      </span>
                    </td>
                    <td>{vehicle.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;