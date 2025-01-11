import React from "react";
import { FaInstagram, FaYoutube, FaTelegram, FaPaperPlane } from "react-icons/fa";
import "../index.css";

const Footer = () => {
  return (
    <footer className="footer text-white py-4">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <div className="footer-column">
              <p>Copyright © 2025 Innovation and Technology Minister.</p>
              <p>All rights reserved</p>
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

          <div className="col-12 col-md-4 mb-4 mb-md-0">
            <div className="footer-column">
              <h3 className="mb-3">Company</h3>
              <ul className="footer-nav list-unstyled">
                <li>Home</li>
                <li>Service</li>
                <li>About Us</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="footer-column">
              <h3 className="mb-3">Stay up to date</h3>
              <div className="subscribe">
                <input
                  type="email"
                  className="email-input form-control"
                  placeholder="Enter your email address"
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
