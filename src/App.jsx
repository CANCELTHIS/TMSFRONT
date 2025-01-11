import React from 'react';
import NavBar from './components/NavBar';
import "./index.css"
import Hero1 from './components/Hero1';
import Hero2 from './components/Hero2';
import Hero3 from './components/Hero3';
import Hero4 from './components/Hero4';
import Hero5 from './components/Hero5';
import EmailForm from './components/EmailForm';
import Footer from './components/Footer';
const App = () => {
  return (
    <div className='app' id="home">
      <NavBar/>
      <Hero1/>
      <Hero2/>
      <Hero3/>
      <Hero4/>
      <Hero5/>
      <EmailForm/>
      <Footer/>
    </div>
  );
};

export default App;
