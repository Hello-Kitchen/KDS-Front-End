import './Header.css';

function CenterText({text}) {
    return (
        <p className='center-info'>{text}</p>
    );
}

function SideText({text}) {
    return (
        <p className='info'>{text}</p>
    );
}

function Header({textRight, textCenter, textLeft}) {

    return (
      <div className='container-header'>
        <div className='center-container'>
            {<SideText text={textLeft}/>}
            {<CenterText text={textCenter}/>}
            {<SideText text={textRight}/>}
        </div>
      </div>
    );
  }
  
  export default Header;