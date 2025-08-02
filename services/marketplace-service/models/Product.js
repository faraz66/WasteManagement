const { query } = require('../config/db');

const Product = {
  async create({ name, description, price, category, seller_id, stock_quantity, image_urls }) {
    const result = await query(
      `INSERT INTO products (name, description, price, category, seller_id, stock_quantity, image_urls) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [name, description, price, category, seller_id, stock_quantity || 0, image_urls || []]
    );
    return result.rows[0];
  },

  async findAll(limit = 20, offset = 0, category = null) {
    let queryText = `
      SELECT * FROM products 
      WHERE status = 'active'
    `;
    let params = [];
    
    if (category) {
      queryText += ' AND category = $1';
      params.push(category);
      queryText += ' ORDER BY created_at DESC LIMIT $2 OFFSET $3';
      params.push(limit, offset);
    } else {
      queryText += ' ORDER BY created_at DESC LIMIT $1 OFFSET $2';
      params.push(limit, offset);
    }

    const result = await query(queryText, params);
    return result.rows;
  },

  async findById(id) {
    const result = await query('SELECT * FROM products WHERE id = $1 AND status = $2', [id, 'active']);
    return result.rows[0];
  },

  async findBySeller(seller_id) {
    const result = await query(
      'SELECT * FROM products WHERE seller_id = $1 AND status = $2 ORDER BY created_at DESC',
      [seller_id, 'active']
    );
    return result.rows;
  },

  async update(id, updates) {
    const { name, description, price, category, stock_quantity, image_urls } = updates;
    const result = await query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, category = $4, 
           stock_quantity = $5, image_urls = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND status = 'active'
       RETURNING *`,
      [name, description, price, category, stock_quantity, image_urls, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await query(
      'UPDATE products SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id',
      ['deleted', id]
    );
    return result.rows[0];
  },

  async search(searchTerm, limit = 20, offset = 0) {
    const result = await query(
      `SELECT * FROM products 
       WHERE (name ILIKE $1 OR description ILIKE $1) AND status = 'active'
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [`%${searchTerm}%`, limit, offset]
    );
    return result.rows;
  }
};

module.exports = Product;
