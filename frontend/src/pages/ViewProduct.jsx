import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar'; // Import the Sidebar component

const ViewProduct = () => {
    const [products, setProducts] = useState([]); // Store all products
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch all products from the API
                const response = await axios.get('/api/products');
                console.log('Products Response:', response.data); // Log the response for debugging
                
                // Check if the response is an array before setting the state
                setProducts(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchProducts(); // Call the fetch function
    }, []); // Empty dependency array to run only once on mount

    // Show loading message while fetching data
    if (loading) {
        return <div>Loading...</div>;
    }

    // Organize products by category
    const categorizedProducts = products.reduce((acc, product) => {
        const { CategoryName } = product;
        if (!acc[CategoryName]) {
            acc[CategoryName] = []; // Create a new category array if it doesn't exist
        }
        acc[CategoryName].push(product); // Add product to the corresponding category
        return acc;
    }, {});

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content">
                <h1>Product List</h1>

                {Object.keys(categorizedProducts).map(category => (
                    <div key={category} className="product-category">
                        <h2>{category}</h2>
                        {categorizedProducts[category].length > 0 ? (
                            <ul>
                                {categorizedProducts[category].map(product => (
                                    <li key={product.id}>
                                        {product.name} <span>Quantity: {product.Quantity}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No {category} products found.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewProduct;