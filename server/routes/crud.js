'use strict';

const express = require('express');
const { getDb, sendDbUnavailable } = require('../db');
const { requireAuth, requireEditor } = require('../auth');
const { ApiError, makeId, pickFields, toInt, toPlain, wrap } = require('../utils');

/**
 * Bir kolleksiya üçün standart REST CRUD route-ları.
 *   GET    /            — siyahı (?limit, ?skip, ?<sahə>=dəyər)
 *   GET    /:id         — tək sənəd
 *   POST   /            — yaratmaq
 *   PATCH  /:id         — qismən yeniləmə
 *   PUT    /:id         — upsert (id ilə)
 *   DELETE /:id         — silmək
 */
module.exports = function createCrudRouter(name, resource) {
  const { collection, fields, idField, cascade = [], idPrefix = name.slice(0, 2), sort = { ts: -1 } } = resource;
  const router = express.Router();

  router.use(requireAuth);

  router.get(
    '/',
    wrap(async (req, res) => {
      const db = await getDb();
      if (!db) return sendDbUnavailable(res);

      const filter = {};
      for (const field of fields) {
        const value = req.query[field];
        if (field !== idField && typeof value === 'string' && value !== '') {
          filter[field] = value;
        }
      }

      const limit = Math.min(Math.max(toInt(req.query.limit, 200), 1), 500);
      const skip = Math.max(toInt(req.query.skip, 0), 0);

      const docs = await db
        .collection(collection)
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray();

      res.json({ data: docs.map(toPlain), count: docs.length });
    })
  );

  router.get(
    '/:id',
    wrap(async (req, res) => {
      const db = await getDb();
      if (!db) return sendDbUnavailable(res);

      const doc = await db.collection(collection).findOne({ [idField]: req.params.id });
      if (!doc) throw new ApiError(404, 'Qeyd tapılmadı.');
      res.json({ data: toPlain(doc) });
    })
  );

  router.post(
    '/',
    requireEditor,
    wrap(async (req, res) => {
      const db = await getDb();
      if (!db) return sendDbUnavailable(res);

      const doc = pickFields(req.body, fields);
      doc[idField] = doc[idField] || makeId(idPrefix);
      if (fields.includes('ts') && doc.ts === undefined) doc.ts = Date.now();

      try {
        await db.collection(collection).insertOne(doc);
      } catch (error) {
        if (error && error.code === 11000) {
          throw new ApiError(409, `Bu ${idField} ilə qeyd artıq mövcuddur.`);
        }
        throw error;
      }

      res.status(201).json({ data: toPlain(doc) });
    })
  );

  router.patch(
    '/:id',
    requireEditor,
    wrap(async (req, res) => {
      const db = await getDb();
      if (!db) return sendDbUnavailable(res);

      const update = pickFields(req.body, fields);
      delete update[idField];

      const result = await db.collection(collection).updateOne({ [idField]: req.params.id }, { $set: update });
      if (result.matchedCount === 0) throw new ApiError(404, 'Qeyd tapılmadı.');

      const doc = await db.collection(collection).findOne({ [idField]: req.params.id });
      res.json({ data: toPlain(doc) });
    })
  );

  router.put(
    '/:id',
    requireEditor,
    wrap(async (req, res) => {
      const db = await getDb();
      if (!db) return sendDbUnavailable(res);

      const doc = pickFields(req.body, fields);
      doc[idField] = req.params.id;
      if (fields.includes('ts') && doc.ts === undefined) doc.ts = Date.now();

      await db.collection(collection).updateOne({ [idField]: req.params.id }, { $set: doc }, { upsert: true });
      const saved = await db.collection(collection).findOne({ [idField]: req.params.id });
      res.json({ data: toPlain(saved) });
    })
  );

  router.delete(
    '/:id',
    requireEditor,
    wrap(async (req, res) => {
      const db = await getDb();
      if (!db) return sendDbUnavailable(res);

      const result = await db.collection(collection).deleteOne({ [idField]: req.params.id });
      if (result.deletedCount === 0) throw new ApiError(404, 'Qeyd tapılmadı.');

      for (const rule of cascade) {
        await db.collection(rule.collection).deleteMany({ [rule.field]: req.params.id });
      }

      res.json({ success: true, deleted: req.params.id });
    })
  );

  return router;
};
