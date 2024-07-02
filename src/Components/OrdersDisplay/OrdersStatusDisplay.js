import React, { useState, useEffect } from 'react';

import SingleOrderDisplay from './SingleOrderDisplay';

function OrdersStatusDisplay({status, orders, updateOrders}) {

    const [ordersList, setOrdersList] = useState([]);

    useEffect(() => {
      setOrdersList(orders.map(order => <SingleOrderDisplay key={order.id} id={order.id} updateOrders={updateOrders} />));
    }, [orders, updateOrders]);

    return (
      <div>
        <div className="grid grid-cols-5 gap-4 mx-2 py-2">
          {ordersList}
        </div>
      </div>
    );
  }

export default OrdersStatusDisplay;