import React from 'react';
import ServiceCard from './ServiceCard';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import "../index.css";

const Services = () => {
  const { mylanguage } = useLanguage(); // Access the current language context
  const { myTheme } = useTheme();

  return (
    <div className={`${myTheme === "dark" ? "dark" : "light"}`}>
      <h2 
        className="d-flex justify-content-center" 
        id="texthero2"
        style={{
          color: myTheme === "dark" ? "#B3A2F0" : "#106374", // Apply the color for dark mode
        }}
      >
        {mylanguage === 'EN' 
          ? 'We Offer Best Services' 
          : 'እኛ ምርጥ አገልግሎቶችን እናቀርባለን'}
      </h2>
      <ServiceCard />
    </div>
  );
};

export default Services;
