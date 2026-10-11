const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Helper to safely parse JSON strings from SQLite
const parseProductJson = (p) => {
  if (!p) return null;
  return {
    ...p,
    details: p.details ? JSON.parse(p.details) : [],
    images: p.images ? JSON.parse(p.images) : [],
    sizes: p.sizes ? JSON.parse(p.sizes) : [],
    colors: p.colors ? JSON.parse(p.colors) : []
  };
};

// GET /api/categories
router.get('/categories', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.id ASC
    `).all();

    return res.json({ categories });
  } catch (err) {
    console.error('Error fetching categories:', err);
    return res.status(500).json({ error: 'Failed to retrieve categories.' });
  }
});

// GET /api/products
router.get('/', (req, res) => {
  try {
    const { category, q, minPrice, maxPrice, sort, featured, limit } = req.query;

    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    // Category filter (slug or id)
    if (category && category !== 'all') {
      query += ` AND (c.slug = ? OR c.id = ?)`;
      params.push(category, category);
    }

    // Search query
    if (q && q.trim()) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ? OR p.badge LIKE ?)`;
      const term = `%${q.trim()}%`;
      params.push(term, term, term);
    }

    // Price range
    if (minPrice && !isNaN(Number(minPrice))) {
      query += ` AND p.price >= ?`;
      params.push(Number(minPrice));
    }
    if (maxPrice && !isNaN(Number(maxPrice))) {
      query += ` AND p.price <= ?`;
      params.push(Number(maxPrice));
    }

    // Featured only
    if (featured === 'true' || featured === '1') {
      query += ` AND p.featured = 1`;
    }

    // Sort order
    switch (sort) {
      case 'price_asc':
        query += ` ORDER BY p.price ASC`;
        break;
      case 'price_desc':
        query += ` ORDER BY p.price DESC`;
        break;
      case 'rating':
        query += ` ORDER BY p.rating DESC, p.review_count DESC`;
        break;
      case 'newest':
        query += ` ORDER BY p.created_at DESC`;
        break;
      case 'featured':
      default:
        query += ` ORDER BY p.featured DESC, p.id ASC`;
        break;
    }

    // Optional limit
    if (limit && !isNaN(Number(limit))) {
      query += ` LIMIT ?`;
      params.push(Number(limit));
    }

    const rows = db.prepare(query).all(...params);
    const products = rows.map(parseProductJson);

    return res.json({ products, total: products.length });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ error: 'Failed to retrieve products.' });
  }
});

// GET /api/products/:idOrSlug
router.get('/:idOrSlug', (req, res) => {
  try {
    const { idOrSlug } = req.params;

    let product;
    if (!isNaN(Number(idOrSlug))) {
      product = db.prepare(`
        SELECT p.*, c.name as category_name, c.slug as category_slug
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = ?
      `).get(Number(idOrSlug));
    } else {
      product = db.prepare(`
        SELECT p.*, c.name as category_name, c.slug as category_slug
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.slug = ?
      `).get(idOrSlug);
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const parsedProduct = parseProductJson(product);

    // Fetch up to 4 related products from the same category
    const relatedRows = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ? AND p.id != ?
      LIMIT 4
    `).all(product.category_id, product.id);

    const related = relatedRows.map(parseProductJson);

    return res.json({
      product: parsedProduct,
      related
    });
  } catch (err) {
    console.error('Error fetching product details:', err);
    return res.status(500).json({ error: 'Failed to retrieve product details.' });
  }
});

module.exports = router;
