import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import '../index.css'; // Import the CSS file for specific styles
import { useTheme } from '../context/ThemeContext';
const SignupModal = ({ onClose }) => {
  const { mylanguage } = useLanguage();
  const {myTheme} = useTheme();
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
    console.log('Form Data Submitted: ', formData);
    // Add your submission logic here (e.g., API call)
  };

  return (
    <div className="modal-overlay">
      <div className={`card modal-card ${myTheme==="dark"?"dark":"light"}`}>
      <button
          className="btn-close"
          style={{ position: 'absolute', top: '10px', right: '10px' }}
          onClick={onClose}
        ></button>
        <h1 className="modal-title">
          {mylanguage === "EN" ? "Sign Up" : "ይመዝገቡ"}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label label">
              {mylanguage === "EN" ? "Name" : "ስም"}
            </label>
            <input
              type="text"
              className="form-control input-field"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={mylanguage === "EN" ? "Enter your name" : "ስምዎን ይግቡ"}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label label">
              {mylanguage === "EN" ? "Phone" : "ስልክ ቁጥር"}
            </label>
            <input
              type="tel"
              className="form-control input-field"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder={mylanguage === "EN" ? "Enter your phone number" : "ስልክ ቁጥርዎን ይግቡ"}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label label">
              {mylanguage === "EN" ? "Email" : "ኢሜል"}
            </label>
            <input
              type="email"
              className="form-control input-field"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={mylanguage === "EN" ? "Enter your email address" : "ኢሜል አድራሻዎን ይግቡ"}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="role" className="form-label label">
              {mylanguage === "EN" ? "Role" : "ክፍል"}
            </label>
            <select
              className="form-select input-field"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">
                {mylanguage === "EN" ? "Select a role" : "ክፍል ይምረጡ"}
              </option>
              <option value="Admin">
                {mylanguage === "EN" ? "Admin" : "አስተዳዳሪ"}
              </option>
              <option value="Manager">
                {mylanguage === "EN" ? "Manager" : "አስተዳዳሪ"}
              </option>
              <option value="Employee">
                {mylanguage === "EN" ? "Employee" : "ሰራተኛ"}
              </option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="department" className="form-label label">
              {mylanguage === "EN" ? "Department" : "ክፍል"}
            </label>
            <select
              className="form-select input-field"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">
                {mylanguage === "EN" ? "Select a department" : "ክፍል ይምረጡ"}
              </option>
              <option value="HR">
                {mylanguage === "EN" ? "HR" : "አሰፋላሊ"}
              </option>
              <option value="Finance">
                {mylanguage === "EN" ? "Finance" : "ፋይናንስ"}
              </option>
              <option value="IT">
                {mylanguage === "EN" ? "IT" : "ኢቲ"}
              </option>
              <option value="Marketing">
                {mylanguage === "EN" ? "Marketing" : "ማርኬቲንግ"}
              </option>
            </select>
          </div>

          <div className="text-center">
            <button type="submit" className="btn submit-btn">
              {mylanguage === "EN" ? "Sign Up" : "መመዝገብ"}
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          {mylanguage === "EN" ? "Already have an account?" : "አሁንም አካውንት አላችሁ?"}{' '}
          <a href="#" className="text-decoration-none login-link" onClick={() => onClose()}>
            {mylanguage === "EN" ? "Login" : "ይግቡ"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
