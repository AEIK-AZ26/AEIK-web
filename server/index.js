'use strict';

// Lokal (ayrıca) server üçün giriş nöqtəsi:  node server/index.js
// Vercel-də bu fayl işlədilmir — orada api/ qovluğundakı funksiya app-i ixrac edir.
const app = require('./app');
const { PORT, isDbConfigured, isJwtConfigured } = require('./config');
const { disconnectFromMongoDB, ensureReady } = require('./db');

async function start() {
  if (!isDbConfigured()) {
    console.warn('[aeik-api] MONGODB_URI təyin edilməyib və ya placeholder-dir — baza endpoint-ləri 503 qaytaracaq.');
  }
  if (!isJwtConfigured) {
    console.warn('[aeik-api] JWT_SECRET təyin edilməyib — auth endpoint-ləri işləməyəcək.');
  }

  await ensureReady();

  const server = app.listen(PORT, () => {
    console.log(`[aeik-api] http://localhost:${PORT}/api/v1`);
    console.log(`[aeik-api] Sağlamlıq yoxlaması: http://localhost:${PORT}/api/v1/health`);
  });

  const shutdown = async (signal) => {
    console.log(`\n[aeik-api] ${signal} — server dayandırılır...`);
    server.close(async () => {
      await disconnectFromMongoDB();
      process.exit(0);
    });
    // 5 saniyə ərzində bağlanmasa prosesi məcburi bitir.
    setTimeout(() => process.exit(0), 5000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((error) => {
  console.error('[aeik-api] Server başlamadı:', error);
  process.exit(1);
});
