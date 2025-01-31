import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import Home from './components/Home';
import Services from './components/Services';
import WhyTMS from './components/WhyTMS';
import EmailForm from './components/EmailForm';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import Sidebar from './components/Sidebar';
import AdminPage from './components/AdminPage';
import AdminDepartmentPage from './components/AdminDepartmentPage';
import AccountPage from './components/AccountPage';
import HistoryPage from './components/HistoryPage';
import TransportDashboard from './components/TransportDashboard';
import VehicleManagement from './components/VehicleManagement';

const App = () => {
  const [modalType, setModalType] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const homeRef = useRef(null);
  const servicesRef = useRef(null);
  const whyTMSRef = useRef(null);
  const emailFormRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      setAuthToken(token);
      checkUserRole(token);
    }
  }, []);

  const checkUserRole = async (token) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/me/', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const userData = await response.json();
        setUserRole(userData.role);
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const closeModal = () => setModalType(null);

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.access);
        setIsAuthenticated(true);
        setAuthToken(data.access);
        setModalType(null);
        checkUserRole(data.access);
        setTimeout(() => {
          navigate(userRole === 'admin' ? '/admin' : '/');
        }, 500);
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className={`app ${modalType ? 'blurred' : ''}`}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <NavBar
                    homeRef={homeRef}
                    servicesRef={servicesRef}
                    whyTMSRef={whyTMSRef}
                    emailFormRef={emailFormRef}
                    footerRef={footerRef}
                    onOpenModal={setModalType}
                  />
                  <div ref={homeRef}><Home /></div>
                  <div ref={servicesRef}><Services /></div>
                  <div ref={whyTMSRef}><WhyTMS /></div>
                  <div ref={emailFormRef}><EmailForm /></div>
                  <Footer homeRef={homeRef} servicesRef={servicesRef} aboutRef={whyTMSRef} contactRef={emailFormRef} />
                </>
              }
            />

            {/* Admin Pages */}
            <Route
              path="/admin/*"
              element={
                <div className="d-flex">
                  <Sidebar role="admin" />
                  <div className="container">
                    <Routes>
                      <Route path="admin" element={<AdminPage />} />
                      <Route path="admin-department" element={<AdminDepartmentPage />} />
                      <Route path="account-page" element={<AccountPage />} />
                      <Route path="history" element={<HistoryPage />} />
                    </Routes>
                  </div>
                </div>
              }
            />

            {/* Transport Manager Pages */}
            <Route
              path="/transport/*"
              element={
                <div className="d-flex">
                  <Sidebar role="transport_manager" />
                  <div className="container">
                    <Routes>
                      <Route path="transport-dashboard" element={<TransportDashboard />} />
                      <Route path="vehicle-management" element={<VehicleManagement />} />
                    </Routes>
                  </div>
                </div>
              }
            />
          </Routes>

          {/* Modals */}
          {modalType === 'login' && (
            <div className="modal-overlay">
              <div className="modal">
                <button className="close-button" onClick={closeModal}>X</button>
                <LoginModal onLogin={handleLogin} />
              </div>
            </div>
          )}
          {modalType === 'signup' && (
            <div className="modal-overlay">
              <div className="modal">
                <button className="close-button" onClick={closeModal}>X</button>
                <SignupModal />
              </div>
            </div>
          )}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
