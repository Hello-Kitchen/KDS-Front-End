import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsSwitch from '../Components/Buttons/SettingsSwitch';

describe('SettingsSwitch Component', () => {
    test('renders with default labels and colors', () => {
        render(<SettingsSwitch value={true} onChange={() => {}} />);
        
        const optionOne = screen.getByText('Oui');
        const optionTwo = screen.getByText('Non');
        
        expect(optionOne).toBeInTheDocument();
        expect(optionTwo).toBeInTheDocument();
        expect(optionOne).toHaveClass('bg-kitchen-green text-white');
        expect(optionTwo).toHaveClass('bg-neutral-200 text-kitchen-red');
    });

    test('renders with custom labels and colors', () => {
        render(<SettingsSwitch optionOneLabel="Yes" optionTwoLabel="No" optionOneColor="blue" optionTwoColor="red" value={false} onChange={() => {}} />);
        
        const optionOne = screen.getByText('Yes');
        const optionTwo = screen.getByText('No');
        
        expect(optionOne).toBeInTheDocument();
        expect(optionTwo).toBeInTheDocument();
        expect(optionOne).toHaveClass('bg-neutral-200 text-blue');
        expect(optionTwo).toHaveClass('bg-red text-white');
    });

    test('calls onChange when clicked', () => {
        const handleChange = jest.fn();
        render(<SettingsSwitch value={true} onChange={handleChange} />);
        
        const switchComponent = screen.getByText('Oui');
        fireEvent.click(switchComponent);
        
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    test('applies correct styles based on value prop', () => {
        const { rerender } = render(<SettingsSwitch value={true} onChange={() => {}} />);
        
        let optionOne = screen.getByText('Oui');
        let optionTwo = screen.getByText('Non');
        
        expect(optionOne).toHaveClass('bg-kitchen-green text-white');
        expect(optionTwo).toHaveClass('bg-neutral-200 text-kitchen-red');
        
        rerender(<SettingsSwitch value={false} onChange={() => {}} />);
        
        optionOne = screen.getByText('Oui');
        optionTwo = screen.getByText('Non');
        
        expect(optionOne).toHaveClass('bg-neutral-200 text-kitchen-green');
        expect(optionTwo).toHaveClass('bg-kitchen-red text-white');
    });
});