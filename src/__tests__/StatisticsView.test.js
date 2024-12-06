import React from 'react';
import { render, screen } from '@testing-library/react';
import StatisticsView from '../Components/ModalViews/StatisticsView';

describe('StatisticsView Component', () => {
    test('renders the component without crashing', () => {
        render(<StatisticsView />);
        expect(screen.getByText('GRAPH')).toBeInTheDocument();
    });

    test('renders the waiting time section', () => {
        render(<StatisticsView />);
        expect(screen.getByText("Temps d'attente")).toBeInTheDocument();
        expect(screen.getByText("Temps d'attente moyen par plat : --:--")).toBeInTheDocument();
        expect(screen.getByText("Temps d'attente moyen par commande : --:--")).toBeInTheDocument();
        expect(screen.getByText("Temps d'attente moyen 1/4 d'h par commmande : --:--")).toBeInTheDocument();
    });

    test('renders the number of orders section', () => {
        render(<StatisticsView />);
        expect(screen.getByText("Nombre de commandes")).toBeInTheDocument();
        expect(screen.getByText("Commandes en cours :")).toBeInTheDocument();
        expect(screen.getByText("- commandes en dans les temps")).toBeInTheDocument();
        expect(screen.getByText("- commandes en retard")).toBeInTheDocument();
        expect(screen.getByText("- commandes très en retard")).toBeInTheDocument();
        expect(screen.getByText("Total : - commandes")).toBeInTheDocument();
        expect(screen.getByText("Commandes au 1/4 d'h : -")).toBeInTheDocument();
    });

    test('renders the number of clients section', () => {
        render(<StatisticsView />);
        expect(screen.getByText("Nombre de clients")).toBeInTheDocument();
        expect(screen.getByText("Clients en salle : -")).toBeInTheDocument();
    });
});