import React from 'react';
import PropTypes from 'prop-types';
import buttonComponents from '../Buttons/Buttons';

/**
 * !! This will most likely be refactored !!
 */

/**
 * @brief Renders an empty button as a placeholder.
 *
 * This component is used when no specific button is assigned.
 *
 * @return A JSX element representing an empty button.
 */
const ButtonEmpty = () => (
    <div className='w-1/6 bg-kitchen-blue'>
    </div>
);

/**
 * @brief Renders the connected state view.
 *
 * This component shows connection details and an icon indicating a connected status.
 *
 * @return A JSX element with the connection state and icon.
 */
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
        <div className='text-white text-etat'>R1161</div>
        <div className='text-white text-etat'>N03</div>
    </div>
);

/**
 * @brief Renders the disconnected state view.
 *
 * This component displays an icon and details indicating a disconnected status.
 *
 * @return A JSX element showing the disconnected state.
 */
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
        <div className='text-white text-etat'>R1161</div>
        <div className='text-white text-etat'>N03</div>
    </div>
);

/**
 * @brief Footer component that displays the buttons and connection status.
 *
 * This component dynamically renders buttons based on the `buttons` prop and shows
 * connection status (either connected or not). It also provides configuration control via the `setConfig` function.
 *
 * @param {Object} props - Component properties.
 * @param {string[]} props.buttons - An array of button identifiers to be rendered.
 * @param {function} props.setConfig - A function to manage configuration, especially toggling the active state.
 *
 * @return {JSX.Element} The footer with the specified buttons and connection state.
 */
function Footer({ buttons, setConfig, handleSettingsDisplay }) {
    const connect = true; ///< Flag indicating connection status. Set to true by default.
    const Etat = connect ? connected : notconnected; ///< Component to render based on connection status.

    return (
        <div className='w-full h-lf bg-kitchen-yellow flex flex-row justify-between gap-0.5'>
            {buttons.map((buttonKey, i) => {
                const ButtonComponent = Object.prototype.hasOwnProperty.call(buttonComponents, buttonKey) ? buttonComponents[buttonKey] : ButtonEmpty;
                if (buttonKey === "activer")
                    return <ButtonComponent key={i} setConfig={setConfig} />;
                else if (buttonKey === "reglage")
                    return <ButtonComponent key={i} handleSettingsDisplay={handleSettingsDisplay} />;
                else
                    return <ButtonComponent key={i} />;
            })}
            <Etat />
        </div>
    );
}

Footer.propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.string).isRequired, ///< List of buttons to be rendered.
    setConfig: PropTypes.func.isRequired, ///< Function to handle configuration changes.
    handleSettingsDisplay: PropTypes.func, ///< Function to handle settings display.
};

export default Footer;