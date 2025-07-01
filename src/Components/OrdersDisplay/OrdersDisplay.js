import React, { useState, useEffect, useRef } from "react";
import SingleOrderDisplay from "./SingleOrderDisplay";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import OrderCarousel from './OrderCarousel';

/**
 * @component OrdersDisplay
 * @description A functional component that fetches and displays food orders.
 * It manages the state for the number of orders, the orders waiting, and organizes
 * the display of orders into two lines based on their status.
 * Orders are fetched every 5 seconds.
 *
 * @param {number} props.selectOrder - Index of the order be selected with button "suivant" and "precedent".
 * @param {func} props.setNbrOrder - Function for set the number of order for the selection.
 * @param {Boolean} orderAnnoncement - A boolean to determine if an order announcement is active.
 * @param {boolean} props.activeRecall - The currently active recall.
 * @param {Boolean} orderSelect - A boolean to determine if an order announcement is active for the selected order.
 * @param {Boolean} orderReading - A boolean to determine if an order announcement is active for the new order.
 * @param {Function} props.setOrdersForStatistics - Function to handle the selection of an order ID.
 *
 * @returns {JSX.Element} The rendered component.
 */
function OrdersDisplay({ orderAnnoncement, selectOrder, setNbrOrder, activeRecall, onSelectOrderId, orderSelect, orderReading, isServing, setOrdersForStatistics, updateTime }) {
  const navigate = useNavigate();
  const [nbrOrders, setNbrOrders] = useState(0);
  const [nbrOrdersWaiting, setNbrOrdersWaiting] = useState(0);
  const [ordersLine1, setOrdersLine1] = useState([]);
  const [ordersLine2, setOrdersLine2] = useState([]);
  const previousNbrOrders = useRef(0);
  const [lastOrders, setLastOrders] = useState();
  const selectOrderRef = useRef(selectOrder);

  const audio = new Audio("audio/newOrder.mp3");

  const speakWithPause = (text, pauseDuration = 1000) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);

    setTimeout(() => {
      const pauseUtterance = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(pauseUtterance);
    }, pauseDuration);
  };

  const prepareText = (currentOrder) => {
    let text = "";

    if (currentOrder) {
      text = `Commande pour la table ${currentOrder.props.orderDetails.number}`;
      speakWithPause(text);

      for (const food of currentOrder.props.orderDetails.food_ordered) {
        text = `Plat: ${food.name}`;
        speakWithPause(text);

        if (food.details.length > 0) {
          text = "details: " + food.details.join(", ");
          speakWithPause(text);
        }

        if (food.mods_ingredients.length > 0) {
          text = 'ingredients: ' + food.mods_ingredients.map(ingredient => {
            return ingredient.type === 'DEL' ? `Enlever: ${ingredient.ingredient}` : `Ajouter: ${ingredient.ingredient}`;
          }).join(", ");
          speakWithPause(text);
        }

        if (food.note) {
          text = `Note: ${food.note}`;
          speakWithPause(text);
        }
      }
    }
  };

  /**
   * @function fetchOrders
   * @description Fetches orders from the backend API, processes them, and sets the
   * state for displaying the orders in the component.
   */
  const fetchOrders = () => {
    /**
     * @function getNbrColumns
     * @description Calculates the number of columns needed to display an order
     * based on the number of food items, their details, and modifications.
     *
     * @param {Object} orderDetails - The details of the order.
     * @returns {number} The number of columns needed to display the order.
     */
    const getNbrColumns = (orderDetails) => {
      if (!orderDetails || !orderDetails.food_ordered || orderDetails.food_ordered.length === 0) {
        return 1;
      }

      let nbrLines = 0;
      let nbrCol = 0;

      orderDetails.food_ordered.map((food) => {
        nbrLines += 1;
        if (food.details && Array.isArray(food.details)) {
          food.details.map(() => {
            nbrLines += 1;
          });
        }
        if (food.mods_ingredients && Array.isArray(food.mods_ingredients)) {
          food.mods_ingredients.map(() => {
            nbrLines += 1;
          });
        }
        if (food.note) {
          nbrLines += 1;
        }
      });
      nbrCol = Math.ceil(nbrLines / 10);
      return nbrCol || 1;
    };

    fetch(
      `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${localStorage.getItem("restaurantID")}/orders?sort=time`
      , {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      .then((response) => {
        if (response.status === 401) {
          navigate("/", { state: { error: "Unauthorized access. Please log in." } });
          throw new Error("Unauthorized access. Please log in.");
        }
        return response.json();
      })
      .then((ordersData) => {
        // Filter orders to display, only those that have at least one food that is not ready

        const orderToDisplay = [];

        ordersData.forEach((order) => {
          const foodPart = [];
          order.food_ordered.forEach((food) => {
            if (food.part === order.part) {
              foodPart.push(food);
            }
          });
          if (foodPart.some((food) => !food.is_ready)) {
            orderToDisplay.push(order);
          }
        });

        setOrdersForStatistics(orderToDisplay);

        if (orderAnnoncement && orderToDisplay.length > previousNbrOrders.current) {
          audio.play().catch((error) => {
            console.error("Erreur lors de la lecture du son :", error);
          });

          if (!orderReading) {
            for (const i in orderToDisplay.length - previousNbrOrders.current)
              prepareText(orderToDisplay[i]);
          }
        }

        previousNbrOrders.current = orderToDisplay.length;

        // Used to display the number of orders waiting
        setNbrOrders(orderToDisplay.length);

        // Fetch food details for each order to display
        const fetchFoodDetailsPromises = orderToDisplay.slice(0, 10).map((order) => {
          return fetch(
            `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${localStorage.getItem("restaurantID")}/orders/${order.id}?forKDS=true`
            , {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
            })
            .then((response) => {
              if (response.status === 401) {
                navigate("/", { state: { error: "Unauthorized access. Please log in." } });
                throw new Error("Unauthorized access. Please log in.");
              }
              return response.json();
            })
            .then((data) => {
              const orderDateObj = new Date(order.date);
              const orderDate = {
                hours: String(orderDateObj.getHours()).padStart(2, "0"),
                minutes: String(orderDateObj.getMinutes()).padStart(2, "0"),
                seconds: String(orderDateObj.getSeconds()).padStart(2, "0"),
              };
              ordersData.find((singleOrder) => singleOrder.id === order.id).food_ordered = data.food_ordered;
              ordersData.find((singleOrder) => singleOrder.id === order.id).orderDate = orderDate;
            });
        });

        // Create array of components to display
        Promise.all(fetchFoodDetailsPromises).then(() => {
          const ordersLineComponents = orderToDisplay.slice(0, 10).map(
            (orderDetails, index) => ({
              component: (
                <SingleOrderDisplay
                  updateTime={updateTime}
                  key={orderDetails.id}
                  orderDetails={orderDetails}
                  span={getNbrColumns(orderDetails)}
                  index={index}
                  selectOrder={selectOrderRef.current}
                />
              ),
              nbrCol: getNbrColumns(orderDetails),
            })
          );
          let ordersLine1 = [];
          let ordersLine2 = [];
          let currentLine1Cols = 0;
          let currentLine2Cols = 0;
          let waitingOrdersQueue = [];

          setNbrOrder(ordersLineComponents.length);
          ordersLineComponents.forEach((order) => {
            if (
              currentLine1Cols + order.nbrCol <=5 &&
              waitingOrdersQueue.length === 0 &&
              ordersLine2.length === 0
            ) {
              ordersLine1.push(order.component);
              currentLine1Cols += order.nbrCol;
            } else if (
              currentLine2Cols + order.nbrCol <= 5 &&
              waitingOrdersQueue.length === 0
            ) {
              ordersLine2.push(order.component);
              currentLine2Cols += order.nbrCol;
            } else {
              waitingOrdersQueue.push(order);
            }
          });

          const processWaitingOrders = () => {
            waitingOrdersQueue.every((order) => {
              if (currentLine1Cols + order.nbrCol <= 5) {
                ordersLine1.push(order.component);
                currentLine1Cols += order.nbrCol;
              } else if (currentLine2Cols + order.nbrCol <= 5) {
                ordersLine2.push(order.component);
                currentLine2Cols += order.nbrCol;
              } else {
                return;
              }
            });
          };

          processWaitingOrders();

          setOrdersLine1(ordersLine1);
          setOrdersLine2(ordersLine2);
        });
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  useEffect(() => {
    if (ordersLine1.length !== 0 && ordersLine2.length !== 0)
      setNbrOrdersWaiting(nbrOrders - ordersLine1.length - ordersLine2.length);
  }, [nbrOrders, ordersLine1, ordersLine2]);

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(fetchOrders, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const newOrdersLineComponents = ordersLine1.filter((order) => order.props.orderDetails.id !== isServing).map((order) => ({
      component: (
        <SingleOrderDisplay
          updateTime={updateTime}
          key={order.props.index}
          orderDetails={order.props.orderDetails}
          span={order.props.span}
          index={order.props.index}
          selectOrder={selectOrder}
        />
      )
    })
    );
    let array = [];
    newOrdersLineComponents.forEach((component) => { array.push(component.component); });
    setOrdersLine1(array);
    const newOrdersLineComponents2 = ordersLine2.filter((order) => order.props.orderDetails.id !== isServing).map((order) => ({
      component: (
        <SingleOrderDisplay
          updateTime={updateTime}
          key={order.props.index}
          orderDetails={order.props.orderDetails}
          span={order.props.span}
          index={order.props.index}
          selectOrder={selectOrder}
        />
      )
    })
    );
    array = [];
    newOrdersLineComponents2.forEach((component) => { array.push(component.component); });
    setOrdersLine2(array);
    selectOrderRef.current = selectOrder;
  }, [selectOrder, isServing]);

  useEffect(() => {
    const selectedOrder = ordersLine1.concat(ordersLine2)[selectOrder];
    const selectedOrderId = selectedOrder ? selectedOrder.props.orderDetails.id : undefined;

    onSelectOrderId(selectedOrderId);

  }, [selectOrder, ordersLine1]);

  useEffect(() => {
    if (nbrOrders >= 10) {
      if (activeRecall) {
        setLastOrders(ordersLine2[ordersLine2.length]);
        setOrdersLine2((prevOrders) => prevOrders.slice(0, -1));
        setNbrOrdersWaiting(nbrOrdersWaiting + 1);
      }
      else {
        setOrdersLine2((prevOrders) => [...prevOrders, lastOrders]);
        setLastOrders(undefined);
        setNbrOrdersWaiting(nbrOrdersWaiting - 1);
      }
    }
  }, [activeRecall]);

  useEffect(() => {
    let currentOrder;

    if (!orderSelect)
      return;
    if (selectOrder <= 4)
      currentOrder = ordersLine1[selectOrder];
    else
      currentOrder = ordersLine2[selectOrder - 5];
    prepareText(currentOrder);
  }, [selectOrder]);

  useEffect(() => {
    if (isServing !== -1)
      setNbrOrders(nbrOrders - 1);
  }, [isServing]);

  return (
    <div className="relative w-full h-full grid grid-rows-2 grid-cols-1">
      <div className="grid grid-cols-5 gap-4 mx-2 py-2 min-h-full">
        {ordersLine1}
      </div>
      <div className="grid grid-cols-5 gap-4 mx-2 py-2 min-h-full">
        {ordersLine2}
        {activeRecall && <OrderCarousel label="cuisine" />}
      </div>
      {nbrOrdersWaiting === 1 && (
        <div className="absolute bottom-0 right-0 bg-orange-400 text-white font-bold border-2 border-orange-400 rounded-tl-md">
          {nbrOrdersWaiting} commande en attente &gt;&gt;
        </div>
      )}
      {nbrOrdersWaiting > 1 && (
        <div className="absolute bottom-0 right-0 bg-orange-400 text-white font-bold border-2 border-orange-400 rounded-tl-md">
          {nbrOrdersWaiting} commandes en attente &gt;&gt;
        </div>
      )}
    </div>
  );
}


OrdersDisplay.propTypes = {
  orderAnnoncement: PropTypes.bool, //< A boolean to determine if an order announcement is active.
  selectOrder: PropTypes.number.isRequired, //< Index of the order be selected with button "suivant" and "precedent".
  setNbrOrder: PropTypes.func,
  activeRecall: PropTypes.bool, //< Function for set the number of order for the selection.
  onSelectOrderId: PropTypes.func.isRequired,
  orderSelect: PropTypes.bool,
  orderReading: PropTypes.bool,
  isServing: PropTypes.number,
  setOrdersForStatistics: PropTypes.func.isRequired, //< Function to set the orders to count in the statistics page.
  updateTime: PropTypes.func.isRequired,
};

OrdersDisplay.defaultProps = {
  orderAnnoncement: false,
};

export default OrdersDisplay;
