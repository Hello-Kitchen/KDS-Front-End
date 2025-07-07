import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle, IoIosCheckmarkCircle } from "react-icons/io";

/**
 * @brief Renders a custom image inside a circle.
 *
 * This component takes a URL and uses it as a pattern inside an SVG circle.
 *
 * @param {Object} props Component properties.
 * @param {string} props.url The URL of the image to be displayed.
 *
 * @return {JSX.Element} An SVG circle element with the image as a background.
 */
const CustomImage = ({ url }) => {
    return (
        <svg viewBox="0 0 24 24" height="50" width="50" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id={`imagePattern${url}`} patternUnits="userSpaceOnUse" width="24" height="24">
                    <image href={url} x="0" y="0" width="24" height="24" />
                </pattern>
            </defs>
            <circle r="10" cx="12" cy="12" fill={`url(#imagePattern${url})`} />
        </svg>
    );
};

CustomImage.propTypes = {
    url: PropTypes.string.isRequired
};

// Map icon names to actual icon components
const icons = {
    checkmark: IoIosCheckmarkCircle,
    leftArrow: IoIosArrowDropleftCircle,
    rightArrow: IoIosArrowDroprightCircle,
};

/**
 * @brief Renders a generic button with an icon and a label.
 *
 * This component renders a button that can display either a predefined icon or a custom image.
 * An optional `onClick` function can be passed to handle button interactions.
 *
 * @param {Object} props Component properties.
 * @param {string} props.icon Icon type, can be a predefined icon name (e.g., 'checkmark') or 'null' to render a custom image.
 * @param {string} props.label Label to display below the icon.
 * @param {string} [props.imageUrl] Optional URL for the custom image (used when icon is 'null').
 * @param {function} [props.setConfig] Optional function to toggle configuration (passed for specific buttons like 'activer').
 * @param {string} props.activeTab The currently active tab.
 * @param {function} props.updateActiveTab Function to update the active tab.
 * @param {boolean} props.invertOnClick Whether to invert the color on button click.
 * @param {function} props.navigationPrev - A function to navigate to the prev order.
 * @param {function} props.navigationAfter - A function to navigate to the next order.
 * @param {function} props.handleDisplayStatistics - A function to handle display statistics.
 * @param {boolean} props.activeRecall - The currently active recall.
 * @param {function} props.updateActiveRecall - A function to update the active recall.
 *
 * @return {JSX.Element} A button component with an icon or image and a label.
 */
