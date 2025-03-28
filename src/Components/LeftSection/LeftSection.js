import React from "react";

/**
 * @component LeftSection
 * @description A functional component that displays two vertical text labels
 * indicating the status of food orders: "PRÊT A ENVOYER" and "BIENTOT PRÊT".
 * It is used for the passe.
 *
 * @returns {JSX.Element} The rendered component.
 */
const LeftSection = () => {
    return (
        <div className="bg-kitchen-blue flex flex-col justify-around items-center h-full">
            <div className="writing-mode-tb-rl rotate-180 text-white text-xl font-bold mx-6 text-center">
                PRÊT A ENVOYER
            </div>
            <div className="writing-mode-tb-rl rotate-180 text-white text-xl font-bold mx-6 text-center">
                BIENTOT PRÊT
            </div>
        </div>
    );
};

export default LeftSection;
