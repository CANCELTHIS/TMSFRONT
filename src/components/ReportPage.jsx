import React, { useState, useEffect } from 'react';
import Logo from "../assets/Logo.jpg"; // Import the logo image

// Sample data for the report (replace this with actual data from your backend)
const sampleData = {
  totalRefueling: 5000,
  totalRefuelingBudget: 3000,
  totalMaintenanceBudget: 4000,
  totalVehicleUsage: [
    { department: 'Department 1', usage: 120 },
    { department: 'Department 2', usage: 80 },
    { department: 'Department 3', usage: 150 },
  ],
  vipTripBudget: 2000,
};

const ReportPage = () => {
  const [isDetailedView, setIsDetailedView] = useState(false);

  const handleViewMore = () => {
    setIsDetailedView(true);
  };

  const handlePrintReport = () => {
    window.print(); // Trigger print dialog
  };

  return (
    <div className="report-page">
      <img src={Logo} alt="Logo" className="logo" />

      {!isDetailedView ? (
        <div className="cards-container">
          <div className="card">
            <h3>Total Refueling Usage</h3>
            <p>{sampleData.totalRefueling} Liters</p>
          </div>
          <div className="card">
            <h3>Total Refueling Budget</h3>
            <p>{sampleData.totalRefuelingBudget} ETB</p>
          </div>
          <div className="card">
            <h3>Total Maintenance Budget</h3>
            <p>{sampleData.totalMaintenanceBudget} ETB</p>
          </div>
          <div className="card">
            <h3>VIP Trip Budget Usage</h3>
            <p>{sampleData.vipTripBudget} ETB</p>
          </div>

          <button onClick={handleViewMore} className="view-more-button">View More</button>
        </div>
      ) : (
        <div className="detailed-report">
          <h2>Detailed Report</h2>
          <div className="report-section">
            <h3>Vehicle Usage by Department</h3>
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Vehicle Usage (km)</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.totalVehicleUsage.map((usage, index) => (
                  <tr key={index}>
                    <td>{usage.department}</td>
                    <td>{usage.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button onClick={handlePrintReport} className="print-button">Print Report</button>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
