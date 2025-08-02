const express = require('express');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware);

router.post('/add', addToCart);
router.get('/', getCart);
router.put('/items/:product_id', updateCartItem);
router.delete('/items/:product_id', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;
