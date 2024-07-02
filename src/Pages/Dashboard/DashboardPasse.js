import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import OrdersStatusDisplay from '../../Components/OrdersDisplay/OrdersStatusDisplay';
import LeftSection from "../../Components/LeftSection/LeftSection"
import './DashboardPasse.css';

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

function DashboardPasse() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [readyOrders, setReadyOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);

  const fetchOrders = (status, setOrdersList) => {
    fetch(`http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/orders/status/${status}`)
      .then(response => response.json())
      .then(data => setOrdersList(data))
      .catch(error => console.log(error));
  };

  useEffect(() => {
    updateOrders();
  }, []);

  const updateOrders = () => {
    fetchOrders('ready', setReadyOrders);
    fetchOrders('pending', setPendingOrders);
  };

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
        <div className="col-span-1 row-span-2"><LeftSection/></div>
        <div className="col-span-1 row-span-1 bg-white"><OrdersStatusDisplay status={"ready"} orders={readyOrders} updateOrders={updateOrders} /></div>
        <div className="col-span-1 row-span-1 bg-white"><OrdersStatusDisplay status={"pending"} orders={pendingOrders} updateOrders={updateOrders} /></div>
      </div>
      <Footer buttons={["servie", "precedent", "suivant", "rappel", "statistique", "reglage"]} />
    </div>
  );
}

export default DashboardPasse;
