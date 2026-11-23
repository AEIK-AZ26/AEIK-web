'use strict';

const express = require('express');
const { API_VERSION, isDbConfigured } = require('../config');
const { getDb } = require('../db');
const { RESOURCES } = require('../collections');
const createCrudRouter = require('./crud');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const dataRoutes = require('./data');

const router = express.Router();

// GET /api/v1 — endpoint siyahısı
router.get('/', (req, res) => {
  res.json({
    service: 'AEİK Web API',
    version: API_VERSION,
    docs: 'server/README.md',
    endpoints: {
      health: 'GET /health',
      auth: ['POST /auth/register', 'POST /auth/login', 'GET /auth/me'],
      users: ['GET /users', 'POST /users', 'PATCH /users/:id', 'DELETE /users/:id'],
      data: ['GET /data', 'POST /sync'],
      resources: Object.keys(RESOURCES).map((name) => ({
        name,
        base: `/${name}`,
        methods: ['GET', 'GET /:id', 'POST', 'PATCH /:id', 'PUT /:id', 'DELETE /:id'],
      })),
    },
  });
});

// GET /api/v1/health — baza vəziyyəti ilə birlikdə
router.get('/health', async (req, res) => {
  const configured = isDbConfigured();
  let connected = false;

  if (configured) {
    const db = await getDb();
    if (db) {
      try {
        await db.command({ ping: 1 });
        connected = true;
      } catch (_) {
        connected = false;
      }
    }
  }

  res.status(configured && !connected ? 503 : 200).json({
    status: connected ? 'ok' : configured ? 'degraded' : 'ok',
    service: 'aeik-api',
    version: API_VERSION,
    db: { configured, connected },
    uptime: Math.round(process.uptime()),
    time: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use(dataRoutes);
router.use('/public', require('./public'));

for (const [name, resource] of Object.entries(RESOURCES)) {
  router.use(`/${name}`, createCrudRouter(name, resource));
}

module.exports = router;
