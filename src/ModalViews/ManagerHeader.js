import React from "react";

import { IoIosArrowBack } from "react-icons/io";

import PropTypes from "prop-types";

function ManagerHeader({title, onClick}) {
    return (
        <div className="flex items-center bg-kitchen-blue " onClick={onClick}>
            <IoIosArrowBack />
            <p className="font-bold text-3xl text-white cursor-pointer">{title}</p>
        </div>
    );
}

ManagerHeader.propTypes = {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
};

export default ManagerHeader;