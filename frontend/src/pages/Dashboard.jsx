import React from 'react';
import Sidebar from '../components/Sidebar'; // Adjust the path if necessary

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content">
                <h1>Dashboard</h1>
                {/* <p>Welcome to the inventory dashboard!</p> */}
                {/* Additional inventory management features can be added here */}
            </div>
        </div>
    );
};

export default Dashboard;