import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar'; // Import the Sidebar component

const ViewProduct = () => {
    const [products, setProducts] = useState([]); // Initialize as an empty array
    const [selectedProduct, setSelectedProduct] = useState(null); // Store selected product for updating
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products'); // Ensure this URL is correct
                if (Array.isArray(response.data)) {
                    setProducts(response.data); // Set products if response is an array
                } else {
                    console.error('Unexpected response format:', response.data);
                    setProducts([]); // Set to empty array if not as expected
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]); // Set to empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchProducts(); // Call the fetch function
    }, []);

    const handleEdit = (product) => {
        setSelectedProduct(product); // Set selected product for editing
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`); // Call delete API
            setProducts(products.filter(product => product.id !== id)); // Remove deleted product from state
            alert('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/products/${selectedProduct.id}`, selectedProduct); // Update product API call
            setProducts(products.map(product => (
                product.id === selectedProduct.id ? selectedProduct : product
            )));
            alert('Product updated successfully');
            setSelectedProduct(null); // Reset selected product
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product');
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Loading message
    }

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content">
                <h1>Product List</h1>

                {Array.isArray(products) && products.length > 0 ? (
                    products.map(product => (
                        <div key={product.id} className="product-container">
                            <h3>{product.name}</h3>
                            <p><strong>Product ID:</strong> {product.ProductId}</p>
                            <p><strong>Category:</strong> {product.CategoryName}</p>
                            <p><strong>Location:</strong> {product.Location}</p>
                            <p><strong>Quantity:</strong> {product.Quantity}</p>
                            <p><strong>Batch Date:</strong> {new Date(product.BatchDate).toLocaleDateString()}</p>
                            <p><strong>Expiry Date:</strong> {new Date(product.ExpiryDate).toLocaleDateString()}</p>
                            <button onClick={() => handleEdit(product)}>Edit</button>
                            <button onClick={() => handleDelete(product.id)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No products found.</p>
                )}

                {selectedProduct && (
                    <form onSubmit={handleUpdate}>
                        <h2>Edit Product</h2>
                        <div>
                            <label>Name:</label>
                            <input
                                type="text"
                                value={selectedProduct.name}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Product ID:</label>
                            <input
                                type="text"
                                value={selectedProduct.ProductId}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, ProductId: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Category:</label>
                            <input
                                type="text"
                                value={selectedProduct.CategoryName}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, CategoryName: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Location:</label>
                            <input
                                type="text"
                                value={selectedProduct.Location}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, Location: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Quantity:</label>
                            <input
                                type="number"
                                value={selectedProduct.Quantity}
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, Quantity: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Batch Date:</label>
                            <input
                                type="date"
                                value={selectedProduct.BatchDate.split('T')[0]} // Convert to YYYY-MM-DD format
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, BatchDate: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Expiry Date:</label>
                            <input
                                type="date"
                                value={selectedProduct.ExpiryDate.split('T')[0]} // Convert to YYYY-MM-DD format
                                onChange={(e) => setSelectedProduct({ ...selectedProduct, ExpiryDate: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit">Update Product</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ViewProduct;