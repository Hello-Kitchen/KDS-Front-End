import './Footer.css';
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle, IoIosCheckmarkCircle, IoMdRefreshCircle } from "react-icons/io";
import { RiRefreshFill } from "react-icons/ri";

function Footer({ buttons }) {

    return (
        <div style={{width: "100%", height: "100%", flexDirection: "column"}}>
            <div style={{width: "100%", height: "5%", backgroundColor: "#499CA6"}}></div>
            <div style={{width: "100%", height: "85%"}}></div>
            <div className='container'>
                <div className='button'>
                    <IoIosCheckmarkCircle color='#F2E5A2' size={60}/>
                    <div className='text'>SERVIE</div>
                </div>
                <div className='button'>
                    <IoIosArrowDropleftCircle color='#F2E5A2' size={60}/>
                    <div className='text'>PRECEDENT</div>
                </div>
                <div className='button'>
                    <IoIosArrowDroprightCircle color='#F2E5A2' size={60}/>
                    <div className='text'>SUIVANT</div>
                </div>
                <div className='button'>
                    <RiRefreshFill color='#F2E5A2' size={60}/>
                    <div className='text'>RAPPEL</div>
                </div>
                <div className='button'>
                    <IoIosArrowDroprightCircle color='#F2E5A2' size={60}/>
                    <div className='text'>STATISTIQUES</div>
                </div>
                <div className='button'>
                    <IoIosArrowDroprightCircle color='#F2E5A2' size={60}/>
                    <div className='text'>REGLAGES</div>
                </div>
                <div className='etat'></div>
            </div>
        </div>
    );
}

export default Footer;