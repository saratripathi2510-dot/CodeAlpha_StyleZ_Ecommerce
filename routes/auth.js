const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../database/db');

// Email regex helper
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid name (at least 2 characters).' });
    }

    if (!email || !isValidEmail(email.trim())) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check if user already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user into SQLite
    const insert = db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, 'user')
    `);
    const result = insert.run(cleanName, cleanEmail, passwordHash);

    const user = {
      id: result.lastInsertRowid,
      name: cleanName,
      email: cleanEmail,
      role: 'user'
    };

    // Store in session
    req.session.userId = user.id;

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to StyleZ.',
      user
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'An error occurred during registration. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both your email and password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Set session
    req.session.userId = user.id;

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}.`,
      user: safeUser
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'An error occurred during login. Please try again.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Unable to sign out.' });
    }
    res.clearCookie('connect.sid');
    return res.json({ success: true, message: 'You have been successfully signed out.' });
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (req.user) {
    return res.json({ authenticated: true, user: req.user });
  }
  return res.json({ authenticated: false, user: null });
});

module.exports = router;
