import React from 'react';
import PropTypes from 'prop-types';
import ButtonSet from '../Buttons/Buttons';

/**
 * @brief Renders the connected state view.
 *
 * This component displays an icon and connection details indicating that the system is connected.
 * It includes a circular icon with the connected state image and some labels with connection info.
 *
 * @return {JSX.Element} A JSX element representing the connected state with an icon and details.
 */
const Connected = () => (
    <div className='w-etat bg-kitchen-blue flex flex-col justify-center items-center border-r-[1px] border-l-[1px] border-kitchen-yellow'>
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
 * This component displays an icon and connection details indicating that the system is not connected.
 * Similar to the connected state, but with a different image indicating disconnection.
 *
 * @return {JSX.Element} A JSX element representing the disconnected state with an icon and details.
 */
const NotConnected = () => (
    <div className='w-etat bg-kitchen-blue flex flex-col justify-center items-center border-r-[1px] border-l-[1px] border-kitchen-yellow'>
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
 * This component renders the footer section, which consists of a dynamic set of buttons and the connection status view.
 * It uses the `ButtonSet` component to render buttons based on the `buttons` prop and conditionally renders the
 * connection status (either connected or disconnected). It also provides a configuration control through the `setConfig` function.
 *
 * @param {Object} props - Component properties.
 * @param {string[]} props.buttons - An array of button identifiers to be rendered.
 * @param {function} props.setConfig - A function to manage configuration, especially toggling the active state.
 * @param {function} props.navigationPrev - A function to navigate to the prev order.
 * @param {function} props.navigationAfter - A function to navigate to the next order.
 * @param {string} props.activeTab - The currently active tab.
 * @param {function} props.updateActiveTab - A function to update the active tab state.
 *
 * @return {JSX.Element} A JSX element representing the footer with buttons and connection state.
 */
function Footer({ buttons, setConfig, activeTab, updateActiveTab, navigationPrev, navigationAfter, handleDisplayStatistics }) {
    const isConnected = true; // Connection status, assumed to be true for now
    const ConnectionStatus = isConnected ? Connected : NotConnected;
    return (
        <div className='w-full h-lf bg-kitchen-yellow flex flex-row justify-between'>
            <ButtonSet buttons={buttons} setConfig={setConfig} activeTab={activeTab} updateActiveTab={updateActiveTab} navigationPrev={navigationPrev} navigationAfter={navigationAfter} handleDisplayStatistics={handleDisplayStatistics} />
            <ConnectionStatus />
        </div>
    );
}

Footer.propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.string).isRequired, ///< List of buttons to be rendered.
    navigationPrev: PropTypes.func, ///< Function to handle button clicks.
    navigationAfter: PropTypes.func, ///< Function to handle button clicks.
    setConfig: PropTypes.func, ///< Function to handle configuration changes.
    activeTab: PropTypes.string, ///< Currently active tab
    updateActiveTab: PropTypes.func, ///< Function to handle tab changes
    handleDisplayStatistics: PropTypes.func, ///< Function to handle statistics display
};

export default Footer;
