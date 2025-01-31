import React from "react";
import { FaUserCircle } from "react-icons/fa";
import Logo from '../assets/Logo.jpg';
import { CgProfile } from "react-icons/cg";

const Header = () => {
  return (
    <header className="d-flex justify-content-between align-items-center px-3 py-2 bg-white shadow-sm">
      <h2 className="header-title mb-0 fs-5">Admin Dashboard</h2>
      <div className="user-info d-flex align-items-center">
        {/* <span className="greeting me-2 d-none d-sm-inline">Hello, Admin</span>
        <FaUserCircle className="user-icon" size={50} style={{ color: "#333"}} /> */}
      <CgProfile/>
      </div>
    </header>
  );
};

export default Header;