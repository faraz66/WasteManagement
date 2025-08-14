const express = require('express');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  searchProducts
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:id', getProduct);

// Protected routes - require authentication
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.get('/seller/my-products', authMiddleware, getMyProducts);

module.exports = router;
