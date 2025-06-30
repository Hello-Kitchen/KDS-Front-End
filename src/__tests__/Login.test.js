import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate, useLocation } from 'react-router-dom';
import Login from '../Pages/Login/Login';

// Mocking useNavigate and useLocation from react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn()
}));

describe('Login Page', () => {
    const mockNavigate = jest.fn();
    const mockLocation = { state: { error: 'Sample error message' } };

    beforeEach(() => {
      // Reset mocks before each test
      useNavigate.mockReturnValue(mockNavigate);
      useLocation.mockReturnValue(mockLocation);
      jest.spyOn(Storage.prototype, 'setItem'); // Mock localStorage.setItem
    });

    afterEach(() => {
      jest.clearAllMocks(); // Clear all mocks after each test to avoid leakage
    });

    test('renders the login form and displays an error message from location', () => {
        render(<Login />);

        // Check if the error from location.state is displayed
        expect(screen.getByText(/Sample error message/i)).toBeInTheDocument();

        // Check if the form is rendered correctly
        expect(screen.getByLabelText(/Numéro de restaurant/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Nom d'utilisateur/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Se connecter/i })).toBeInTheDocument();
      });

      test('handles form submission and successful login', async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            status: 200,
            json: () => Promise.resolve({ access_token: 'sampleToken' }),
          })
        );

        render(<Login />);

        // Fill in the form
        fireEvent.change(screen.getByLabelText(/Numéro de restaurant/i), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/Nom d'utilisateur/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'password123' } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));

        // Wait for the fetch to resolve and navigation to occur
        await waitFor(() => {
          expect(localStorage.setItem).toHaveBeenCalledWith('token', 'sampleToken');
          expect(mockNavigate).toHaveBeenCalledWith('/cuisine');
        });
      });

      test('displays an error message on incorrect login', async () => {
        global.fetch = jest.fn(() =>
          Promise.resolve({
            status: 400,
            json: () => Promise.resolve({}),
          })
        );

        render(<Login />);

        // Fill in the form
        fireEvent.change(screen.getByLabelText(/Nom d'utilisateur/i), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: 'wrongpassword' } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Se connecter/i }));

        // Wait for the fetch to resolve and error message to appear
        await waitFor(() => {
          expect(screen.getByText(/Username or password is incorrect/i)).toBeInTheDocument();
        });
    });
});