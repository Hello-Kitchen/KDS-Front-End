import React, { useState, useEffect, useRef } from 'react';
import SingleOrderDisplay from './SingleOrderDisplay';
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import OrderCarousel from './OrderCarousel';

/**
 * @component OrdersDisplayPasse
 * @description Displays orders based on their status (ready or pending).
 * It fetches orders from the backend and organizes them for display.
 *
 * @param {Object} props - The component props.
 * @param {string} props.status - The status of the orders to display ('ready' or 'pending').
 * @param {number} props.selectOrder - Index of the order be selected with button "suivant" and "precedent".
 * @param {func} props.setNbrOrder - Function for set the number of order for the selection.
 * @param {boolean} props.activeRecall - The currently active recall.
 *
 * @example
 * <OrdersDisplayPasse status="ready" selectOrder=0/>
 */
function OrdersDisplayPasse({ status, selectOrder, setNbrOrder, onSelectOrderId, activeRecall }) {
  const navigate = useNavigate();
  const [nbrOrders, setNbrOrders] = useState(0);
  const [nbrOrdersWaiting, setNbrOrdersWaiting] = useState(0);
  const [ordersLine1, setOrdersLine1] = useState([]);
  const [lastOrders, setLastOrders] = useState();
  const selectOrderRef = useRef(selectOrder);

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

  /**
   * @function fetchOrders
   * @description Fetches orders from the backend API, processes them, and sets the
   * state for displaying the orders in the component.
   */
  const fetchOrders = () => {

    fetch(
      `http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${process.env.REACT_APP_NBR_RESTAURANT}/orders?sort=time&status=${status}`
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
          if (status === "ready" && foodPart.every((food) => food.is_ready)) {
            orderToDisplay.push(order);
          } else if (status === "pending" && foodPart.some((food) => food.is_ready) && !foodPart.every((food) => food.is_ready)) {
            orderToDisplay.push(order);
          }
        });

        // Update the number of orders to display
        setNbrOrders(orderToDisplay.length);

        // Fetch food details for each order to display
        const fetchFoodDetailsPromises = orderToDisplay.slice(0, 5).map((order) => {
          return fetch(
            `http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${process.env.REACT_APP_NBR_RESTAURANT}/orders/${order.id}?forKDS=true`
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

        Promise.all(fetchFoodDetailsPromises).then(() => {
          const ordersLineComponents = orderToDisplay.slice(0, 5).map(
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
          let currentLine1Cols = 0;
          let waitingOrdersQueue = [];

          ordersLineComponents.forEach((order) => {
            if (currentLine1Cols + order.nbrCol <= 5 && waitingOrdersQueue.length === 0) {
              ordersLine1.push(order.component);
              currentLine1Cols += order.nbrCol;
            } else {
              waitingOrdersQueue.push(order);
            }
          });

          const processWaitingOrders = () => {
            waitingOrdersQueue.forEach((order) => {
              if (currentLine1Cols + order.nbrCol <= 5) {
                ordersLine1.push(order.component);
                currentLine1Cols += order.nbrCol;
              }
            });
          };

          processWaitingOrders();

          setOrdersLine1(ordersLine1);
          if (setNbrOrder !== undefined)
            setNbrOrder(ordersLine1.length);
        });
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  useEffect(() => {
    setNbrOrdersWaiting(nbrOrders - ordersLine1.length);
  }, [nbrOrders, ordersLine1]);

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(fetchOrders, 5000);

    return () => clearInterval(intervalId);
  }, [status]);

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
    selectOrderRef.current = selectOrder;
  }, [selectOrder]);

  useEffect(() => {
    const selectedOrder = ordersLine1[selectOrder];
    const selectedOrderId = selectedOrder ? selectedOrder.props.orderDetails.id : undefined;

    onSelectOrderId(selectedOrderId);

  }, [selectOrder, ordersLine1]);

  useEffect(() => {
    if (nbrOrders >= 5) {
      if (activeRecall) {
        setLastOrders(ordersLine1[ordersLine1.length]);
        setOrdersLine1((prevOrders) => prevOrders.slice(0, -1));
        setNbrOrdersWaiting(nbrOrdersWaiting + 1);
      }
      else {
        setOrdersLine1((prevOrders) => [...prevOrders, lastOrders]);
        setLastOrders(undefined);
        setNbrOrdersWaiting(nbrOrdersWaiting - 1);
      }
    }
  }, [activeRecall]);

  return (
    <div className="relative w-full h-full grid grid-cols-1">
      <div className="grid grid-cols-5 gap-4 mx-2 py-2 h-full">
        {ordersLine1}
        {activeRecall && <OrderCarousel label="passe" />}
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

OrdersDisplayPasse.propTypes = {
  status: PropTypes.string.isRequired,
  selectOrder: PropTypes.number.isRequired,
  setNbrOrder: PropTypes.func,
  onSelectOrderId: PropTypes.func,
  activeRecall: PropTypes.bool,
};

export default OrdersDisplayPasse;
