import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./Orders.css";
import { BeatLoader } from "react-spinners";

export default function SingleOrderDisplay({ id }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderDate, setOrderDate] = useState({});
  const [waitingTime, setWaitingTime] = useState({});

  const calculateWaitingTime = (orderDate) => {
    const waitTime = new Date(Date.now() - new Date(orderDate));
    return {
      hours: String(waitTime.getHours()).padStart(2, "0"),
      minutes: String(waitTime.getMinutes()).padStart(2, "0"),
      seconds: String(waitTime.getSeconds()).padStart(2, "0")
    };
  };

  useEffect(() => {
    const fetchOrderDetails = () => {
      fetch(`http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/orders/${id}?forKDS=true`)
        .then(response => response.json())
        .then(data => {
          const orderDateObj = new Date(data.date);
          setOrderDate({
            hours: String(orderDateObj.getHours()).padStart(2, "0"),
            minutes: String(orderDateObj.getMinutes()).padStart(2, "0"),
            seconds: String(orderDateObj.getSeconds()).padStart(2, "0")
          });
          setWaitingTime(calculateWaitingTime(data.date));
          setOrderDetails(data);
        })
        .catch(error => {
          console.error(error);
        });
    };

    fetchOrderDetails();

    const intervalId = setInterval(() => {
      if (orderDetails) {
        setWaitingTime(calculateWaitingTime(orderDetails.date));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [id, orderDetails]);

  return (
    <div className="">
      {orderDetails ? (
        <div>
          <div className="bg-slate-600 text-white grid grid-cols-2 rounded-t-lg">
            <div className="p-2 text-left">
              <p className="font-semibold text-lg">{orderDetails.number}</p>
              <p className="text-sm">{orderDetails.channel}</p>
            </div>
            <div className="text-right p-2 text-lg">
              {waitingTime.hours > 1  && waitingTime.seconds % 2 ? (
                <p className="font-semibold text-xl text-white border-2 bg-red-500 border-red-500 text-center rounded-lg">
                  {waitingTime.hours}:{waitingTime.minutes}:{waitingTime.seconds}
                </p>
              ) : waitingTime.hours > 1 ? (
                <p className="font-semibold text-xl text-red-500 border-2 bg-white border-red-500 text-center rounded-lg">
                  {waitingTime.hours}:{waitingTime.minutes}:{waitingTime.seconds}
                </p>
              ) : (
                <p className={waitingTime.minutes > 15 ? "font-semibold text-lg text-red-500" : "font-semibold text-lg"}>
                  {waitingTime.minutes}:{waitingTime.seconds}
                </p>
              )}
              <p className="text-sm">
                {orderDate.hours}:{orderDate.minutes}
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1 border-2 border-t-0 rounded-b-lg ${
              orderDetails.channel === "En salle" ? "bg-yellow-100" : orderDetails.channel === "A emporter" ? "bg-blue-100" : "bg-purple-100"
            }`}
          >
            <ul>
              {orderDetails.food.map((food, index) => (
                <li key={index}>
                  {food.quantity}x {food.name}
                  <ol>
                    {food.mods_ingredients.map((modif, index) => (
                      <li key={index} className="flex flex-row pl-5">
                        <div className={`p-px text-white font-semibold ${modif.type === "ADD" ? "bg-green-500" : modif.type === "DEL" || modif.type === "ALL"  ? "bg-red-500" : "bg-orange-500"}`}>
                          {modif.type}
                        </div>
                        <div className="pl-1">{modif.ingredient}</div>
                      </li>
                    ))}
                    <div>
                      {food.note ? <div className="flex flex-row">
                        <div className="p-px text-white font-semibold bg-orange-500">
                          NOTE
                        </div>
                        <div className="pl-1">{food.note}</div>
                      </div>
                      : <div/>}
                    </div>
                  </ol>
                  <ol>
                    {food.details.map((detail, index) => (
                      <li key={index} className="pl-5">→ {detail}</li>
                    ))}
                  </ol>
                  <ol>
                    {food.details.map((detail, index) => (
                      <li key={index} className="pl-5">→ {detail}</li>
                    ))}
                  </ol>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-slate-600 text-white grid grid-cols-2 rounded-t-lg">
            <div className="p-2 text-left">
              <p className="font-semibold text-lg">-</p>
              <p className="text-sm">-</p>
            </div>
            <div className="text-right p-2 text-lg">
                <p className="font-semibold text-lg">
                  --:--
                </p>
              <p className="text-sm">
                --:--
              </p>
            </div>
          </div>
          <div className="px-3 py-5 border-2 border-t-0 rounded-b-lg bg-slate-200 flex flex-col justify-center text-center">
              Chargement de la commande...
              <div className="pt-5">
                <BeatLoader speedMultiplier={0.5}/>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

SingleOrderDisplay.propTypes = {
  id: PropTypes.number.isRequired,
};
