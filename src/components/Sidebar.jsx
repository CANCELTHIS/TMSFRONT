import React from "react";
import { Link } from "react-router-dom";
import { FaUserAlt, FaBuilding, FaClipboardList } from "react-icons/fa";
import Logo from "../assets/Logo.jpg";
import '../index.css';

const Sidebar = () => {
  return (
    <div className="d-flex flex-column align-items-center align-items-sm-start bg-light h-100 px-3 py-4">
      <div className="logo mb-4 text-center w-100">
        
      </div>
      <nav className="nav flex-column w-100">
        <ul className="nav flex-column w-100">
          <li className="nav-item mb-2">
            <Link to="/admin" className="nav-link text-dark d-flex align-items-center">
              <FaUserAlt className="me-2" />
              <span className="d-none d-sm-inline">Account</span>
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/department" className="nav-link text-dark d-flex align-items-center">
              <FaBuilding className="me-2" />
              <span className="d-none d-sm-inline">Department</span>
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/request" className="nav-link text-dark d-flex align-items-center">
              <FaClipboardList className="me-2" />
              <span className="d-none d-sm-inline">Request</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
