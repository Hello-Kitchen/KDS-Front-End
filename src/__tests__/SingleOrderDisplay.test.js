import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import SingleOrderDisplay from '../Components/OrdersDisplay/SingleOrderDisplay';
import { MemoryRouter } from 'react-router-dom';

// Mock the BeatLoader to avoid rendering the actual spinner
jest.mock('react-spinners', () => ({
  BeatLoader: jest.fn(() => <div>Loading...</div>),
}));

describe('SingleOrderDisplay Component', () => {
    const now = new Date(Date.now())
  const mockOrderDetails = {
    "channel": "En salle",
      "number": "Table 60",
      "food_ordered": [
        {
          "food": 9,
          "name": "Glace des gourmands",
          "quantity": 1,
          "details": [
            "Vanille",
            "Fraise"
          ],
          "mods_ingredients": [],
          "part": 1,
          "is_ready": true,
          "id": 178
        },
        {
          "food": 10,
          "name": "Burger du chef",
          "quantity": 1,
          "details": [
            "Saignant",
            "Frite",
            "Salade",
            "Sauce du Chef",
            "Brioché"
          ],
          "mods_ingredients": [
            {
              "type": "DEL",
              "ingredient": "Oeuf"
            }
          ],
          "part": 2,
          "is_ready": false,
          "id": 179
        }
      ],
      "part": 1,
      "date": new Date(now.getTime() + 3600000).toISOString(),
      "orderDate": {
        "hours":now.getHours(),"minutes":now.getMinutes(),"seconds":now.getSeconds(),
      },
      "id": 108
    }

    beforeAll(() => {
        // Mock the fetch function
        global.fetch = jest.fn(() =>
          Promise.resolve({
            json: jest.fn().mockResolvedValue(mockOrderDetails), // Mocking the response
          })
        );
      });

      afterAll(() => {
        // Restore the original fetch function after tests
        jest.restoreAllMocks();
      });

  test('renders order details correctly', async () => {
    render(<MemoryRouter><SingleOrderDisplay orderDetails={mockOrderDetails} span={2} /></MemoryRouter>);

    // Check that order details are displayed
    await waitFor(() => {
        expect(screen.getByText('Table 60')).toBeInTheDocument(),
        expect(screen.getByText('1x Burger du chef')).toBeInTheDocument(),
        expect(screen.getByText(/Saignant/)).toBeInTheDocument(),
        expect(screen.getByText(/Frite/)).toBeInTheDocument(),
        expect(screen.getByText(/Salade/)).toBeInTheDocument(),
        expect(screen.getByText(/Sauce du Chef/)).toBeInTheDocument(),
        expect(screen.getByText(/Brioché/)).toBeInTheDocument(),
        expect(screen.getByText(/Oeuf/)).toBeInTheDocument(),
        expect(screen.getByText('1x Glace des gourmands')).toBeInTheDocument(),
        expect(screen.getByText(/Vanille/)).toBeInTheDocument(),
        expect(screen.getByText(/Fraise/)).toBeInTheDocument()
    });
    })

  // test('renders waiting time and updates correctly', async () => {
  //   jest.useFakeTimers();
  //   render(<MemoryRouter><SingleOrderDisplay orderDetails={mockOrderDetails} span={2} /></MemoryRouter>);

  //   // Initial waiting time (since the order was created just now)
  //   await waitFor(() => {
  //       expect(screen.getByText(/00:00/)).toBeInTheDocument()
  //   });

  //   // Fast forward 5 seconds and check if the waiting time updates
  //   act(() => {
  //     jest.advanceTimersByTime(5000); // 5 seconds
  //   });
  //   expect(screen.getByText(/00:05/)).toBeInTheDocument();

  //   // Fast forward 5 seconds and check if the waiting time updates
  //   act(() => {
  //       jest.advanceTimersByTime(5000); // 5 seconds
  //   });
  //   expect(screen.getByText(/00:10/)).toBeInTheDocument();

  //   jest.useRealTimers();
  // });

  test('toggles food readiness when clicked', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );

    render(<MemoryRouter><SingleOrderDisplay orderDetails={mockOrderDetails} span={2} /></MemoryRouter>);

    // Ensure the food is initially not ready
    const foodItem = screen.getByText('1x Burger du chef');
    expect(foodItem).not.toHaveClass('text-slate-500');

    // Click the food item to toggle its readiness
    fireEvent.click(foodItem);

    // After clicking, the food should be marked as ready (with a specific class applied)
    expect(foodItem).toHaveClass('text-slate-500');
  });
});
