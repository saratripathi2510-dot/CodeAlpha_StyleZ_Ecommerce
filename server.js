require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');

const db = require('./database/db');
const { attachUser } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const checkoutRoutes = require('./routes/checkout');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;

// Logging & request parsers
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session management
app.use(session({
  name: 'stylez_session',
  secret: process.env.SESSION_SECRET || 'stylez_champagne_gold_secret_key_2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Attach logged-in user to request if session exists
app.use(attachUser);

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);

// System health check
app.get('/api/health', (req, res) => {
  try {
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    return res.json({
      status: 'online',
      name: 'StyleZ Haute Couture API',
      database: 'connected',
      users: userCount,
      products: productCount,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', error: err.message });
  }
});

// Single Page Application fallback to index.html for non-API routes
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong.' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`✨ StyleZ luxury e-commerce server running at http://localhost:${PORT}`);
  console.log(`💎 Mode: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
