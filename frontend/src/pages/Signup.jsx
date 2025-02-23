import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [username, setUsername] = useState(''); // Optional for your application logic
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        // Client-side validation
        if (username.trim() === '') {
            setMessage('Username is required.');
            return;
        }
        if (email.trim() === '') {
            setMessage('Email is required.');
            return;
        }
        if (password.length < 6) {
            setMessage('Password must be at least 6 characters long.');
            return;
        }

        try {
            const res = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCrZMno56Y-1hK_c3Szi_c348JaIrkUwA4', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, returnSecureToken: true }),
            });

            const data = await res.json();

            if (res.ok) {
                // Handle successful signup (e.g., navigate to login)
                navigate('/'); // Redirect to Login page on success
            } else {
                // Handle specific errors based on response message
                if (data.error && data.error.message) {
                    setMessage(data.error.message);
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