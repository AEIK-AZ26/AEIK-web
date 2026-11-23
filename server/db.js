'use strict';

const { MongoClient } = require('mongodb');
const { MONGODB_URI, dbNameFromUri, isDbConfigured } = require('./config');
const seedDatabase = require('./data/seed');

// Serverless mühitdə isti başlanğıclar arasında bağlantı paylaşılır.
const cache =
  globalThis.__aeikMongoCache ||
  (globalThis.__aeikMongoCache = { client: null, db: null, promise: null, ready: null });

const DB_UNAVAILABLE_MESSAGE =
  'Verilənlər bazasına qoşulmaq mümkün olmadı. MONGODB_URI dəyərini yoxlayın.';

async function connectToMongoDB() {
  if (!isDbConfigured()) return null;
  if (cache.client && cache.db) return cache.client;

  if (!cache.promise) {
    cache.promise = (async () => {
      const client = new MongoClient(MONGODB_URI, {
        maxPoolSize: 10,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 8000,
        connectTimeoutMS: 8000,
      });
      await client.connect();
      cache.client = client;
      cache.db = client.db(dbNameFromUri(MONGODB_URI));
      return client;
    })().catch((error) => {
      cache.promise = null;
      cache.client = null;
      cache.db = null;
      console.error('MongoDB bağlantı xətası:', error.message);
      throw error;
    });
  }

  try {
    return await cache.promise;
  } catch (_) {
    return null;
  }
}

/** Baza obyekti və ya null (konfiqurasiya/bağlantı yoxdursa). */
async function getDb() {
  await connectToMongoDB();
  return cache.db;
}

async function disconnectFromMongoDB() {
  if (cache.client) {
    await cache.client.close();
  }
  cache.client = null;
  cache.db = null;
  cache.promise = null;
  cache.ready = null;
}

function sendDbUnavailable(res) {
  return res.status(503).json({ error: DB_UNAVAILABLE_MESSAGE, connected: false });
}

/** İndekslər + ilkin (boş kolleksiya) məlumatlar — prosesdə bir dəfə. */
async function ensureReady() {
  if (!isDbConfigured()) return null;
  if (cache.ready) return cache.ready;

  cache.ready = (async () => {
    const db = await getDb();
    if (!db) {
      cache.ready = null;
      return null;
    }

    await Promise.all([
      db.collection('users').createIndex({ email: 1 }, { unique: true }),
      db.collection('members').createIndex({ id: 1 }, { unique: true }),
      db.collection('projects').createIndex({ id: 1 }, { unique: true }),
      db.collection('events').createIndex({ id: 1 }, { unique: true }),
      db.collection('attendance').createIndex({ key: 1 }, { unique: true }),
      db.collection('links').createIndex({ linkId: 1 }, { unique: true }),
      db.collection('items').createIndex({ id: 1 }, { unique: true }),
    ]);

    await seedDatabase(db);
    return db;
  })().catch((error) => {
    cache.ready = null;
    console.error('MongoDB hazırlıq xətası:', error.message);
    return null;
  });

  return cache.ready;
}

module.exports = {
  DB_UNAVAILABLE_MESSAGE,
  connectToMongoDB,
  disconnectFromMongoDB,
  ensureReady,
  getDb,
  sendDbUnavailable,
};
