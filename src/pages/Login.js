import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Login.css"
import logo from "../Logo_Hello_Kitchen.png"
import axios from "axios"

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:3000/api/login/', {username, password})
        .then((res) => {
            navigate('/');
        })
        .catch((err) => {
            console.log("ERROR", err)
        })
    }

    return (
        <div className="login-container">
            <img src={logo} alt="Logo" className="login-logo" />
            <div className="login-box">
                <form onSubmit={handleSubmit}>
                    <div className="input-field">
                        <label htmlFor="username">Nom d'utilisateur</label>
                        <input type="text" id="username" name="username" onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button type="submit">Se connecter</button>
                </form>
            </div>
        </div>
    )
}

export default Login;