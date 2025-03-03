import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { db } from '../firebase'; // Import Firestore db
import { collection, addDoc } from 'firebase/firestore';
import Sidebar from '../components/Sidebar'; // Import the Sidebar component

const Products = () => {
    const [categories, setCategories] = useState([
        { id: 1, name: 'Milk' },
        { id: 2, name: 'Perfume' },
        { id: 2, name: 'Cream' },
    ]); // Default categories

    const [product, setProduct] = useState({
        name: '',
        ProductId: '',
        CategoryName: 'Milk', // Default category
        Location: '',
        Quantity: '',
        BatchDate: '',
        ExpiryDate: '',
    });

    useEffect(() => {
        // Fetch categories from the backend
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/categories'); // Adjust the endpoint as necessary
                if (Array.isArray(response.data)) {
                    setCategories((prev) => [...prev, ...response.data]); // Add API categories if any
                } else {
                    console.error('Unexpected response format for categories:', response.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        // Uncomment if you want to fetch categories from the backend
        // fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Save product to Firestore
            await addDoc(collection(db, 'products'), product);
            alert('Product created successfully');
            setProduct({
                name: '',
                ProductId: '',
                CategoryName: 'Milk',
                Location: '',
                Quantity: '',
                BatchDate: '',
                ExpiryDate: '',
            }); // Reset form after submission
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Error creating product');
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content">
                <h1>Products</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Product ID:</label>
                        <input
                            type="text"
                            name="ProductId"
                            value={product.ProductId}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Category:</label>
                        <select
                            name="CategoryName"
                            value={product.CategoryName}
                            onChange={handleChange}
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Location:</label>
                        <input
                            type="text"
                            name="Location"
                            value={product.Location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Quantity:</label>
                        <input
                            type="number"
                            name="Quantity"
                            value={product.Quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Batch Date:</label>
                        <input
                            type="date"
                            name="BatchDate"
                            value={product.BatchDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Expiry Date:</label>
                        <input
                            type="date"
                            name="ExpiryDate"
                            value={product.ExpiryDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Create Product</button>
                </form>
            </div>
        </div>
    );
};

export default Products;