import React from 'react';
import "../index.css";
import { useLanguage } from '../context/LanguageContext';

const EmailForm = () => {
  const { mylanguage } = useLanguage(); // Access the current language context

  return (
    <div className="container py-4">
      {/* Header Section */}
      <h2 className="text-center mb-3">
        {mylanguage === 'EN' ? 'Get in Touch' : 'እንኳን ወደ ማኅበረሰብ ተገናኝተዋል'}
      </h2>
      <p className="text-center text-muted mb-4">
        {mylanguage === 'EN' ? 'We are here for you! How can we help?' : 'እኛ ለእርስዎ እዚህ ነን! እንዴት ልርዳችሁ እንችላለን?'}
      </p>

      {/* Form Section */}
      <form className="mx-auto emailform" style={{ maxWidth: '500px' }}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            {mylanguage === 'EN' ? 'Name' : 'ስም'}
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder={mylanguage === 'EN' ? 'Enter your name' : 'ስምዎን ይግቡ'}
            required
            style={{ maxWidth: '100%' }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            {mylanguage === 'EN' ? 'Email' : 'ኢሜል'}
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder={mylanguage === 'EN' ? 'Enter your email' : 'ኢሜልዎን ይግቡ'}
            required
            style={{ maxWidth: '100%' }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            {mylanguage === 'EN' ? 'Message' : 'መልእክት'}
          </label>
          <textarea
            className="form-control"
            id="message"
            rows="4"
            placeholder={mylanguage === 'EN' ? 'Enter your message' : 'መልእክትዎን ይግቡ'}
            required
            style={{ maxWidth: '100%' }}
          ></textarea>
        </div>

        {/* Center the Button */}
        <div className="d-flex justify-content-center">
          <button
            type="submit"
            className="btn landingSubmit"
            style={{ backgroundColor: '#0a3e4b', color: 'white' }}
          >
            {mylanguage === 'EN' ? 'Submit' : 'ማቅረብ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailForm;
