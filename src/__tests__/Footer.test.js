import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Components/Footer/Footer';
describe('Footer Component', () => {
    test('renders buttons based on buttons prop', () => {
        let buttons = ['servie', 'precedent', 'suivant'];
        const mockSetConfig = jest.fn();

        const { rerender } = render(<Footer buttons={buttons} setConfig={mockSetConfig} navigationPrev={() => {}} navigationAfter={() => {}}/>);

        expect(screen.getByText('SERVIE')).toBeInTheDocument();
        expect(screen.getByText('PRECEDENT')).toBeInTheDocument();
        expect(screen.getByText('SUIVANT')).toBeInTheDocument();
        expect(screen.queryByText('STATISTIQUES')).not.toBeInTheDocument();

        buttons.push('statistique');
        rerender(<Footer buttons={buttons} setConfig={mockSetConfig} navigationPrev={() => {}} navigationAfter={() => {}}/>);

        expect(screen.getByText('SERVIE')).toBeInTheDocument();
        expect(screen.getByText('PRECEDENT')).toBeInTheDocument();
        expect(screen.getByText('SUIVANT')).toBeInTheDocument();
        expect(screen.getByText('STATISTIQUES')).toBeInTheDocument();
    });

    test('renders unknown button', () => {
        const buttons = ['unknownButton'];
        const mockSetConfig = jest.fn();

        render(<Footer buttons={buttons} setConfig={mockSetConfig} navigationPrev={() => {}} navigationAfter={() => {}}/>);
        expect(screen.queryByText('SERVIE')).not.toBeInTheDocument();
        expect(screen.queryByText('PRECEDENT')).not.toBeInTheDocument();
        expect(screen.queryByText('SUIVANT')).not.toBeInTheDocument();
        expect(screen.queryByText('STATISTIQUES')).not.toBeInTheDocument();
        expect(screen.queryByText('RÉGLAGES')).not.toBeInTheDocument();
    });
});