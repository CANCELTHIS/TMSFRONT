import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard, MdLocalShipping, MdHistory, MdRequestQuote } from "react-icons/md";
import { IoIosPeople } from "react-icons/io";
import { FaUserShield, FaClipboardList, FaGasPump, FaTools } from "react-icons/fa";
import { IoCarSport } from "react-icons/io5";
import Logo from "../assets/Logo.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import '../index.css';  

const Sidebar = ({ role }) => {
  const location = useLocation();

  const getActiveClass = (path) => location.pathname === path ? "active text-primary fw-bold" : "text-dark";

  const adminMenus = [
    { path: "/admin/admin", icon: <MdDashboard />, label: "Dashboard" },
    { path: "/admin/admin-department", icon: <IoIosPeople />, label: "Departments" },
    { path: "/admin/account-page", icon: <FaUserShield />, label: "Accounts" },
    { path: "/admin/history", icon: <MdHistory />, label: "History" },
  ];

  const transportMenus = [
    { path: "/transport-manager/transport-dashbord", icon: <MdDashboard />, label: "Dashboard" },
    { path: "/transport-manager/vehicle-request", icon: <MdRequestQuote />, label: "Vehicle Request" },
    { path: "/transport-manager/vehicle-management", icon: <MdLocalShipping />, label: "Vehicle Management" },
    { path: "/transport-manager/maintenance-table", icon: <FaTools />, label: "Maintenance Table" },
    { path: "/transport-manager/report", icon: <FaTools />, label: "Maintenance Table" },
  ];

  const driverMenus = [
    { path: "/driver/driver-schedule", icon: <MdDashboard />, label: "Driver Schedule" },
    { path: "/driver/maintenance-request", icon: <FaTools />, label: "Maintenance Request" },
  ];

  const departmentManagerMenus = [
    { path: "/department-manager/vehicle-request", icon: <MdRequestQuote />, label: "Vehicle Request" },
    { path: "/department-manager/refueling", icon: <FaGasPump />, label: "Refueling" },
  ];

  const financeManagerMenus = [
    { path: "/finance-manager/vehicle-request", icon: <MdRequestQuote />, label: "Vehicle Request" },
    { path: "/finance-manager/refueling", icon: <FaGasPump />, label: "Refueling" },
  ];

  const ceoMenus = [
    { path: "/ceo/vehicle-request", icon: <MdRequestQuote />, label: "Vehicle Request" },
    { path: "/ceo/refueling", icon: <FaGasPump />, label: "Refueling" },
  ];

  const menuMappings = {
    "/admin": adminMenus,
    "/transport-manager": transportMenus,
    "/driver": driverMenus,
    "/department-manager": departmentManagerMenus,
    "/finance-manager": financeManagerMenus,
    "/ceo": ceoMenus,
  };

  const activeMenu = Object.keys(menuMappings).find((key) => location.pathname.startsWith(key));
  const menus = activeMenu ? menuMappings[activeMenu] : [];

  return (
    <div className="d-flex flex-column bg-light px-3 py-4" style={{ width: "220px", height: "100vh" }}>
      <div className="text-center">
        <img src={Logo} alt="Logo" className="img-fluid mb-3" style={{ maxWidth: "100px" }} />
      </div>
      <ul className="nav flex-column">
        {menus.map((menu, index) => (
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
