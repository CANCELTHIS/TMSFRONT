import React from 'react';
import "../index.css";
import Car from '../assets/car.png';
import Car2 from '../assets/car2.png'; // Add more images as needed
import Car3 from '../assets/car3.png'; // Add more images as needed
import { useLanguage } from '../context/LanguageContext';
import Typewriter from 'react-typewriter-effect';
import { Carousel } from 'react-bootstrap';

const Hero1 = () => {
  const { mylanguage } = useLanguage(); // Access the current language from context

  return (
    <div className="Hero1 bg-light w-100">
      <div className="container-fluid px-0">
        <div className="row align-items-center">
          {/* Text Section */}
          <div className="col-lg-6 col-12 text-center text-lg-start p-4">
            <h5 className="headertext1">
              {mylanguage === 'EN' 
                ? 'Ministry of Innovation and Technology' 
                : 'የኢኖቬሽንና ቴክኖሎጂ ሚኒስቴር'}
            </h5>
            <h2 className="headertext2">
              {mylanguage === 'EN' ? (
                <Typewriter
                  multiText={[
                    "Streamline Your Fleet, Optimize Your Journey!",
                    "Revolutionize Your Workflow with TMS!",
                    "Efficient Transport Solutions for Modern Businesses!"
                  ]}
                  multiTextLoop={true} // Enable looping
                  typeSpeed={50}
                  deleteSpeed={30}
                  cursorColor="#F09F33"
                />
              ) : (
                <Typewriter
                  multiText={[
                    "መጓጓዣዎን በማቀናበር, የእርስዎን ጉዞ ያሻሽሉ!",
                    "የትራንስፖርት አስተዳደር ስርዓት አብዮት ይፈጥሩ!",
                    "ለዘመናዊ ቢዝነሶች ውጤታማ የመጓጓዣ መፍትሄዎች!"
                  ]}
                  multiTextLoop={true} // Enable looping
                  typeSpeed={50}
                  deleteSpeed={30}
                  cursorColor="#F09F33"
                />
              )}
            </h2>
            <p className="headertext3">
              {mylanguage === 'EN' 
                ? 'Discover a smarter way to manage transportation. The Transport Management System (TMS) revolutionizes your workflow, digitizing and automating every step to save time, reduce inefficiencies, and ensure seamless coordination.' 
                : 'መጓጓዣ ለመቆጣጠር የሚያስችል ብልህ ዘዴ ይኑርህ። የትራንስፖርት አስተዳደር ስርዓት (TMS) የእርስዎን የስራ ፍሰት አብዮት, ጊዜ ለመቆጠብ, ውጤታማነትን ለመቀነስ እና ስፌት አልባ ቅንጅት ለማረጋገጥ እያንዳንዱን እርምጃ ዲጂቲንግ እና አውቶማቲክ ያደርገዋል.'}
            </p>
          </div>

          {/* Image Section with Carousel */}
          <div className="col-lg-6 col-12 text-center">
            <Carousel interval={3000} controls={false} indicators={true}> {/* Auto-slide every 3 seconds */}
              <Carousel.Item>
                <img
                  className="d-block img-fluid"
                  src={Car}
                  alt="First slide"
                  style={{ height: '400px', objectFit: 'cover' }} // Ensures all images are equal in height
                />
                <Carousel.Caption>
                  <h5>Efficient Fleet Management</h5>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block img-fluid"
                  src={Car2}
                  alt="Second slide"
                  style={{ height: '400px', objectFit: 'cover' }}
                />
                <Carousel.Caption>
                  <h5>Seamless Transportation</h5>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item>
                <img
                  className="d-block img-fluid"
                  src={Car3}
                  alt="Third slide"
                  style={{ height: '400px', objectFit: 'cover' }}
                />
                <Carousel.Caption>
                  <h5>Innovative Solutions</h5>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero1;
