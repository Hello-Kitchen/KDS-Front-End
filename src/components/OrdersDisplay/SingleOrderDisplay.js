import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import "./Orders.css";

export default function SingleOrderDisplay({
  id
}) {
  const [orderDetails, setOrderDetails] = useState();
  const [orderDate, setOrderDate] = useState({});
  const [waitingTime, setWaitingTime] = useState({});

  useEffect(() => {
      fetch(`http://localhost:4000/api/orders/${id}?forKDS=true`).then(response => {
        response.json().then(data => {
          setOrderDate({
            hours: new Date(data.date).getHours(),
            minutes: new Date(data.date).getMinutes(),
            seconds: new Date(data.date).getSeconds()
          });
          const waitTime = new Date(new Date - new Date(data.date));
          setWaitingTime({
            hours: waitTime.getHours(),
            minutes: waitTime.getMinutes(),
            seconds: waitTime.getSeconds()
          });
          setOrderDetails(data);
        });
      }).catch(error => {
        console.log(error);
      });
    }, [id]);

  return (
    <div className="">
      {orderDetails ?
      <div>
        <div className="bg-slate-600 text-white grid grid-cols-2 rounded-t-lg">
          <div className="p-2 text-left">
            <p className="font-semibold text-lg">{orderDetails.number}</p>
            <p className="text-sm">{orderDetails.channel}</p>
          </div>
          <div className="text-right p-2 text-lg">
              {waitingTime.hours > 1 ?
                <p className={"font-semibold text-2xl text-white border-2 bg-red-500 border-red-500 text-center rounded-lg"}>{waitingTime.hours}:{waitingTime.minutes}:{waitingTime.seconds}</p> :
                <p className={waitingTime.minutes > 15 ? "font-semibold text-lg text-red-500" : "font-semibold text-lg"}>{waitingTime.minutes}:{waitingTime.seconds}</p>
              }
            <p className="text-sm">{orderDate.hours}:{orderDate.minutes}</p>
          </div>
        </div>
        <div className={`px-3 py-1 border-2 border-t-0 rounded-b-lg ${orderDetails.channel === "En salle" ? "bg-yellow-100" : orderDetails.channel === "A emporter" ? "bg-blue-100" : "bg-purple-100"}`}>
          <ul>
            {orderDetails.food.map((food, index) =>
            <li key={index}>
                {food.name}
                <ol>
                    {food.details.map((detail, index) => <li key={index}>→ {detail}</li>)}
                </ol>
                <ol>
                    {food.mods_ingredients.map((modif, index) =>
                      <li key={index} className="flex flex-row">
                        <div className={`p-px text-white font-semibold ${modif.type === "ADD" ? "bg-green-500" : modif.type === "DEL" ? "bg-red-500" : "bg-orange-500"}`}>
                          {modif.type}
                        </div>
                        <div className="pl-1">
                          {modif.ingredient}
                        </div>
                      </li>)
                    }
                </ol>
            </li>
            )}
          </ul>
        </div>
      </div> : <p>Loading...</p>}
    </div>
  );
}

SingleOrderDisplay.propTypes = {
  id: PropTypes.number.isRequired
};