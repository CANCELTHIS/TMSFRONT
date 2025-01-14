import React from 'react';
import Logo from "../assets/Logo.jpg";
import "../index.css";
import { useLanguage } from '../context/LanguageContext'; 
import { FaLanguage } from "react-icons/fa6";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const NavBar = () => {
  const { mylanguage, toggleLanguage } = useLanguage(); // Correct usage

  return (
    <div className='mynav'>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#home">
            <img id="logo" src={Logo} alt="MiNT Logo" />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex justify-content-center">
              <section className="navs">
                <li className="nav-item">
                  <a className="nav-link" href="#home">{mylanguage === 'EN' ? 'Home' : 'መግቢያ'}</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#services">{mylanguage === 'EN' ? 'Services' : 'አገልግሎቶች'}</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#about">{mylanguage === 'EN' ? 'About' : 'ስለ እኛ'}</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#contact">{mylanguage === 'EN' ? 'Contact Us' : 'እኛን እንደምን ደርሶ'}</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#" onClick={toggleLanguage}>
                    {mylanguage === 'EN' ? 'EN' : 'አማ'} <FaLanguage size={30} />
                  </a>
                </li>
              </section>
            </ul>
            <a href="/Login">
              <button
                className="btn"
                style={{
                  backgroundColor: '#F09F33',
                  color: 'white',
                  marginTop: '-5px'
                }}
              >
                {mylanguage === 'EN' ? 'Login' : 'መግቢያ'}
              </button>
              </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
