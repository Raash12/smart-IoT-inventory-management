const admin = require('firebase-admin');

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
    admin.initializeApp();
}

// Create a new category
exports.createCategory = async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
    }

    try {
        const existingCategorySnapshot = await admin.firestore().collection('categories')
            .where('name', '==', name)
            .limit(1)
            .get();

        if (!existingCategorySnapshot.empty) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const categoryRef = await admin.firestore().collection('categories').add({
            name,
            description,
        });

        res.status(201).json({ message: 'Category created successfully', id: categoryRef.id });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection('categories').get();
        const categories = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
    }

    try {
        const categoryRef = admin.firestore().collection('categories').doc(id);
        await categoryRef.update({ name, description });

        res.json({ message: 'Category updated successfully' });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        await admin.firestore().collection('categories').doc(id).delete();
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};