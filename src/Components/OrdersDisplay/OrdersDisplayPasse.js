import React, { useState, useEffect } from 'react';
import SingleOrderDisplay from './SingleOrderDisplay';
import PropTypes from "prop-types";

function OrdersDisplayPasse({ status }) {
  const [nbrOrders, setNbrOrders] = useState(0);
  const [nbrOrdersWaiting, setNbrOrdersWaiting] = useState(0);
  const [ordersLine1, setOrdersLine1] = useState([]);

  const fetchOrders = () => {
    const getNbrColumns = (orderDetails) => {
      let nbrLines = 0;
      let nbrCol = 0;

      orderDetails.food.forEach((food) => {
        nbrLines += 1;
        food.details.forEach(() => {
          nbrLines += 1;
        });
        food.mods_ingredients.forEach(() => {
          nbrLines += 1;
        });
        if (food.note) {
          nbrLines += 1;
        }
      });
      nbrCol = Math.ceil(nbrLines / 10);
      return nbrCol;
    };

    fetch(`http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/orders?status=${status}&sort=time`)
      .then((response) => response.json())
      .then((data) => {
        setNbrOrders(data.length);

        const fetchOrderDetailsPromises = data.slice(0, 10).map((order) => {
          return fetch(`http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/orders/${order.id}?forKDS=true`)
            .then((response) => response.json())
            .then((data) => {
              const orderDateObj = new Date(data.date);
              const orderDate = {
                hours: String(orderDateObj.getHours()).padStart(2, "0"),
                minutes: String(orderDateObj.getMinutes()).padStart(2, "0"),
                seconds: String(orderDateObj.getSeconds()).padStart(2, "0"),
              };
              return { ...data, orderDate };
            });
        });

        Promise.all(fetchOrderDetailsPromises).then((orderDetailsArray) => {
          const ordersLineComponents = orderDetailsArray.map((orderDetails) => ({
            component: (
              <SingleOrderDisplay
                key={orderDetails.number}
                orderDetails={orderDetails}
                span={getNbrColumns(orderDetails)}
                updateOrders={fetchOrders}
              />
            ),
            nbrCol: getNbrColumns(orderDetails),
          }));

          let ordersLine1 = [];
          let currentLine1Cols = 0;
          let waitingOrdersQueue = [];

          ordersLineComponents.forEach((order) => {
            if (currentLine1Cols + order.nbrCol <= 5 && waitingOrdersQueue.length === 0) {
              ordersLine1.push(order.component);
              currentLine1Cols += order.nbrCol;
            } else {
              waitingOrdersQueue.push(order);
            }
          });

          const processWaitingOrders = () => {
            waitingOrdersQueue.forEach((order) => {
              if (currentLine1Cols + order.nbrCol <= 5) {
                ordersLine1.push(order.component);
                currentLine1Cols += order.nbrCol;
              }
            });
          };

          processWaitingOrders();

          setOrdersLine1(ordersLine1);
        });
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  useEffect(() => {
    setNbrOrdersWaiting(nbrOrders - ordersLine1.length);
  }, [nbrOrders, ordersLine1]);

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(fetchOrders, 5000);

    return () => clearInterval(intervalId);
  }, [status]);

  return (
    <div className="relative w-full h-full grid grid-rows-2 grid-cols-1">
      <div className="grid grid-cols-5 gap-4 mx-2 py-2 min-h-full">
        {ordersLine1}
      </div>
      {nbrOrdersWaiting === 1 && (
        <div className="absolute bottom-0 right-0 bg-orange-400 text-white font-bold border-2 border-orange-400 rounded-tl-md">
          {nbrOrdersWaiting} commande en attente &gt;&gt;
        </div>
      )}
      {nbrOrdersWaiting > 1 && (
        <div className="absolute bottom-0 right-0 bg-orange-400 text-white font-bold border-2 border-orange-400 rounded-tl-md">
          {nbrOrdersWaiting} commandes en attente &gt;&gt;
        </div>
      )}
    </div>
  );
}

OrdersDisplayPasse.propTypes = {
  status: PropTypes.string.isRequired,
};

export default OrdersDisplayPasse;
