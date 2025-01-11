import React from 'react';
import "../index.css";
import Car from '../assets/car.png';

const Hero1 = () => {
  return (
    <div className="Hero1 bg-light w-100">
      <div className="container-fluid px-0">
        <div className="row align-items-center">
          {/* Text Section */}
          <div className="col-lg-6 col-12 text-center text-lg-start p-4">
            <h5 className="headertext1">Ministry of Innovation and Technology</h5>
            <h2 className="headertext2">
              Streamline Your Fleet, <br /> Optimize Your Journey!
            </h2>
            <p className="headertext3">
              Discover a smarter way to manage transportation. The Transport Management System (TMS) revolutionizes your workflow, digitizing and automating every step to save time, reduce inefficiencies, and ensure seamless coordination.
            </p>
          </div>
          <div className="col-lg-6 col-12 text-center">
            <div className="carimage">
              <img src={Car} alt="car image" id="car" className="img-fluid w-95"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero1;
