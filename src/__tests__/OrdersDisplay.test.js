/* eslint-disable react/display-name, react/prop-types */

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
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch.mockClear();
    console.error.mockRestore();
  });

  test('fetches and displays orders correctly', async () => {
    global.fetch = jest.fn()
      // First fetch call: get the list of orders
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            id: 108,
            channel: "En salle",
            number: "Table 60",
            part: 1,
            date: new Date(Date.now()).toISOString(),
            food_ordered: [
              { id: 176, food: 3, details: [], mods_ingredients: [], part: 1, is_ready: false }
            ],
          },
          {
            id: 135,
            channel: "En salle",
            number: "Table 42",
            part: 1,
            date: new Date(Date.now()).toISOString(),
            food_ordered: [
              { id: 181, food: 8, details: [], mods_ingredients: [], part: 1, is_ready: false }
            ],
          }
        ])
      }))
      // Second fetch call: fetch food details for each order
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          food_ordered: [
            { id: 176, food: 3, details: [], mods_ingredients: [], part: 1, is_ready: false }
          ]
        })
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          food_ordered: [
            { id: 181, food: 8, details: [], mods_ingredients: [], part: 1, is_ready: false }
          ]
        })
      }));
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><OrdersDisplay setNbrOrder={(nbr) => {toString(nbr);}} onSelectOrderId={() => {}}/></MemoryRouter>);

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

    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><OrdersDisplay setNbrOrder={(nbr) => {toString(nbr);}} onSelectOrderId={() => {}}/></MemoryRouter>);

    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error fetching orders:', 'API error'));

    expect(screen.queryByTestId(/^order/)).not.toBeInTheDocument();
  });

  test('shows waiting orders when there are more than 10 orders', async () => {
    // Update to mock more than 10 orders
    global.fetch = jest.fn()
    // First fetch call: get the list of orders (12 orders with different food)
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve(
            Array.from({ length: 12 }, (_, index) => ({
              channel: "En salle",
              number: `Table ${index + 1}`,
              food_ordered: [
                {
                  food: index + 1,
                  details: [],
                  mods_ingredients: [],
                  part: 1,
                  is_ready: false,
                  id: index + 176
                }
              ],
              part: 1,
              date: new Date(Date.now()).toISOString(), // Current date
              id: index + 100,
            }))
          ),
      })
    )
    // Second fetch call: fetch food details for each of the 12 orders
    .mockImplementation((url) => {
      // Extract the order id from the URL
      const orderId = parseInt(url.match(/\/orders\/(\d+)/)[1], 10);
      const orderIndex = orderId - 100; // Adjust index to match the order ID

      // Return a different mock response for each order
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            food_ordered: [
              {
                food: orderIndex + 1,
                details: [],
                mods_ingredients: [],
                part: 1,
                is_ready: false,
                id: orderIndex + 176,
              },
            ],
          }),
      });
    });


    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><OrdersDisplay setNbrOrder={(nbr) => {toString(nbr);}} onSelectOrderId={() => {}}/></MemoryRouter>);

    // Wait for the orders to be fetched
    await waitFor(() => screen.getAllByTestId(/^order/));

    // Check that the waiting orders notification appears
    expect(screen.getByText(/commandes en attente/)).toBeInTheDocument();
  });

  test('updates the number of waiting orders correctly', async () => {
    global.fetch = jest.fn()
    // First fetch call: get the list of orders (12 orders with different food)
    .mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve(
            Array.from({ length: 12 }, (_, index) => ({
              channel: "En salle",
              number: `Table ${index + 1}`,
              food_ordered: [
                {
                  food: index + 1,
                  details: [],
                  mods_ingredients: [],
                  part: 1,
                  is_ready: false,
                  id: index + 176
                }
              ],
              part: 1,
              date: new Date(Date.now()).toISOString(), // Current date
              id: index + 100,
            }))
          ),
      })
    )
    // Second fetch call: fetch food details for each of the 12 orders
    .mockImplementation((url) => {
      // Extract the order id from the URL
      const orderId = parseInt(url.match(/\/orders\/(\d+)/)[1], 10);
      const orderIndex = orderId - 100; // Adjust index to match the order ID

      // Return a different mock response for each order
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            food_ordered: [
              {
                food: orderIndex + 1,
                details: [],
                mods_ingredients: [],
                part: 1,
                is_ready: false,
                id: orderIndex + 176,
              },
            ],
          }),
      });
    });


    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><OrdersDisplay setNbrOrder={(nbr) => {toString(nbr);}} onSelectOrderId={() => {}}/></MemoryRouter>);

    // Wait for the fetch to complete
    await waitFor(() => expect(screen.getAllByTestId(/^order/).length).toBeGreaterThan(0));

    // Check for the waiting orders message
    expect(screen.getByText(/2 commandes en attente/)).toBeInTheDocument(); // Because OrdersDisplay displays 10 Orders
    expect(screen.queryByText(/3 commandes en attente/)).not.toBeInTheDocument();
  });
});
