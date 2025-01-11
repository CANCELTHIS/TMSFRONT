import React from 'react';
import "../index.css";

const EmailForm = () => {
  return (
    <div className="container py-4">
      {/* Header Section */}
      <h2 className="text-center mb-3">Get in Touch</h2>
      <p className="text-center text-muted mb-4">
        We are here for you! How can we help?
      </p>

      {/* Form Section */}
      <form className="mx-auto emailform" style={{ maxWidth: '500px' }}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter your name"
            required
            style={{ maxWidth: '100%' }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            required
            style={{ maxWidth: '100%' }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea
            className="form-control"
            id="message"
            rows="4"
            placeholder="Enter your message"
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
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailForm;
