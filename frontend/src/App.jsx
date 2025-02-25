import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products'; // Import the Products component
import Categories from './pages/Categories'; // Import the Categories component
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
                <Route path="/products" element={<Products />} /> {/* Products route */}
                <Route path="/categories" element={<Categories />} /> {/* Categories route */}
            </Routes>
        </Router>
    );
};

export default App;