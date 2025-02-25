const admin = require('firebase-admin');

// Create a new product
exports.createProduct = async (req, res) => {
    const { name, ProductId, CategoryName, Location, Quantity, BatchDate, ExpiryDate } = req.body;

    // Validate required fields
    if (!name || !ProductId || !CategoryName || !Location || Quantity === undefined || !BatchDate || !ExpiryDate) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Ensure dates are valid
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
        // Fetch the category by name
        const categorySnapshot = await admin.firestore().collection('categories')
            .where('name', '==', CategoryName)
            .limit(1)
            .get();

        if (categorySnapshot.empty) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const categoryDoc = categorySnapshot.docs[0]; // Get the first matching category
        const categoryId = categoryDoc.id; // Get the category's ID

        const productRef = await admin.firestore().collection('products').add({
            name,
            ProductId,
            CategoryId: categoryId, // Now using CategoryId
            CategoryName,  // Add category name
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

    try {
        // Fetch the category by name
        const categorySnapshot = await admin.firestore().collection('categories')
            .where('name', '==', CategoryName)
            .limit(1)
            .get();

        if (categorySnapshot.empty) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const categoryDoc = categorySnapshot.docs[0]; // Get the first matching category
        const categoryId = categoryDoc.id; // Get the category's ID

        const productRef = admin.firestore().collection('products').doc(id);
        await productRef.update({
            name,
            ProductId,
            CategoryId: categoryId, // Now using CategoryId
            CategoryName,  // Update category name
            Location,
            Quantity,
            BatchDate,
            ExpiryDate,
        });
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await admin.firestore().collection('products').doc(id).delete();
        res.json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};