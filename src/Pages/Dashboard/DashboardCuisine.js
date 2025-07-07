import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import OrdersDisplay from '../../Components/OrdersDisplay/OrdersDisplay';
import StatisticsView from '../../Components/ModalViews/StatisticsView';
import SettingsView from '../../ModalViews/SettingsView';


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
  const [displayStatistics, setDisplayStatistics] = useState(false);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [currentOrderId, setCurrentOrderId] = useState(undefined);
  const [nbrOrder, setNbrOrder] = useState(0);
  const [activeTab, setActiveTab] = useState("");
  const [displaySettings, setDisplaySettings] = useState(false);
  const [orderAnnoncement, setOrderAnnoncement] = useState(false);
  const [orderReading, setOrderReading] = useState(false);
  const [orderSelect, setOrderSelect] = useState(false);
  const [touchscreenMode, setTouchscreenMode] = useState(true);
  const [servingOrder, setServingOrder] = useState(-1);
  const [ordersForStatistics, setOrdersForStatistics] = useState([]);

  const handleDisplayStatistics = () => {
    setDisplayStatistics(!displayStatistics);
    setDisplaySettings(false);
    setActiveRecall(false);
  };
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

  const handleOrderAnnoncement = () => {
    setOrderAnnoncement(!orderAnnoncement);
  };

  const handleOrderReading = () => {
    setOrderReading(!orderReading);
  };

  const handleOrderSelect = () => {
    setOrderSelect(!orderSelect);
  };

  const handleTouchscreenMode = () => {
    setTouchscreenMode(!touchscreenMode);
  };

  const handleSettingsDisplay = () => {
    setDisplaySettings(!displaySettings);
    setDisplayStatistics(false);
    setActiveRecall(false);
  };

  /**
   * @function updateActiveRecall
   * @description Updates the active recall for order.
   *
   * @param {boolean} newRecall - The new recall to set as active or not.
   */
  const updateActiveRecall = (newRecall) => {
    setActiveRecall(newRecall);
  };

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

  if (config.enable) {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <Header textLeft="time" textCenter="Cuisine 1" textRight={formatDate(currentTime)} />
        <div className='w-full h-lb'>
          {displayStatistics ? (
            <StatisticsView ordersForStatistics={ordersForStatistics}/>
          ) : displaySettings ? (
            <SettingsView
              orderAnnoncement={orderAnnoncement}
              handleOrderAnnoncement={handleOrderAnnoncement}
              orderReading={orderReading}
              handleOrderReading={handleOrderReading}
              orderSelect={orderSelect}
              handleOrderSelect={handleOrderSelect}
              touchscreenMode={touchscreenMode}
              handleTouchscreenMode={handleTouchscreenMode}
              setConfig={setConfig}
              screenOn={true}
            />
          ) : (
            <OrdersDisplay setOrdersForStatistics={setOrdersForStatistics} selectOrder={currentOrderIndex} setNbrOrder={setNbrOrder} orderAnnoncement={orderAnnoncement} onSelectOrderId={setCurrentOrderId} activeRecall={activeRecall} orderReading={orderReading} orderSelect={orderSelect} isServing={servingOrder}/>
          )}
        </div>
        <Footer
          buttons={["servie", "precedent", "suivant", "rappel", "statistique", "reglage"]}
          setConfig={setConfig}
          handleDisplayStatistics={handleDisplayStatistics}
          activeTab={activeTab}
          updateActiveTab={updateActiveTab}
          activeRecall={activeRecall} updateActiveRecall={updateActiveRecall} navigationPrev={handleNavigationPrev}
          navigationAfter={handleNavigationAfter}
          handleSettingsDisplay={handleSettingsDisplay}
          currentOrderId={currentOrderId}
          isServing={setServingOrder}
        />
      </div>
    );
  } else {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <Header textLeft="Tps moyen: --:--" textCenter="Cuisine 1" textRight={formatDate(currentTime)} />
        <div className='w-full h-lb'>
          {displaySettings ? (
            <SettingsView
              orderAnnoncement={orderAnnoncement}
              handleOrderAnnoncement={handleOrderAnnoncement}
              orderReading={orderReading}
              handleOrderReading={handleOrderReading}
              orderSelect={orderSelect}
              handleOrderSelect={handleOrderSelect}
              touchscreenMode={touchscreenMode}
              handleTouchscreenMode={handleTouchscreenMode}
              setConfig={setConfig}
              screenOn={false}
            />
          ) : (
            <div className='w-full h-full flex justify-center items-center bg-[#BABABA]'>
              <div className='flex justify-center items-center text-white font-bold text-4xl'>Cuisine 1 est désactivé</div>
            </div>
          )}
        </div>
        <Footer
          buttons={["activer", "", "", "", "", "reglage"]}
          setConfig={setConfig}
          activeTab={activeTab}
          updateActiveTab={updateActiveTab}
          handleSettingsDisplay={handleSettingsDisplay}
        />
      </div>
    );
  }
}

DashboardCuisine.propTypes = {
  config: PropTypes.object.isRequired,
  setConfig: PropTypes.func.isRequired,
};

export default DashboardCuisine;
