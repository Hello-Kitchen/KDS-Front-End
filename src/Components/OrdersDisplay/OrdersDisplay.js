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
 * @param {boolean} props.activeRecall - The currently active recall.
 *
 * @returns {JSX.Element} The rendered component.
 */
function OrdersDisplay({ selectOrder, setNbrOrder, activeRecall }) {
  const navigate = useNavigate();
  const [nbrOrders, setNbrOrders] = useState(0);
  const [nbrOrdersWaiting, setNbrOrdersWaiting] = useState(0);
  const [ordersLine1, setOrdersLine1] = useState([]);
  const [ordersLine2, setOrdersLine2] = useState([]);
  const selectOrderRef = useRef(selectOrder);

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
      let nbrLines = 0;
      let nbrCol = 0;
      
      orderDetails.food_ordered.map((food) => {
        nbrLines += 1;
        food.details.map(() => {
          nbrLines += 1;
        });
        food.mods_ingredients.map(() => {
          nbrLines += 1;
        });
        if (food.note) {
          nbrLines += 1;
        }
      });
      nbrCol = Math.ceil(nbrLines / 10);
      return nbrCol;
    };

    fetch(
      `http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${process.env.REACT_APP_NBR_RESTAURANT}/orders?sort=time`
      , {headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }})
      .then((response) => {
        if (response.status === 401) {
          navigate("/", {state: {error: "Unauthorized access. Please log in."}});
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

        // Used to display the number of orders waiting
        setNbrOrders(orderToDisplay.length);

        // Fetch food details for each order to display
        const fetchFoodDetailsPromises = orderToDisplay.slice(0, 10).map((order) => {
          return fetch(
            `http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${process.env.REACT_APP_NBR_RESTAURANT}/orders/${order.id}?forKDS=true`
          , {headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }})
            .then((response) => {
              if (response.status === 401) {
                navigate("/", {state: {error: "Unauthorized access. Please log in."}});
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
                  key={index}
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
              currentLine1Cols + order.nbrCol <= 5 &&
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
    const newOrdersLineComponents = ordersLine1.map((order) => ({
      component: (
        <SingleOrderDisplay
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
    const newOrdersLineComponents2 = ordersLine2.map((order) => ({
      component: (
        <SingleOrderDisplay
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
  }, [selectOrder]);

  return (
    <div className="relative w-full h-full grid grid-rows-2 grid-cols-1">
      <div className="grid grid-cols-5 gap-4 mx-2 py-2 min-h-full">
        {ordersLine1}
      </div>
      <div className="grid grid-cols-5 gap-4 mx-2 py-2 min-h-full">
        {ordersLine2}
        {activeRecall && <OrderCarousel />}
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
  selectOrder: PropTypes.number.isRequired,
  setNbrOrder: PropTypes.func,
  activeRecall: PropTypes.bool,
};

export default OrdersDisplay;
