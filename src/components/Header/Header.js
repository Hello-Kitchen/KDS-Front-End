import React from 'react';

import './Header.css';
import PropTypes from 'prop-types';

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

CenterText.propTypes = {
    text: PropTypes.string.isRequired
};

SideText.propTypes = {
    text: PropTypes.string.isRequired
};

Header.propTypes = {
    textLeft: PropTypes.string.isRequired,
    textCenter: PropTypes.string.isRequired,
    textRight: PropTypes.string.isRequired
};

export default Header;