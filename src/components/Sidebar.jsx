"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdAttachEmail, MdMenu, MdSchedule } from "react-icons/md";
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
import { LetterTextIcon, Settings, Wrench } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { FaRoute } from "react-icons/fa";

const Sidebar = ({ role }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { mylanguage } = useLanguage();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const getActiveClass = (path) =>
    location.pathname === path ? "active text-primary fw-bold" : "text-dark";

  // Helper function to translate labels
  const t = (en, am) => (mylanguage === "EN" ? en : am);

  const adminMenus = [
    {
      title: t("Management", "አስተዳደር"),
      items: [
        {
          path: "/admin/admin",
          icon: <MdOutlineDashboard size={18} />,
          label: "Dashboard",
        },
        {
          path: "/admin/admin-department",
          icon: <IoBusiness size={18} />,
          label: "Departments",
        },
        {
          path: "/admin/account-page",
          icon: <FaUserCog size={18} />,
          label: "Accounts",
        },
      ],
    },
    {
      title: t("Records", "ቀዳሚ ማስታወሻዎች"),
      items: [
        {
          path: "/admin/history",
          icon: <MdOutlineHistory size={18} />,
          label: "History",
        },
      ],
    },
  ];

  const transportMenus = [
    {
      title: t("Overview", "አጠቃላይ እይታ"),
      items: [
        {
          path: "/transport-manager/dashbord",
          icon: <MdOutlineDashboard size={18} />,
          label: t("Dashboard", "ዳሽቦርድ"),
        },
      ],
    },
    {
      title: t("Operations", "ኦፕሬሽኖች"),
      items: [
        {
          path: "/transport-manager/vehicle-request",
          icon: <MdOutlineRequestPage size={18} />,
          label: t("Vehicle Request", "የተሽከርካሪ ጥያቄ"),
        },
         {
          path: "/transport-manager/high_cost",
          icon: <FaRoute />,
          label: t("Field Trip Request", "የተሽከርካሪ ጥያቄ"),
        },
      ],
    },
    {
      title: t("Requests", "ጥያቄዎች"),
      items: [
        {
          path: "/transport-manager/maintenance-request",
          icon: <FaTools size={18} />,
          label: t("Create Maintenance Request", "የጥገና ጥያቄ ፍጠር"),
        },
        {
          path: "/transport-manager/vehicle-services",
          icon: <Settings />,
          label: "Monthly Kilometer",
        },
        {
          path: "/transport-manager/hight-cost-request",
          icon: <FaRoute />,
          label: "Field Trip Request",
        },
      ],
    },
    {
      title: t("Vehicle Management", "የተሽከርካሪ አስተዳደር"),
      items: [
        {
          path: "/transport-manager/vehicle-management",
          icon: <AiOutlineCar size={18} />,
          label: t("Vehicle Management", "የተሽከርካሪ አስተዳደር"),
        },
        {
          path: "/transport-manager/under-maintanace-vechile",
          icon: <FaTools size={18} />,
          label: t("Under Maintenance", "በጥገና ላይ ያሉ መኪናዎች"),
        },
      ],
    },
    {
      title: t("Maintenance & Services", "ጥገና እና አገልግሎቶች"),
      items: [
        {
          path: "/transport-manager/maintenance-table",
          icon: <FaTools size={18} />,
          label: t("Maintenance", "ጥገና"),
        },
        {
          path: "/transport-manager/service",
          icon: <Wrench size={18} />,
          label: t("Vehicle Service", "የተሽከርካሪ አገልግሎት"),
        },
      ],
    },
    {
      title: t("Fuel Management", "የነዳጅ አስተዳደር"),
      items: [
        {
          path: "/transport-manager/refueling",
          icon: <FaGasPump size={18} />,
          label: t("Refueling", "እንደገና ማሙላት"),
        },
        {
          path: "/transport-manager/monthly-coupons",
          icon: <MdAttachEmail size={18} />,
          label: "Transport Coupons",
        },
      ],
    },
    {
      title: t("Reports & History", "ሪፖርቶች እና ታሪክ"),
      items: [
        {
          path: "/transport-manager/report",
          icon: <AiOutlineFileText size={18} />,
          label: t("Report", "ሪፖርት"),
        },
        {
          path: "/transport-manager/history",
          icon: <MdOutlineHistory size={18} />,
          label: t("History", "ታሪክ"),
        },
      ],
    },
  ];

  const driverMenus = [
    {
      title: t("Schedules", "ስክድዩሎች"),
      items: [
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
      ],
    },
    {
      title: t("Requests", "ጥያቄዎች"),
      items: [
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
          icon: <Settings />,
          label: "Monthly Kilometer",
        },
        {
          path: "/driver/monthly-coupon",
          icon: <LetterTextIcon />,
          label: "Request Coupon",
        },
      ],
    },
  ];

  const departmentManagerMenus = [
    {
      title: t("Operations", "ኦፕሬሽኖች"),
      items: [
        {
          path: "/department-manager/vehicle-request",
          icon: <MdOutlineRequestPage />,
          label: "Vehicle Request",
        },
      ],
    },
    {
      title: t("Requests", "ጥያቄዎች"),
      items: [
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
          path: "/department-manager/vehicle-services",
          icon: <Settings />,
          label: "Monthly Kilometer",
        },
        {
          path: "/department-manager/hight-cost-request",
          icon: <FaRoute />,
          label: "Field Trip Request",
        },
        {
          path: "/department-manager/monthly-coupon",
          icon: <LetterTextIcon />,
          label: "Request Coupon",
        },
      ],
    },
    {
      title: t("Records", "ቀዳሚ ማስታወሻዎች"),
      items: [
        {
          path: "/department-manager/history",
          icon: <MdOutlineHistory />,
          label: "History",
        },
      ],
    },
  ];

  const financeManagerMenus = [
    {
      title: t("Operations", "ኦፕሬሽኖች"),
      items: [
        {
          path: "/finance-manager/hight-cost",
          icon: <FaGaugeHigh />,
          label: "Field Trip",
        },
        {
          path: "/finance-manager/refueling",
          icon: <FaGasPump />,
          label: "Refueling",
        },
      ],
    },
    {
      title: t("Maintenance & Service", "ጥገና"),
      items: [
        {
          path: "/finance-manager/financemaintenance-table",
          icon: <FaTools />,
          label: "Maintenance Request",
        },
        {
          path: "/finance-manager/service",
          icon: <Wrench />,
          label: "Vehicle Service",
        },
      ],
    },
    {
      title: t("Requests", "ጥያቄዎች"),
      items: [
        {
          path: "/finance-manager/vehicle-services",
          icon: <Settings />,
          label: "Monthly Kilometer",
        },
        {
          path: "/finance-manager/maintenance-request",
          icon: <FaTools />,
          label: "Create Maintenance Request",
        },
        {
          path: "/finance-manager/monthly-coupon",
          icon: <LetterTextIcon />,
          label: "Request Coupon",
        },
        {
          path: "/finance-manager/hight-cost-request",
          icon: <FaRoute />,
          label: "Field Trip request",
        },
      ],
    },
  ];

  const ceoMenus = [
    {
      title: t("Overview", "አጠቃላይ እይታ"),
      items: [
        {
          path: "/ceo/dashbord",
          icon: <MdOutlineDashboard size={18} />,
          label: t("Dashboard", "ዳሽቦርድ"),
        },
      ],
    },
    {
      title: t("Operations", "ኦፕሬሽኖች"),
      items: [
        {
          path: "/ceo/high_cost",
          icon: <FaRoute />,
          label: "Field Trip",
        },
        {
          path: "/ceo/refueling",
          icon: <FaGasPump />,
          label: "Refueling",
        },
        {
          path: "/ceo/ceomaintenance-table",
          icon: <FaTools />,
          label: "Maintenance",
        },
        {
          path: "/ceo/service",
          icon: <Wrench />,
          label: "Vehicle Service",
        },
      ],
    },
    {
      title: t("Requests", "ጥያቄዎች"),
      items: [
        {
          path: "/ceo/vehicle-services",
          icon: <Settings />,
          label: "Monthly Kilometer",
        },
        {
          path: "/ceo/maintenance-request",
          icon: <FaTools />,
          label: "Create Maintenance Request",
        },
        {
          path: "/ceo/monthly-coupon",
          icon: <LetterTextIcon />,
          label: "Request Coupon",
        },
        {
          path: "/ceo/hight-cost-request",
          icon: <FaRoute />,
          label: "Field Trip Request",
        },
      ],
    },
    {
      title: t("Records", "ቀዳሚ ማስታወሻዎች"),
      items: [
        {
          path: "/ceo/history",
          icon: <MdOutlineHistory />,
          label: "History",
        },
      ],
    },
  ];

  const BudgetManagerMenus = [
    {
      title: t("Operations", "ኦፕሬሽኖች"),
      items: [
        {
          path: "/budget-manager/refueling",
          icon: <FaGasPump />,
          label: "Refueling",
        },
        {
          path: "/budget-manager/high_cost",
          icon: <FaRoute />,
          label: "Field Trip",
        },
        {
          path: "/budget-manager/maintenance",
          icon: <FaTools />,
          label: "Maintenance",
        },
        {
          path: "/budget-manager/service",
          icon: <Wrench />,
          label: "Vehicle Service",
        },
      ],
    },
    {
      title: t("Requests", "ጥያቄዎች"),
      items: [
        {
          path: "/budget-manager/vehicle-services",
          icon: <Settings />,
          label: "Monthly Kilometer",
        },
        {
          path: "/budget-manager/maintenance-request",
          icon: <FaTools />,
          label: "Create Maintenance Request",
        },
        {
          path: "/budget-manager/monthly-coupon",
          icon: <LetterTextIcon />,
          label: "Request Coupon",
        },
        {
          path: "/budget-manager/hight-cost-request",
          icon: <FaRoute />,
          label: "Field Trip Request",
        },
      ],
    },
    {
      title: t("Records", "ቀዳሚ �ማስታወሻዎች"),
      items: [
        {
          path: "/budget-manager/history",
          icon: <MdOutlineHistory />,
          label: "History",
        },
      ],
    },
  ];

  const GeneralSystemExcuterMenus = [
    {
      title: t("Overview", "አጠቃላይ እይታ"),
      items: [
        {
          path: "/general-service/dashboard",
          icon: <MdOutlineDashboard size={18} />,
          label: t("Dashboard", "ዳሽቦርድ"),
        },
      ],
    },
    {
      title: t("Operations", "ኦፕሬሽኖች"),
      items: [
        {
          path: "/general-service/refueling",
          icon: <FaGasPump />,
          label: "Refueling",
        },
        {
          path: "/general-service/high_cost",
          icon: <FaRoute />,
          label: "Field Trip",
        },
        {
          path: "/general-service/maintenance",
          icon: <Wrench />,
          label: "Maintenance",
        },
        {
          path: "/general-service/service",
          icon: <Wrench />,
          label: "Vehicle Service",
        },
      ],
    },
    {
      title: t("Requests", "ጥያቄዎች"),
      items: [
        {
          path: "/general-service/vehicle-services",
          icon: <Settings />,
          label: "Monthly Kilometer",
        },
        {
          path: "/general-service/maintenance-request",
          icon: <FaTools />,
          label: "Create Maintenance Request",
        },
        {
          path: "/general-service/monthly-coupon",
          icon: <LetterTextIcon />,
          label: "Request Coupon",
        },
        {
          path: "/general-service/hight-cost-request",
          icon: <FaRoute />,
          label: "Field Trip Request",
        },
      ],
    },
    {
      title: t("Records", "ቀዳሚ ማስታወሻዎች"),
      items: [
        {
          path: "/general-service/history",
          icon: <MdOutlineHistory />,
          label: "History",
        },
      ],
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
    "/budget-manager": BudgetManagerMenus,
  };

  const activeMenu = Object.keys(menuMappings).find((key) =>
    location.pathname.startsWith(key)
  );
  const menuGroups = activeMenu ? menuMappings[activeMenu] : [];

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
        } sidebar-scrollbar`}
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
          overflowY: "auto",
          scrollbarWidth: "thin",
          msOverflowStyle: "auto",
        }}
      >
        <style>
          {`
            .sidebar-scrollbar::-webkit-scrollbar {
              width: 8px;
              background: #e0e0e0;
            }
            .sidebar-scrollbar::-webkit-scrollbar-thumb {
              background: #bdbdbd;
              border-radius: 4px;
            }
            .sidebar-section-title {
              font-size: 0.75rem;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #6c757d;
              margin-top: 1rem;
              margin-bottom: 0.5rem;
              padding-left: 0.5rem;
            }
          `}
        </style>
        <div className="sidebar-hide-scrollbar d-flex flex-column h-85">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="text-center">
              <img
                src={Logo || "/placeholder.svg"}
                alt="Logo"
                className="img-fluid"
                style={{ maxWidth: "80px", marginLeft: "90px" }}
              />
            </div>
            {/* X Button for closing sidebar */}
            <button
              className="btn btn-light ms-2"
              style={{ fontSize: "18px", color: "#222", border: "none", background: "none", boxShadow: "none", padding: "0 4px", position: "absolute", top: "10px", right: "10px" }}
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              &#10005;
            </button>
          </div>

          <ul className="nav flex-column">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <div
                  className="sidebar-section-title"
                  style={{ fontSize: "16px", color: "#545250bc" }}
                >
                  {group.title}
                </div>
                {group.items.map((menu, index) => (
                  <li className="nav-item" key={`${groupIndex}-${index}`}>
                    <Link
                      to={menu.path}
                      className={`nav-link d-flex align-items-center ${getActiveClass(
                        menu.path
                      )} sidebar-link`}
                      onClick={() => setIsOpen(false)}
                    >
                      {menu.icon}
                      <span className="ms-2">{menu.label}</span>
                    </Link>
                  </li>
                ))}
              </div>
            ))}
          </ul>
        </div>
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