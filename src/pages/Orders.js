import React, { useState, useEffect } from 'react';

import Order from '../components/Order';
import './Orders.css';

function Orders() {

    const [ordersList, setOrdersList] = useState([]);
  
    useEffect(() => {
      fetch ("http://localhost:4000/api/orders/").then(response => {
        response.json().then(data => {
          setOrdersList(data.map(order => <Order id={order.id}/>));
        });
      }).catch(error => {
        console.log(error);
      });
    }, []);

    return (
      <div>
        <h1>Orders</h1>
        <div class="grid grid-cols-5 gap-4 mx-2">
          {ordersList}
        </div>
      </div>
    );
  }

export default Orders;