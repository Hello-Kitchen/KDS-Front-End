import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

export default function SingleOrderDisplay({ orderDetails, span }) {
  const navigate = useNavigate();

  const [orderDetail, setOrderDetail] = useState(orderDetails);
  const [waitingTime, setWaitingTime] = useState({
    hours: "--",
    minutes: "--",
    seconds: "--",
  });

  const calculateWaitingTime = (orderDate) => {
    const waitTime = new Date(Date.now() - new Date(orderDate));
    return {
      hours: String(waitTime.getHours()).padStart(2, "0"),
      minutes: String(waitTime.getMinutes()).padStart(2, "0"),
      seconds: String(waitTime.getSeconds()).padStart(2, "0"),
    };
  };

  // To be optimized
  const updateStatus = (idFood) => {
    let notReadyFood = undefined;
    let updatedFood = orderDetail.food_ordered.map(food => {
      if (food.id === idFood) {
        return {...food, is_ready: !food.is_ready};
      } else {
        return food;
      }
    });
    if (notReadyFood)
      updatedFood.push(notReadyFood);
    setOrderDetail(prevOrderDetail => ({
      ...prevOrderDetail,
      food_ordered: updatedFood
    }));
    fetch(`http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${process.env.REACT_APP_NBR_RESTAURANT}/orders/status/${idFood}`, { method: 'PUT', headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}})
      .then((response) => {
        if (response.status === 401) {
          navigate("/", {state: {error: "Unauthorized access. Please log in."}});
          throw new Error("Unauthorized access. Please log in.");
        }
        return response.json();
      })
      .catch(error => console.error(error));
  };
  useEffect(() => {
    if (orderDetails) {
      setOrderDetail(orderDetails);
      calculateWaitingTime(orderDetails.date);
      const interval = setInterval(() => {
        setWaitingTime(calculateWaitingTime(orderDetails.date));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [orderDetails]);
    return (
      <div className={`col-span-${span}`}>
        {orderDetails ? (
          <div>
            <div className="bg-slate-600 text-white grid grid-cols-2 rounded-t-lg">
              <div className="p-2 text-left">
                <p className="font-semibold text-lg">{orderDetails.number}</p>
                <p className="text-sm">{orderDetails.channel}</p>
              </div>
              <div className="text-right p-2 text-lg">
                {waitingTime.hours > 1 && waitingTime.seconds % 2 ? (
                  <p className="font-semibold text-xl text-white border-2 bg-red-500 border-red-500 text-center rounded-lg">
                    {waitingTime.hours}:{waitingTime.minutes}:
                    {waitingTime.seconds}
                  </p>
                ) : waitingTime.hours > 1 ? (
                  <p className="font-semibold text-xl text-red-500 border-2 bg-white border-red-500 text-center rounded-lg">
                    {waitingTime.hours}:{waitingTime.minutes}:
                    {waitingTime.seconds}
                  </p>
                ) : (
                  <p
                    className={
                      waitingTime.minutes > 15
                        ? "font-semibold text-lg text-red-500"
                        : "font-semibold text-lg"
                    }
                  >
                    {waitingTime.minutes}:{waitingTime.seconds}
                  </p>
                )}
                <p className="text-sm">
                  {orderDetails.orderDate.hours}:{orderDetails.orderDate.minutes}
                </p>
              </div>
            </div>
            <div className={`px-3 py-1 border-2 border-t-0 rounded-b-lg ${orderDetails.channel === "En salle" ? "bg-yellow-100" : orderDetails.channel === "A emporter" ? "bg-blue-100" : "bg-purple-100"}`} style={{ columnCount: span }}>
              <ul>
                {orderDetail.food_ordered.map((food, index) =>
                  <li key={index}>
                    <span onClick={() => updateStatus(food.id)} className={`${food.is_ready ? "text-slate-500 italic" : ""}`}>{food.quantity + "x " + food.name + " "}</span>
                    {food.is_ready && <span className={`whitespace-pre h-2 w-2 rounded-full mr-2 bg-green-500`}>     </span>}
                    <ol>
                      {food.details.map((detail, index) => <li key={index} className={`${food.is_ready ? "text-slate-500 italic" : ""}`}>→ {detail}</li>)}
                    </ol>
                    <ol>
                      {food.mods_ingredients.map((modif, index) => (
                        <div key={index}>
                          <li className="flex flex-row pl-5">
                            <div className={`${food.is_ready ? "text-slate-500 italic" : ""} p-px text-white font-semibold ${modif.type === "ADD" ? "bg-green-500" : modif.type === "DEL" ? "bg-red-500" : "bg-orange-500"}`}>
                              {modif.type}
                            </div>
                            <div className={`${food.is_ready ? "text-slate-500 italic" : ""} pl-1`}>
                              {modif.ingredient}
                            </div>
                          </li>
                          <div>
                            {food.note ? (
                              <div className="flex flex-row pl-5">
                                <div className="pl-5p-px text-white font-semibold bg-orange-500">
                                  NOTE
                                </div>
                                <div className="pl-1">{food.note}</div>
                              </div>
                            ) : (
                              <div />
                            )}
                          </div>
                        </div>
                      ))}
                    </ol>
                  </li>
                )}
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
                <p className="font-semibold text-lg">--:--</p>
                <p className="text-sm">--:--</p>
              </div>
            </div>
            <div className="px-3 py-5 border-2 border-t-0 rounded-b-lg bg-slate-200 flex flex-col justify-center text-center">
              Chargement de la commande...
              <div className="pt-5">
                <BeatLoader speedMultiplier={0.5} />
              </div>
            </div>
          </div>
        )}
      </div>
    );

}

SingleOrderDisplay.propTypes = {
  orderDetails: PropTypes.object.isRequired,
  span: PropTypes.number.isRequired,
};
