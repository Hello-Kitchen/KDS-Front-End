import React from 'react';

import PropTypes from 'prop-types';
import buttonComponents from '../Buttons/Buttons';

const ButtonEmpty = () => (
    <div className='w-1/6 h-10 bg-kitchen-yellow'>
    </div>
);

const connected = () => (
    <div className='w-etat bg-kitchen-blue flex flex-col justify-center items-center'>
        <svg viewBox="0 0 24 24" height="50" width="50" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="imageConnected" patternUnits="userSpaceOnUse" width="24" height="24">
                    <image href="./connected.jpg" x="0" y="0" width="24" height="24" />
                </pattern>
            </defs>
            <circle r="10" cx="12" cy="12" fill="url(#imageConnected)" />
        </svg>
        <div className='text-white text-24px'>R1161</div>
        <div className='text-white text-24px'>N03</div>
    </div>
)

const notconnected = () => (
    <div className='w-etat bg-kitchen-blue flex flex-col justify-center items-center'>
        <svg viewBox="0 0 24 24" height="50" width="50" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="imageNotConnected" patternUnits="userSpaceOnUse" width="24" height="24">
                    <image href="./notconnected.jpg" x="0" y="0" width="24" height="24" />
                </pattern>
            </defs>
            <circle r="10" cx="12" cy="12" fill="url(#imageNotConnected)" />
        </svg>
        <div className='text-white text-24px'>R1161</div>
        <div className='text-white text-24px'>N03</div>
    </div>
)

function Footer({ buttons }) {
    const connect = true;
    const Etat = connect ? connected : notconnected;
    return (
        <div className='w-full h-lf bg-kitchen-yellow flex flex-row justify-between gap-0.5'>
            {buttons.map(buttonKey => {
                const ButtonComponent = Object.prototype.hasOwnProperty.call(buttonComponents, buttonKey) ? buttonComponents[buttonKey] : ButtonEmpty;
                return <ButtonComponent key={buttonKey} />;
            })}
            <Etat />
        </div>
    );
}

Footer.propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default Footer;