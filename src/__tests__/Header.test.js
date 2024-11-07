import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../Components/Header/Header';

describe('Header Component', () => {
    test('renders text based on props', () => {
        const texts = ['leftText', 'centerText', 'rightText'];
        const { rerender } = render(<Header textLeft={texts[0]} textCenter={texts[1]} textRight={texts[2]} />);

        expect(screen.getByText('leftText')).toBeInTheDocument();
        expect(screen.getByText('centerText')).toBeInTheDocument();
        expect(screen.getByText('rightText')).toBeInTheDocument();

        texts[2] = 'notRightText';
        rerender(<Header textLeft={texts[0]} textCenter={texts[1]} textRight={texts[2]} />);
        expect(screen.getByText('leftText')).toBeInTheDocument();
        expect(screen.getByText('centerText')).toBeInTheDocument();
        expect(screen.queryByText('rightText')).not.toBeInTheDocument();
        expect(screen.getByText('notRightText')).toBeInTheDocument();
    });
});