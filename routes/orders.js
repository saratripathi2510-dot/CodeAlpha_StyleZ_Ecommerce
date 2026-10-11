const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAuth } = require('../middleware/auth');

// GET /api/orders - Get all orders for the authenticated user
router.get('/', requireAuth, (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT * FROM orders 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(req.user.id);

    const getItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?');

    const ordersWithItems = orders.map(order => ({
      ...order,
      items: getItems.all(order.id)
    }));

    return res.json({
      orders: ordersWithItems
    });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    return res.status(500).json({ error: 'Failed to retrieve order history.' });
  }
});

// GET /api/orders/:orderNumber - Get single order details
router.get('/:orderNumber', (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = db.prepare('SELECT * FROM orders WHERE order_number = ?').get(orderNumber);

    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    // Access control: if order has user_id, check that requester is either owner or matching email
    if (order.user_id && (!req.user || req.user.id !== order.user_id)) {
      return res.status(403).json({ error: 'Access denied to this order receipt.' });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

    return res.json({
      order,
      items
    });
  } catch (err) {
    console.error('Error fetching order:', err);
    return res.status(500).json({ error: 'Failed to retrieve order details.' });
  }
});

module.exports = router;
