"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdMenu, MdSchedule } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import Logo from "../assets/Logo.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import {
  MdOutlineDashboard,
  MdOutlineHistory,
  MdOutlineRequestPage,
} from "react-icons/md";
import { IoBusiness } from "react-icons/io5";
import { FaUserCog, FaTools, FaGasPump } from "react-icons/fa";
import { AiOutlineCar, AiOutlineFileText } from "react-icons/ai";
import { FaGaugeHigh } from "react-icons/fa6";
import { Wrench } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
const Sidebar = ({ role }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const { mylanguage } = useLanguage();
  const getActiveClass = (path) =>
    location.pathname === path ? "active text-primary fw-bold" : "text-dark";

  const adminMenus = [
    { path: "/admin/admin", icon: <MdOutlineDashboard />, label: "Dashboard" },
    {
      path: "/admin/admin-department",
      icon: <IoBusiness />,
      label: "Departments",
    },
    { path: "/admin/account-page", icon: <FaUserCog />, label: "Accounts" },
    { path: "/admin/history", icon: <MdOutlineHistory />, label: "History" },
  ];

  const transportMenus = [
    {
      path: "/transport-manager/transport-dashbord",
      icon: <MdOutlineDashboard />,
      label: mylanguage === "EN" ? "Dashboard" : "ዳሽቦርድ",
    },
    {
      path: "/transport-manager/vehicle-request",
      icon: <MdOutlineRequestPage />,
      label: mylanguage === "EN" ? "Vehicle Request" : "የተሽከርካሪ ጥያቄ",
    },
    {
      path: "/transport-manager/vehicle-management",
      icon: <AiOutlineCar />,
      label: mylanguage === "EN" ? "Vehicle Management" : "የተሽከርካሪ አስተዳደር",
    },
    {
      path: "/transport-manager/maintenance-table",
      icon: <FaTools />,
      label: mylanguage === "EN" ? "Maintenance" : "ጥገና",
    },
    {
      path: "/transport-manager/refueling",
      icon: <FaGasPump />,
      label: mylanguage === "EN" ? "Refueling" : "እንደገና ማሙላት",
    },
    {
      path: "/transport-manager/high_cost",
      icon: <FaGaugeHigh />,
      label:
        mylanguage === "EN"
          ? "Highcost Vehicle Requests"
          : "የከፍተኛ ዋጋ ተሽከርካሪ ጥያቄዎች",
    },
    {
      path: "/transport-manager/report",
      icon: <AiOutlineFileText />,
      label: mylanguage === "EN" ? "Report" : "ሪፖርት",
    },
    {
      path: "/transport-manager/history",
      icon: <MdOutlineHistory />,
      label: mylanguage === "EN" ? "History" : "ታሪክ",
    },
    {
      path: "/transport-manager/maintenance-request",
      icon: <FaTools />,
      label:
        mylanguage === "EN" ? "Create Maintenance Request" : "የጥገና ጥያቄ ፍጠር",
    },
    {
      path: "/transport-manager/service",
      icon: <Wrench />,
      label: mylanguage === "EN" ? "Vehicle Service" : "የተሽከርካሪ አገልግሎት",
    },
  ];

  const driverMenus = [
    {
      path: "/driver/driver-schedule",
      icon: <MdSchedule />,
      label: "Driver Schedules",
    },
    {
      path: "/driver/high-cost-schedule",
      icon: <FaGaugeHigh />,
      label: "High Cost Schedule",
    },
    {
      path: "/driver/maintenance-request",
      icon: <FaTools />,
      label: "Create Maintenance Request",
    },
    {
      path: "/driver/refueling-request",
      icon: <FaGasPump />,
      label: "Refueling Request",
    },
    {
      path: "/driver/vehicle-services",
      icon: <Wrench />,
      label: "Vehicle Service",
    },
  ];

  const departmentManagerMenus = [
    {
      path: "/department-manager/vehicle-request",
      icon: <MdOutlineRequestPage />,
      label: "Vehicle Request",
    },
    {
      path: "/department-manager/refueling-request",
      icon: <FaGasPump />,
      label: "Refueling",
    },
    {
      path: "/department-manager/maintenance-request",
      icon: <FaTools />,
      label: "Maintenance Request",
    },
    {
      path: "/department-manager/hight-cost",
      icon: <FaGaugeHigh />,
      label: "High Cost",
    },
    {
      path: "/department-manager/history",
      icon: <MdOutlineHistory />,
      label: "History",
    },
  ];

  const financeManagerMenus = [
    {
      path: "/finance-manager/hight-cost",
      icon: <FaGaugeHigh />,
      label: "High Cost",
    },
    {
      path: "/finance-manager/financemaintenance-table",
      icon: <FaTools />,
      label: "Maintenance Request",
    },
    {
      path: "/finance-manager/refueling",
      icon: <FaGasPump />,
      label: "Refueling",
    },
    {
      path: "/finance-manager/maintenance-request",
      icon: <FaTools />,
      label: "Create Maintenance Request",
    },
    {
      path: "/finance-manager/service",
      icon: <Wrench />,
      label: "Vehicle Service",
    },
  ];

  const ceoMenus = [
    {
      path: "/ceo/high_cost",
      icon: <FaGaugeHigh />,
      label: "Highcost Vehicle Requests",
    },
    { path: "/ceo/refueling", icon: <FaGasPump />, label: "Refueling" },
    {
      path: "/ceo/ceomaintenance-table",
      icon: <FaTools />,
      label: "Maintenance",
    },
    {
      path: "/ceo/maintenance-request",
      icon: <FaTools />,
      label: "Create Maintenance Request",
    },
    { path: "/ceo/history", icon: <MdOutlineHistory />, label: "History" },
    {
      path: "/ceo/service",
      icon: <Wrench />,
      label: "Vehicle Service",
    },
  ];
  const BudgetManagerMenus = [
    {
      path: "/budget-manager/refueling",
      icon: <FaGasPump />,
      label: "Refueling",
    },
    {
      path: "/budget-manager/high_cost",
      icon: <FaGaugeHigh />,
      label: "Highcost Vehicle Requests",
    },
    {
      path: "/budget-manager/maintenance",
      icon: <FaTools />,
      label: "Maintenance",
    },
    {
      path: "/budget-manager/maintenance-request",
      icon: <FaTools />,
      label: "Create Maintenance Request",
    },
    {
      path: "/budget-manager/history",
      icon: <MdOutlineHistory />,
      label: "History",
    },
    {
      path: "/budget-manager/service",
      icon: <Wrench />,
      label: "Vehicle Service",
    },
  ];

  const GeneralSystemExcuterMenus = [
    {
      path: "/general-service/refueling",
      icon: <FaGasPump />,
      label: "Refueling",
    },
    {
      path: "/general-service/high_cost",
      icon: <FaGaugeHigh />,
      label: "Highcost Vehicle Requests",
    },
    {
      path: "/general-service/maintenance",
      icon: <Wrench />,
      label: "Maintenance",
    },
    {
      path: "/general-service/maintenance-request",
      icon: <FaTools />,
      label: "Create Maintenance Request",
    },
    {
      path: "/general-service/history",
      icon: <MdOutlineHistory />,
      label: "History",
    },
    {
      path: "/general-service/service",
      icon: <Wrench />,
      label: "Vehicle Service",
    },
  ];

  const menuMappings = {
    "/admin": adminMenus,
    "/transport-manager": transportMenus,
    "/driver": driverMenus,
    "/department-manager": departmentManagerMenus,
    "/finance-manager": financeManagerMenus,
    "/ceo": ceoMenus,
    "/general-service": GeneralSystemExcuterMenus,
    "/budget-manager": BudgetManagerMenus, // Added Budget Officer menus
  };

  const activeMenu = Object.keys(menuMappings).find((key) =>
    location.pathname.startsWith(key)
  );
  const menus = activeMenu ? menuMappings[activeMenu] : [];

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        className={`btn btn-light position-fixed d-flex align-items-center justify-content-center ${
          isOpen ? "d-none" : ""
        }`}
        onClick={toggleSidebar}
        style={{
          top: "1px",
          left: "20px",
          zIndex: 1030,
          width: "40px",
          height: "40px",
        }}
      >
        <MdMenu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`d-flex flex-column px-3 py-4 position-fixed top-0 bottom-0 ${
          isOpen ? "show-sidebar" : "hide-sidebar"
        }`}
        style={{
          width: "300px",
          height: "100vh",
          left: 0,
          zIndex: 1020,
          transition: "transform 0.3s ease-in-out",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          borderBottom: "none",
          backgroundColor: "rgba(219, 219, 219, 0.9)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="text-center">
            <img
              src={Logo || "/placeholder.svg"}
              alt="Logo"
              className="img-fluid"
              style={{ maxWidth: "80px" }}
            />
          </div>
          <button
            className="btn "
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <IoClose size={24} />
          </button>
        </div>

        <ul className="nav flex-column">
          {menus.map((menu, index) => (
            <li className="nav-item" key={index}>
              <Link
                to={menu.path}
                className={`nav-link d-flex align-items-center ${getActiveClass(
                  menu.path
                )} sidebar-link`}
                onClick={() => setIsOpen(false)} // Close sidebar when a link is clicked
              >
                {menu.icon}
                <span className="ms-2">{menu.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 1010,
          }}
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
