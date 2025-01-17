import React, { useState } from 'react';
import Logo from '../assets/Logo.jpg';
import '../index.css';
import { useLanguage } from '../context/LanguageContext';
import { FaLanguage } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import LoginModal from './LoginModal';
import { GiHamburgerMenu } from "react-icons/gi";

const NavBar = ({ homeRef, servicesRef, whyTMSRef, emailFormRef, onOpenModal }) => {
  const { mylanguage, toggleLanguage } = useLanguage();
  const [showLogin, setShowLogin] = useState(false);

  const scrollToSection = (sectionRef) => {
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
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
    <div className="mynav">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid d-flex gap-6">
          <a className="navbar-brand" href="/">
            <motion.img
              id="logo"
              src={Logo}
              alt="MiNT Logo"
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
<GiHamburgerMenu/>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex justify-content-center">
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
                    transition={{ delay: index * 0.1 }}
                  >
                    <a
                      className="nav-link"
                      href="#"
                      onClick={() => scrollToSection(ref)}  // Scroll to section on click
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
                <motion.li
                  className="nav-item"
                  initial="hidden"
                  animate="visible"
                  variants={linkVariants}
                >
                  <a className="nav-link" href="#" onClick={toggleLanguage}>
                    {mylanguage === 'EN' ? 'EN' : 'አማ'} <FaLanguage size={30} />
                  </a>
                </motion.li>
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
              onClick={() => setShowLogin(true)} // Open login modal on click
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
