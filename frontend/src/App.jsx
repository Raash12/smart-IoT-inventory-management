import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import ViewProduct from './pages/ViewProduct'; // Import the ViewProduct component
import ProductUpdate from './pages/ProductUpdate'; // Import the ProductUpdate component
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
                <Route path="/products" element={<Products />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/view-products" element={<ViewProduct />} /> {/* View Product route */}
                <Route path="/update-product/:id" element={<ProductUpdate />} /> {/* Product Update route */}
            </Routes>
        </Router>
    );
};

export default App;