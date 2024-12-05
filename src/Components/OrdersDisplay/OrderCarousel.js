import React, { useEffect, useState } from 'react';
import SingleOrderDisplay from './SingleOrderDisplay';



const OrderCarousel = ({ label }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [orders, setOrders] = useState([]);
  const [isFetch, setIsFetch] = useState(false)

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

  function fetchOrdersKitchen () {

    fetch(
      `http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${process.env.REACT_APP_NBR_RESTAURANT}/orders?status=ready`
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
        const fetchFoodDetailsPromises = ordersData.slice(0, 5).map((order) => {
          return fetch(
            `http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${process.env.REACT_APP_NBR_RESTAURANT}/orders/${order.id}?forKDS=true`
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

        Promise.all(fetchFoodDetailsPromises).then(() => { setOrders(ordersData); setIsFetch(true) })
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  useEffect(() => {
    fetchOrdersKitchen();

    const intervalId = setInterval(fetchOrdersKitchen, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (isFetch) {
    return (
      <div className="h-full col-start-5">
        <SingleOrderDisplay orderDetails={orders[currentIndex]} span={getNbrColumns(orders[currentIndex])} index={currentIndex} selectOrder={-1} />
        <div className='bg-slate-600 h-6 rounded-bl-lg rounded-br-lg flex items-center content-center justify-between px-2'>
          <img className='cursor-pointer' onClick={prevOrder} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAV0lEQVR4nO3TOwqAMBRFwVi4Wr+FCzHrFRwRQcT+BQKZMsW5zUtKTVMUOqwYo+LZ40AfFT8xRcbnOuI3bGHxUgMd9s/IUvVIDjnTIh/tN7JgeB+bJkW7ADG4v+M8NFbCAAAAAElFTkSuQmCC" alt="back--v1" />
          <img className='cursor-pointer' onClick={nextOrder} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAaElEQVR4nO3UMQqDQBBA0cVrRIisBzBHDSmTi6UQFDzIS6GFpUWmWJh/gPnwmZlSkiQUPPDCLUrwtjOjjxBUbNGSO5ZDsmJoVjKecn3RtSPAcEq0/DWR4OE1dE3xib6BCc+wV5Ek5Qo/kzy/4z5ey24AAAAASUVORK5CYII=" alt="back--v1" />
        </div>
      </div>
    );
  }
};

export default OrderCarousel;