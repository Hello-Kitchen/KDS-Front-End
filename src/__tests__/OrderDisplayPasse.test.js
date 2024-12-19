/* eslint-disable react/display-name, react/prop-types */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import OrdersDisplayPasse from '../Components/OrdersDisplay/OrdersDisplayPasse';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../Components/OrdersDisplay/SingleOrderDisplay', () => ({ orderDetails }) => (
    <div data-testid={`order-${orderDetails.number}`}>
      {orderDetails.number}
    </div>
));

describe('OrdersDisplayPasse', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch.mockClear();
    console.error = jest.fn();
  });

  test('fetches and displays orders correctly for status "ready"', async () => {
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
              { id: 181, food: 8, details: [], mods_ingredients: [], part: 1, is_ready: true }
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
            { id: 181, food: 8, details: [], mods_ingredients: [], part: 1, is_ready: true }
          ]
        })
      }));
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><OrdersDisplayPasse status="ready" onSelectOrderId={() => {}} /></MemoryRouter>);

    // Wait for the fetch to complete and data to be rendered
    await waitFor(() => {
      expect(screen.getByTestId('order-Table 42')).toBeInTheDocument();
    });

    // Check that Table 42 is displayed correctly
    expect(screen.getByTestId('order-Table 42')).toHaveTextContent('Table 42');

    // Table 60 should not be displayed because it's filtered out
    expect(screen.queryByTestId('order-Table 60')).not.toBeInTheDocument();

    // Ensure no waiting orders message is shown
    expect(screen.queryByText(/commandes en attente/)).not.toBeInTheDocument();
  });

  test('handles fetch errors gracefully for status "ready"', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject('API error')
    );

    // Capture console.error
    console.error = jest.fn();
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><OrdersDisplayPasse status='ready' onSelectOrderId={() => {}}/></MemoryRouter>);

    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error fetching orders:', 'API error'));

    expect(screen.queryByTestId(/^order/)).not.toBeInTheDocument();
  });

  test('shows waiting orders when there are more than 10 orders for status "ready"', async () => {
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
                  is_ready: true,
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
                is_ready: true,
                id: orderIndex + 176,
              },
            ],
          }),
      });
    });

    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><OrdersDisplayPasse status='ready' onSelectOrderId={() => {}}/></MemoryRouter>);

    // Wait for the orders to be fetched
    await waitFor(() => screen.getAllByTestId(/^order/));

    // Check that the waiting orders notification appears
    expect(screen.getByText(/commandes en attente/)).toBeInTheDocument();
  });

  test('updates the number of waiting orders correctly for status "ready"', async () => {
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
                  is_ready: true,
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
                is_ready: true,
                id: orderIndex + 176,
              },
            ],
          }),
      });
    });

    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><OrdersDisplayPasse status='ready' onSelectOrderId={() => {}}/></MemoryRouter>);

    // Wait for the fetch to complete
    await waitFor(() => expect(screen.getAllByTestId(/^order/).length).toBeGreaterThan(0));

    // Check for the waiting orders message
    expect(screen.getByText('7 commandes en attente >>')).toBeInTheDocument(); // Because OrdersDisplayPasse displays 5 Orders
    expect(screen.queryByText('8 commandes en attente >>')).not.toBeInTheDocument();
  });

  test('shows waiting orders when there are more than 10 orders for status "pending"', async () => {
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
                  is_ready: true,
                  id: index + 176
                },
                {
                  food: index + 2,
                  details: [],
                  mods_ingredients: [],
                  part: 1,
                  is_ready: false,
                  id: index + 177
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
                is_ready: true,
                id: orderIndex + 176,
              },
              {
                food: orderIndex + 2,
                details: [],
                mods_ingredients: [],
                part: 1,
                is_ready: false,
                id: orderIndex + 177,
              }
            ],
          }),
      });
    });

    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><OrdersDisplayPasse status='pending' onSelectOrderId={() => {}}/></MemoryRouter>);

    // Wait for the orders to be fetched
    await waitFor(() => screen.getAllByTestId(/^order/));

    // Check that the waiting orders notification appears
    expect(screen.getByText(/commandes en attente/)).toBeInTheDocument();
  });

  test('updates the number of waiting orders correctly for status "pending"', async () => {
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
                  is_ready: true,
                  id: index + 176
                },
                {
                  food: index + 2,
                  details: [],
                  mods_ingredients: [],
                  part: 1,
                  is_ready: false,
                  id: index + 177
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
                is_ready: true,
                id: orderIndex + 176,
              },
              {
                food: orderIndex + 2,
                details: [],
                mods_ingredients: [],
                part: 1,
                is_ready: false,
                id: orderIndex + 177,
              }
            ],
          }),
      });
    });

    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><OrdersDisplayPasse status='pending' onSelectOrderId={() => {}}/></MemoryRouter>);

    // Wait for the fetch to complete
    await waitFor(() => expect(screen.getAllByTestId(/^order/).length).toBeGreaterThan(0));

    // Check for the waiting orders message
    expect(screen.getByText('7 commandes en attente >>')).toBeInTheDocument(); // Because OrdersDisplayPasse displays 5 Orders
    expect(screen.queryByText('8 commandes en attente >>')).not.toBeInTheDocument();
  });

});
