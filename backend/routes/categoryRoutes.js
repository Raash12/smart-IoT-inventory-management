const express = require('express');
const router = express.Router();
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');

// Route to create a category
router.post('/', createCategory);

// Route to get all categories
router.get('/', getCategories);

// Route to update a category
router.put('/:id', updateCategory);

// Route to delete a category
router.delete('/:id', deleteCategory);

module.exports = router;