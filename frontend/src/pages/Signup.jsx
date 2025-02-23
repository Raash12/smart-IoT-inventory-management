import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        try {
            const res = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json(); // Move this up to handle error response properly
            
            if (res.ok) {
                navigate('/'); // Redirect to Login page on success
            } else {
                // Handle specific errors based on status code or message
                if (data.message) {
                    setMessage(data.message);
                } else {
                    setMessage('Signup failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred: ' + error.message);
        }
    };

    return (
        <div className="container">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Create Account</button>
            </form>
            {message && <p>{message}</p>} {/* Display error or success messages */}
        </div>
    );
};

export default Signup;