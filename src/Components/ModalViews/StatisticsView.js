import Skeleton from "@mui/material/Skeleton";
import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { BarChart } from '@mui/x-charts/BarChart';
import { calculateWaitingTime } from "../OrdersDisplay/SingleOrderDisplay";

/**
 * StatisticsView component displays various statistics related to the kitchen operations.
 * It includes sections for displaying graphs, average waiting times, number of orders, and number of clients.
 *
 * @component
 * @example
 * return (
 *   <StatisticsView />
 * )
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function StatisticsView({ ordersForStatistics }) {
    const navigate = useNavigate();
    const [apiData, setApiData] = React.useState(null);
    const [graphData, setGraphData] = React.useState(null);
    const [counts, setCounts] = React.useState({
        onTime: 0,
        late: 0,
        veryLate: 0,
        total: 0
    });

    const fetchApiData = () => {
        return fetch(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${localStorage.getItem("restaurantID")}/kpi/displayKpi?useCase=KDS`, {
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
            setApiData(data);
            return data;
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            return null;
        });
    };

    const fetchGraphData = () => {
        const timeNow = new Date();
        timeNow.setMinutes(Math.floor(timeNow.getMinutes() / 15) * 15, 0, 0); // Round down to previous 15 minutes
        const timeBegin = new Date(timeNow.getTime() - 3600000 * 3); // 3 hours ago

        return fetch(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${localStorage.getItem("restaurantID")}/kpi/ordersCount?timeBegin=${timeBegin}&timeEnd=${timeNow}&breakdown=15`, {
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
            const times = Object.keys(data);
            const values = Object.values(data);

            // Convert UTC times to local times
            const localTimes = times.map(utcTime => {
                const [hours, minutes] = utcTime.split(':').map(Number);
                const utcDate = new Date();
                utcDate.setUTCHours(hours, minutes, 0, 0);
                const localHours = utcDate.getHours();
                const localMinutes = utcDate.getMinutes();

                return `${String(localHours).padStart(2, '0')}:${String(localMinutes).padStart(2, '0')}`;
            });

            const chartData = {
                xAxis: [{
                    data: localTimes
                }],
                series: [{
                    data: values
                }],
            };

            setGraphData(chartData);
            return data;
        })
        .catch((error) => {
            console.error("Error fetching graph data:", error);
            return null;
        });
    };

    const countOrders = (orders) => {
        const currentTime = new Date().toUTCString();
        const localcounts = {
            onTime: 0,
            late: 0,
            veryLate: 0,
            total: orders.length
        };

        orders.forEach(order => {
            const orderDate = new Date(order.date).toUTCString();
            const waitingTime = calculateWaitingTime(orderDate, currentTime);

            if (waitingTime.hours < 1) {
                localcounts.onTime++;
            } else if (waitingTime.hours === 1 && waitingTime.minutes < 15) {
                localcounts.late++;
            } else {
                localcounts.veryLate++;
            }
        });

        setCounts(localcounts);
    };

    React.useEffect(() => {
        fetchApiData();
        fetchGraphData();
    }, []);

    React.useEffect(() => {
        countOrders(ordersForStatistics);
    }, [ordersForStatistics]);

    return (
        <div className="bg-kitchen-blue h-full border-kitchen-yellow border-y-2 flex flex-row items-center justify-center space-x-10">
            <div className="bg-white w-5/12 h-4/5 rounded">
                {graphData ? (
                    <BarChart
                        xAxis={graphData.xAxis}
                        series={graphData.series}
                        colors={['#499CA6']}
                    />  
                ) : (
                    <Skeleton variant="rounded" width="100%" animation="wave" height={"100%"} className="bg-white rounded-xl p-4" />
                )}
            </div>
            <div className="w-5/12 space-y-5">
                    {apiData ? (
                        <div className="bg-white rounded-xl p-4">
                            <div className="text-2xl font-bold pb-1">Temps d&apos;attente</div>
                            <div className="text-l">Temps de préparation moyen (1h): {String(apiData.averagePrepTime1h.time.hours).padStart(2, "0")}:{String(apiData.averagePrepTime1h.time.minutes).padStart(2, "0")}:{String(apiData.averagePrepTime1h.time.seconds).padStart(2, "0")}</div>
                            <div className="text-l">Temps de préparation (1/4h) : {String(apiData.averagePrepTime15m.time.hours).padStart(2, "0")}:{String(apiData.averagePrepTime15m.time.minutes).padStart(2, "0")}:{String(apiData.averagePrepTime15m.time.seconds).padStart(2, "0")}</div>
                        </div>
                    ) : (
                        <Skeleton variant="rounded" width="100%" height={100} animation="wave" className="bg-white rounded-xl p-4" />
                    )}
                <div className="bg-white rounded-xl p-4">
                    <div className="text-2xl font-bold pb-1">Nombre de commandes</div>
                    <div className="text-l">Commandes en cours :</div>
                    <div className="pl-5 space-y-1">
                        <div className="bg-kitchen-green text-white px-3 w-fit rounded-lg">{counts.onTime} commandes en dans les temps</div>
                        <div className="bg-kitchen-orange text-white px-3 w-fit rounded-lg">{counts.late} commandes en retard</div>
                        <div className="bg-kitchen-red text-white px-3 w-fit rounded-lg">{counts.veryLate} commandes très en retard</div>
                        <div className="text-l">Total : {counts.total} commandes</div>
                    </div>
                    {apiData ?
                        (
                            <div className="text-l">Commandes au 1/4 d&apos;h : {apiData.last15mOrders}</div>
                        ) : (
                            <Skeleton variant="rounded" width="100%" height={25} animation="wave" />
                        )}
                </div>
                <div>
                    {apiData ? (
                        <div className="bg-white rounded-xl p-4">
                            <div className="text-2xl font-bold pb-1">Nombre de clients</div>
                            <div className="text-l">Clients en salle : {apiData.clientsCount}</div>
                        </div>
                    ) : (
                        <Skeleton variant="rounded" width="100%" height={100} animation="wave" className="bg-white rounded-xl p-4" />
                    )}
                </div>
            </div>
        </div>
    );
}

StatisticsView.propTypes = {
    ordersForStatistics: PropTypes.array.isRequired, // Array of orders to count in the statistics page.
};