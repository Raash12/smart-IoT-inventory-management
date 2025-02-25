// ViewCategories.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Ensure this imports your Firestore configuration
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';

const ViewCategories = ({ onEdit }) => {
    const [categories, setCategories] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch categories from Firestore
    const fetchCategories = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'categories'));
            const categoriesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCategories(categoriesList);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchCategories(); // Call the fetch function when the component mounts
    }, []);

    // Handle category deletion
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                const categoryRef = doc(db, 'categories', id);
                await deleteDoc(categoryRef);
                fetchCategories(); // Refresh the category list
                setSuccessMessage('Category deleted successfully!');
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            } catch (error) {
                console.error('Error deleting category:', error);
            }
        }
    };

    return (
        <div>
            <h1>Categories</h1>
            {successMessage && <div className="success-message">{successMessage}</div>}
            <ul>
                {Array.isArray(categories) && categories.map((category) => (
                    <li key={category.id}>
                        {category.name} - {category.description}
                        <button onClick={() => onEdit(category)}>Edit</button>
                        <button onClick={() => handleDelete(category.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewCategories;