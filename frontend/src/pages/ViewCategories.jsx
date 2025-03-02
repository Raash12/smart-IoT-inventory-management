import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Ensure this imports your Firestore configuration
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Sidebar from '../components/Sidebar';

const ViewCategories = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const fetchCategories = async () => {
        try {
            const categoriesCollection = collection(db, 'categories');
            const categorySnapshot = await getDocs(categoriesCollection);
            const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCategories(categoryList);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setName(category.name);
        setDescription(category.description);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (selectedCategory) {
            try {
                const categoryRef = doc(db, 'categories', selectedCategory.id);
                await updateDoc(categoryRef, { name, description });
                setSuccessMessage('Category updated successfully!');
                setSelectedCategory(null);
                setName('');
                setDescription('');
                fetchCategories();
                setTimeout(() => setSuccessMessage(''), 3000);
            } catch (error) {
                console.error('Error updating category:', error);
                alert('Error updating category: ' + error.message);
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            const categoryRef = doc(db, 'categories', id);
            await deleteDoc(categoryRef);
            fetchCategories();
            alert('Category deleted successfully!');
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Error deleting category: ' + error.message);
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

                <h2>Category List</h2>
                <ul>
                    {categories.map(category => (
                        <li key={category.id}>
                            <h3>{category.name}</h3>
                            <p>{category.description}</p>
                            <button onClick={() => handleEdit(category)}>Edit</button>
                            <button onClick={() => handleDelete(category.id)}>Delete</button>
                        </li>
                    ))}
                </ul>

                {selectedCategory && (
                    <form onSubmit={handleUpdate}>
                        <h2>Edit Category</h2>
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
                        <button type="submit">Update Category</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ViewCategories;