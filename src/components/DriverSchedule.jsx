import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Logo from "../assets/Logo.jpg"; // Import the logo

const DriverSchedule = () => {
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const schedules = [
    {
      id: 1,
      sender: "John Doe",
      destination: "Adama",
      startDate: "23/12/2025",
      startTime: "6:00 AM",
      travelers: ["John Doe", "John Doe", "John Doe", "John Doe", "John Doe"],
    },
  ];

  const handleViewDetails = (schedule) => {
    setSelectedSchedule(schedule);
  };

  const closePopup = () => {
    setSelectedSchedule(null);
  };

  return (
    <div className="d-flex vh-100">
      <div className="flex-grow-1 p-4 bg-light">
        <h5 className="mb-3">View Schedule</h5>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Sender</th>
              <th>Destination</th>
              <th>Start Date</th>
              <th>Start Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>{schedule.id}</td>
                <td>{schedule.sender}</td>
                <td>{schedule.destination}</td>
                <td>{schedule.startDate}</td>
                <td>{schedule.startTime}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleViewDetails(schedule)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSchedule && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white p-4 rounded shadow-lg" style={{ width: "400px" }}>
            <img src={Logo} alt="Logo" className="img-fluid mb-3" style={{ maxWidth: "100px", margin: "0 auto" }} />
            <h5 className="mb-3">Route Details</h5>
            <p><strong>Sender:</strong> {selectedSchedule.sender}</p>
            <p><strong>Destination:</strong> {selectedSchedule.destination}</p>
            <p><strong>Start Date:</strong> {selectedSchedule.startDate}</p>
            <p><strong>Start Time:</strong> {selectedSchedule.startTime}</p>
            <p><strong>Travelers:</strong></p>
            <ul>
              {selectedSchedule.travelers.map((traveler, index) => (
                <li key={index}>{traveler}</li>
              ))}
            </ul>
            <div className="d-flex justify-content-center">
              <button
                className="btn"
                style={{
                  backgroundColor: "#0B455B",
                  color: "white"
                }}
                onClick={closePopup}
              >
                Notify Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverSchedule;