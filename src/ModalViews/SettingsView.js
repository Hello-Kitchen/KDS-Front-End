import React, { useState } from "react";

import { IoIosArrowForward } from "react-icons/io";
import SettingsSwitch from "../Components/Buttons/SettingsSwitch";
import PropTypes from 'prop-types';

/**
 * SettingsView component renders a settings interface with various options.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.orderAnnoncement - The current state of order announcement setting.
 * @param {function} props.handleOrderAnnoncement - The function to handle changes to order announcement setting.
 * @param {boolean} props.orderReading - The current state of order reading setting.
 * @param {function} props.handleOrderReading - The function to handle changes to order reading setting.
 * @param {boolean} props.touchscreenMode - The current state of touchscreen mode setting.
 * @param {function} props.handleTouchscreenMode - The function to handle changes to touchscreen mode setting.
 * @returns {JSX.Element} The rendered component.
 */
const SettingsView = ({
    orderAnnoncement, 
    handleOrderAnnoncement, 
    orderReading, 
    handleOrderReading,
    touchscreenMode, 
    handleTouchscreenMode
}) => {

    return (
        <div className='w-full h-full bg-kitchen-blue border-kitchen-yellow border-y-2'>
            <div className="flex flex-col text-white text-3xl font-bold space-y-5 px-3 pt-5">
                <div className="flex flex-row justify-between px-3">
                    <div className="">Eteindre l'écran</div>
                    <IoIosArrowForward />
                </div>
                <div className="border-white border-[0.5px]"/>
                <div className="flex flex-row justify-between px-3">
                    <div className="">Tonalité d'annonce</div>
                    <SettingsSwitch
                        value={orderAnnoncement}
                        onChange={handleOrderAnnoncement}
                    />
                </div>
                <div className="border-white border-[0.5px]"/>
                <div className="flex flex-row justify-between px-3">
                    <div className="">Lecture des commandes</div>
                    <SettingsSwitch
                        value={orderReading}
                        onChange={handleOrderReading}
                    />
                </div>
                <div className="border-white border-[0.5px]"/>
                <div className="flex flex-row justify-between px-3">
                    <div className="">Mode de fonctionnement</div>
                    <SettingsSwitch
                        optionOneLabel="Tactile"
                        optionTwoLabel="Clavier"
                        optionOneColor="kitchen-blue"
                        optionTwoColor="kitchen-blue"
                        value={touchscreenMode}
                        onChange={handleTouchscreenMode}
                    />
                </div>
                <div className="border-white border-[0.5px]"/>
                <div className="flex flex-row justify-between px-3">
                    <div className="">Gestion du compte</div>
                    <IoIosArrowForward />
                </div>
                <div className="border-white border-[0.5px]"/>
            </div>
        </div>
    );
};

SettingsView.propsTypes = {
    orderAnnoncement: PropTypes.bool.isRequired,
    setOrderAnnoncement: PropTypes.func.isRequired,
    orderReading: PropTypes.bool.isRequired,
    setOrderReading: PropTypes.func.isRequired,
    touchescreenMode: PropTypes.bool.isRequired,
    setTouchescreenMode: PropTypes.func.isRequired,
};

export default SettingsView;