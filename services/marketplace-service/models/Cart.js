const { query } = require('../config/db');

const Cart = {
  async addItem(user_id, product_id, quantity = 1) {
    const result = await query(
      `INSERT INTO cart_items (user_id, product_id, quantity) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (user_id, product_id) 
       DO UPDATE SET quantity = cart_items.quantity + $3
       RETURNING *`,
      [user_id, product_id, quantity]
    );
    return result.rows[0];
  },

  async getCartItems(user_id) {
    const result = await query(
      `SELECT ci.*, p.name, p.price, p.image_urls, p.stock_quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1 AND p.status = 'active'
       ORDER BY ci.created_at DESC`,
      [user_id]
    );
    return result.rows;
  },

  async updateItemQuantity(user_id, product_id, quantity) {
    if (quantity <= 0) {
      return this.removeItem(user_id, product_id);
    }
    
    const result = await query(
      'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
      [quantity, user_id, product_id]
    );
    return result.rows[0];
  },

  async removeItem(user_id, product_id) {
    const result = await query(
      'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING *',
      [user_id, product_id]
    );
    return result.rows[0];
  },

  async clearCart(user_id) {
    const result = await query('DELETE FROM cart_items WHERE user_id = $1', [user_id]);
    return result.rowCount;
  },

  async getCartTotal(user_id) {
    const result = await query(
      `SELECT SUM(ci.quantity * p.price) as total
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = $1 AND p.status = 'active'`,
      [user_id]
    );
    return result.rows[0]?.total || 0;
  }
};

module.exports = Cart;
