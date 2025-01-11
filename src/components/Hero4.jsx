import React from 'react';
import { GiVendingMachine } from "react-icons/gi";
import { FcApprove } from "react-icons/fc";
import { AiFillSchedule } from "react-icons/ai";
import { IoLocation } from "react-icons/io5";

import Car from "../assets/car.png";
import "../index.css";

const Hero4 = () => {
  return (
    <div>
      <h2 className="d-flex justify-content-center mb-4" id="texthero2">
        Schedule Trip with These Steps
      </h2>

      {/* Row to hold the cards */}
      <div className="cards">
        <div className="d-flex flex-wrap justify-content-center space right">
          {/* Column for the three stacked cards on the left */}
          <div className="d-flex flex-column align-items-center col-12 col-sm-6 col-md-4 col-lg-3 gap-3">
            {/* Card 1 with Icon */}
            <div className="card w-100 d-flex justify-content-center mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <GiVendingMachine size={100} className="me-3" /> {/* Icon to the left */}
                  <div>
                    <h5 className="card-title">Trip Request Submission</h5>
                    <p className="card-text">
                      Submit trip details (origin, destination, date, mode,
                      passengers, etc.) for system validation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 with Icon */}
            <div className="card w-100 d-flex justify-content-center mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <FcApprove size={100} className="me-3" /> {/* Icon to the left */}
                  <div>
                    <h5 className="card-title">Trip Approval and Resource Allocation</h5>
                    <p className="card-text">
                      Approve the trip and allocate resources (vehicles, tickets, etc.).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 with Icon */}
            <div className="card w-100 d-flex justify-content-center mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <AiFillSchedule size={100} className="me-3" /> {/* Icon to the left */}
                  <div>
                    <h5 className="card-title">Trip Confirmation and Scheduling</h5>
                    <p className="card-text">
                      Confirm details, notify stakeholders, and schedule the trip
                      with reminders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column for the single card on the right */}
          <div className="d-flex flex-column align-items-center col-12 col-sm-6 col-md-4 col-lg-3 justify-content-center">
            {/* Card 4 with Icon */}
            <div className="card w-100 d-flex justify-content-center mb-3">
              <div className="card-body">
                <div className="align-items-center">
                  <img src={Car} alt="car img" className="me-3 car" />
                  <div>
                    <h5 className="card-title">Trip To Dire Dawa</h5>
                    <p className="card-text">
                      14-29 June by Biruk Nigusie{" "}
                      <span>
                        <IoLocation size={25} />
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero4;
