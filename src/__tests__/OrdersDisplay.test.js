import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import OrdersDisplay from '../Components/OrdersDisplay/OrdersDisplay';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../Components/OrdersDisplay/SingleOrderDisplay', () => ({ orderDetails }) => (
  <div data-testid={`order-${orderDetails.number}`}>
    {orderDetails.number}
  </div>
));

describe('OrdersDisplay', () => {
  beforeEach(() => {
    // Mock the fetch API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              channel: "En salle",
              number: "Table 60",
              food_ordered: [
                { food: 3, details: [], mods_ingredients: [], part: 1, is_ready: false, id: 176 },
              ],
              part: 1,
              date: new Date(Date.now()).toISOString(),
              id: 108,
            },
            {
              channel: "En salle",
              number: "Table 42",
              food_ordered: [
                { food: 8, details: [], mods_ingredients: [], part: 1, is_ready: false, id: 181 },
              ],
              part: 1,
              date: new Date(Date.now()).toISOString(),
              id: 135,
            },
          ]),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  test('fetches and displays orders correctly', async () => {
    render(<MemoryRouter><OrdersDisplay /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByTestId('order-Table 60')).toBeInTheDocument();
      expect(screen.getByTestId('order-Table 42')).toBeInTheDocument();
    });

    expect(screen.getByTestId('order-Table 60')).toHaveTextContent('Table 60');
    expect(screen.getByTestId('order-Table 42')).toHaveTextContent('Table 42');
    expect(screen.queryByText(/commandes en attente/)).not.toBeInTheDocument();
  });

  test('handles fetch errors gracefully', async () => {
    global.fetch.mockImplementationOnce(() => Promise.reject('API error'));

    render(<MemoryRouter><OrdersDisplay /></MemoryRouter>);

    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error fetching orders:', 'API error'));

    expect(screen.queryByTestId(/^order/)).not.toBeInTheDocument();
  });

  test('shows waiting orders when there are more than 10 orders', async () => {
    // Update to mock more than 10 orders
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve(Array.from({ length: 12 }, (_, index) => ({
            channel: "En salle",
            number: `Table ${index + 1}`,
            food_ordered: [
              { food: index + 1, details: [], mods_ingredients: [], part: 1, is_ready: false, id: index + 176 },
            ],
            part: 1,
            date: "2024-07-05T13:31:11.064Z",
            id: index + 100,
          }))),
      })
    );

    render(<MemoryRouter><OrdersDisplay /></MemoryRouter>);

    // Wait for the orders to be fetched
    await waitFor(() => screen.getAllByTestId(/^order/));

    // Check that the waiting orders notification appears
    expect(screen.getByText(/commandes en attente/)).toBeInTheDocument();
  });

  test('updates the number of waiting orders correctly', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve(Array.from({ length: 12 }, (_, index) => ({
            channel: "En salle",
            number: `Table ${index + 1}`,
            food_ordered: [
              { food: index + 1, details: [], mods_ingredients: [], part: 1, is_ready: false, id: index + 176 },
            ],
            part: 1,
            date: "2024-07-05T13:31:11.064Z",
            id: index + 100,
          }))),
      })
    );

    render(<MemoryRouter><OrdersDisplay /></MemoryRouter>);

    // Wait for the fetch to complete
    await waitFor(() => expect(screen.getAllByTestId(/^order/).length).toBeGreaterThan(0));

    // Check for the waiting orders message
    expect(screen.getByText(/2 commandes en attente/)).toBeInTheDocument(); // Because OrdersDisplay displays 10 Orders
    expect(screen.queryByText(/3 commandes en attente/)).not.toBeInTheDocument();
  });
});
