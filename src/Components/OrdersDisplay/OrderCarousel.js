import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { BeatLoader } from 'react-spinners';
import SingleOrderDisplay from './SingleOrderDisplay';
import PropTypes from "prop-types";

const LoadingCard = () => {
  return (
    <div className="h-full col-start-5">
      <div className='bg-slate-600 h-6 rounded-t-lg flex items-center content-center justify-between px-2'></div>
      <div className="bg-gray-800 shadow-md p-4 flex flex-col items-center">
        <BeatLoader size={8} />
        <p className="mt-2 text-gray-600">Chargement des commandes...</p>
      </div>
      <div className='bg-slate-600 h-6 rounded-bl-lg rounded-br-lg flex items-center content-center justify-between px-2'></div>
    </div>
  );
};

const NothingCard = () => {
  return (
    <div className="h-full col-start-5">
      <div className='bg-slate-600 h-6 rounded-t-lg flex items-center content-center justify-between px-2'></div>
      <div className="bg-gray-800 shadow-md p-4 flex flex-col items-center">
        <p className="mt-2 text-gray-600">Aucune commande à rappeler</p>
      </div>
      <div className='bg-slate-600 h-6 rounded-bl-lg rounded-br-lg flex items-center content-center justify-between px-2'></div>
    </div>
  );
};

const OrderCarousel = ({ label }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [isFetch, setIsFetch] = useState(false);

  const nextOrder = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % orders.length);
  };

  const prevOrder = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + orders.length) % orders.length);
  };

  const getNbrColumns = (orderDetails) => {
    let nbrLines = 0;
    let nbrCol = 0;

    orderDetails.food_ordered.map((food) => {
      nbrLines += 1;
      food.details.map(() => {
        nbrLines += 1;
      });
      food.mods_ingredients.map(() => {
        nbrLines += 1;
      });
      if (food.note) {
        nbrLines += 1;
      }
    });
    nbrCol = Math.ceil(nbrLines / 10);
    return nbrCol;
  };

  function fetchOrdersKitchen(status) {

    fetch(
      `http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${localStorage.getItem("restaurantID")}/orders?status=${status}&sort=time`
      , {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      .then((response) => {
        if (response.status === 401) {
          navigate("/", { state: { error: "Unauthorized access. Please log in." } });
          throw new Error("Unauthorized access. Please log in.");
        }
        return response.json();
      })
      .then((ordersData) => {

        // Fetch food details for each order to display
        const fetchFoodDetailsPromises = ordersData.map((order) => {
          return fetch(
            `http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${localStorage.getItem("restaurantID")}/orders/${order.id}?forKDS=true`
            , {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            })
            .then((response) => {
              if (response.status === 401) {
                navigate("/", { state: { error: "Unauthorized access. Please log in." } });
                throw new Error("Unauthorized access. Please log in.");
              }
              return response.json();
            })
            .then((data) => {
              const orderDateObj = new Date(order.date);
              const orderDate = {
                hours: String(orderDateObj.getHours()).padStart(2, "0"),
                minutes: String(orderDateObj.getMinutes()).padStart(2, "0"),
                seconds: String(orderDateObj.getSeconds()).padStart(2, "0"),
              };
              ordersData.find((singleOrder) => singleOrder.id === order.id).food_ordered = data.food_ordered;
              ordersData.find((singleOrder) => singleOrder.id === order.id).orderDate = orderDate;
            });
        });

        Promise.all(fetchFoodDetailsPromises).then(() => { setOrders(ordersData); setIsFetch(true); });
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }

  useEffect(() => {
    if (label === "cuisine") {
      fetchOrdersKitchen('ready');

      const intervalId = setInterval(fetchOrdersKitchen('ready'), 5000);

      return () => clearInterval(intervalId);
    } else if (label == "passe") {
      fetchOrdersKitchen('served');

      const intervalId = setInterval(fetchOrdersKitchen('served'), 5000);

      return () => clearInterval(intervalId);
    }
  }, []);

  if (isFetch) {
    if (orders.length == 0) {
      return <NothingCard />;
    } else {
      return (
        <div className="flex-1 flex flex-col col-start-5">
          <SingleOrderDisplay orderDetails={orders[currentIndex]} span={getNbrColumns(orders[currentIndex])} index={currentIndex} selectOrder={-1} recall={true} />
          <div className='bg-slate-600 h-8 rounded-bl-lg rounded-br-lg flex justify-center items-center justify-around'>
            <img className='cursor-pointer' onClick={prevOrder} src={`${process.env.PUBLIC_URL}/left-arrow.png`} width="22" height="22"/>
            <img className='cursor-pointer' onClick={nextOrder} src={`${process.env.PUBLIC_URL}/right-arrow.png`} width="22" height="22"/>
          </div>
        </div>
      );
    }
  } else {
    return <LoadingCard />;
  }
};

OrderCarousel.propTypes = {
  label: PropTypes.string.isRequired,
};

export default OrderCarousel;