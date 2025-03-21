import React from "react";
import ManagerHeader from "./ManagerHeader";

import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function AccountManagement({onClickBack}){
    const navigate = useNavigate();

    return (
        <div>
            <ManagerHeader title={'Gestion du compte'} onClick={() => onClickBack()}/>
            <div className="m-3 space-y-1">
                <p className="text-4xl font-bold">Cuisine 1</p>
                <p className="text-xl font-medium">Restaurant {localStorage.getItem("restaurantID")} - Ecran 03</p>
                <div className={`flex justify-center bg-kitchen-yellow font-bold text-2xl text-kitchen-blue p-3 rounded-lg cursor-pointer`} onClick={() => {localStorage.removeItem('token');navigate("/");}}>Déconnexion</div>
            </div>
        </div>
    );
}

AccountManagement.propTypes = {
    onClickBack: PropTypes.func.isRequired
};

export default AccountManagement;