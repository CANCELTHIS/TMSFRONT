import React, { useState } from 'react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    fname: '',
    phone: '',
    email: '',
    role: '',
    department: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
    // Add your submission logic here (e.g., API call)
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '30rem' }}>
        <h1 className="text-center mb-4">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="fname" className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              id="fname"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              placeholder="Enter your first name"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone</label>
            <input
              type="tel"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              className="form-select"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select a role</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="department" className="form-label">Department</label>
            <select
              className="form-select"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select a department</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="IT">IT</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: '#27485D', color: '#ffffff' }}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
