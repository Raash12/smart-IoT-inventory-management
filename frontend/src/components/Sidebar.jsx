import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Import the CSS file for styling

const Sidebar = ({ onLogout }) => {
    return (
        <div className="sidebar">
            <h2>Menu</h2>
            <ul>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/items">Items</Link></li>
                <li>
                    <Link 
                        to="/" // Replace with the path you want to navigate to after logout
                        onClick={onLogout} // Call the logout function
                        style={linkStyle}
                    >
                        Logout
                    </Link>
                </li>
            </ul>
        </div>
    );
};

// Styling for links
const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    display: 'block',
    padding: '10px',
    transition: 'background-color 0.3s',
};

export default Sidebar;