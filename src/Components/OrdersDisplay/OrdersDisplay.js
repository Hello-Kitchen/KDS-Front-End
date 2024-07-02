import React, { useState, useEffect } from "react";
import SingleOrderDisplay from "./SingleOrderDisplay";
import "./Orders.css";

function OrdersDisplay() {
  const [ordersList, setOrdersList] = useState([]);
  const [nbrOrders, setNbrOrders] = useState(0);

  const fetchOrders = () => {
    fetch(
      `http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/orders/`
    )
      .then((response) => response.json())
      .then((data) => {
        setNbrOrders(data.length);
        if (data.length > 10) {
          data = data.slice(0, -(data.length - 10));
        }
        setOrdersList(data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(fetchOrders, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative w-full h-full grid grid-rows-2 grid-cols-1">
      <div className="grid grid-cols-5 gap-4 mx-2 py-2 min-h-full">
        {ordersList.slice(0, 5).map((order) => (
          <SingleOrderDisplay key={order.id} id={order.id} />
        ))}
      </div>
      <div className="grid grid-cols-5 gap-4 mx-2 py-2 min-h-full">
        {ordersList.slice(5).map((order) => (
          <SingleOrderDisplay key={order.id} id={order.id} />
        ))}
      </div>
        {nbrOrders === 11 && (
          <div className="absolute bottom-0 right-0 bg-orange-400 text-white font-bold border-2 border-orange-400 rounded-tl-md">;
            {nbrOrders - 10} commande en attente &gt;&gt;
          </div>
        )}
        {nbrOrders > 11 && (
          <div className="absolute bottom-0 right-0 bg-orange-400 text-white font-bold border-2 border-orange-400 rounded-tl-md">
            {nbrOrders - 10} commandes en attente &gt;&gt;
          </div>
        )}
    </div>
  );
}

export default OrdersDisplay;
