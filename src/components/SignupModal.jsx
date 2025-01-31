import React, { useState } from "react";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";

const SignupModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    department: "",
    password: "",
    confirm_password: "",
  });

  const { mylanguage } = useLanguage();
  const { myTheme } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.full_name ||
      !formData.phone_number ||
      !formData.email ||
      !formData.department ||
      !formData.password ||
      !formData.confirm_password
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/register/",  // Ensure this matches your backend endpoint
        { 
          ...formData, 
          role: 1 // Default role = Employee
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(response.data.message || "Registration successful!");
      setFormData({
        full_name: "",
        phone_number: "",
        email: "",
        department: "",
        password: "",
        confirm_password: "",
      });

      setTimeout(() => onClose(), 2000);
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "There was an issue with registration."
      );
    }
  };

  return (
    <div className="modal-overlay">
      <div
        className={`card p-4 shadow modal-card ${myTheme === "dark" ? "dark" : "light"}`}
        style={{ width: "22rem", position: "relative" }}
      >
        <button
          className="btn-close"
          style={{ position: "absolute", top: "10px", right: "10px" }}
          onClick={onClose}
        ></button>
        <h1 className="text-center mb-4">
          {mylanguage === "EN" ? "Sign Up" : "ይመዝገቡ"}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="full_name"
              className="form-control"
              placeholder={mylanguage === "EN" ? "Full Name" : "ሙሉ ስም"}
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="phone_number"
              className="form-control"
              placeholder={mylanguage === "EN" ? "Phone Number" : "ስልክ ቁጥር"}
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder={mylanguage === "EN" ? "Email" : "ኢሜል"}
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              name="department"
              className="form-control"
              placeholder={mylanguage === "EN" ? "Department" : "ክፍል"}
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder={mylanguage === "EN" ? "Password" : "ፕስወርድ"}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="confirm_password"
              className="form-control"
              placeholder={
                mylanguage === "EN" ? "Confirm Password" : "ፕስወርድን ያረጋግጡ"
              }
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: "#27485D", color: "#ffffff" }}
          >
            {mylanguage === "EN" ? "Sign Up" : "ይመዝገቡ"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
