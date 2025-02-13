import React, { useState } from 'react';
import Logo from '../assets/Logo.jpg';
import { useLanguage } from '../context/LanguageContext';
import { FaLanguage } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import LoginModal from './LoginModal';
import { GiHamburgerMenu } from "react-icons/gi";
import { useTheme } from "../context/ThemeContext";
import { MdDarkMode } from "react-icons/md";
import { LuSunMedium } from "react-icons/lu";

const NavBar = ({ homeRef, servicesRef, whyTMSRef, emailFormRef }) => {
  const { mylanguage, toggleLanguage } = useLanguage();
  const [showLogin, setShowLogin] = useState(false);
  const { myTheme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('home'); // Track active section

  const scrollToSection = (sectionRef, section) => {
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(section); // Update active section
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className={`mynav ${myTheme === "dark" ? "dark" : "light"}`}>
      <nav className={`navbar navbar-expand-lg navbar-light fixed-top ${myTheme === "dark" ? "dark" : "light"}`}>
        <div className="container-fluid d-flex gap-6">
          <a className="navbar-brand" href="/">
            <motion.img
              id="logo"
              src={Logo}
              alt="Logo"
              initial="hidden"
              animate="visible"
              variants={logoVariants}
            />
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
            <GiHamburgerMenu color='#F09F33'/>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex gap-4">
              <section className="navs">
                {[
                  { section: 'home', ref: homeRef },
                  { section: 'services', ref: servicesRef },
                  { section: 'about', ref: whyTMSRef },
                  { section: 'contact', ref: emailFormRef },
                ].map(({ section, ref }, index) => (
                  <motion.li
                    key={section}
                    className="nav-item"
                    initial="hidden"
                    animate="visible"
                    variants={linkVariants}
                    transition={{ delay: index * 0.5 }}
                    style={{ marginRight: "20px" }}
                  >
                    <a
                      className="nav-link"
                      href="#"
                      onClick={() => scrollToSection(ref, section)}
                      style={{
                        color: myTheme === 'dark' ? '#B3A2F0' : '#106374',
                        fontSize: "20px",
                        textDecoration: activeSection === section ? 'underline' : 'none',
                        fontWeight: activeSection === section ? 'bold' : 'normal',
                      }}
                    >
                      {mylanguage === 'EN'
                        ? section.charAt(0).toUpperCase() + section.slice(1)
                        : section === 'home'
                        ? 'መግቢያ'
                        : section === 'services'
                        ? 'አገልግሎቶች'
                        : section === 'about'
                        ? 'ስለ እኛ'
                        : 'እኛን እንደምን ደርሶ'}
                    </a>
                  </motion.li>
                ))}
                <motion.li className="nav-item" initial="hidden" animate="visible" variants={linkVariants}>
                  <a
                    className="nav-link"
                    href="#"
                    onClick={toggleLanguage}
                    style={{
                      color: myTheme === 'dark' ? '#B3A2F0' : '#106374',
                    }}
                  >
                    {mylanguage === 'EN' ? 'EN' : 'አማ'} <FaLanguage size={20} />
                  </a>
                </motion.li>
                <motion.div
                  className="theme-icon mt-2"
                  onClick={toggleTheme}
                  style={{
                    alignItems: 'center',
                    cursor: 'pointer',
                    color: myTheme === 'dark' ? '#B3A2F0' : '#106374',
                  }}
                >
                  {myTheme === 'dark' ? <LuSunMedium size={20} /> : <MdDarkMode size={20} />}
                </motion.div>
              </section>
            </ul>
            <motion.button
              className="btn"
              style={{
                backgroundColor: '#F09F33',
                color: 'white',
                marginTop: '-5px',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowLogin(true)}
            >
              {mylanguage === 'EN' ? 'Login' : 'መግቢያ'}
            </motion.button>
          </div>
        </div>
      </nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default NavBar;
