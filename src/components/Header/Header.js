import React from 'react';

import PropTypes from 'prop-types';

function CenterText({text}) {
    return (
        <p className='text-white font-bold text-4xl'>{text}</p>
    );
}

function SideText({text}) {
    return (
        <p className='text-white font-normal text-2xl'>{text}</p>
    );
}

function Header({textRight, textCenter, textLeft}) {
    return (
      <div className='w-full h-lh bg-kitchen-blue p-1'>
        <div className='w-full h-full flex justify-between items-center'>
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