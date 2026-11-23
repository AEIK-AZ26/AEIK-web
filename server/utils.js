'use strict';

const crypto = require('crypto');

/** async route handler-ləri express xəta middleware-inə ötürür (express 4 və 5 uyğun). */
function wrap(handler) {
  return function wrapped(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

function makeId(prefix) {
  return `${prefix}_${crypto.randomBytes(6).toString('hex')}`;
}

function pickFields(body, fields) {
  const out = {};
  if (!body || typeof body !== 'object') return out;
  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(body, field) && body[field] !== undefined) {
      out[field] = body[field];
    }
  }
  return out;
}

/** Mongo sənədini API cavabı üçün təmizləyir (_id, __v çıxarılır). */
function toPlain(doc) {
  if (!doc || typeof doc !== 'object') return doc;
  const plain = { ...doc };
  delete plain._id;
  delete plain.__v;
  return plain;
}

function toInt(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? Math.trunc(num) : fallback;
}

function isEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isNonEmptyString(value, min = 1) {
  return typeof value === 'string' && value.trim().length >= min;
}

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = { ApiError, isEmail, isNonEmptyString, makeId, pickFields, toInt, toPlain, wrap };
