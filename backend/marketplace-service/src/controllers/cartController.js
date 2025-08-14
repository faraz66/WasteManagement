const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const user_id = req.user.id;

    if (!product_id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists and is available
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const cartItem = await Cart.addItem(user_id, product_id, quantity);

    res.status(201).json({
      message: 'Item added to cart successfully',
      cartItem
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    const cartItems = await Cart.getCartItems(user_id);
    const total = await Cart.getCartTotal(user_id);

    res.json({
      cartItems,
      total: parseFloat(total) || 0,
      itemCount: cartItems.length
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { quantity } = req.body;
    const user_id = req.user.id;

    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    if (quantity > 0) {
      // Check stock availability
      const product = await Product.findById(product_id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (product.stock_quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
    }

    const updatedItem = await Cart.updateItemQuantity(user_id, product_id, quantity);

    if (!updatedItem && quantity > 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({
      message: quantity === 0 ? 'Item removed from cart' : 'Cart item updated successfully',
      cartItem: updatedItem
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { product_id } = req.params;
    const user_id = req.user.id;

    const removedItem = await Cart.removeItem(user_id, product_id);

    if (!removedItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    const removedCount = await Cart.clearCart(user_id);

    res.json({
      message: 'Cart cleared successfully',
      removedItems: removedCount
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
