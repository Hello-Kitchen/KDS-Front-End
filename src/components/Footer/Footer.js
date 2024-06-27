import './Footer.css';
import buttonComponents from '../Buttons/Buttons';

const ButtonEmpty = () => (
    <div className='button'>
    </div>
);

const connected = () => (
    <div className='etat'>
        <svg viewBox="0 0 24 24" height="50" width="50" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="imageConnected" patternUnits="userSpaceOnUse" width="24" height="24">
                    <image href="./connected.jpg" x="0" y="0" width="24" height="24" />
                </pattern>
            </defs>
            <circle r="10" cx="12" cy="12" fill="url(#imageConnected)" />
        </svg>
        <div className='text-etat'>R1161</div>
        <div className='text-etat'>N03</div>
    </div>
)

const notconnected = () => (
    <div className='etat'>
        <svg viewBox="0 0 24 24" height="50" width="50" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="imageNotConnected" patternUnits="userSpaceOnUse" width="24" height="24">
                    <image href="./notconnected.jpg" x="0" y="0" width="24" height="24" />
                </pattern>
            </defs>
            <circle r="10" cx="12" cy="12" fill="url(#imageNotConnected)" />
        </svg>
        <div className='text-etat'>R1161</div>
        <div className='text-etat'>N03</div>
    </div>
)

function Footer({ buttons }) {
    const connect = false;
    const Etat = connect ? connected : notconnected;
    return (
        <div style={{ width: "100%", height: "100%", flexDirection: "column" }}>
            <div style={{ width: "100%", height: "5%", backgroundColor: "#499CA6" }}></div>
            <div style={{ width: "100%", height: "85%" }}></div>
            <div className='container'>
                {buttons.map(buttonKey => {
                    const ButtonComponent = buttonComponents.hasOwnProperty(buttonKey) ? buttonComponents[buttonKey] : ButtonEmpty;
                    return <ButtonComponent key={buttonKey} />;
                })}
                <Etat />
            </div>
        </div>
    );
}

export default Footer;