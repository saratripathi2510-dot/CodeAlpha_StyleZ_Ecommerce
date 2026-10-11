const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Helper to generate unique order number
function generateOrderNumber() {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `STZ-${year}-${randomSuffix}`;
}

// POST /api/checkout
router.post('/', (req, res) => {
  try {
    const { items, customer, paymentMethod } = req.body;

    // Validate customer info
    if (!customer || !customer.name || !customer.email || !customer.shippingAddress || !customer.city || !customer.postalCode) {
      return res.status(400).json({
        error: 'Missing shipping details',
        message: 'Please complete all required shipping fields (Name, Email, Address, City, Postal Code).'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Cart is empty',
        message: 'Your shopping bag is empty. Please add items before checking out.'
      });
    }

    // Server-side calculation & stock validation
    const validatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const productId = Number(item.productId);
      const qty = parseInt(item.quantity, 10);

      if (!productId || isNaN(qty) || qty <= 0) {
        return res.status(400).json({
          error: 'Invalid cart item',
          message: 'One or more items in your cart contains invalid product or quantity data.'
        });
      }

      const product = db.prepare('SELECT id, name, price, stock, images FROM products WHERE id = ?').get(productId);

      if (!product) {
        return res.status(400).json({
          error: 'Product unavailable',
          message: `Product ID #${productId} is no longer available in our collection.`
        });
      }

      if (product.stock < qty) {
        return res.status(400).json({
          error: 'Insufficient stock',
          message: `Apologies, only ${product.stock} units of "${product.name}" are currently available in our atelier.`
        });
      }

      let primaryImage = '';
      try {
        const images = JSON.parse(product.images);
        primaryImage = Array.isArray(images) && images.length > 0 ? images[0] : '';
      } catch (e) {
        primaryImage = '';
      }

      const itemSubtotal = Math.round(product.price * qty * 100) / 100;
      subtotal += itemSubtotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: qty,
        size: item.size || 'Standard',
        color: item.color || 'Original',
        image: primaryImage,
        subtotal: itemSubtotal
      });
    }

    subtotal = Math.round(subtotal * 100) / 100;

    // Complimentary shipping above $300, else $25 flat rate
    const shippingFee = subtotal >= 300 ? 0.00 : 25.00;
    // Estimated tax (8%)
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + shippingFee + tax) * 100) / 100;

    const orderNumber = generateOrderNumber();
    const userId = req.user ? req.user.id : null;
    const selectedPayment = paymentMethod || 'Demo Card (Instant Approval)';

    // Execute atomic SQLite transaction
    const placeOrderTransaction = db.transaction(() => {
      // 1. Decrement stock
      const decrementStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
      for (const item of validatedItems) {
        decrementStock.run(item.quantity, item.productId);
      }

      // 2. Insert order
      const insertOrder = db.prepare(`
        INSERT INTO orders (
          order_number, user_id, customer_name, customer_email, customer_phone,
          shipping_address, city, postal_code, country, subtotal, shipping_fee, tax,
          total, status, payment_method, created_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?, datetime('now')
        )
      `);

      const orderResult = insertOrder.run(
        orderNumber,
        userId,
        customer.name.trim(),
        customer.email.trim().toLowerCase(),
        customer.phone ? customer.phone.trim() : null,
        customer.shippingAddress.trim(),
        customer.city.trim(),
        customer.postalCode.trim(),
        customer.country ? customer.country.trim() : 'United States',
        subtotal,
        shippingFee,
        tax,
        total,
        selectedPayment
      );

      const orderId = orderResult.lastInsertRowid;

      // 3. Insert order items
      const insertOrderItem = db.prepare(`
        INSERT INTO order_items (
          order_id, product_id, product_name, product_image, price, quantity, size, color, subtotal
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
      `);

      for (const item of validatedItems) {
        insertOrderItem.run(
          orderId,
          item.productId,
          item.name,
          item.image,
          item.price,
          item.quantity,
          item.size,
          item.color,
          item.subtotal
        );
      }

      return { orderId, orderNumber };
    });

    const transactionResult = placeOrderTransaction();

    // Fetch the inserted order for confirmation response
    const placedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(transactionResult.orderId);
    const placedItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(transactionResult.orderId);

    return res.status(201).json({
      success: true,
      message: 'Your couture order has been successfully placed.',
      order: placedOrder,
      items: placedItems,
      demoNotice: 'Notice: This is a demonstration purchase. No real credit card was charged.'
    });

  } catch (err) {
    console.error('Checkout processing error:', err);
    return res.status(500).json({
      error: 'Checkout failed',
      message: 'A server error occurred while processing your order. Please try again.'
    });
  }
});

module.exports = router;
