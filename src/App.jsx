import React, { useState, useRef } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/NavBar';
import './index.css';
import Home from './components/Home';
import Services from './components/Services';
import WhyTMS from './components/WhyTMS';
import EmailForm from './components/EmailForm';
import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';
import LoginModal from './components/LoginModal'; // Importing LoginModal
import SignupModal from './components/SignupModal'; // Importing SignupModal

const App = () => {
  const [modalType, setModalType] = useState(null); // Track active modal ('login' or 'signup')

  // Create refs for each section to scroll to
  const homeRef = useRef(null);
  const servicesRef = useRef(null);
  const whyTMSRef = useRef(null);
  const emailFormRef = useRef(null);
  const footerRef = useRef(null);

  const closeModal = () => setModalType(null); // Close modal function

  return (
    <Router>
      <LanguageProvider>
        <div className={`app ${modalType ? 'blurred' : ''}`}>
          {/* Pass refs to NavBar */}
          <NavBar
            homeRef={homeRef}
            servicesRef={servicesRef}
            whyTMSRef={whyTMSRef}
            emailFormRef={emailFormRef}
            footerRef={footerRef}
            onOpenModal={setModalType}
          />
          {/* Sections */}
          <div ref={homeRef}><Home /></div>
          <div ref={servicesRef}><Services /></div>
          <div ref={whyTMSRef}><WhyTMS /></div>
          <div ref={emailFormRef}><EmailForm /></div>
          <div ref={footerRef}><Footer /></div>
        </div>

        {/* Modal Rendering */}
        {modalType === 'login' && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="close-button" onClick={closeModal}>X</button>
              <LoginModal /> {/* Display Login Modal */}
            </div>
          </div>
        )}
        {modalType === 'signup' && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="close-button" onClick={closeModal}>X</button>
              <SignupModal /> {/* Display Signup Modal */}
            </div>
          </div>
        )}
      </LanguageProvider>
    </Router>
  );
};

export default App;
