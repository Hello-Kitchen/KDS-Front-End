import React, { useState, useEffect } from 'react';

import SingleOrderDisplay from './SingleOrderDisplay';
import './Orders.css';

function OrdersDisplay() {

    const [ordersList, setOrdersList] = useState([]);
  
    useEffect(() => {
      fetch ("http://localhost:4000/api/orders/").then(response => {
        response.json().then(data => {
          setOrdersList(data.map(order => <SingleOrderDisplay key={order.id} id={order.id}/>));
        });
      }).catch(error => {
        console.log(error);
      });
    }, []);

    return (
      <div>
        <div className="grid grid-cols-5 gap-4 mx-2 py-2">
          {ordersList}
        </div>
      </div>
    );
  }

export default OrdersDisplay;