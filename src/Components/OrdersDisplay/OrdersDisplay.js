import React, { useState, useEffect } from "react";
import SingleOrderDisplay from "./SingleOrderDisplay";

function OrdersDisplay() {
  const [nbrOrders, setNbrOrders] = useState(0);
  const [nbrOrdersWaiting, setNbrOrdersWaiting] = useState(0);
  const [ordersLine1, setOrdersLine1] = useState([]);
  const [ordersLine2, setOrdersLine2] = useState([]);

  const fetchOrders = () => {
    const getNbrColumns = (orderDetails) => {
      let nbrLines = 0;
      let nbrCol = 0;

      orderDetails.food.map((food) => {
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

    fetch(
      `http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/orders/`
    )
      .then((response) => response.json())
      .then((data) => {
        setNbrOrders(data.length);

        const fetchOrderDetailsPromises = data.slice(0, 10).map((order) => {
          return fetch(
            `http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/orders/${order.id}?forKDS=true`
          )
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
          const ordersLineComponents = orderDetailsArray.map(
            (orderDetails) => ({
              component: (
                <SingleOrderDisplay
                  key={orderDetails.number}
                  orderDetails={orderDetails}
                  span={getNbrColumns(orderDetails)}
                />
              ),
              nbrCol: getNbrColumns(orderDetails),
            })
          );

          let ordersLine1 = [];
          let ordersLine2 = [];
          let currentLine1Cols = 0;
          let currentLine2Cols = 0;
          let waitingOrdersQueue = [];

          ordersLineComponents.forEach((order) => {
            if (
              currentLine1Cols + order.nbrCol <= 5 &&
              waitingOrdersQueue.length === 0 &&
              ordersLine2.length === 0
            ) {
              ordersLine1.push(order.component);
              currentLine1Cols += order.nbrCol;
            } else if (
              currentLine2Cols + order.nbrCol <= 5 &&
              waitingOrdersQueue.length === 0
            ) {
              ordersLine2.push(order.component);
              currentLine2Cols += order.nbrCol;
            } else {
              waitingOrdersQueue.push(order);
            }
          });

          const processWaitingOrders = () => {
            waitingOrdersQueue.every((order) => {
              if (currentLine1Cols + order.nbrCol <= 5) {
                ordersLine1.push(order.component);
                currentLine1Cols += order.nbrCol;
              } else if (currentLine2Cols + order.nbrCol <= 5) {
                ordersLine2.push(order.component);
                currentLine2Cols += order.nbrCol;
              } else {
                return;
              }
            });
          };

          processWaitingOrders();

          setOrdersLine1(ordersLine1);
          setOrdersLine2(ordersLine2);
        });
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  useEffect(() => {
    if (ordersLine1.length !== 0 && ordersLine2.length !== 0)
      setNbrOrdersWaiting(nbrOrders - ordersLine1.length - ordersLine2.length);
  }, [nbrOrders, ordersLine1, ordersLine2]);

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(fetchOrders, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative w-full h-full grid grid-rows-2 grid-cols-1">
      <div className="grid grid-cols-5 gap-4 mx-2 py-2 min-h-full">
        {ordersLine1}
      </div>
      <div className="grid grid-cols-5 gap-4 mx-2 py-2 min-h-full">
        {ordersLine2}
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

export default OrdersDisplay;
