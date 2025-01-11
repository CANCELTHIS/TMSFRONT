import React from 'react';
import Allocate from "../assets/Allocate.jpg";
import Schedule from "../assets/Schedule.jpg";

const Hero5 = () => {
  return (
    <div className="container py-4">
      {/* Card 1 */}
      <div className="row justify-content-center mb-3">
        <div className="col-12 col-md-8">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center">
              {/* Image on the left */}
              <div className="image-container me-4">
                <img src={Allocate} alt="This is allocation Im" className="card-img" />
              </div>
              <div>
                <h5 className="card-title">Get started Today!</h5>
                <p className="card-text">
                  Take control of your transportation management and achieve unparalleled Efficiency.
                </p>
                <p className="text-center">
                  With TMS, you can simplify complex processes, reduce costs, and ensure compliance—all in one powerful
                  platform. Whether you’re managing a single fleet or planning for large-scale implementation across
                  multiple departments, TMS has the tools you need to succeed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">
          <div className="card h-100">
            <div className="card-body d-flex align-items-center">
              <div>
                <h5 className="card-title">Trip Approval and Resource Allocation</h5>
                <p className="card-text">
                  Approve the trip and allocate resources (vehicles, tickets, etc.).
                </p>
              </div>
              {/* Image on the right */}
              <div className="image-container ms-4">
                <img src={Schedule} alt="allocation Image" className="card-img" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero5;
