import React from "react";
import { motion } from "framer-motion";
import { FcQuestions, FcApproval } from "react-icons/fc";
import { RiNotification4Fill } from "react-icons/ri";
import { GrHostMaintenance } from "react-icons/gr";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const ServiceCard = () => {
  const { mylanguage } = useLanguage();
  const { myTheme } = useTheme();

  // Variants for card animations
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
    },
    hover: {
      scale: 1.05,
      rotateX: -5,
      rotateY: 5,
      boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  };

  const cardsData = [
    {
      icon: <FcQuestions size={50} />,
      titleEN: "Simplified Requests",
      titleAM: "ቀላል ጥያቄዎች",
      textEN:
        "Easily submit transport requests through an intuitive, user-friendly interface, reducing time and effort.",
      textAM: "በቀላሉ ጥያቄዎችን በቀላል በሆነ ገፅ አቅርቡ፣ ጊዜን እና በአስቸጋሪነትን አንሳሳሉ።",
    },
    {
      icon: <FcApproval size={50} />,
      titleEN: "Streamlined Approvals",
      titleAM: "በቀላሉ ማጽደቅ",
      textEN:
        "Accelerate the approval process with automated workflows, ensuring quick and smooth decision-making.",
      textAM: "ተሻሽለው የተቀመጡትን ሥራ እንዲወጣ ማስፈጸሚያን በፍጥነት ያንሳሉ።",
    },
    {
      icon: <RiNotification4Fill size={50} />,
      titleEN: "Real-Time Notifications",
      titleAM: "በቀላሉ ማሳወቂያዎች",
      textEN:
        "Stay updated with instant alerts on trip schedules, approvals, and vehicle status in real time.",
      textAM: "የተለያዩ የጉዞ ጊዜ ማሳወቂያዎችን በቀኝ ሰዓት አገኙ።",
    },
    {
      icon: <GrHostMaintenance size={50} />,
      titleEN: "Maintenance Management",
      titleAM: "የጠባቂነት አስተዳደር",
      textEN:
        "Streamline vehicle maintenance and refueling requests, ensuring timely and efficient handling.",
      textAM: "የመኪና ጠባቂነትን እና የእምነት ጥያቄዎችን በሰዓት አንሳሳሉ።",
    },
  ];

  return (
    <div className="mb-0 my-5">
      <motion.div
        className="row g-4 justify-content-center"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.2 }}
      >
        {cardsData.map(({ icon, titleEN, titleAM, textEN, textAM }, index) => (
          <motion.div
            key={index}
            className="col-12 col-sm-6 col-lg-3 d-flex justify-content-center"
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <div
              className="mt-0 card text-center"
              style={{
                width: "100%",
                overflow: "hidden",
                backgroundColor: myTheme === "dark" ? "#4E6373" : "#FFFFFF",
                color: myTheme === "dark" ? "#C1C1C2" : "#181E4B",
                padding: "20px",
                borderRadius: "15px",
              }}
            >
              <div className="d-flex justify-content-center align-items-center mt-3">
                {icon}
              </div>
              <div className="card-body">
                <h5 className="card-title">
                  {mylanguage === "EN" ? titleEN : titleAM}
                </h5>
                <p className="card-text">
                  {mylanguage === "EN" ? textEN : textAM}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ServiceCard;
