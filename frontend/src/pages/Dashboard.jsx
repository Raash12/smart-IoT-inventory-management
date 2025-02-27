import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/users/profile', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!res.ok) {
                    const errorData = await res.text(); // Get the response text for debugging
                    throw new Error(`Failed to fetch user data: ${errorData}`);
                }

                const data = await res.json();
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (token) {
            fetchUserData();
        }
    }, [token]);

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content">
                <h1>Dashboard</h1>
                {userData ? (
                    <div>
                        <h2>Welcome, {userData.username}</h2>
                        <p>Email: {userData.email}</p>
                    </div>
                ) : (
                    <p>Loading user data...</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;