import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Components/Footer/Footer';

// Mock the setConfig function
const mockSetConfig = jest.fn();
const updateActiveTabMock = jest.fn();

describe('Footer Component', () => {
    test('renders buttons based on buttons prop', () => {
        let buttons = ['servie', 'precedent', 'suivant'];

        const { rerender } = render(
            <Footer buttons={buttons} setConfig={mockSetConfig} activeTab="" updateActiveTab={updateActiveTabMock} navigationPrev={() => {}} navigationAfter={() => {}}/>
        );

        // Verify buttons that are present
        expect(screen.queryByText('SERVIE')).toBeInTheDocument();
        expect(screen.queryByText('PRÉCÉDENT')).toBeInTheDocument();
        expect(screen.queryByText('SUIVANT')).toBeInTheDocument();
        expect(screen.queryByText('STATISTIQUES')).not.toBeInTheDocument();

        // Add a new button
        buttons.push('statistique');
        rerender(
            <Footer buttons={buttons} setConfig={mockSetConfig} activeTab="" updateActiveTab={updateActiveTabMock} navigationPrev={() => {}} navigationAfter={() => {}} />
        );

        // Check that the new button is rendered
        expect(screen.queryByText('STATISTIQUES')).toBeInTheDocument();
    });

    test('renders unknown button', () => {
        const buttons = ['unknownButton'];

        render(<Footer buttons={buttons} setConfig={mockSetConfig} activeTab="" updateActiveTab={updateActiveTabMock} navigationPrev={() => {}} navigationAfter={() => {}}/>);
        expect(screen.queryByText('SERVIE')).not.toBeInTheDocument();
        expect(screen.queryByText('PRÉCÉDENT')).not.toBeInTheDocument();
        expect(screen.queryByText('SUIVANT')).not.toBeInTheDocument();
        expect(screen.queryByText('STATISTIQUES')).not.toBeInTheDocument();
        expect(screen.queryByText('RÉGLAGES')).not.toBeInTheDocument();
    });

    test('renders connection status as connected', () => {
        render(
            <Footer buttons={['servie', 'precedent', 'suivant']} setConfig={mockSetConfig} activeTab="" updateActiveTab={updateActiveTabMock} navigationPrev={() => {}} navigationAfter={() => {}}/>
        );

        // Check if the connected icon and text appear
        expect(screen.queryByText('R1161')).toBeInTheDocument();
        expect(screen.queryByText('N03')).toBeInTheDocument();
    });

    test('renders connection status as disconnected', () => {
        // Temporarily set the connection status to false
        render(
            <Footer buttons={['servie', 'precedent', 'suivant']} setConfig={mockSetConfig} activeTab="" updateActiveTab={updateActiveTabMock} navigationPrev={() => {}} navigationAfter={() => {}}/>
        );

        // Check if the disconnected icon and text appear
        expect(screen.queryByText('R1161')).toBeInTheDocument();
        expect(screen.queryByText('N03')).toBeInTheDocument();
    });
});
