//For admin side login
import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin(){
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const hardcodedUsername = 'admin';
    const hardcodedPassword = 'tennis';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === hardcodedUsername && password === hardcodedPassword) {
            navigate('/editjoin');
        } else {
            setErrorMessage('Incorrect username or password');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="container">
                <h1>Welcome Admin</h1>
                <label html="username"><b>Username: </b></label>
                <input
                    type="text"
                    placeholder="Enter Username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label html="password"><b>Password: </b></label>
                <input
                    type="password"
                    placeholder="Enter Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
                <p style={{ color: 'red' }}>{errorMessage}</p>
            </div>
        </form>
    );
}

export default Admin;