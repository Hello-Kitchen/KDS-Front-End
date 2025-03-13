import React from 'react';
import { useNavigate, } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsView from '../ModalViews/SettingsView';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

describe('SettingsView', () => {
    const mockHandleOrderAnnoncement = jest.fn();
    const mockHandleOrderReading = jest.fn();
    const mockHandleOrderSelect = jest.fn();
    const mockHandleTouchscreenMode = jest.fn();
    const mockSetConfig = jest.fn();

    const defaultProps = {
        orderAnnoncement: true,
        handleOrderAnnoncement: mockHandleOrderAnnoncement,
        orderReading: true,
        handleOrderReading: mockHandleOrderReading,
        orderSelect: true,
        handleOrderSelect: mockHandleOrderSelect,
        touchscreenMode: true,
        handleTouchscreenMode: mockHandleTouchscreenMode,
        setConfig: mockSetConfig,
        screenOn: true
    };

    const mockNavigate = jest.fn();        

    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        render(<SettingsView {...defaultProps} />);
        jest.spyOn(Storage.prototype, 'removeItem');
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test to avoid leakage
    });

    test('renders SettingsView component', () => {
        expect(screen.getByText("Eteindre l'écran")).toBeInTheDocument();
        expect(screen.getByText("Tonalité d'annonce")).toBeInTheDocument();
        expect(screen.getByText("Lecture des commandes à l'arrivée")).toBeInTheDocument();
        expect(screen.getByText("Lecture de la commande sélectionnée")).toBeInTheDocument();
        expect(screen.getByText("Mode de fonctionnement")).toBeInTheDocument();
        expect(screen.getByText("Gestion du compte")).toBeInTheDocument();
    });

    test('renders SettingsSwitch components', () => {
        expect(screen.getAllByText('Oui')).toHaveLength(3);
        expect(screen.getByText('Tactile')).toBeInTheDocument();
    });

    test('calls handleOrderAnnoncement when order announcement switch is toggled', () => {
        const orderAnnoncementSwitch = screen.getAllByText('Oui')[0];
        fireEvent.click(orderAnnoncementSwitch);
        expect(mockHandleOrderAnnoncement).toHaveBeenCalled();
    });

    test('calls handleOrderReading when order reading switch is toggled', () => {
        const orderReadingSwitch = screen.getAllByText('Oui')[1];
        fireEvent.click(orderReadingSwitch);
        expect(mockHandleOrderReading).toHaveBeenCalled();
    });

    test('calls handleTouchscreenMode when touchscreen mode switch is toggled', () => {
        const touchscreenModeSwitch = screen.getByText('Clavier');
        fireEvent.click(touchscreenModeSwitch);
        expect(mockHandleTouchscreenMode).toHaveBeenCalled();
    });

    test('disconnects and returns to login if logout button is clicked', () => {
        const accountGestion = screen.getByText('Gestion du compte');
        fireEvent.click(accountGestion);
        const logout = screen.getByText('Se déconnecter');
        fireEvent.click(logout);
        
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});