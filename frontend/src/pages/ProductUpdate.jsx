import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate instead of useHistory
import Sidebar from '../components/Sidebar'; // Import the Sidebar component

const ProductUpdate = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null); // Initialize product state
    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate(); // Hook to navigate programmatically

    // Fetch the product details
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct(); // Call the fetch function
    }, [id]);

    // Handle updating a product
    const handleUpdate = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            await axios.put(`http://localhost:5000/api/products/${id}`, product);
            alert('Product updated successfully');
            navigate('/view-products'); // Redirect back to the product list using navigate
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product');
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Loading message
    }

    if (!product) {
        return <div>Product not found.</div>; // Handle case where product is not found
    }

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content">
                <h2>Edit Product</h2>
                <form onSubmit={handleUpdate}>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={product.name}
                            onChange={(e) => setProduct({ ...product, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>Product ID:</label>
                        <input
                            type="text"
                            value={product.ProductId}
                            onChange={(e) => setProduct({ ...product, ProductId: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>Category:</label>
                        <input
                            type="text"
                            value={product.CategoryName}
                            onChange={(e) => setProduct({ ...product, CategoryName: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>Location:</label>
                        <input
                            type="text"
                            value={product.Location}
                            onChange={(e) => setProduct({ ...product, Location: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>Quantity:</label>
                        <input
                            type="number"
                            value={product.Quantity}
                            onChange={(e) => setProduct({ ...product, Quantity: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>Batch Date:</label>
                        <input
                            type="date"
                            value={product.BatchDate.split('T')[0]} // Convert to YYYY-MM-DD format
                            onChange={(e) => setProduct({ ...product, BatchDate: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>Expiry Date:</label>
                        <input
                            type="date"
                            value={product.ExpiryDate.split('T')[0]} // Convert to YYYY-MM-DD format
                            onChange={(e) => setProduct({ ...product, ExpiryDate: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit">Update Product</button>
                </form>
            </div>
        </div>
    );
};

export default ProductUpdate;