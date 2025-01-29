import React from "react";

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
 * @param {boolean} props.orderSelect - The current state of order select setting.
 * @param {function} props.handleOrderSelect - The function to handle changes to order select setting.
 * @param {boolean} props.touchscreenMode - The current state of touchscreen mode setting.
 * @param {function} props.handleTouchscreenMode - The function to handle changes to touchscreen mode setting.
 * @param {function} props.setConfig - The function to set the configuration.
 * @param {boolean} props.screenOn - The current state of the screen.
 * @returns {JSX.Element} The rendered component.
 */
const SettingsView = ({
    orderAnnoncement, 
    handleOrderAnnoncement, 
    orderReading, 
    handleOrderReading,
    orderSelect, 
    handleOrderSelect,
    touchscreenMode, 
    handleTouchscreenMode,
    setConfig,
    screenOn
}) => {

    return (
        <div className='w-full h-full bg-kitchen-blue border-kitchen-yellow border-y-2'>
            <div className="flex flex-col text-white text-3xl font-bold space-y-5 px-3 pt-5">
                {screenOn &&
                    <div className="space-y-5">
                        <div className="flex flex-row justify-between px-3" onClick={() => {setConfig(prevConfig => ({ ...prevConfig, enable: !prevConfig.enable }));}}>
                            <div className="">Eteindre l&apos;écran</div>
                            <IoIosArrowForward />
                        </div>
                        <div className="border-white border-[0.5px]"/>
                    </div>
                }
                <div className="flex flex-row justify-between px-3">
                    <div className="">Tonalité d&apos;annonce</div>
                    <SettingsSwitch
                        value={orderAnnoncement}
                        onChange={handleOrderAnnoncement}
                    />
                </div>
                <div className="border-white border-[0.5px]"/>
                <div className="flex flex-row justify-between px-3">
                    <div className="">Lecture des commandes à l&apos;arrivée</div>
                    <SettingsSwitch
                        value={orderReading}
                        onChange={handleOrderReading}
                    />
                </div>
                <div className="border-white border-[0.5px]"/>
                <div className="flex flex-row justify-between px-3">
                    <div className="">Lecture de la commande sélectionnée</div>
                    <SettingsSwitch
                        value={orderSelect}
                        onChange={handleOrderSelect}
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

SettingsView.propTypes = {
    orderAnnoncement: PropTypes.bool.isRequired, //< boolean - The current state of order announcement setting.
    handleOrderAnnoncement: PropTypes.func.isRequired, //< function - The function to handle changes to order announcement setting.
    orderReading: PropTypes.bool.isRequired, //< boolean - The current state of order reading setting.
    handleOrderReading: PropTypes.func.isRequired, //< function - The function to handle changes to order reading setting.
    orderSelect: PropTypes.bool.isRequired, //< boolean - The current state of order select setting.
    handleOrderSelect: PropTypes.func.isRequired, //< function - The function to handle changes to order select setting.
    touchscreenMode: PropTypes.bool.isRequired, //< boolean - The current state of touchscreen mode setting.
    handleTouchscreenMode: PropTypes.func.isRequired, //< function - The function to handle changes to touchscreen mode setting.
    setConfig: PropTypes.func.isRequired, //< function - The function to set the configuration.
    screenOn: PropTypes.bool.isRequired //< boolean - The current state of the screen.
};

export default SettingsView;