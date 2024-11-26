import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import OrdersDisplay from '../../Components/OrdersDisplay/OrdersDisplay';

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
 * @function DashboardCuisine
 * @description Represents the dashboard for the kitchen display system (KDS), showing the current time, orders, and controls.
 *
 * @param {Object} config - The configuration object that determines the state of the kitchen.
 * @param {Function} setConfig - Function to update the configuration state of the kitchen.
 *
 * @returns {JSX.Element} The rendered dashboard component, showing different UI based on the `config.enable` state.
 */
function DashboardCuisine({ config, setConfig }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("");

  /**
   * @function updateActiveTab
   * @description Updates the active tab for navigation.
   *
   * @param {string} newTab - The new tab to set as active.
   */
  const updateActiveTab = (newTab) => {
    setActiveTab(newTab);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (config.enable) {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <Header textLeft="time" textCenter="Cuisine 1" textRight={formatDate(currentTime)} />
        <div className='w-full h-lb'>
          <OrdersDisplay />
        </div>
        <Footer buttons={["servie", "precedent", "suivant", "rappel", "statistique", "reglage"]} activeTab={activeTab} updateActiveTab={updateActiveTab}/>
      </div>
    );
  } else {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <Header textLeft="Tps moyen: --:--" textCenter="Cuisine 1" textRight={formatDate(currentTime)} />
        <div className='w-full h-lb'>
          <div className='w-full h-full flex justify-center items-center bg-[#BABABA]'>
            <div className='flex justify-center items-center text-white font-bold text-4xl'>Cuisine 2 est désactivé</div>
          </div>
        </div>
        <Footer buttons={["activer", "", "", "", "", "reglage"]} setConfig={setConfig} activeTab={activeTab} updateActiveTab={updateActiveTab}/>
      </div>
    );
  }
}

DashboardCuisine.propTypes = {
  config: PropTypes.object.isRequired,
  setConfig: PropTypes.func.isRequired,
};

export default DashboardCuisine;
