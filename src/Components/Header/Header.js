import React from 'react';
import PropTypes from 'prop-types';

/**
 * @brief A component that displays centered text.
 *
 * This component renders a paragraph with large, bold, centered white text.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.text - The text to be displayed in the center.
 *
 * @return {JSX.Element} A paragraph element with centered text.
 */
function CenterText({ text }) {
    return (
        <p className='text-white font-bold text-4xl'>{text}</p>
    );
}

/**
 * @brief A component that displays side-aligned text.
 *
 * This component renders a paragraph with smaller, normal-weight, white text.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.text - The text to be displayed on the side.
 *
 * @return {JSX.Element} A paragraph element with side text.
 */
function SideText({ text }) {
    return (
        <p className='text-white font-normal text-2xl'>{text}</p>
    );
}

/**
 * @brief Header component displaying text on the left, center, and right.
 *
 * The Header component arranges three text sections: left, center, and right.
 * Each of these sections can display a different text, and the text is styled accordingly.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.textLeft - The text displayed on the left side of the header.
 * @param {string} props.textCenter - The text displayed in the center of the header.
 * @param {string} props.textRight - The text displayed on the right side of the header.
 *
 * @return {JSX.Element} A header div element containing the left, center, and right text components.
 */
function Header({ textRight, textCenter, textLeft }) {
    return (
      <div className='w-full h-lh bg-kitchen-blue p-1'>
        <div className='w-full h-full flex justify-between items-center'>
            {<SideText text={textLeft}/>}
            {<CenterText text={textCenter}/>}
            {<SideText text={textRight}/>}
        </div>
      </div>
    );
}

// Define prop types for each component

/**
 * @typedef {Object} CenterTextProps
 * @property {string} text - The text to be displayed in the center.
 */

/**
 * @typedef {Object} SideTextProps
 * @property {string} text - The text to be displayed on the side.
 */

/**
 * @typedef {Object} HeaderProps
 * @property {string} textLeft - The text displayed on the left side of the header.
 * @property {string} textCenter - The text displayed in the center of the header.
 * @property {string} textRight - The text displayed on the right side of the header.
 */

// Set propTypes validation
CenterText.propTypes = {
    text: PropTypes.string.isRequired, ///< The text to be displayed in the center.
};

SideText.propTypes = {
    text: PropTypes.string.isRequired, ///< The text to be displayed on the side.
};

Header.propTypes = {
    textLeft: PropTypes.string.isRequired, ///< The text displayed on the left side of the header.
    textCenter: PropTypes.string.isRequired, ///< The text displayed in the center of the header.
    textRight: PropTypes.string.isRequired, ///< The text displayed on the right side of the header.
};

export default Header;