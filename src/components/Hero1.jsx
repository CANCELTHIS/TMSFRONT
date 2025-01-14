import React from 'react';
import "../index.css";
import Car from '../assets/car.png';
import { useLanguage } from '../context/LanguageContext';

const Hero1 = () => {
  const { mylanguage } = useLanguage(); // Access the current language from context

  return (
    <div className="Hero1 bg-light w-100">
      <div className="container-fluid px-0">
        <div className="row align-items-center">
          {/* Text Section */}
          <div className="col-lg-6 col-12 text-center text-lg-start p-4">
            <h5 className="headertext1">
{mylanguage === 'EN' ? 'Ministry of Innovation and Technology':'የኢኖቬሽንና ቴክኖሎጂ ሚኒስቴር'}
            </h5>
            <h2 className="headertext2">
              {mylanguage === 'EN' 
                ? 'Streamline Your Fleet, Optimize Your Journey!' 
                : 'መጓጓዣዎን በማቀናበር, የእርስዎን ጉዞ ያሻሽሉ!'}
            </h2>
            <p className="headertext3">
              {mylanguage === 'EN' 
                ? 'Discover a smarter way to manage transportation. The Transport Management System (TMS) revolutionizes your workflow, digitizing and automating every step to save time, reduce inefficiencies, and ensure seamless coordination.' 
                : 'መጓጓዣ ለመቆጣጠር የሚያስችል ብልህ ዘዴ ይኑርህ። የትራንስፖርት አስተዳደር ስርዓት (TMS) የእርስዎን የስራ ፍሰት አብዮት, ጊዜ ለመቆጠብ, ውጤታማነትን ለመቀነስ እና ስፌት አልባ ቅንጅት ለማረጋገጥ እያንዳንዱን እርምጃ ዲጂቲንግ እና አውቶማቲክ ያደርገዋል.'}
            </p>
          </div>
          <div className="col-lg-6 col-12 text-center">
            <div className="carimage">
              <img src={Car} alt="car" id="car" className="img-fluid w-95" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero1;






















































































