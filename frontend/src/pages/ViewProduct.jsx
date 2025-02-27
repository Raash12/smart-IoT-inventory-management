import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar'; // Import the Sidebar component

const ViewProduct = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/api/products/${id}`); // Fetch the product
                setProduct(response.data);

                // Fetch the category based on CategoryName
                const categoryResponse = await axios.get(`/api/categories/${response.data.CategoryName}`);
                setCategory(categoryResponse.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content">
                <h1>{category ? category.name : 'Category'} Details</h1>
                <div className="product-container">
                    <h2>{product.name}</h2>
                    <p><strong>Product ID:</strong> {product.ProductId}</p>
                    <p><strong>Category:</strong> {product.CategoryName}</p>
                    <p><strong>Location:</strong> {product.Location}</p>
                    <p><strong>Quantity:</strong> {product.Quantity}</p>
                    <p><strong>Batch Date:</strong> {new Date(product.BatchDate).toLocaleDateString()}</p>
                    <p><strong>Expiry Date:</strong> {new Date(product.ExpiryDate).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default ViewProduct;