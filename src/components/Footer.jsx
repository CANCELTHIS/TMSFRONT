import React from "react";
import { FaInstagram, FaYoutube, FaTelegram, FaPaperPlane } from "react-icons/fa";
import "../index.css";
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { mylanguage } = useLanguage(); // Access the current language context

  return (
    <footer className="footer text-white py-4">
      <div className="container">
        <div className="row">
          {/* First Column - Copyright and Social Media */}
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <div className="footer-column">
              <p>
                {mylanguage === 'EN' 
                  ? 'Copyright © 2025 Innovation and Technology Minister.' 
                  : 'የቅጂ መብት  © 2025 ፣ የኢኖቬሽን እና ቴክኖሎጂ ሚኒስቴር።'}
              </p>
              <p>
                {mylanguage === 'EN' ? 'All rights reserved' : 'ሁሉም መብቶች የተጠበቁ'}
              </p>
              <div className="social-icons">
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white me-2">
                  <FaInstagram size={30} />
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-white me-2">
                  <FaYoutube size={30} />
                </a>
                <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" className="text-white me-2">
                  <FaPaperPlane size={30} />
                </a>
                <a href="https://www.telegram.com" target="_blank" rel="noopener noreferrer" className="text-white">
                  <FaTelegram size={30} />
                </a>
              </div>
            </div>
          </div>

          {/* Second Column - Company Links */}
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <div className="footer-column">
              <h3 className="mb-3">
                {mylanguage === 'EN' ? 'Company' : 'ኩባንያ'}
              </h3>
              <ul className="footer-nav list-unstyled">
                <li>{mylanguage === 'EN' ? 'Home' : 'መነሻ'}</li>
                <li>{mylanguage === 'EN' ? 'Service' : 'አገልግሎት'}</li>
                <li>{mylanguage === 'EN' ? 'About Us' : 'ስለ እኛ'}</li>
                <li>{mylanguage === 'EN' ? 'Contact' : 'አገናኝ'}</li>
              </ul>
            </div>
          </div>

          {/* Third Column - Stay Up to Date */}
          <div className="col-12 col-md-4">
            <div className="footer-column">
              <h3 className="mb-3">
                {mylanguage === 'EN' ? 'Stay up to date' : 'ወቅታዊ ቆይታ'}
              </h3>
              <div className="subscribe">
                <input
                  type="email"
                  className="email-input form-control"
                  placeholder={mylanguage === 'EN' ? 'Enter your email address' : 'የኢሜል አድራሻዎን ያስገቡ'}
                />
                <button className="send-button btn btn-primary mt-2 mt-md-0">
                  <FaPaperPlane size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
