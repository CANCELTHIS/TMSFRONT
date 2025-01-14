import React from 'react';
import { FcQuestions, FcApproval } from "react-icons/fc";
import { RiNotification4Fill } from "react-icons/ri";
import { GrHostMaintenance } from "react-icons/gr";
import { useLanguage } from '../context/LanguageContext';

const ServiceCard = () => {
  const { mylanguage } = useLanguage(); // Access the current language context

  return (
    <div className="container my-5">
      <div className="row g-4 justify-content-center">
        <div className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
          <div className="card text-center" style={{ width: '100%' }}>
            <div className="d-flex justify-content-center align-items-center mt-3">
              <FcQuestions size={50} />
            </div>
            <div className="card-body">
              <h5 className="card-title">
                {mylanguage === 'EN' ? 'Simplified Requests' : 'ቀላል ጥያቄዎች'}
              </h5>
              <p className="card-text">
                {mylanguage === 'EN' 
                  ? 'Easily submit transport requests through an intuitive, user-friendly interface, reducing time and effort.'
                  : 'በቀላሉ ጥያቄዎችን በተሳሳቢ እና ቀላል በሆነ ገፅ አቅርቡ፣ ጊዜን እና በአስቸጋሪነትን አንሳሳሉ።'}
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
              <h5 className="card-title">
                {mylanguage === 'EN' ? 'Streamlined Approvals' : 'በቀላሉ ማጽደቅ'}
              </h5>
              <p className="card-text">
                {mylanguage === 'EN' 
                  ? 'Accelerate the approval process with automated workflows, ensuring quick and smooth decision-making.'
                  : 'ተሻሽለው የተቀመጡትን ሥራ እንዲወጣ ማስፈጸሚያን በፍጥነት ያንሳሉ።'}
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
              <h5 className="card-title">
                {mylanguage === 'EN' ? 'Real-Time Notifications' : 'በቀላሉ ማሳወቂያዎች'}
              </h5>
              <p className="card-text">
                {mylanguage === 'EN' 
                  ? 'Stay updated with instant alerts on trip schedules, approvals, and vehicle status in real time.'
                  : 'የተለያዩ የጉዞ ጊዜ ማሳወቂያዎችን በቀኝ ሰዓት አገኙ።'}
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
              <h5 className="card-title">
                {mylanguage === 'EN' ? 'Maintenance Management' : 'የጠባቂነት አስተዳደር'}
              </h5>
              <p className="card-text">
                {mylanguage === 'EN' 
                  ? 'Streamline vehicle maintenance and refueling requests, ensuring timely and efficient handling.'
                  : 'የመኪና ጠባቂነትን እና የእምነት ጥያቄዎችን በሰዓት አንሳሳሉ።'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
