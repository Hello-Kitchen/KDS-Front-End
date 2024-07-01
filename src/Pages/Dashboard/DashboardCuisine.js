import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import React, { useState, useEffect } from 'react';
import OrdersDisplay from '../../Components/OrdersDisplay/OrdersDisplay';

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

function DashboardCuisine() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%"}}>
      <Header textLeft="time" textCenter="Cuisine" textRight={formatDate(currentTime)} />
      <div className='w-full h-lb'>
        <OrdersDisplay />
      </div>
      <Footer buttons={["servie", "precedent", "suivant", "rappel", "statistique", "reglage"]} />
    </div>
  );
}

export default DashboardCuisine;
