import React from "react";
import { Link } from "react-router-dom";

const TransportDashboard = () => {
  return (
    <div className="container mt-4"style={{ minHeight: "100vh", backgroundColor: "#f8f9fc" }}>
      <h1 className="text-center mb-4">Transport Manager Dashboard</h1>

      <div className="row">
        <div className="col-md-3">
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
              <h5 className="card-title">Vehicle Management</h5>
              <p className="card-text">Manage vehicles in the fleet, add, edit, or remove vehicles.</p>
              <Link to="/transport/vehicle-management" className="btn btn-primary">
                Manage Vehicles
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
              <h5 className="card-title">Transport Requests</h5>
              <p className="card-text">View and manage transport requests from citizens.</p>
              <Link to="/transport/transport-request" className="btn btn-primary">
                View Requests
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
              <h5 className="card-title">Maintenance Requests</h5>
              <p className="card-text">View maintenance requests for vehicles and manage them.</p>
              <Link to="/transport/maintenance-request" className="btn btn-primary">
                Manage Requests
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
              <h5 className="card-title">Reports</h5>
              <p className="card-text">Generate and view transport-related reports.</p>
              <Link to="/transport/reports" className="btn btn-primary">
                View Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportDashboard;
