import React from 'react';
import Sidebar from '../components/Sidebar'; // Import the Sidebar component

const Products = () => {
    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content">
                <h1>Products</h1>
                {/* <p>Manage your products here.</p> */}
                {/* Additional product management features can be added here */}
            </div>
        </div>
    );
};

export default Products;