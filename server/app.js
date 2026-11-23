'use strict';

const express = require('express');
const cors = require('cors');
const { API_VERSION, isDbConfigured, isOriginAllowed } = require('./config');
const apiRoutes = require('./routes');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(
  cors({
    origin(origin, callback) {
      if (isOriginAllowed(origin)) return callback(null, true);
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
);

app.use(express.json({ limit: '1mb' }));

// Lokal serverdə həm /api/v1/..., həm də /v1/... işləyir.
const BASE_PATHS = ['/api/v1', '/v1'];
app.use(BASE_PATHS, apiRoutes);

app.get('/', (req, res) => {
  res.json({
    service: 'AEİK Web API',
    version: API_VERSION,
    dbConfigured: isDbConfigured(),
    baseUrl: '/api/v1',
    health: '/api/v1/health',
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint tapılmadı.',
    method: req.method,
    path: req.originalUrl,
    hint: 'Mövcud endpoint-lərin siyahısı: GET /api/v1',
  });
});

// Mərkəzi xəta emalı — bütün cavablar JSON formatındadır.
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  if (error && error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON gövdəsi düzgün formatda deyil.' });
  }

  const status = Number(error && error.status) || 500;
  if (status >= 500) {
    console.error('API xətası:', error);
  }

  return res.status(status).json({
    error: status >= 500 ? 'Serverdə gözlənilməz xəta baş verdi.' : error.message,
    ...(status >= 500 && process.env.NODE_ENV !== 'production' ? { detail: error.message } : {}),
  });
});

module.exports = app;
