import React from 'react';
import ServiceCard from './ServiceCard';
import { useLanguage } from '../context/LanguageContext';

const Hero2 = () => {
  const { mylanguage } = useLanguage(); // Access the current language context

  return (
    <div>
      <h2 className="d-flex justify-content-center" id="texthero2">
        {mylanguage === 'EN' 
          ? 'We Offer Best Services' 
          : 'እኛ ምርጥ አገልግሎቶችን እናቀርባለን'}
      </h2>
      <ServiceCard />
    </div>
  );
};

export default Hero2;
