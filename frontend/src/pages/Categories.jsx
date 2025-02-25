import React, { useState } from 'react';
import { db } from '../firebase'; // Ensure this imports your Firestore configuration
import { collection, addDoc } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';
const Categories = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create new category
            await addDoc(collection(db, 'categories'), { name, description });
            setSuccessMessage('Category created successfully!');
            setName('');
            setDescription('');
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error saving category:', error.message);
            alert('Error saving category: ' + error.message);
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar />
            <div className="dashboard-content">
                <h1>Categories</h1>
                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <input 
                            type="text" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit">Create Category</button>
                </form>
            </div>
        </div>
    );
};

export default Categories;