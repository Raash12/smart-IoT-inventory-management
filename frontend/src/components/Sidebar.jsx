import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Create this CSS file for styling

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Menu</h2>
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/items">Items</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;