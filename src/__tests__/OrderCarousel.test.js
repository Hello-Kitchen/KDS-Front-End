// src/__tests__/OrderCarousel.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import OrderCarousel from '../Components/OrdersDisplay/OrderCarousel';

jest.mock("react-router-dom", () => ({
    useNavigate: () => jest.fn(),
}));

beforeEach(() => {
    // Mock de fetch pour qu'il ne fasse rien
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([]), // Renvoie une réponse vide par défaut
        })
    );
});

describe('OrderCarousel Component', () => {
    // const mockOrders = [
    //     { "food_ordered": [{ food: 1, is_ready: true, mods_ingredients: [], details: ["A point"], part: 1, id: 178 }], channel: "Sur place", number: "10", part: 1, date: "2025-01-24T18:46:53.015Z", served: false, id: 139 },
    //     { "food_ordered": [{ food: 1, is_ready: true, mods_ingredients: [], details: ["A point"], part: 1, id: 178 }], channel: "Sur place", number: "10", part: 1, date: "2025-01-24T18:46:53.015Z", served: false, id: 139 },
    //     { "food_ordered": [{ food: 1, is_ready: true, mods_ingredients: [], details: ["A point"], part: 1, id: 178 }], channel: "Sur place", number: "10", part: 1, date: "2025-01-24T18:46:53.015Z", served: false, id: 139 },
    // ];

    // test('renders the carousel with orders', async () => {
    //     // Simule la réponse de fetch pour le premier appel (récupération des commandes)
    //     fetch.mockImplementationOnce(() =>
    //         Promise.resolve({
    //             json: () => Promise.resolve(mockOrders),
    //         })
    //     );

    //     // Simule la réponse de fetch pour chaque commande (deuxième fetch)
    //     fetch.mockImplementationOnce(() =>
    //         Promise.resolve({
    //             json: () => Promise.resolve({ food_ordered: [{ food: 1, details: ["Frite", "Saignant"], mods_ingredients: [{ type: "DEL", ingredient: "Salade" }, { type: "DEL", ingredient: "Tomate" }, { type: "ADD", ingredient: "Oignon" }] }] }), // Réponse fictive pour la première commande
    //         })
    //     );

    //     fetch.mockImplementationOnce(() =>
    //         Promise.resolve({
    //             json: () => Promise.resolve({ food_ordered: [{ food: 1, details: ["Frite", "Saignant"], mods_ingredients: [{ type: "DEL", ingredient: "Salade" }, { type: "DEL", ingredient: "Tomate" }, { type: "ADD", ingredient: "Oignon" }] }] }), // Réponse fictive pour la première commande
    //         })
    //     );

    //     fetch.mockImplementationOnce(() =>
    //         Promise.resolve({
    //             json: () => Promise.resolve({ food_ordered: [{ food: 1, details: ["Frite", "Saignant"], mods_ingredients: [{ type: "DEL", ingredient: "Salade" }, { type: "DEL", ingredient: "Tomate" }, { type: "ADD", ingredient: "Oignon" }] }] }), // Réponse fictive pour la première commande
    //         })
    //     );

    //     render(<OrderCarousel label="cuisine" />);

    //     // Attendre que les commandes soient chargées
    //     await screen.findByText('Order 1');

    //     // Vérifie que chaque commande est affichée
    //     mockOrders.forEach(order => {
    //         expect(screen.getByText(order.name)).toBeInTheDocument();
    //     });
    // });

    test('displays loading state initially', () => {
        render(<OrderCarousel label="cuisine" />);

        // Vérifie que le composant de chargement est affiché
        expect(screen.getByText(/Chargement des commandes.../i)).toBeInTheDocument();
    });

    test('displays a message when there are no orders', async () => {
        // Simule la réponse de fetch vide pour le premier appel
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve([]), // Réponse vide pour les commandes
            })
        );

        render(<OrderCarousel label="cuisine" />);

        // Attendre que le message soit affiché
        await screen.findByText(/Aucune commande a rappelle/i);
    });
});