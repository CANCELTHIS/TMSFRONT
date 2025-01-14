// LanguageContext.js
import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [mylanguage, setLanguage] = useState('EN');

  const toggleLanguage = () => {
    setLanguage(mylanguage === 'EN' ? 'አማ' : 'EN');
  };

  return (
    <LanguageContext.Provider value={{ mylanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
