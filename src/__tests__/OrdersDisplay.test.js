/* eslint-disable react/display-name */
import React from "react";
import { render, screen } from "@testing-library/react";
import OrdersDisplay from "../Components/OrdersDisplay/OrdersDisplay";

jest.mock("../Components/OrdersDisplay/SingleOrderDisplay", () => () => <div data-testid="single-order-display" />);
jest.mock("../Components/OrdersDisplay/OrderCarousel", () => () => <div data-testid="order-carousel" />);
jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

describe("OrdersDisplay", () => {
  let setNbrOrderMock, setOrdersForStatisticsMock, onSelectOrderIdMock;

  beforeEach(() => {
    setNbrOrderMock = jest.fn();
    setOrdersForStatisticsMock = jest.fn();
    onSelectOrderIdMock = jest.fn();
    jest.clearAllMocks();
  });

  it("renders two grid rows for orders", () => {
    render(
      <OrdersDisplay
        selectOrder={0}
        setNbrOrder={setNbrOrderMock}
        activeRecall={false}
        onSelectOrderId={onSelectOrderIdMock}
        orderSelect={false}
        orderReading={false}
        isServing={-1}
        setOrdersForStatistics={setOrdersForStatisticsMock}
      />
    );
    // Check for two grid rows by class name instead of role
    expect(document.querySelectorAll('.grid.grid-cols-5').length).toBeGreaterThanOrEqual(2);
  });


  it("renders OrderCarousel when activeRecall is true", () => {
    render(
      <OrdersDisplay
        selectOrder={0}
        setNbrOrder={setNbrOrderMock}
        activeRecall={true}
        onSelectOrderId={onSelectOrderIdMock}
        orderSelect={false}
        orderReading={false}
        isServing={-1}
        setOrdersForStatistics={setOrdersForStatisticsMock}
      />
    );
    expect(screen.getByTestId("order-carousel")).toBeInTheDocument();
  });

  it("calls onSelectOrderId with undefined if no orders", () => {
    render(
      <OrdersDisplay
        selectOrder={0}
        setNbrOrder={setNbrOrderMock}
        activeRecall={false}
        onSelectOrderId={onSelectOrderIdMock}
        orderSelect={false}
        orderReading={false}
        isServing={-1}
        setOrdersForStatistics={setOrdersForStatisticsMock}
      />
    );
    expect(onSelectOrderIdMock).toHaveBeenCalledWith(undefined);
  });
});