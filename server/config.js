'use strict';

const path = require('path');

// Next.js konvensiyası ilə eyni qaydada env oxunur: .env → .env.local
try {
  require('dotenv').config({ path: path.join(process.cwd(), '.env'), quiet: true });
  require('dotenv').config({ path: path.join(process.cwd(), '.env.local'), override: true, quiet: true });
} catch (_) {
  // dotenv yoxdursa dəyərlər birbaşa mühitdən (Vercel env) oxunur.
}

const DEFAULT_DB_NAME = 'aeik_database';
const DEFAULT_JWT_SECRET = 'aeik_default_jwt_secret_change_in_env_2026';

const MONGODB_URI = (process.env.MONGODB_URI || '').trim();
const MONGODB_DB = (process.env.MONGODB_DB || process.env.MONGODB_DATABASE || '').trim();
const JWT_SECRET = (process.env.JWT_SECRET || DEFAULT_JWT_SECRET).trim();
const PORT = Number(process.env.PORT) || 4000;
const API_VERSION = '1.0.0';

const DEFAULT_ORIGINS = [
  'https://aeik.vercel.app',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:4000',
  'http://127.0.0.1:4000',
];

const configuredOrigins = [process.env.CORS_ORIGINS, process.env.NEXT_PUBLIC_APP_URL, process.env.APP_URL]
  .filter(Boolean)
  .join(',')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const ALLOW_ALL_ORIGINS = configuredOrigins.includes('*');
const ALLOWED_ORIGINS = Array.from(new Set([...DEFAULT_ORIGINS, ...configuredOrigins.filter((o) => o !== '*')]));

/** Mongo URI real şifrə ilə verilibmi? Placeholder varsa baza "konfiqurasiya olunmayıb" sayılır. */
function isDbConfigured() {
  if (!MONGODB_URI) return false;
  if (MONGODB_URI.includes('<db_password>') || MONGODB_URI.includes('YOUR_PASSWORD')) return false;
  return /^mongodb(\+srv)?:\/\//.test(MONGODB_URI);
}

/** URI-nin sonundakı baza adını götürür; yoxdursa MONGODB_DB və ya standart ad. */
function dbNameFromUri(uri) {
  if (MONGODB_DB) return MONGODB_DB;
  try {
    const normalized = uri.replace('mongodb+srv://', 'https://').replace('mongodb://', 'http://');
    const parsed = new URL(normalized);
    const fromPath = decodeURIComponent(parsed.pathname.replace(/^\/+/, '')).split('?')[0].trim();
    if (fromPath) return fromPath;
  } catch (_) {
    /* URI parse olunmadı — standart ad istifadə olunur */
  }
  return DEFAULT_DB_NAME;
}

function isOriginAllowed(origin) {
  if (!origin) return true; // same-origin / server-to-server sorğular
  if (ALLOW_ALL_ORIGINS) return true;
  const clean = origin.replace(/\/$/, '');
  if (ALLOWED_ORIGINS.includes(clean)) return true;
  try {
    const hostname = new URL(clean).hostname;
    if (hostname.endsWith('.vercel.app')) return true;
  } catch (_) {
    return false;
  }
  return false;
}

module.exports = {
  API_VERSION,
  ALLOWED_ORIGINS,
  ALLOW_ALL_ORIGINS,
  DEFAULT_DB_NAME,
  JWT_SECRET,
  MONGODB_URI,
  PORT,
  dbNameFromUri,
  isDbConfigured,
  isOriginAllowed,
};
