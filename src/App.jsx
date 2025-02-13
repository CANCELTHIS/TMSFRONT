import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate ,useNavigate} from 'react-router-dom';
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
import Header from './components/Header';
import AdminPage from './components/AdminPage';
import AdminDepartmentPage from './components/AdminDepartmentPage';
import AccountPage from './components/AccountPage';
import HistoryPage from './components/HistoryPage';
import VehicleManagement from './components/VehicleManagement';
import EmployeePage from './components/EmployeePage';
import FinanceManagerPage from './components/FinanceManagerPage';
import DepartmentManagerPage from './components/DepartmentManagerPage';
import DriverPage from './components/DriverPage';
import CEOPPage from './components/CEOPPage';
import TransportDashboard from './components/TransportManagerPage';
import PleaseLoginPage  from './PleaseLoginPage'
// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated, redirectTo }) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }
  return children;
};

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
        
        const userResponse = await fetch('http://127.0.0.1:8000/api/user/me/', {
          method: 'GET',
          headers: { Authorization: `Bearer ${data.access}` },
        });
  
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserRole(userData.role);
  
          // Redirect based on role
          switch (userData.role) {
            case 'admin':
              navigate('/admin/admin');
              break;
            case 'employee':
              navigate('/employee');
              break;
            case 'department_manager':
              navigate('/department-manager');
              break;
            case 'finance_manager':
              navigate('/finance-manager');
              break;
            case 'transport_manager':
              navigate('/transport-manager');
              break;
            case 'ceo':
              navigate('/ceo');
              break;
            case 'driver':
              navigate('/driver');
              break;
            default:
              navigate('/'); // Fallback
              break;
          }
        }
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
            {/* Protected Routes */}
            <Route
              path="/employee"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirectTo="/-login">
                  <EmployeePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/department-manager"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirectTo="/-login">
                  <DepartmentManagerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/finance-manager"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirectTo="/-login">
                  <FinanceManagerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transport-manager/*"
              element={
                <div className="d-flex">
                  <Header role="transport_manager" />
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
            <Route
              path="/ceo"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirectTo="/-login">
                  <CEOPPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirectTo="/-login">
                  <DriverPage />
                </ProtectedRoute>
              }
            />
            {/* Admin Pages */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirectTo="/-login">
                  <div className="d-flex">
                    <Header role="admin" />
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
                </ProtectedRoute>
              }
            />
            {/* Transport Manager Pages */}
            <Route
              path="/transport/*"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} redirectTo="/-login">
                  <div className="d-flex">
                    <Header role="transport_manager" />
                    <Sidebar role="transport_manager" />
                    <div className="container">
                      <Routes>
                        <Route path="transport-dashboard" element={<TransportDashboard />} />
                        <Route path="vehicle-management" element={<VehicleManagement />} />
                      </Routes>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="/-login" element={<PleaseLoginPage />} />
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


