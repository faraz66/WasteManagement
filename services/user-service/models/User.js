const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async create({ username, email, password, user_type }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (username, email, password_hash, user_type) VALUES ($1, $2, $3, $4) RETURNING id, username, email, user_type, created_at',
      [username, email, hashedPassword, user_type]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async findById(id) {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  },

  async updateProfile(id, updates) {
    const { username } = updates;
    const result = await query(
      'UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, email, user_type, created_at',
      [username, id]
    );
    return result.rows[0];
  }
};

module.exports = User;
