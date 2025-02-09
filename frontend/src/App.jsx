import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products'; // Import the Products component
import Items from './pages/Items'; // Import the Items component
import Navbar from './components/Navbar';
import './styles/styles.css'; // Importing the CSS file

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} /> {/* Add Products route */}
                <Route path="/items" element={<Items />} /> {/* Add Items route */}
            </Routes>
        </Router>
    );
};

export default App;