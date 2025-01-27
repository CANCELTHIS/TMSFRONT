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
        "http://127.0.0.1:8000/register/",
        { ...formData, role: 1 }, // Default role = Employee
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
          {mylanguage === "EN" ? "Sign Up" : "\u12ed\u1218\u12dd\u1308\u1269"}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="full_name"
              className="form-control"
              placeholder={mylanguage === "EN" ? "Full Name" : "\u1218\u1209 \u1235\u121d"}
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
              placeholder={mylanguage === "EN" ? "Phone Number" : "\u1235\u120d\u132d \u1241\u132d\u122d"}
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
              placeholder={mylanguage === "EN" ? "Email" : "\u12a2\u1218\u120d"}
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
              placeholder={mylanguage === "EN" ? "Department" : "\u12ad\u134d\u120d"}
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
              placeholder={mylanguage === "EN" ? "Password" : "\u134b\u1230\u12f0"}
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
                mylanguage === "EN"
                  ? "Confirm Password"
                  : "\u134b\u1230\u12f0\u1295 \u12a5\u1295\u12f0\u1308 \u12eb\u1235\u1308\u1269"
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
            {mylanguage === "EN" ? "Sign Up" : "\u12ed\u1218\u12dd\u1308\u1269"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;