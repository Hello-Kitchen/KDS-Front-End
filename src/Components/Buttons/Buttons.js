import React from 'react';
import PropTypes from 'prop-types';

import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle, IoIosCheckmarkCircle } from "react-icons/io";

const ButtonServie = () => (
    <div className='w-1/6 bg-kitchen-blue p-0.5 flex flex-col justify-center items-center gap-1.5'>
        <IoIosCheckmarkCircle color='#F2E5A2' size={50} />
        <div className='text-24px font-bold text-white'>SERVIE</div>
    </div>
);

const ButtonPrecedent = () => (
    <div className='w-1/6 bg-kitchen-blue p-0.5 flex flex-col justify-center items-center gap-1.5'>
        <IoIosArrowDropleftCircle color='#F2E5A2' size={50} />
        <div className='text-24px font-bold text-white'>PRECEDENT</div>
    </div>
);

const ButtonSuivant = () => (
    <div className='w-1/6 bg-kitchen-blue p-0.5 flex flex-col justify-center items-center gap-1.5'>
        <IoIosArrowDroprightCircle color='#F2E5A2' size={50} />
        <div className='text-24px font-bold text-white'>SUIVANT</div>
    </div>
);

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

const ButtonStatistiques = () => (
    <div className='w-1/6 bg-kitchen-blue p-0.5 flex flex-col justify-center items-center gap-1.5'>
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

const buttonComponents = {
    servie: ButtonServie,
    precedent: ButtonPrecedent,
    suivant: ButtonSuivant,
    rappel: ButtonRappel,
    statistique: ButtonStatistiques,
    reglage: ButtonReglages,
    activer: ButtonPower,
};

ButtonPower.propTypes = {
    setConfig: PropTypes.func.isRequired,
};

export default buttonComponents;