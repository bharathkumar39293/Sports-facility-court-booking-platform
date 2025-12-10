const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const DEBUG = process.env.DEBUG_AUTH === 'true';
  try {
    const authHeader = req.headers.authorization;
    if (DEBUG) console.log('[authMiddleware] Authorization header:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      if (DEBUG) console.log('[authMiddleware] No token provided');
      return res.status(401).json({ ok: false, message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
      if (DEBUG) console.log('[authMiddleware] Decoded token:', decoded);
    } catch (e) {
      if (DEBUG) console.log('[authMiddleware] Token verify failed:', e.message);
      return res.status(401).json({ ok: false, message: 'Invalid token' });
    }

    // Load fresh user from DB to ensure role and status are up-to-date
    const user = await User.findById(decoded.id).select('role');
    if (DEBUG) console.log('[authMiddleware] DB user role:', user ? user.role : null);
    if (!user) return res.status(401).json({ ok: false, message: 'Invalid token (user not found)' });

    req.user = { id: decoded.id, role: user.role };
    next();
  } catch (err) {
    if (DEBUG) console.error('[authMiddleware] Error:', err);
    return res.status(401).json({ ok: false, message: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  const DEBUG = process.env.DEBUG_AUTH === 'true';
  if (DEBUG) console.log('[adminMiddleware] req.user:', req.user);
  if (!req.user) return res.status(401).json({ ok: false, message: 'Not authenticated' });
  if (req.user.role !== 'admin') {
    if (DEBUG) console.log('[adminMiddleware] Forbidden - role is not admin');
    return res.status(403).json({ ok: false, message: 'Forbidden' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
