import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Assuming you have a separate CSS file for Navbar

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">Smart Inventory</div>
            <ul className="navbar-menu">
                <li><Link to="/">Login</Link></li>
                <li><Link to="/signup">Signup</Link></li>
                
            </ul>
        </nav>
    );
};

export default Navbar;