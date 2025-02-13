import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard, MdLocalShipping, MdSettings } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { BiHistory } from "react-icons/bi";
import { FaUserShield, FaClipboardList } from "react-icons/fa";
import Logo from "../assets/Logo.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import '../index.css';  

const Sidebar = ({ role }) => {
  const location = useLocation(); 

  const getActiveClass = (path) => location.pathname === path ? "active text-primary  fw-bold" : "text-dark";
  const adminMenus = [
    { path: "/admin/admin", icon: <MdDashboard />, label: "Dashboard" },
    { path: "/admin/admin-department", icon: <IoIosPeople />, label: "Departments" },
    { path: "/admin/account-page", icon: <FaUserShield />, label: "Accounts" },
    { path: "/admin/history", icon: <BiHistory />, label: "History" },
  ];
  const transportMenus = [
    { path: "/transport/transport-dashboard", icon: <MdDashboard />, label: "Dashboard" },
    { path: "/transport/vehicle-management", icon: <MdLocalShipping />, label: "Vehicle Management" },
  ];
  const isTransportPage = location.pathname.startsWith("/transport");
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="d-flex flex-column bg-light px-3 py-4 " style={{ width: "220px", height: "100vh"}}>
      <div className="text-center">
        <img src={Logo} alt="Logo" className="img-fluid mb-3" style={{ maxWidth: "100px" }} />
      </div>
      <ul className="nav flex-column">
        {isAdminPage && adminMenus.map((menu, index) => (
          <li className="nav-item" key={index}>
            <Link to={menu.path} className={`nav-link d-flex align-items-center ${getActiveClass(menu.path)} sidebar-link`}>
              {menu.icon}
              <span className="ms-2">{menu.label}</span>
            </Link>
          </li>
        ))}

        {isTransportPage && transportMenus.map((menu, index) => (
          <li className="nav-item" key={index}>
            <Link to={menu.path} className={`nav-link d-flex align-items-center ${getActiveClass(menu.path)} sidebar-link`}>
              {menu.icon}
              <span className="ms-2">{menu.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar; 