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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", flexDirection: "column" }}>
      <Header textLeft="time" textCenter="Passe" textRight={formatDate(currentTime)} />
      <div className='w-full h-lb grid grid-cols-[5%_1fr] grid-rows-2 gap-0.5 bg-kitchen-blue'>
        <div className="col-span-1 row-span-2"><LeftSection /></div>
        <div className="col-span-1 row-span-1 bg-white"><OrdersDisplayPasse status={"ready"} /></div>
        <div className="col-span-1 row-span-1 bg-white"><OrdersDisplayPasse status={"pending"} /></div>
      </div>
      <Footer buttons={["servie", "precedent", "suivant", "rappel", "statistique", "reglage"]} />
    </div>
  );
}

export default DashboardPasse;
