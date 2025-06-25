import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';
import PropTypes from "prop-types";

/**
 * @function SingleOrderDisplay
 * @description Component representing an order with various details.
 * @param {Object} orderDetails - Details of the order to be displayed.
 * @param {number} span - The number of columns the order should span in the grid.
 * @param {number} index - Index of the order into array.
 * @param {number} selectOrder - Index of the order be selected with button "suivant" and "precedent".
 * @param {number} recall - Can specify whether the component is used for displaying a recall.
 * @returns {JSX.Element} The rendered component.
 */
export default function SingleOrderDisplay({ orderDetails, span, index, selectOrder, recall }) {
  // if (recall) console.log("orderdetails = ", orderDetails);
  const navigate = useNavigate();

  const [orderDetail, setOrderDetail] = useState(orderDetails);
  const [updatingFoodIds, setUpdatingFoodIds] = useState(new Set());
  const [lastUpdateTime, setLastUpdateTime] = useState(new Map());
  const [previousStates, setPreviousStates] = useState(new Map());
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /**
   * @function calculateWaitingTime
   * @description Calculates the waiting time for the order based on the order date.
   * @param {string} orderDate - The date when the order was placed.
   * @returns {Object} The calculated waiting time in hours, minutes, and seconds.
   */
  const calculateWaitingTime = (orderDate) => {
    const waitTime = new Date(currentTime - new Date(orderDate));
    return {
      hours: String(waitTime.getHours()).padStart(2, "0"),
      minutes: String(waitTime.getMinutes()).padStart(2, "0"),
      seconds: String(waitTime.getSeconds()).padStart(2, "0"),
    };
  };

  /**
   * @function updateStatus
   * @description Updates the readiness status of a specific food item in the order.
   * @param {string} idFood - The ID of the food item to be updated.
   */
  const updateStatus = (idFood) => {
    // Save previous state
    setPreviousStates(prev => new Map(prev).set(idFood, {...orderDetail}));

    // Mark as updating
    setUpdatingFoodIds(prev => new Set(prev).add(idFood));
    setLastUpdateTime(prev => new Map(prev).set(idFood, Date.now()));

    // Optimistic update
    let updatedFood = orderDetail.food_ordered.map(food => {
      if (food.id === idFood) {
        return {...food, is_ready: !food.is_ready};
      }
      return food;
    });

    setOrderDetail(prevOrderDetail => ({
      ...prevOrderDetail,
      food_ordered: updatedFood
    }));

    // API Request
    fetch(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${localStorage.getItem("restaurantID")}/orders/status/${idFood}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status === 401) {
        navigate("/", { state: { error: "Unauthorized access. Please log in." } });
        throw new Error("Unauthorized access. Please log in.");
      }
      if (!response.ok) {
        throw new Error('Update failed');
      }
    })
    .catch(error => {
      console.error('Error updating status:', error);
      // Rollback in case of error
      const previousState = previousStates.get(idFood);
      if (previousState) {
        setOrderDetail(previousState);
      }
    })
    .finally(() => {
      // Clean up states
      setUpdatingFoodIds(prev => {
        const next = new Set(prev);
        next.delete(idFood);
        return next;
      });
      setPreviousStates(prev => {
        const next = new Map(prev);
        next.delete(idFood);
        return next;
      });
    });
  };

  // Handle periodic refresh
  useEffect(() => {
    if (orderDetails && orderDetails.food_ordered) {
      const now = Date.now();
      const shouldUpdate = Array.from(lastUpdateTime.entries()).every(
        ([, time]) => now - time > 5000
      );

      if (shouldUpdate) {
        setOrderDetail(orderDetails);
      }
    }
  }, [orderDetails]);

  // Component rendering with loading state management
  const renderFoodItem = (food) => (
    <span
      onClick={() => !updatingFoodIds.has(food.id) && updateStatus(food.id)}
      className={`
        cursor-pointer
        ${food.is_ready ? "text-slate-500 italic" : ""}
        ${updatingFoodIds.has(food.id) ? "opacity-50" : ""}
      `}
    >
      {updatingFoodIds.has(food.id) ? (
        <>
          {food.quantity}x {food.name} <BeatLoader size={8} />
        </>
      ) : (
        `${food.quantity}x ${food.name} `
      )}
    </span>
  );

  if (!orderDetail || !orderDetail.food_ordered)
    return (<></>);

  const colSpanClasses = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
  };

  return (
    <div className={`flex ${colSpanClasses[span]}`}>
      {orderDetails ? (
        <div className={`flex-1 flex flex-col`}>
          <div className="bg-slate-600 text-white flex justify-between rounded-t-lg flex-shrink-0">
            <div className="p-2 text-left">
              <p className="font-semibold text-lg">{orderDetails.number}</p>
              <p className="text-sm">{orderDetails.channel}</p>
            </div>
            <div className="text-right p-2 text-lg flex flex-col justify-between h-[70px] items-end">
              {calculateWaitingTime(orderDetails.date).hours > 1 && calculateWaitingTime(orderDetails.date).seconds % 2 ? (
                <p className="font-semibold text-xl text-white border-2 bg-red-500 border-red-500 text-center rounded-lg">
                  {calculateWaitingTime(orderDetails.date).hours}:{calculateWaitingTime(orderDetails.date).minutes}:{calculateWaitingTime(orderDetails.date).seconds}
                </p>
              ) : calculateWaitingTime(orderDetails.date).hours > 1 ? (
                <p className="font-semibold text-xl text-red-500 border-2 bg-white border-red-500 text-center rounded-lg">
                  {calculateWaitingTime(orderDetails.date).hours}:{calculateWaitingTime(orderDetails.date).minutes}:{calculateWaitingTime(orderDetails.date).seconds}
                </p>
              ) : (
                <p
                  className={
                    calculateWaitingTime(orderDetails.date).minutes > 15
                      ? "font-semibold text-lg text-red-500"
                      : "font-semibold text-lg"
                  }
                >
                  {calculateWaitingTime(orderDetails.date).minutes}:{calculateWaitingTime(orderDetails.date).seconds}
                </p>
              )}
              <p className="text-sm">
                {orderDetails.orderDate.hours}:{orderDetails.orderDate.minutes}
              </p>
            </div>
          </div>
          <div className={`flex-grow px-3 py-1 border-4 border-t-0 ${recall ? `` : `rounded-b-lg`} ${selectOrder === index ? `border-select-orange ${orderDetails.channel === "Sur place" ? "bg-yellow-100" : orderDetails.channel === "A emporter" ? "bg-blue-100" : "bg-purple-100"}` : orderDetails.channel === "Sur place" ? "bg-yellow-100 border-yellow-100" : orderDetails.channel === "A emporter" ? "bg-blue-100 border-blue-100" : "bg-purple-100 border-purple-100"}`} style={{ columnCount: span }}>
            <ul>
              {orderDetail.food_ordered.map((food, index) =>
                <li key={index}>
                  <div className='break-inside-avoid'>
                    {renderFoodItem(food)}
                    {food.is_ready && <span className={`whitespace-pre h-2 w-2 rounded-full mr-2 bg-green-500`}>     </span>}
                    <ol>
                      {food.details.map((detail, index) => <li key={index} className={`${food.is_ready ? "text-slate-500 italic" : ""}`}>→ {detail}</li>)}
                    </ol>
                  </div>
                  <ol>
                    {food.mods_ingredients.map((modif, index) => (
                      <div key={index} className='break-inside-avoid'>
                        <li className="flex flex-row pl-5">
                          <div className={`${food.is_ready ? "text-slate-500 italic" : ""} p-px text-white font-semibold ${modif.type === "ADD" ? "bg-green-500" : modif.type === "DEL" ? "bg-red-500" : "bg-orange-500"}`}>
                            {modif.type}
                          </div>
                          <div className={`${food.is_ready ? "text-slate-500 italic" : ""} pl-1`}>
                            {modif.ingredient}
                          </div>
                        </li>
                        <div>
                        </div>
                      </div>
                    ))}
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
  index: PropTypes.number.isRequired,
  selectOrder: PropTypes.number.isRequired,
  recall: PropTypes.bool
};
