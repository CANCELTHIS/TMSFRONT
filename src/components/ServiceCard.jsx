import React from 'react';
import { FcQuestions, FcApproval } from "react-icons/fc";
import { RiNotification4Fill } from "react-icons/ri";
import { GrHostMaintenance } from "react-icons/gr";

const ServiceCard = () => {
  return (
    <div className="container my-5">
      <div className="row g-4 justify-content-center">
        <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
          <div className="card text-center" style={{ width: '100%' }}>
            <div className="d-flex justify-content-center align-items-center mt-3">
              <FcQuestions size={50} />
            </div>
            <div className="card-body">
              <h5 className="card-title">Simplified Requests</h5>
              <p className="card-text">
                Easily submit transport requests through an intuitive,
                user-friendly interface, reducing time and effort.
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
          <div className="card text-center" style={{ width: '100%' }}>
            <div className="d-flex justify-content-center align-items-center mt-3">
              <FcApproval size={50} />
            </div>
            <div className="card-body">
              <h5 className="card-title">Streamlined Approvals</h5>
              <p className="card-text">
                Accelerate the approval process with automated workflows, ensuring quick and smooth decision-making.
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
          <div className="card text-center" style={{ width: '100%' }}>
            <div className="d-flex justify-content-center align-items-center mt-3">
              <RiNotification4Fill size={50} />
            </div>
            <div className="card-body">
              <h5 className="card-title">Real-Time Notifications</h5>
              <p className="card-text">
                Stay updated with instant alerts on trip schedules, approvals, and vehicle status in real time.
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
          <div className="card text-center" style={{ width: '100%' }}>
            <div className="d-flex justify-content-center align-items-center mt-3">
              <GrHostMaintenance size={50} />
            </div>
            <div className="card-body">
              <h5 className="card-title">Maintenance Management</h5>
              <p className="card-text">
                Streamline vehicle maintenance and refueling requests, ensuring timely and efficient handling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
