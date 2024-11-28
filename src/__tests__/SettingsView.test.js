import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsView from '../ModalViews/SettingsView';

describe('SettingsView', () => {
    const mockHandleOrderAnnoncement = jest.fn();
    const mockHandleOrderReading = jest.fn();
    const mockHandleTouchscreenMode = jest.fn();
    const mockSetConfig = jest.fn();

    const defaultProps = {
        orderAnnoncement: true,
        handleOrderAnnoncement: mockHandleOrderAnnoncement,
        orderReading: true,
        handleOrderReading: mockHandleOrderReading,
        touchscreenMode: true,
        handleTouchscreenMode: mockHandleTouchscreenMode,
        setConfig: mockSetConfig,
        screenOn: true
    };

    beforeEach(() => {
        render(<SettingsView {...defaultProps} />);
    });

    test('renders SettingsView component', () => {
        expect(screen.getByText("Eteindre l'écran")).toBeInTheDocument();
        expect(screen.getByText("Tonalité d'annonce")).toBeInTheDocument();
        expect(screen.getByText("Lecture des commandes")).toBeInTheDocument();
        expect(screen.getByText("Mode de fonctionnement")).toBeInTheDocument();
        expect(screen.getByText("Gestion du compte")).toBeInTheDocument();
    });

    test('renders SettingsSwitch components', () => {
        expect(screen.getAllByText('Oui')).toHaveLength(2);
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
});