const GenericButton = ({
    icon,
    label,
    imageUrl,
    setConfig,
    activeTab,
    updateActiveTab,
    invertOnClick,
    navigationPrev,
    navigationAfter,
    handleDisplayStatistics,
    handleSettingsDisplay,
    currentOrderId,
    activeRecall,
    updateActiveRecall,
    isServing
}) => {
    const [isInverted, setIsInverted] = useState(false);
    const navigate = useNavigate();

    const handleMouseDown = () => {
        setIsInverted(true);
    };

    const handleMouseUp = () => {
        setIsInverted(false);
    };

    const handleServed = async (id) => {
        isServing(id);
        let willRecurse = false;
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${localStorage.getItem("restaurantID")}/orders/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.status === 401) {
                navigate("/", { state: { error: "Unauthorized access. Please log in." } });
                throw new Error("Unauthorized access. Please log in.");
            }

            const order = await response.json();

            const fetchPromises = [];

            if (order.food_ordered.every(food => food.is_ready === true)) {
                fetchPromises.push(
                    fetch(
                        `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${localStorage.getItem("restaurantID")}/orders/served/${order.id}`,
                        {
                            method: 'PUT',
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    ).then((response) => {
                        if (response.status === 401) {
                            navigate("/", { state: { error: "Unauthorized access. Please log in." } });
                            throw new Error("Unauthorized access. Please log in.");
                        }
                    })
                );
            } else {
                order.food_ordered.forEach((food) => {
                    if (!food.is_ready) {
                        if (food.quantity > 1)
                            willRecurse = true;
                        fetchPromises.push(
                            fetch(
                                `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/${localStorage.getItem("restaurantID")}/orders/status/${food.id}`,
                                {
                                    method: 'PUT',
                                    headers: {
                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                    },
                                }
                            ).then((response) => {
                                if (response.status === 401) {
                                    navigate("/", { state: { error: "Unauthorized access. Please log in." } });
                                    throw new Error("Unauthorized access. Please log in.");
                                }
                            })
                        );
                    }
                });
            }

            await Promise.all(fetchPromises);
            if (willRecurse) {
                handleServed(id);
            }
        } catch (error) {
            console.error('An error occurred:', error.message);
        } finally {
            isServing(-1);
            
        }
    };

    const handleClick = () => {
        if (setConfig) {
            setConfig(prevConfig => ({ ...prevConfig, enable: !prevConfig.enable }));
        }
        if (label === "SERVIE") {
            handleServed(currentOrderId);
            navigationAfter();
            navigationPrev();
        }

        if (label === "SUIVANT")
            navigationAfter();

        if (label === "PRÉCÉDENT")
            navigationPrev();

        if (label === "STATISTIQUES")
            handleDisplayStatistics();
        if (label === "RÉGLAGES")
            handleSettingsDisplay();

        if (label === "RAPPEL") {
            updateActiveRecall(!activeRecall);
        }

        if (label !== "RAPPEL" && activeRecall === true)
            updateActiveRecall(false);
        if (!invertOnClick && label !== "ACTIVER") {
            activeTab === label ? updateActiveTab("") : updateActiveTab(label);
        }
    };

    const isActive = activeTab === label || isInverted;

    return (
        label === "" ? (
            <div className="flex-1 bg-kitchen-blue select-none"></div>
        ) : (
            <div
                className={`flex-1 p-0.5 flex flex-col justify-center items-center border-r-[1px] border-l-[1px] border-kitchen-yellow cursor-pointer select-none
                    ${isActive ? 'bg-kitchen-yellow text-kitchen-blue shadow-inner-top-lg' : 'bg-kitchen-blue text-white'}
                `}
                onMouseDown={invertOnClick ? handleMouseDown : undefined}
                onMouseUp={invertOnClick ? handleMouseUp : undefined}
                onClick={label !== "RAPPEL" ? handleClick : activeTab !== "ACTIVER" && activeTab !== "" && activeTab !== "RAPPEL" ? undefined : handleClick}
            >
                {icon !== 'null' ? (
                    React.createElement(icons[icon], { size: 50, color: isActive ? '#499CA6' : '#F2E5A2' })
                ) : (
                    imageUrl && <CustomImage url={isActive ? `./active-${imageUrl}` : `./${imageUrl}`} />
                )}
                <div className={`text-24px font-bold ${isActive ? 'text-kitchen-blue' : 'text-white'}`}>
                    {label}
                </div>
            </div>
        )
    );
};

GenericButton.propTypes = {
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    activeTab: PropTypes.string.isRequired,
    updateActiveTab: PropTypes.func.isRequired,
    invertOnClick: PropTypes.bool.isRequired,
    imageUrl: PropTypes.string,
    setConfig: PropTypes.func,
    navigationPrev: PropTypes.func, ///< Function to handle navigation order
    navigationAfter: PropTypes.func, ///< Function to handle navigation order
    handleDisplayStatistics: PropTypes.func, ///< Function to handle display statistics
    handleSettingsDisplay: PropTypes.func, ///< Function to handle settings display
    currentOrderId: PropTypes.number,
    activeRecall: PropTypes.bool, ///< Currently active recall
    updateActiveRecall: PropTypes.func, ///< Function to handle recall changes
    isServing: PropTypes.func, ///< Function to update the Id of the order being served
};

export { GenericButton };

/**
 * @brief Defines the button data, including icon, label, and any custom behavior.
 *
 * The data is used to generate buttons dynamically with varying configurations.
 * Each button is identified by a unique key.
 */
