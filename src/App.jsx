import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import "./index.css";
import Hero1 from './components/Hero1';
import Hero2 from './components/Hero2';
import Hero3 from './components/Hero3';
import EmailForm from './components/EmailForm';
import Footer from './components/Footer';
import Login from './components/Login';  // Import Login page
import Signup from './components/Signup';
import { LanguageProvider } from './context/LanguageContext'; // Updated relative path

const App = () => {
  return (
    <Router>
      <LanguageProvider>
        <div className="app" id="home">
          <NavBar />
          
          {/* Home Section */}
          <div id="home">
            <Hero1 />
          </div>
          
          {/* Services Section */}
          <div id="services">
            <Hero2 />
          </div>
          
          {/* About Section */}
          <div id="about">
            <Hero3 />
          </div>

          {/* Contact Section */}
          <div id="contact">
            <EmailForm />
          </div>
          
          <Routes>
            <Route path="/login" element={<Login />} />  {/* Add Login route */}
            <Route path="/Signup" element={<Signup />} />
          </Routes>
          
          <Footer />
        </div>
      </LanguageProvider>
    </Router>
  );
};

export default App;
