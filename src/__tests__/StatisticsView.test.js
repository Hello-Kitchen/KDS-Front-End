/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import { render, screen } from "@testing-library/react";
import StatisticsView from "../Components/ModalViews/StatisticsView";

// Mock useNavigate from react-router-dom
jest.mock("react-router-dom", () => ({
    useNavigate: () => jest.fn(),
}));

// Mock BarChart from @mui/x-charts/BarChart
jest.mock("@mui/x-charts/BarChart", () => ({
    BarChart: () => <div data-testid="barchart" />,
}));

// Mock Skeleton from @mui/material/Skeleton
jest.mock("@mui/material/Skeleton", () => (props) => (
    <div data-testid="skeleton">{props.children}</div>
));

// Mock calculateWaitingTime
jest.mock("../Components/OrdersDisplay/SingleOrderDisplay", () => ({
    calculateWaitingTime: (orderDate) => {
        // Return a fixed waiting time for testing
        if (orderDate.includes("onTime")) return { hours: 0, minutes: 30 };
        if (orderDate.includes("late")) return { hours: 1, minutes: 10 };
        if (orderDate.includes("veryLate")) return { hours: 2, minutes: 0 };
        return { hours: 0, minutes: 0 };
    },
}));

describe("StatisticsView", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders skeletons when no data is loaded", () => {
        render(<StatisticsView ordersForStatistics={[]} />);
        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
    });

    it("renders BarChart when graphData is set", () => {
        // Patch React.useState to simulate graphData being set
        const useStateSpy = jest.spyOn(React, "useState");
        useStateSpy
            .mockImplementationOnce(() => [null, jest.fn()]) // apiData
            .mockImplementationOnce(() => [
                {
                    xAxis: [{ data: ["10:00", "10:15"] }],
                    series: [{ data: [1, 2] }],
                },
                jest.fn(),
            ]) // graphData
            .mockImplementation((init) => [init, jest.fn()]); // counts

        render(<StatisticsView ordersForStatistics={[]} />);
        expect(screen.getByTestId("barchart")).toBeInTheDocument();
        useStateSpy.mockRestore();
    });

    it("renders average waiting times and client count when apiData is set", () => {
        const fakeApiData = {
            averagePrepTime1h: { time: { hours: 0, minutes: 15, seconds: 30 } },
            averagePrepTime15m: { time: { hours: 0, minutes: 5, seconds: 10 } },
            last15mOrders: 3,
            clientsCount: 7,
        };
        // Patch React.useState to simulate apiData being set
        const useStateSpy = jest.spyOn(React, "useState");
        useStateSpy
            .mockImplementationOnce(() => [fakeApiData, jest.fn()]) // apiData
            .mockImplementationOnce(() => [null, jest.fn()]) // graphData
            .mockImplementation((init) => [init, jest.fn()]); // counts

        render(<StatisticsView ordersForStatistics={[]} />);
        expect(screen.getByText(/Temps de préparation moyen \(1h\): 00:15:30/)).toBeInTheDocument();
        expect(screen.getByText(/Temps de préparation \(1\/4h\) : 00:05:10/)).toBeInTheDocument();
        expect(screen.getByText(/Commandes au 1\/4 d'h : 3/)).toBeInTheDocument();
        expect(screen.getByText(/Clients en salle : 7/)).toBeInTheDocument();
        useStateSpy.mockRestore();
    });
});