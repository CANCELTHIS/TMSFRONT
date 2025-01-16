import React, { useState } from 'react';
import SignupModal from './SignupModal';
import '../index.css';
import { useLanguage } from '../context/LanguageContext';
const LoginModal = ({ onClose }) => {
  const [showSignup, setShowSignup] = useState(false);
const {mylanguage} = useLanguage();
  if (showSignup) {
    return <SignupModal onClose={() => setShowSignup(false)} />;
  }

  return (
    <div className="modal-overlay">
      <div className="card p-4 shadow" style={{ width: '22rem', position: 'relative' }}>
        <button
          className="btn-close"
          style={{ position: 'absolute', top: '10px', right: '10px' }}
          onClick={onClose}
        ></button>
        <h1 className="text-center mb-4">{mylanguage === 'EN' ? 'Login' : 'መግቢያ'}</h1>
        <form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              {mylanguage === "EN" ? "Email Address":"የኢሜል አድራሻ"}
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder={mylanguage === "EN" ? "Your email address" : "የኢሜል አድራሻዎን ያስገቡ"}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              {mylanguage === "EN" ? "Password":"ፓስወርድ"}
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder={mylanguage === "EN" ? "Your password" : "ፓስወርድዎን ያስገቡ"}
              required
            />
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{ backgroundColor: '#27485D', color: '#ffffff' }}
          >
            {mylanguage === "EN" ? "Login":"ይግቡ"}
          </button>
        </form>
        <div className="text-center mt-3">
        {mylanguage === "EN" ? "Don't have an account?" : "አካዉንት የሎትም?"}
          <a href="#" className="text-decoration-none signup" onClick={() => setShowSignup(true)}>
            {mylanguage === "EN" ? "Sign Up":"ይመዝገቡ"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
