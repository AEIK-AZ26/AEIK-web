'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

const ROLES = ['owner', 'admin', 'member'];
const EDITOR_ROLES = ['owner', 'admin'];

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

function verifyPassword(password, hashed) {
  if (!hashed) return Promise.resolve(false);
  return bcrypt.compare(password, hashed);
}

/** Mövcud Next.js tokeni ilə eyni payload — tokenlər qarşılıqlı işləyir. */
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (_) {
    return null;
  }
}

function readBearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

function requireAuth(req, res, next) {
  const token = readBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Giriş edilməyib. Authorization: Bearer <token> tələb olunur.' });
  }
  const user = verifyToken(token);
  if (!user || !user.userId) {
    return res.status(401).json({ error: 'Token etibarsızdır və ya vaxtı bitib.' });
  }
  req.user = { userId: String(user.userId), email: user.email, role: user.role };
  return next();
}

/** Token varsa istifadəçini oxuyur, yoxdursa davam edir (ictimai endpoint-lər üçün). */
function optionalAuth(req, _res, next) {
  const token = readBearerToken(req);
  if (token) {
    const user = verifyToken(token);
    if (user && user.userId) {
      req.user = { userId: String(user.userId), email: user.email, role: user.role };
    }
  }
  return next();
}

function requireRole(...roles) {
  const allowed = roles.flat();
  return function roleGuard(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: 'Giriş edilməyib.' });
    }
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ error: 'Bu əməliyyat üçün icazəniz yoxdur.' });
    }
    return next();
  };
}

const requireEditor = requireRole(EDITOR_ROLES);

function publicUser(user) {
  return {
    uid: String(user._id || user.uid || ''),
    email: user.email,
    displayName: user.displayName,
    department: user.department,
    role: user.role,
    createdAt: user.createdAt,
  };
}

module.exports = {
  EDITOR_ROLES,
  ROLES,
  hashPassword,
  optionalAuth,
  publicUser,
  requireAuth,
  requireEditor,
  requireRole,
  signToken,
  verifyPassword,
  verifyToken,
};
