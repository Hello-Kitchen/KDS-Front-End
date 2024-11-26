import React from 'react';
import PropTypes from 'prop-types';
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle, IoIosCheckmarkCircle } from "react-icons/io";

/**
 * !! This will most likely be refactored !!
 */

/**
 * @brief ButtonServie component renders a button with a checkmark icon labeled "SERVIE".
 *
 * This button is not currently used, it only displays "SERVIE".
 *
 * @return {JSX.Element} A button component displaying the "SERVIE" label.
 */
const ButtonServie = () => (
    <div className='w-1/6 bg-kitchen-blue p-0.5 flex flex-col justify-center items-center gap-1.5'>
        <IoIosCheckmarkCircle color='#F2E5A2' size={50} />
        <div className='text-24px font-bold text-white'>SERVIE</div>
    </div>
);

/**
 * @brief ButtonPrecedent component renders a button with a left arrow icon labeled "PRECEDENT".
 *
 * This button is not currently used, it only displays "PRECEDENT".
 *
 * @return {JSX.Element} A button component displaying the "PRECEDENT" label.
 */
const ButtonPrecedent = () => (
    <div className='w-1/6 bg-kitchen-blue p-0.5 flex flex-col justify-center items-center gap-1.5'>
        <IoIosArrowDropleftCircle color='#F2E5A2' size={50} />
        <div className='text-24px font-bold text-white'>PRECEDENT</div>
    </div>
);

/**
 * @brief ButtonSuivant component renders a button with a right arrow icon labeled "SUIVANT".
 *
 * This button is not currently used, it only displays "SUIVANT".
 *
 * @return {JSX.Element} A button component displaying the "SUIVANT" label.
 */
const ButtonSuivant = () => (
    <div className='w-1/6 bg-kitchen-blue p-0.5 flex flex-col justify-center items-center gap-1.5'>
        <IoIosArrowDroprightCircle color='#F2E5A2' size={50} />
        <div className='text-24px font-bold text-white'>SUIVANT</div>
    </div>
);

/**
 * @brief ButtonRappel component renders a button with a custom image icon labeled "RAPPEL".
 *
 * This button is not currently used, it only displays "RAPPEL"
 *
 * @return {JSX.Element} A button component displaying the "RAPPEL" label.
 */
const ButtonRappel = () => (
    <div className='w-1/6 bg-kitchen-blue p-0.5 flex flex-col justify-center items-center gap-1.5'>
        <svg viewBox="0 0 24 24" height="50" width="50" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="imageRecall" patternUnits="userSpaceOnUse" width="24" height="24">
                    <image href="./recall.jpg" x="0" y="0" width="24" height="24" />
                </pattern>
            </defs>
            <circle r="10" cx="12" cy="12" fill="url(#imageRecall)" />
        </svg>
        <div className='text-24px font-bold text-white'>RAPPEL</div>
    </div>
);

/**
 * @brief ButtonStatistiques component renders a button with a statistics icon labeled "STATISTIQUES".
 *
 * This button is not currently used, it only displays "STATISTIQUES"
 *
 * @return {JSX.Element} A button component displaying the "STATISTIQUES" label.
 */
const ButtonStatistiques = ({ handleDisplayStatistics }) => (
    <div className='w-1/6 bg-kitchen-blue p-0.5 flex flex-col justify-center items-center gap-1.5' onClick={handleDisplayStatistics}>
        <svg viewBox="0 0 24 24" height="50" width="50" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="imageStat" patternUnits="userSpaceOnUse" width="24" height="24">
                    <image href="./analytic.jpg" x="0" y="0" width="24" height="24" />
                </pattern>
            </defs>
            <circle r="10" cx="12" cy="12" fill="url(#imageStat)" />
        </svg>
        <div className='text-24px font-bold text-white'>STATISTIQUES</div>
    </div>
);

/**
 * @brief ButtonReglages component renders a button with a settings icon labeled "RÉGLAGES".
 *
 * This button is not currently used, it only displays "RÉGLAGES".
 *
 * @return {JSX.Element} A button component displaying the "RÉGLAGES" label.
 */
const ButtonReglages = () => (
    <div className='w-1/6 bg-kitchen-blue p-0.5 flex flex-col justify-center items-center gap-1.5'>
        <svg viewBox="0 0 24 24" height="50" width="50" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="imageSetting" patternUnits="userSpaceOnUse" width="24" height="24">
                    <image href="./setting.jpg" x="0" y="0" width="24" height="24" />
                </pattern>
            </defs>
            <circle r="10" cx="12" cy="12" fill="url(#imageSetting)" />
        </svg>
        <div className='text-24px font-bold text-white'>RÉGLAGES</div>
    </div>
);

/**
 * @brief ButtonPower component renders a button with a power icon labeled "ACTIVER".
 *
 * This button toggles the state of the kitchen.
 *
 * @param {Object} props Component properties.
 * @param {function} props.setConfig Function to toggle the enable state.
 *
 * @return {JSX.Element} A button component that toggles the enable state.
 */
const ButtonPower = ({ setConfig }) => (
    <div className='w-1/6 bg-kitchen-blue p-0.5 flex flex-col justify-center items-center gap-1.5 cursor-pointer' onClick={() => { setConfig(prevConfig => ({ ...prevConfig, enable: !prevConfig.enable })); }}>
        <svg viewBox="0 0 24 24" height="50" width="50" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="imagePower" patternUnits="userSpaceOnUse" width="24" height="24">
                    <image href="./power.jpg" x="0" y="0" width="24" height="24" />
                </pattern>
            </defs>
            <circle r="10" cx="12" cy="12" fill="url(#imagePower)" />
        </svg>
        <div className='text-24px font-bold text-white'>ACTIVER</div>
    </div>
);

// Define the available button components
const buttonComponents = {
    servie: ButtonServie,
    precedent: ButtonPrecedent,
    suivant: ButtonSuivant,
    rappel: ButtonRappel,
    statistique: ButtonStatistiques,
    reglage: ButtonReglages,
    activer: ButtonPower,
};

// Define PropTypes for ButtonPower
ButtonPower.propTypes = {
    setConfig: PropTypes.func.isRequired,
};

// Define PropTypes for ButtonStatistiques
ButtonStatistiques.propTypes = {
    handleDisplayStatistics: PropTypes.func.isRequired,
};

export default buttonComponents;