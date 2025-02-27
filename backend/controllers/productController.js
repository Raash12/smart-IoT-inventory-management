const admin = require('firebase-admin');

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
    admin.initializeApp();
}

// Create a new product
exports.createProduct = async (req, res) => {
    const { name, ProductId, CategoryName, Location, Quantity, BatchDate, ExpiryDate } = req.body;

    if (!name || !ProductId || !CategoryName || !Location || Quantity === undefined || !BatchDate || !ExpiryDate) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const batchDate = new Date(BatchDate);
    const expiryDate = new Date(ExpiryDate);
    const currentDate = new Date();

    if (batchDate >= expiryDate) {
        return res.status(400).json({ message: 'BatchDate must be before ExpiryDate' });
    }

    if (batchDate < currentDate) {
        return res.status(400).json({ message: 'BatchDate cannot be in the past' });
    }

    try {
        const categorySnapshot = await admin.firestore().collection('categories')
            .where('name', '==', CategoryName)
            .limit(1)
            .get();

        let categoryId = 'defaultCategoryId'; // Set default CategoryId

        if (!categorySnapshot.empty) {
            const categoryDoc = categorySnapshot.docs[0];
            categoryId = categoryDoc.id; // Update categoryId if category exists
        }

        const productRef = await admin.firestore().collection('products').add({
            name,
            ProductId,
            CategoryName,
            Location,
            Quantity,
            BatchDate: batchDate,
            ExpiryDate: expiryDate,
        });

        res.status(201).json({ message: 'Product created successfully', id: productRef.id });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

// Get all products
exports.getProducts = async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection('products').get();
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

// Update a product
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, ProductId, CategoryName, Location, Quantity, BatchDate, ExpiryDate } = req.body;

    if (!name || !ProductId || !CategoryName || !Location || Quantity === undefined || !BatchDate || !ExpiryDate) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const batchDate = new Date(BatchDate);
    const expiryDate = new Date(ExpiryDate);
    const currentDate = new Date();

    if (batchDate >= expiryDate) {
        return res.status(400).json({ message: 'BatchDate must be before ExpiryDate' });
    }

    if (batchDate < currentDate) {
        return res.status(400).json({ message: 'BatchDate cannot be in the past' });
    }

    try {
        let categoryId = 'defaultCategoryId'; // Set default CategoryId

        // Optionally check for category existence for update
        if (CategoryName) {
            const categorySnapshot = await admin.firestore().collection('categories')
                .where('name', '==', CategoryName)
                .limit(1)
                .get();

            if (!categorySnapshot.empty) {
                const categoryDoc = categorySnapshot.docs[0];
                categoryId = categoryDoc.id; // Update categoryId if category exists
            }
        }

        const productRef = admin.firestore().collection('products').doc(id);
        await productRef.update({
            name,
            ProductId,
            CategoryName,
            Location,
            Quantity,
            BatchDate: batchDate,
            ExpiryDate: expiryDate,
        });

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};
// Get all products or filter by category
exports.getProducts = async (req, res) => {
    const { category } = req.query; // Get category from query parameters
    try {
        let query = admin.firestore().collection('products');
        if (category) {
            query = query.where('CategoryName', '==', category); // Filter by category
        }
        const snapshot = await query.get();
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};
// Delete a product
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await admin.firestore().collection('products').doc(id).delete();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};