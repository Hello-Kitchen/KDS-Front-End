import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import logo from './logo-notext.png';
import bcrypt from "bcryptjs-react";

/**
 * Component : Page, Component used to handle a User login in the POS Application. Main entry point
 * 
 * @component Login
 */
const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [restaurantID, setRestaurantID] = useState(localStorage.getItem('restaurantID') || '');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState();

    useEffect(() => {
        if (location.state && location.state.error) {
            setError(location.state.error);
        }
    }, [location]);
    
    //post request to the back-end, If login informations are correct, will redirect to the Loading page
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!restaurantID || !username || !password) {
            setError('Merci de remplir tous les champs');
            return;
        }

        const hasedPassword = bcrypt.hashSync(password, `${process.env.REACT_APP_SALT_HASH}`);


        fetch(`${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/login?idRestaurant=${restaurantID}&username=${username}&password=${hasedPassword}`)
            .then(response => {
                if (response.status === 400)
                    setError('Username or password is incorrect');
                return response.json();
            })
            .then(data => {
                if (data.access_token) {
                    localStorage.setItem('restaurantID', restaurantID);
                    localStorage.setItem('token', data.access_token);
                    navigate('/cuisine');
                }
            })
            .catch(error => {
                console.error('Login error:', error);
            });
    };


    return (
        <div className="flex flex-row h-full w-full">
            <div className="w-7/12 bg-kitchen-blue shadow-inner-right-lg"/>
            <div className="flex flex-col w-5/12 justify-center pl-20">
                <img src="./logo-notext.png" alt="Logo" className="w-2/6" />
                <div className="font-extrabold text-2xl text-kitchen-blue mb-1">CONNEXION</div>
                {error && (<div className="bg-kitchen-beige text-white w-4/6 mb-4 p-2 rounded">
                    {error}
                </div>)}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="restaurantID" className="block pl-2">Numéro de restaurant</label>
                        <input
                            type="text"
                            id="restaurantID"
                            name="restaurantID"
                            className="w-4/6 p-2.5 rounded-2xl border border-kitchen-blue"
                            onChange={(e) => setRestaurantID(e.target.value)}
                            value={restaurantID}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="username" className="block pl-2">Nom d&#39;utilisateur</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="w-4/6 p-2.5 rounded-2xl border border-kitchen-blue"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block pl-2">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-4/6 p-2.5 rounded-2xl border border-kitchen-blue"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-4/6 p-2.5 rounded-2xl bg-[#499CA6] text-white hover:bg-[#417f8c] transition duration-300"
                    >
                        <div className="text-lg font-bold">
                            Se connecter
                        </div>
                    </button>
                </form>
            </div>

        </div>
    );
};

export default Login;