import React from "react";
import { render, screen, fireEvent, jest, test, expect, describe } from '@testing-library/react';
import buttonComponents from '../Components/Buttons/Buttons';

const {
    servie: ButtonServie,
    precedent: ButtonPrecedent,
    suivant: ButtonSuivant,
    rappel: ButtonRappel,
    statistique: ButtonStatistiques,
    reglage: ButtonReglages,
    activer: ButtonPower
} = buttonComponents;

describe('Button Components', () => {

    test('renders ButtonServie with correct text', () => {
        render(<ButtonServie />);
        expect(screen.getByText("SERVIE")).toBeInTheDocument();
    });

    test('renders ButtonPrecedent with correct text', () => {
        render(<ButtonPrecedent />);
        expect(screen.getByText("PRECEDENT")).toBeInTheDocument();
    });

    test('renders ButtonSuivant with correct text', () => {
        render(<ButtonSuivant />);
        expect(screen.getByText("SUIVANT")).toBeInTheDocument();
    });

    test('renders ButtonRappel with correct text', () => {
        render(<ButtonRappel />);
        expect(screen.getByText("RAPPEL")).toBeInTheDocument();
    });

    test('renders ButtonStatistiques with correct text', () => {
        render(<ButtonStatistiques />);
        expect(screen.getByText("STATISTIQUES")).toBeInTheDocument();
    });

    test('renders ButtonReglages with correct text', () => {
        render(<ButtonReglages />);
        expect(screen.getByText("RÉGLAGES")).toBeInTheDocument();
    });

    test('ButtonPower toggles configuration on click', () => {
        const setConfigMock = jest.fn();

        render(<ButtonPower setConfig={setConfigMock} />);

        const buttonElement = screen.getByText("ACTIVER");

        fireEvent.click(buttonElement);

        expect(setConfigMock).toHaveBeenCalledTimes(1);
        expect(setConfigMock).toHaveBeenCalledWith(expect.any(Function));

        const previousConfig = { enable: true };
        const toggleFunction = setConfigMock.mock.calls[0][0];
        const newConfig = toggleFunction(previousConfig);

        expect(newConfig.enable).toBe(false);
    });

});
