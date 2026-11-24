'use strict';

const express = require('express');
const { getDb, sendDbUnavailable } = require('../db');
const { wrap } = require('../utils');

/**
 * Auth tələb etməyən oxu endpoint-ləri — gələcəkdə landing səhifəsi
 * məlumatları birbaşa buradan oxuyacaq.
 */
const router = express.Router();

// GET /api/v1/public/projects — böyük layihələr (ictimai)
router.get(
  '/projects',
  wrap(async (req, res) => {
    const db = await getDb();
    if (!db) return sendDbUnavailable(res);

    const filter = {};
    if (typeof req.query.type === 'string' && req.query.type !== '') filter.type = req.query.type;
    if (typeof req.query.stage === 'string' && req.query.stage !== '') filter.stage = req.query.stage;

    const docs = await db
      .collection('projects')
      .find(filter, { projection: { _id: 0, __v: 0 } })
      .sort({ ts: 1 })
      .limit(100)
      .toArray();

    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({ data: docs, count: docs.length });
  })
);

// GET /api/v1/public/members — idarə heyəti siyahısı (ictimai)
router.get(
  '/members',
  wrap(async (req, res) => {
    const db = await getDb();
    if (!db) return sendDbUnavailable(res);

    const docs = await db
      .collection('members')
      .find({}, { projection: { _id: 0, __v: 0 } })
      .sort({ ts: 1 })
      .limit(200)
      .toArray();

    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({ data: docs, count: docs.length });
  })
);

// GET /api/v1/public/content — ana səhifə məzmunu (yalnız dərc olunmuşlar)
router.get(
  '/content',
  wrap(async (req, res) => {
    const db = await getDb();
    if (!db) return res.status(503).json({ connected: false, data: [], message: 'MongoDB konfiqurasiya edilməyib.' });

    const filter = { status: { $ne: 'draft' } };
    if (typeof req.query.sec === 'string' && req.query.sec !== '') filter.sec = req.query.sec;

    const docs = await db
      .collection('sitecontents')
      .find(filter, { projection: { _id: 0, __v: 0 } })
      .sort({ order: 1, ts: -1 })
      .limit(300)
      .toArray();

    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({ connected: true, data: docs, count: docs.length });
  })
);

module.exports = router;
