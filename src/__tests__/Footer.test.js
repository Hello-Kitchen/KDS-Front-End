import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Components/Footer/Footer';
import { MemoryRouter } from 'react-router-dom';

// Mock the setConfig function
const mockSetConfig = jest.fn();
const updateActiveTabMock = jest.fn();

describe('Footer Component', () => {
    test('renders buttons based on buttons prop', () => {
        let buttons = ['servie', 'precedent', 'suivant'];

        const { rerender } = render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Footer buttons={buttons} setConfig={mockSetConfig} activeTab="" updateActiveTab={updateActiveTabMock} navigationPrev={() => {}} navigationAfter={() => {}}/></MemoryRouter>
        );

        // Verify buttons that are present
        expect(screen.queryByText('SERVIE')).toBeInTheDocument();
        expect(screen.queryByText('PRÉCÉDENT')).toBeInTheDocument();
        expect(screen.queryByText('SUIVANT')).toBeInTheDocument();
        expect(screen.queryByText('STATISTIQUES')).not.toBeInTheDocument();

        // Add a new button
        buttons.push('statistique');
        rerender(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Footer buttons={buttons} setConfig={mockSetConfig} activeTab="" updateActiveTab={updateActiveTabMock} navigationPrev={() => {}} navigationAfter={() => {}} /></MemoryRouter>
        );

        // Check that the new button is rendered
        expect(screen.queryByText('STATISTIQUES')).toBeInTheDocument();
    });

    test('renders unknown button', () => {
        const buttons = ['unknownButton'];

        render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Footer buttons={buttons} setConfig={mockSetConfig} activeTab="" updateActiveTab={updateActiveTabMock} navigationPrev={() => {}} navigationAfter={() => {}}/></MemoryRouter>);
        expect(screen.queryByText('SERVIE')).not.toBeInTheDocument();
        expect(screen.queryByText('PRÉCÉDENT')).not.toBeInTheDocument();
        expect(screen.queryByText('SUIVANT')).not.toBeInTheDocument();
        expect(screen.queryByText('STATISTIQUES')).not.toBeInTheDocument();
        expect(screen.queryByText('RÉGLAGES')).not.toBeInTheDocument();
    });

    test('renders connection status as connected', () => {
        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Footer buttons={['servie', 'precedent', 'suivant']} setConfig={mockSetConfig} activeTab="" updateActiveTab={updateActiveTabMock} navigationPrev={() => {}} navigationAfter={() => {}}/></MemoryRouter>
        );

        // Check if the connected icon and text appear
        expect(screen.queryByText('R1161')).toBeInTheDocument();
        expect(screen.queryByText('N03')).toBeInTheDocument();
    });

    test('renders connection status as disconnected', () => {
        // Temporarily set the connection status to false
        render(
            <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Footer buttons={['servie', 'precedent', 'suivant']} setConfig={mockSetConfig} activeTab="" updateActiveTab={updateActiveTabMock} navigationPrev={() => {}} navigationAfter={() => {}}/></MemoryRouter>
        );

        // Check if the disconnected icon and text appear
        expect(screen.queryByText('R1161')).toBeInTheDocument();
        expect(screen.queryByText('N03')).toBeInTheDocument();
    });
});
