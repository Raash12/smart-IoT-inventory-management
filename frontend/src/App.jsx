import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import ViewCategories from './pages/ViewCategories'; // Import the new ViewCategories component
import ViewProduct from './pages/ViewProduct'; // Import the ViewProduct component

import './styles/styles.css'; // Importing the CSS file

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/view-categories" element={<ViewCategories />} /> {/* Add this route */}
                <Route path="/products/:id" element={<ViewProduct />} /> {/* View Product route */}
            </Routes>
        </Router>
    );
};

export default App;