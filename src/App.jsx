import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './index.css';
import Home from './components/Home';
import AdminPage from './components/AdminPage';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import Footer from './components/Footer';
import NavBar from './components/NavBar';
import Services from './components/Services'; // Your Services component
import WhyTMS from './components/WhyTMS'; // Your WhyTMS component
import EmailForm from './components/EmailForm'; // Your EmailForm component

const App = () => {
  const [modalType, setModalType] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [authToken, setAuthToken] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false); 

  const navigate = useNavigate();

  // Creating refs for each section
  const homeRef = useRef(null);
  const servicesRef = useRef(null);
  const whyTMSRef = useRef(null);
  const emailFormRef = useRef(null);
  const footerRef = useRef(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      setAuthToken(token);
      checkAdminStatus(token); 
    }
  }, []);

  const checkAdminStatus = async (token) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/me/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.role === 'admin') {
          setIsAdmin(true); 
        }
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const closeModal = () => setModalType(null); 

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
    return children;
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.access); 
        setIsAuthenticated(true);
        setAuthToken(data.access);
        setModalType(null); // Close the modal
        checkAdminStatus(data.access); 

        // Wait until `isAdmin` is set and then navigate
        setTimeout(() => {
          navigate(isAdmin ? '/admin' : '/');
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
          
          {/* Modal Rendering */}
          {modalType === 'login' && (
            <LoginModal onClose={closeModal} onLogin={handleLogin} />
          )}
          {modalType === 'signup' && <SignupModal onClose={closeModal} />}

          {/* Routes for Navigation */}
          <Routes>
            
            <Route path="/" element={
              <>
                {/* Navigation Bar with refs for sections */}
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
              </>
            } />

            {/* Admin Route - Protected */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>

        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
