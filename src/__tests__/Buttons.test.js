import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import ButtonSet from '../Components/Buttons/Buttons'; // Importing ButtonSet

describe('ButtonSet Component', () => {
    // Mock the setConfig function
    const setConfigMock = jest.fn();

    test('renders all buttons with correct text', () => {
        const buttons = ['servie', 'precedent', 'suivant', 'rappel', 'statistique', 'reglage', 'activer'];

        render(<ButtonSet buttons={buttons} setConfig={setConfigMock} />);

        // Check that each button's text is present
        expect(screen.getByText("SERVIE")).toBeInTheDocument();
        expect(screen.getByText("PRECEDENT")).toBeInTheDocument();
        expect(screen.getByText("SUIVANT")).toBeInTheDocument();
        expect(screen.getByText("RAPPEL")).toBeInTheDocument();
        expect(screen.getByText("STATISTIQUES")).toBeInTheDocument();
        expect(screen.getByText("RÉGLAGES")).toBeInTheDocument();
        expect(screen.getByText("ACTIVER")).toBeInTheDocument();
    });

    test('ButtonPower toggles configuration on click', () => {
        const buttons = ['activer'];
        render(<ButtonSet buttons={buttons} setConfig={setConfigMock} />);

        const buttonElement = screen.getByText("ACTIVER");

        // Fire a click event on the power button
        fireEvent.click(buttonElement);

        // Verify that setConfigMock was called
        expect(setConfigMock).toHaveBeenCalledTimes(1);

        // Verify that the function passed to setConfig was called with the previous configuration
        const previousConfig = { enable: true };
        const toggleFunction = setConfigMock.mock.calls[0][0];
        const newConfig = toggleFunction(previousConfig);

        // Ensure that the config is toggled correctly
        expect(newConfig.enable).toBe(false);
    });

});
