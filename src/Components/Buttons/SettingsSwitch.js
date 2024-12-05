import React from "react";
import PropTypes from 'prop-types';

/**
 * A switch component that toggles between two options.
 *
 * @param {Object} props - The properties object.
 * @param {string} [props.optionOneLabel="Oui"] - The label for the first option.
 * @param {string} [props.optionTwoLabel="Non"] - The label for the second option.
 * @param {string} [props.optionOneColor="kitchen-green"] - The color for the first option when selected.
 * @param {string} [props.optionTwoColor="kitchen-red"] - The color for the second option when selected.
 * @param {boolean} props.value - The current value of the switch. `true` for the first option, `false` for the second.
 * @param {function} props.onChange - The function to call when the switch is clicked.
 * @returns {JSX.Element} The rendered switch component.
 */
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
    );
};

SettingsSwitch.propTypes = {
    optionOneLabel: PropTypes.string, //< The label for the first option.
    optionTwoLabel: PropTypes.string, //< The label for the second option.
    optionOneColor: PropTypes.string, //< The color for the first option when selected.
    optionTwoColor: PropTypes.string, //< The color for the second option when selected.
    value: PropTypes.bool, //< The current value of the switch. `true` for the first option, `false` for the second.
    onChange: PropTypes.func //< The function to call when the switch is clicked.
};

export default SettingsSwitch;