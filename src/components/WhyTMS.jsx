import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const WhyTMS = () => {
  const { mylanguage } = useLanguage(); // Access the current language context

  return (
    <div className="container px-5">
      <div className="circle1"></div>
      <h2 className="d-flex justify-content-center mb-4" id="texthero2">
        {mylanguage === 'EN' ? 'Why TMS' : 'ለምን TMS'}
      </h2>
      <div className="row d-flex justify-content-between gap-4">
        <div className="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center mb-4">
          <div
            className="card text-center"
            style={{ width: '100%', backgroundColor: 'transparent', border: 'none' }}
          >
            <div className="card-body">
              <h5 className="card-title">
                {mylanguage === 'EN' ? 'Optimize Fleet Utilization' : 'የተሽከርካሪ እንቅስቃሴን ያስተካክሉ'}
              </h5>
              <p className="card-text">
                {mylanguage === 'EN'
                  ? 'Maximize vehicle usage with centralized scheduling, real-time tracking, and improved management.'
                  : 'በተሰበሰበ መርሀ ግብር፣ በሰሜን ጊዜ እንቅስቃሴ እና የተሻለ አስተዳደር የተሽከርካሪ እንቅስቃሴን አብዝበው ይጠቀሙ።'}
              </p>
            </div>
          </div>
        </div>
        <div className="circle2"></div>
        <div
          className="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center mb-4"
          style={{ marginTop: '100px' }}
        >
          <div
            className="card text-center"
            style={{ width: '100%', backgroundColor: 'transparent', border: 'none' }}
          >
            <div className="card-body">
              <h5 className="card-title">
                {mylanguage === 'EN' ? 'Enhance Operational Efficiency' : 'የሥራ እድሜን አብዛቡ'}
              </h5>
              <p className="card-text">
                {mylanguage === 'EN'
                  ? 'Reduce time spent on administrative tasks through automated workflows and streamlined approvals.'
                  : 'በተሠሩ የሥራ አሰራሮችና የተሻለ ማጽደቅ ሥርዓት ላይ የሚከፈል ጊዜን አሳልፉ።'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="circle3"></div>
      <div className="row d-flex justify-content-between gap-4">
        <div className="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center mb-4">
          <div
            className="card text-center"
            style={{ width: '100%', backgroundColor: 'transparent', border: 'none' }}
          >
            <div className="card-body">
              <h5 className="card-title">
                {mylanguage === 'EN' ? 'Reduce Costs' : 'ወጪዎችን አንሳስ'}
              </h5>
              <p className="card-text">
                {mylanguage === 'EN'
                  ? 'Lower operational expenses with advanced data analysis and preventive maintenance scheduling to avoid unexpected repairs and downtime.'
                  : 'ከቀድሞው ይልቅ በሰላም የመጠቀምና እንቅስቃሴን እንዳይወጣ በተሻለ የመረጃ ትንተና ያንሳሉ።'}
              </p>
            </div>
          </div>
        </div>
        <div className="circle4"></div>
        <div
          className="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center mb-4"
          style={{ marginTop: '100px' }}
        >
          <div
            className="card text-center"
            style={{ width: '100%', backgroundColor: 'transparent', border: 'none' }}
          >
            <div className="card-body">
              <h5 className="card-title">
                {mylanguage === 'EN' ? 'Optimize Fleet Utilization' : 'የተሽከርካሪ እንቅስቃሴን ያስተካክሉ'}
              </h5>
              <p className="card-text">
                {mylanguage === 'EN'
                  ? 'Maximize vehicle usage with centralized scheduling, real-time tracking, and improved management.'
                  : 'በተሰበሰበ መርሀ ግብር፣ በሰሜን ጊዜ እንቅስቃሴ እና የተሻለ አስተዳደር የተሽከርካሪ እንቅስቃሴን አብዝበው ይጠቀሙ።'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyTMS;
