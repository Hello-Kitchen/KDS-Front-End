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
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              channel: 'En salle',
              number: 'Table 60',
              food_ordered: [
                { food: 3, details: [], mods_ingredients: [], part: 1, is_ready: false, id: 176 },
              ],
              part: 1,
              date: '2024-07-05T13:31:11.064Z',
              id: 108,
            },
            {
              channel: 'En salle',
              number: 'Table 42',
              food_ordered: [
                { food: 8, details: [], mods_ingredients: [], part: 1, is_ready: true, id: 181 },
              ],
              part: 1,
              date: '2024-07-05T13:31:11.064Z',
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

  test('fetches and displays orders correctly for status "ready"', async () => {
    render(<MemoryRouter><OrdersDisplayPasse status="ready" /></MemoryRouter>);

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
    global.fetch.mockImplementationOnce(() => Promise.reject('API error'));

    render(<MemoryRouter><OrdersDisplayPasse status='ready'/></MemoryRouter>);

    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error fetching orders:', 'API error'));

    expect(screen.queryByTestId(/^order/)).not.toBeInTheDocument();
  });

  test('shows waiting orders when there are more than 10 orders for status "ready"', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve(Array(12).fill({
            channel: "En salle",
            number: "Table 60",
            food_ordered: [
              { food: 3, details: [], mods_ingredients: [], part: 1, is_ready: true, id: 176 },
            ],
            part: 1,
            date: "2024-07-05T13:31:11.064Z",
            id: 108,
          })),
      })
    );

    render(<MemoryRouter><OrdersDisplayPasse status='ready'/></MemoryRouter>);

    // Wait for the orders to be fetched
    await waitFor(() => screen.getAllByTestId(/^order/));

    // Check that the waiting orders notification appears
    expect(screen.getByText(/commandes en attente/)).toBeInTheDocument();
  });

  test('updates the number of waiting orders correctly for status "ready"', async () => {
    global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve(Array(12).fill({
              channel: "En salle",
              number: "Table 60",
              food_ordered: [
                { food: 3, details: [], mods_ingredients: [], part: 1, is_ready: true, id: 176 },
              ],
              part: 1,
              date: "2024-07-05T13:31:11.064Z",
              id: 108,
            })),
        })
      );

    render(<MemoryRouter><OrdersDisplayPasse status='ready'/></MemoryRouter>);

    // Wait for the fetch to complete
    await waitFor(() => expect(screen.getAllByTestId(/^order/).length).toBeGreaterThan(0));

    // Check for the waiting orders message
    expect(screen.getByText('7 commandes en attente >>')).toBeInTheDocument(); // Because OrdersDisplayPasse displays 5 Orders
    expect(screen.queryByText('8 commandes en attente >>')).not.toBeInTheDocument();
  });

  test('shows waiting orders when there are more than 10 orders for status "pending"', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve(Array(12).fill({
            channel: "En salle",
            number: "Table 60",
            food_ordered: [
              { food: 3, details: [], mods_ingredients: [], part: 1, is_ready: true, id: 176 },
              { food: 3, details: [], mods_ingredients: [], part: 1, is_ready: false, id: 176 }
            ],
            part: 1,
            date: "2024-07-05T13:31:11.064Z",
            id: 108,
          })),
      })
    );

    render(<MemoryRouter><OrdersDisplayPasse status='pending'/></MemoryRouter>);

    // Wait for the orders to be fetched
    await waitFor(() => screen.getAllByTestId(/^order/));

    // Check that the waiting orders notification appears
    expect(screen.getByText(/commandes en attente/)).toBeInTheDocument();
  });

  test('updates the number of waiting orders correctly for status "pending"', async () => {
    global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve(Array(12).fill({
              channel: "En salle",
              number: "Table 60",
              food_ordered: [
                { food: 3, details: [], mods_ingredients: [], part: 1, is_ready: true, id: 176 },
                { food: 3, details: [], mods_ingredients: [], part: 1, is_ready: false, id: 176 }
              ],
              part: 1,
              date: "2024-07-05T13:31:11.064Z",
              id: 108,
            })),
        })
      );

    render(<MemoryRouter><OrdersDisplayPasse status='pending'/></MemoryRouter>);

    // Wait for the fetch to complete
    await waitFor(() => expect(screen.getAllByTestId(/^order/).length).toBeGreaterThan(0));

    // Check for the waiting orders message
    expect(screen.getByText('7 commandes en attente >>')).toBeInTheDocument(); // Because OrdersDisplayPasse displays 5 Orders
    expect(screen.queryByText('8 commandes en attente >>')).not.toBeInTheDocument();
  });

});
