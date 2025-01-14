import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import "./index.css";
import Hero1 from './components/Hero1';
import Hero2 from './components/Hero2';
import Hero3 from './components/Hero3';
import EmailForm from './components/EmailForm';
import Footer from './components/Footer';
<<<<<<< HEAD
import Login from './components/Login';
import Signup from './components/Signup';

const App = () => {
  return (
    <Router>
      <div className="app" id="home">
        <NavBar />
        <Routes>
          <Route path="/" element={<Hero1 />} />
          <Route path="/services" element={<Hero2 />} />
          <Route path="/about" element={<Hero3 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/contact" element={<EmailForm />} />
        </Routes>
        <Footer />
      </div>
    </Router>
=======
import { LanguageProvider } from './context/LanguageContext'; // Updated relative path

const App = () => {
  return (
    <LanguageProvider>
      <div className="app" id="home">
        <NavBar />
        <Hero1 />
        <Hero2 />
        <Hero3 />
        <Hero4 />
        <Hero5 />
        <EmailForm />
        <Footer />
      </div>
    </LanguageProvider>
>>>>>>> 71aee9073c18f7bc6891e7f79bafd9264f87e7f2
  );
};

export default App;
