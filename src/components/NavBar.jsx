import React from 'react';
import Logo from "../assets/Logo.jpg";
import "../index.css";
import { IoMdArrowDropdown } from "react-icons/io";
import { useLanguage } from '../context/LanguageContext'; // Importing from context

const NavBar = () => {
  // Access the global language state and toggle function from the context
  const { mylanguage, toggleLanguage } = useLanguage();

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
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
                  <a className="nav-link" aria-current="page" href="#">
                    {mylanguage === 'EN' ? 'Home' : 'መግቢያ'}
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    {mylanguage === 'EN' ? 'Services' : 'አገልግሎቶች'}
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    {mylanguage === 'EN' ? 'About' : 'ስለ እኛ'}
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#" onClick={toggleLanguage}>
                  {mylanguage === 'EN' ? 'EN' : 'አማ'} <IoMdArrowDropdown />
                  </a>
                </li>
              </section>
            </ul>
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
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
