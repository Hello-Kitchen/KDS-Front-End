import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle, IoIosCheckmarkCircle } from "react-icons/io";
import './Buttons.css';

const ButtonServie = () => (
    <div className='button-footer'>
        <IoIosCheckmarkCircle color='#F2E5A2' size={60} />
        <div className='text'>SERVIE</div>
    </div>
);

const ButtonPrecedent = () => (
    <div className='button-footer'>
        <IoIosArrowDropleftCircle color='#F2E5A2' size={60} />
        <div className='text'>PRECEDENT</div>
    </div>
);

const ButtonSuivant = () => (
    <div className='button-footer'>
        <IoIosArrowDroprightCircle color='#F2E5A2' size={60} />
        <div className='text'>SUIVANT</div>
    </div>
);

const ButtonRappel = () => (
    <div className='button-footer'>
        <svg viewBox="0 0 24 24" height="60" width="60" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="imageRecall" patternUnits="userSpaceOnUse" width="24" height="24">
                    <image href="./recall.jpg" x="0" y="0" width="24" height="24" />
                </pattern>
            </defs>
            <circle r="10" cx="12" cy="12" fill="url(#imageRecall)" />
        </svg>
        <div className='text'>RAPPEL</div>
    </div>
);

const ButtonStatistiques = () => (
    <div className='button-footer'>
        <svg viewBox="0 0 24 24" height="60" width="60" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="imageStat" patternUnits="userSpaceOnUse" width="24" height="24">
                    <image href="./analytic.jpg" x="0" y="0" width="24" height="24" />
                </pattern>
            </defs>
            <circle r="10" cx="12" cy="12" fill="url(#imageStat)" />
        </svg>
        <div className='text'>STATISTIQUES</div>
    </div>
);

const ButtonReglages = () => (
    <div className='button-footer'>
        <svg viewBox="0 0 24 24" height="60" width="60" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="imageSetting" patternUnits="userSpaceOnUse" width="24" height="24">
                    <image href="./setting.jpg" x="0" y="0" width="24" height="24" />
                </pattern>
            </defs>
            <circle r="10" cx="12" cy="12" fill="url(#imageSetting)" />
        </svg>
        <div className='text'>REGLAGES</div>
    </div>
);

const buttonComponents = {
    servie: ButtonServie,
    precedent: ButtonPrecedent,
    suivant: ButtonSuivant,
    rappel: ButtonRappel,
    statistique: ButtonStatistiques,
    reglage: ButtonReglages,
};

export default buttonComponents;