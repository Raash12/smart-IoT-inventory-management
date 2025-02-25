import React from 'react';
import Sidebar from '../components/Sidebar'; // Import the Sidebar component

const Categories = () => {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content">
                <h1>Categories</h1>
                {/* <p>Manage your items here.</p> */}
                {/* Additional item management features can be added here */}
            </div>
        </div>
    );
};

export default Categories;