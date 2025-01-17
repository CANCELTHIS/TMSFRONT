import React from 'react';
import { color, motion } from 'framer-motion';
import { FaFacebook, FaYoutube, FaLinkedin, FaTelegram } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

const Footer = ({ homeRef, servicesRef, aboutRef, contactRef }) => {
  const { mylanguage } = useLanguage(); // Access language context

  const scrollToSection = (sectionRef) => {
    sectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Social Media Links */}
        <div className="flex">
          <div className="one">
            <div className="copyright">
              © {new Date().getFullYear()} MiNT Solutions. All rights reserved.
            </div>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={30} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <FaYoutube size={30} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={30} />
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
                <FaTelegram size={30} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="quick-links">
            {[
              { section: 'home', ref: homeRef },
              { section: 'services', ref: servicesRef },
              { section: 'about', ref: aboutRef },
              { section: 'contact', ref: contactRef },
            ].map(({ section, ref }) => (
              <motion.div
                key={section}
                className="link"
                whileHover={{ scale: 1.1 }}
                onClick={() => scrollToSection(ref)}
              >
                {mylanguage === 'EN'
                  ? section.charAt(0).toUpperCase() + section.slice(1)
                  : section === 'home'
                  ? 'መግቢያ'
                  : section === 'services'
                  ? 'አገልግሎቶች'
                  : section === 'about'
                  ? 'ስለ እኛ'
                  : 'እኛን እንዴት እንደምን ደርስ'}
              </motion.div>
            ))}
          </div>

          {/* Philosophy Section */}
          <div className="philosophy">
            <h4 style={{color:"#F09F33"}}>{mylanguage === 'EN' ? 'Our Philosophy' : 'ፍልስፍናችን'}</h4>
            <p>
  {mylanguage === 'EN'
    ? (
        <>
          We believe in innovation and technology to create <br />
          sustainable solutions for a better tomorrow.
        </>
      )
    : 'እኛ በኢኖቬሽንና ቴክኖሎጂ ላይ እንምናለን እና ለወደፊት ቀላል የሆኑ መፍትሄዎችን እንፈጥራለን።'}
</p>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
