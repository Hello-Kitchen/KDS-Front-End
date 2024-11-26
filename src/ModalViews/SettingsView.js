import React, { useState } from "react";

import { IoIosArrowForward } from "react-icons/io";
import SettingsSwitch from "../Components/Buttons/SettingsSwitch";

const SettingsView = () => {

    const [orderAnnoncement, setOrderAnnoncement] = useState(false);
    const [orderReading, setOrderReading] = useState(false);
    const [touchescreenMode, setTouchescreenMode] = useState(false);

    const handleOrderAnnoncement = () => {
        setOrderAnnoncement(!orderAnnoncement);
    }

    const handleOrderReading = () => {
        setOrderReading(!orderReading);
    }

    const handleTouchescreenMode = () => {
        setTouchescreenMode(!touchescreenMode);
    }

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
                        value={touchescreenMode}
                        onChange={handleTouchescreenMode}
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

export default SettingsView;