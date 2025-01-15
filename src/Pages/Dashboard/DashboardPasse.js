import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import OrdersDisplayPasse from '../../Components/OrdersDisplay/OrdersDisplayPasse';
import LeftSection from "../../Components/LeftSection/LeftSection";
import './DashboardPasse.css';

/**
 * @function formatDate
 * @description Formats a Date object into a string in the format DD/MM/YYYY - HH:MM.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

/**
 * @function DashboardPasse
 * @description One of the main pages of the KDS, it is the dashboard of the passe, displaying the current time and orders with food ready.
 * @returns {JSX.Element} The rendered dashboard component.
 */
function DashboardPasse() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [nbrOrder, setNbrOrder] = useState(0);
  const [activeTab, setActiveTab] = useState("");
  const [activeRecall, setActiveRecall] = useState(false);

  /**
   * @function updateActiveTab
   * @description Updates the active tab for navigation.
   *
   * @param {string} newTab - The new tab to set as active.
   */
  const updateActiveTab = (newTab) => {
    setActiveTab(newTab);
  };

  /**
   * @function updateActiveRecall
   * @description Updates the active recall for order.
   *
   * @param {boolean} newRecall - The new recall to set as active or not.
   */
  const updateActiveRecall = (newRecall) => {
    setActiveRecall(newRecall);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigationPrev = () => {
    setCurrentOrderIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + nbrOrder) % nbrOrder;
      return newIndex;
    });
  };

  const handleNavigationAfter = () => {
    setCurrentOrderIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % nbrOrder;
      return newIndex;
    });
  };

  return (
    <div style={{ width: "100%", height: "100%", flexDirection: "column" }}>
      <Header textLeft="time" textCenter="Passe" textRight={formatDate(currentTime)} />
      <div className='w-full h-lb grid grid-cols-[5%_1fr] grid-rows-2 gap-0.5 bg-kitchen-blue'>
        <div className="col-span-1 row-span-2"><LeftSection /></div>
        <div className="col-span-1 row-span-1 bg-white"><OrdersDisplayPasse status={"ready"} selectOrder={currentOrderIndex} setNbrOrder={setNbrOrder} /></div>
        <div className="col-span-1 row-span-1 bg-white"><OrdersDisplayPasse status={"pending"} selectOrder={-1} setNbrOrder={undefined} activeRecall={activeRecall} /></div>
      </div>
      <Footer
        buttons={["servie", "precedent", "suivant", "rappel", "statistique", "reglage"]}
        navigationPrev={handleNavigationPrev}
        navigationAfter={handleNavigationAfter}
        activeTab={activeTab} 
        updateActiveTab={updateActiveTab}
        activeRecall={activeRecall}
        updateActiveRecall={updateActiveRecall}
      />
    </div>
  );
}

export default DashboardPasse;
