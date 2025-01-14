import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import "../index.css";
import { useLanguage } from '../context/LanguageContext';

const EmailForm = () => {
  const { mylanguage } = useLanguage(); // Access the current language context
  const form = useRef();

  // Language translations
  const translations = {
    EN: {
      header: "Get in Touch",
      subheader: "We are here for you! How can we help?",
      name: "Name",
      email: "Email",
      message: "Message",
      submit: "Submit",
    },
    AM: {
      header: "እንኳን ወደ ማኅበረሰብ ተገናኝተዋል",
      subheader: "እኛ ለእርስዎ እዚህ ነን! እንዴት ልርዳችሁ እንችላለን?",
      name: "ስም",
      email: "ኢሜል",
      message: "መልእክት",
      submit: "ማቅረብ",
    },
  };

  const lang = translations[mylanguage] || translations.EN; // Fallback to English

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_cf5gngo', 'template_0aua8iv', form.current, {
        publicKey: 'DYWJ0edl9oKjFT5mp',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };

  return (
    <div className="container py-4">
      {/* Header Section */}
      <h2 className="text-center mb-3">{lang.header}</h2>
      <p className="text-center text-muted mb-4">{lang.subheader}</p>

      {/* Form Section */}
      <form ref={form} onSubmit={sendEmail} className="mx-auto emailform" style={{ maxWidth: '500px' }}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            {lang.name}
          </label>
          <input
            type="text"
            name="user_name"
            className="form-control"
            id="name"
            placeholder={lang.name}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            {lang.email}
          </label>
          <input
            type="email"
            name="user_email"
            className="form-control"
            id="email"
            placeholder={lang.email}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            {lang.message}
          </label>
          <textarea
            name="message"
            className="form-control"
            id="message"
            rows="4"
            placeholder={lang.message}
            required
          ></textarea>
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">
            {lang.submit}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailForm;
