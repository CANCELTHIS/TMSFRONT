import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const EmployeePage= () => {
  const [requesterName, setRequesterName] = useState('');
  const [startDay, setStartDay] = useState('');
  const [returnDay, setReturnDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  const [employees, setEmployees] = useState([]);
  const [employeeName, setEmployeeName] = useState('');

  // Get today's date in yyyy-mm-dd format
  const today = new Date().toISOString().split("T")[0];

  const handleAddEmployee = () => {
    if (employeeName) {
      setEmployees([...employees, employeeName]);
      setEmployeeName('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Log the form data
    console.log({
      requesterName,
      startDay,
      returnDay,
      startTime,
      destination,
      reason,
      employees,
    });

    // Clear the form after submission
    setRequesterName('');
    setStartDay('');
    setReturnDay('');
    setStartTime('');
    setDestination('');
    setReason('');
    setEmployees([]);
    setEmployeeName('');
  };

  return (
    <div>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2 className="text-center mb-4">Transport Request Form</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Person who requests</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Full Name"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Start Day</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDay}
                  onChange={(e) => setStartDay(e.target.value)}
                  min={today} // Restrict past dates
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Return Day</label>
                <input
                  type="date"
                  className="form-control"
                  value={returnDay}
                  onChange={(e) => setReturnDay(e.target.value)}
                  min={today}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">List of Employees</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleAddEmployee}
                  >
                    Add
                  </button>
                </div>
                <ul className="list-group mt-2">
                  {employees.map((employee, index) => (
                    <li key={index} className="list-group-item">
                      {employee}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-3">
                <label className="form-label">Destination</label>
                <input
                  type="text"
                  className="form-control"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Reason</label>
                <textarea
                  className="form-control"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows="3"
                />
              </div>

              <div className="text-center mb-4">
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EmployeePage;
