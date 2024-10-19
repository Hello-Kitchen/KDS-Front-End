/* eslint-env node */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "./Logo_Hello_Kitchen.png";
import bcrypt from "bcryptjs-react";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState();

    useEffect(() => {
        if (location.state && location.state.error) {
            setError(location.state.error);
        }
    }, [location]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const hasedPassword = bcrypt.hashSync(password, `${process.env.REACT_APP_SALT_HASH}`);


        fetch(`http://${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/login?idRestaurant=${process.env.REACT_APP_NBR_RESTAURANT}&username=${username}&password=${hasedPassword}`)
            .then(response => {
                if (response.status === 400)
                    setError('Username or password is incorrect');
                return response.json()
            })
            .then(data => {
                if (data.access_token) {
                    localStorage.setItem('token', data.access_token);
                    navigate('/cuisine');
                }
            })
            .catch(error => {
                console.error('Login error:', error);
            });
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-kitchen-blue">
            <img src={logo} alt="Logo" className="w-52 h-52 mb-5" />
            <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-md w-80 text-center">
                {error && (<div className="bg-kitchen-beige text-white mb-4 p-2 rounded">
                    {error}
                </div>)}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-2">Nom d&#39;utilisateur</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="w-full p-2 rounded border border-gray-300"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full p-2 rounded border border-gray-300"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-kitchen-blue text-white hover:bg-[#417f8c] transition duration-300"
                    >
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;