import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import './index.css';
import Home from './components/Home';
import Services from './components/Services';
import WhyTMS from './components/WhyTMS';
import EmailForm from './components/EmailForm';
import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';
import Login from './components/Login';
import Signup from './components/Signup';

const App = () => {
  return (
    <Router>
      <LanguageProvider>
        <div className="app">
          <Routes>
            {/* Main Sections */}
            <Route
              path="/"
              element={
                <>
                  <NavBar />
                  <div id="home">
                    <Home />
                  </div>
                  <div id="services">
                    <Services />
                  </div>
                  <div id="about">
                    <WhyTMS />
                  </div>
                  <div id="contact">
                    <EmailForm />
                  </div>
                  <Footer />
                </>
              }
            />
            {/* Login and Signup Pages */}
            <Route
              path="/login"
              element={
                <>
                  <NavBar />
                  <Login />
                  <Footer />
                </>
              }
            />
            <Route
              path="/signup"
              element={
                <>
                  <NavBar />
                  <Signup />
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </LanguageProvider>
    </Router>
  );
};

export default App;
