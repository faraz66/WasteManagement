const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock_quantity, image_urls } = req.body;
    const seller_id = req.user.id; // From auth middleware

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      seller_id,
      stock_quantity,
      image_urls
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const offset = (page - 1) * limit;

    const products = await Product.findAll(parseInt(limit), parseInt(offset), category);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: products.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock_quantity, image_urls } = req.body;
    
    // Check if product exists and belongs to the seller
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (existingProduct.seller_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updatedProduct = await Product.update(id, {
      name,
      description,
      price,
      category,
      stock_quantity,
      image_urls
    });

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if product exists and belongs to the seller
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (existingProduct.seller_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await Product.delete(id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const seller_id = req.user.id;
    const products = await Product.findBySeller(seller_id);

    res.json({ products });
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const offset = (page - 1) * limit;
    const products = await Product.search(q, parseInt(limit), parseInt(offset));

    res.json({
      products,
      query: q,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: products.length === parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
