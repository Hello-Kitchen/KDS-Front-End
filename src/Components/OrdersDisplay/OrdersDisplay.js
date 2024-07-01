import React, { useState, useEffect } from "react";
import SingleOrderDisplay from "./SingleOrderDisplay";
import "./Orders.css";

function OrdersDisplay() {
  const [ordersList, setOrdersList] = useState([]);

  const fetchOrders = () => {
    fetch(
      `http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/orders/`
    )
      .then((response) => response.json())
      .then((data) => {
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
    <div>
      <div className="grid grid-cols-5 gap-4 mx-2 py-2">
        {ordersList.map((order) => (
          <SingleOrderDisplay key={order.id} id={order.id} />
        ))}
      </div>
    </div>
  );
}

export default OrdersDisplay;
