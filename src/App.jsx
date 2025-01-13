import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import "./index.css";
import Hero1 from './components/Hero1';
import Hero2 from './components/Hero2';
import Hero3 from './components/Hero3';
import EmailForm from './components/EmailForm';
import Footer from './components/Footer';
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
  );
};

export default App;
