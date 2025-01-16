import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import "./index.css";
import Home from './components/Home';
import Services from './components/Services';
import WhyTMS from './components/WhyTMS';
import EmailForm from './components/EmailForm';
import Footer from './components/Footer';
import { LanguageProvider } from './context/LanguageContext'; 
import Login from './components/Login';  // Import Login page
import Signup from './components/Signup';
const App = () => {
  return (
    <Router>
      <LanguageProvider>
        <div className="app" id="home">
          <NavBar />
          
          {/* Home Section */}
          <div id="home">
            <Home />
          </div>
          
          {/* Services Section */}
          <div id="services">
            <Services />
          </div>
          
          {/* About Section */}
          <div id="about">
            <WhyTMS />
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
