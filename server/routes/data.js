'use strict';

const express = require('express');
const { getDb, sendDbUnavailable } = require('../db');
const { requireAuth, requireEditor } = require('../auth');
const { BULK_KEYS } = require('../collections');
const { ApiError, pickFields, wrap } = require('../utils');

const router = express.Router();

async function toRecordMap(db, collectionName, idField) {
  const docs = await db.collection(collectionName).find({}).toArray();
  const map = {};
  for (const doc of docs) {
    const id = doc[idField];
    const plain = { ...doc };
    delete plain._id;
    delete plain.__v;
    map[id] = plain;
  }
  return map;
}

// GET /api/v1/data — kabinet üçün bütün məlumat bir cavabda
router.get(
  '/data',
  requireAuth,
  wrap(async (req, res) => {
    const db = await getDb();
    if (!db) return res.status(503).json({ connected: false, message: 'MongoDB konfiqurasiya edilməyib.' });

    const [members, projects, events, att, links, items] = await Promise.all([
      toRecordMap(db, 'members', 'id'),
      toRecordMap(db, 'projects', 'id'),
      toRecordMap(db, 'events', 'id'),
      toRecordMap(db, 'attendance', 'key'),
      toRecordMap(db, 'links', 'linkId'),
      toRecordMap(db, 'items', 'id'),
    ]);

    res.json({
      connected: true,
      data: {
        [BULK_KEYS.members]: members,
        [BULK_KEYS.projects]: projects,
        [BULK_KEYS.events]: events,
        [BULK_KEYS.attendance]: att,
        [BULK_KEYS.links]: links,
        [BULK_KEYS.items]: items,
      },
    });
  })
);

const SYNC_TARGETS = {
  members: { collection: 'members', idField: 'id' },
  att: { collection: 'attendance', idField: 'key' },
  projects: { collection: 'projects', idField: 'id' },
  events: { collection: 'events', idField: 'id' },
  links: { collection: 'links', idField: 'linkId' },
  items: { collection: 'items', idField: 'id' },
};

// POST /api/v1/sync — mövcud kabinet sinxronizasiyası ilə uyğun format
// body: { entity, action: 'save' | 'delete', id, data }
router.post(
  '/sync',
  requireAuth,
  requireEditor,
  wrap(async (req, res) => {
    const { entity, action, id, data } = req.body || {};
    const target = SYNC_TARGETS[entity];
    if (!target) throw new ApiError(400, 'Naməlum obyekt növü.');
    if (typeof id !== 'string' || id === '') throw new ApiError(400, 'id tələb olunur.');

    const db = await getDb();
    if (!db) return sendDbUnavailable(res);

    const collection = db.collection(target.collection);

    if (action === 'delete') {
      await collection.deleteOne({ [target.idField]: id });
      if (entity === 'projects') {
        await db.collection('events').deleteMany({ pid: id });
      }
      return res.json({ success: true, connected: true });
    }

    const payload = pickFields(data, Object.keys(data || {}));
    payload[target.idField] = id;
    await collection.updateOne({ [target.idField]: id }, { $set: payload }, { upsert: true });

    return res.json({ success: true, connected: true });
  })
);

module.exports = router;
