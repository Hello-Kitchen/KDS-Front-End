import React, { useState, useEffect } from 'react';

import Order from '../components/Order';

function Orders() {

    const [ordersList, setOrdersList] = useState([]);
  
    useEffect(() => {
      async function fetchData() {
        fetch ("http://localhost:4000/api/orders/").then(response => {
          response.json().then(data => {
            setOrdersList(data.map(order => <Order id={order.id}/>));
          });
        }).catch(error => {
          console.log(error);
        });
      };
  
      fetchData();
    }, []);
  
    return (
      <div>
        <header>
          <h1>Orders</h1>
          <ul>
            {ordersList}
          </ul>
        </header>
      </div>
    );
  }

export default Orders;