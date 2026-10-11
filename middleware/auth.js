const db = require('../database/db');

function attachUser(req, res, next) {
  if (req.session && req.session.userId) {
    try {
      const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.session.userId);
      if (user) {
        req.user = user;
      } else {
        delete req.session.userId;
      }
    } catch (err) {
      console.error('Error fetching session user:', err);
    }
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId || !req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please sign in to your StyleZ account to proceed.' 
    });
  }
  next();
}

module.exports = {
  attachUser,
  requireAuth
};
