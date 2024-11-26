import React from "react";

const SettingsSwitch = ({ optionOneLabel = "Oui", optionTwoLabel = "Non", optionOneColor = "kitchen-green", optionTwoColor = "kitchen-red", value, onChange}) => {

    return (
        <div className="flex flex-row border-[2px] border-white rounded" onClick={onChange}>
            <div className={`flex h-8 w-20 font-medium text-lg justify-center items-center select-none ${value === true ? `bg-${optionOneColor} text-white` : `bg-neutral-200 text-${optionOneColor}`}`}>
                {optionOneLabel}
            </div>
            <div className={`flex h-8 w-20 font-medium text-lg justify-center items-center select-none ${value == false ? `bg-${optionTwoColor} text-white` : `bg-neutral-200 text-${optionTwoColor}`}`}>
                {optionTwoLabel}
            </div>
        </div>
    )
};

export default SettingsSwitch;