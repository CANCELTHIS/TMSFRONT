import React from 'react';
import { Link } from 'react-router-dom';
import Logo from "../assets/Logo.jpg";
import "../index.css";
import { IoMdArrowDropdown } from "react-icons/io";

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img id="logo" src={Logo} alt="MiNT Logo" />
        </Link>
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
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/services">Services</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">EN <IoMdArrowDropdown /></a>
              </li>
            </section>
          </ul>
          <Link
            className="btn"
            to="/login"
            style={{
              backgroundColor: '#F09F33',
              color: 'white',
              marginTop: '-5px'
            }}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
