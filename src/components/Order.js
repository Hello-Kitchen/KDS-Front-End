import React, { useEffect, useState } from "react";

export default function Order({
  id
}) {
  const [orderDetails, setOrderDetails] = useState();

  useEffect(() => {
    async function fetchData(id) {
      fetch(`http://localhost:4000/api/orders/${id}?forKDS=true`).then(response => {
        response.json().then(data => {
          setOrderDetails(data);
        });
      }).catch(error => {
        console.log(error);
      });
    }

    fetchData(id);
  }, []);

  const actualDate = new Date();

  return (
    <div style={{border: '1px solid red'}}>
      {orderDetails ?
      <div>
        <p>{orderDetails.number}</p>
        <p>{orderDetails.channel}</p>
        <p>Temps écoulé : {new Date(actualDate - new Date(orderDetails.date)).getMinutes()}:{new Date(actualDate - new Date(orderDetails.date)).getSeconds()}</p>
        <ul>
          {orderDetails.food.map((food, index) =>
          <li key={index}>
              {food.name}
              <ol>
                  {food.mods_ingredients.map((modif, index) => <li key={index}>{modif.type} {modif.ingredient}</li>)}
              </ol>
          </li>
          )}
        </ul>
      </div> : <p>Loading...</p>}
    </div>
  );
}