let buttonData = {
    servie: { icon: 'checkmark', label: 'SERVIE' },
    precedent: { icon: 'leftArrow', label: 'PRÉCÉDENT' },
    suivant: { icon: 'rightArrow', label: 'SUIVANT' },
    rappel: { icon: 'null', imageUrl: 'recall.jpg', label: 'RAPPEL' },
    statistique: { icon: 'null', imageUrl: 'analytic.jpg', label: 'STATISTIQUES' },
    reglage: { icon: 'null', imageUrl: 'setting.jpg', label: 'RÉGLAGES' },
    activer: { icon: 'null', imageUrl: 'power.jpg', label: 'ACTIVER', onClick: (setConfig) => () => setConfig(prev => ({ ...prev, enable: !prev.enable })) },
};

/**
 * @brief Renders a set of buttons based on the provided keys.
 *
 * This component dynamically generates buttons based on a list of keys, mapping each key
 * to the corresponding button data. It passes the `setConfig` function to buttons that need it.
 *
 * @param {Object} props - Component properties.
 * @param {string[]} props.buttons - An array of button keys to render.
 * @param {function} props.setConfig - Function to handle configuration toggling, passed to relevant buttons.
 * @param {function} props.navigationPrev - A function to navigate to the prev order.
 * @param {function} props.navigationAfter - A function to navigate to the next order.
 * @param {string} props.activeTab - The currently active tab.
 * @param {function} props.updateActiveTab - A function to update the active tab.
 * @param {boolean} props.activeRecall - The currently active recall.
 * @param {function} props.updateActiveRecall - A function to update the active recall.
 *
 * @return {JSX.Element} A set of rendered buttons.
 */
function ButtonSet({ buttons, setConfig, activeTab, updateActiveTab, navigationPrev, navigationAfter, handleDisplayStatistics, handleSettingsDisplay, currentOrderId, activeRecall, updateActiveRecall, isServing }) {
    return (
        <div className="flex w-full">
            {buttons.map((key, i) => {
                const buttonInfo = buttonData[key]; // Retrieve the button data based on key

                if (!buttonInfo) {
                    return <div key={i} className='flex-1 bg-kitchen-blue'></div>;
                }

                const { icon, label, imageUrl } = buttonInfo;
                return (
                    <GenericButton
                        key={i}
                        icon={icon}
                        label={label}
                        imageUrl={imageUrl}
                        setConfig={key === 'activer' ? setConfig : null} // Only pass setConfig if it's the power button
                        activeTab={activeTab}
                        updateActiveTab={updateActiveTab}
                        invertOnClick={["SERVIE","PRÉCÉDENT","SUIVANT"].includes(label) ? true : false}
                        navigationPrev={navigationPrev}
                        navigationAfter={navigationAfter}
                        handleDisplayStatistics={handleDisplayStatistics}
                        handleSettingsDisplay={handleSettingsDisplay}
                        currentOrderId={currentOrderId}
                        activeRecall={activeRecall}
                        updateActiveRecall={updateActiveRecall}
                        isServing={isServing}
                    />
                );
            })}
        </div>
    );
}

ButtonSet.propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.string).isRequired, ///< List of buttons to be rendered.
    setConfig: PropTypes.func, ///< Function to handle configuration changes.
    activeTab: PropTypes.string.isRequired, ///< Currently active tab
    updateActiveTab: PropTypes.func.isRequired, ///< Function to handle tab changes
    navigationPrev: PropTypes.func, ///< Function to handle navigation order
    navigationAfter: PropTypes.func, ///< Function to handle navigation order
    handleDisplayStatistics: PropTypes.func, ///< Function to handle display statistics
    handleSettingsDisplay: PropTypes.func, ///< Function to handle settings display
    currentOrderId: PropTypes.number, ///< Function to handle serving feature
    activeRecall: PropTypes.bool, ///< Currently active recall
    updateActiveRecall: PropTypes.func, ///< Function to handle recall changes
    isServing: PropTypes.func, ///< Function to update the Id of the order being served
};

export default ButtonSet;
