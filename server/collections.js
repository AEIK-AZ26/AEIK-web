'use strict';

/**
 * Kabinet məlumatlarının kolleksiya sxemi.
 * Yeni modul əlavə etmək üçün bura bir sətir yazmaq kifayətdir —
 * CRUD route-ları avtomatik yaranır (/api/v1/<ad>).
 */
const RESOURCES = {
  members: {
    collection: 'members',
    idPrefix: 'm',
    idField: 'id',
    fields: ['id', 'name', 'ts'],
    sort: { ts: 1 },
  },
  projects: {
    collection: 'projects',
    idPrefix: 'p',
    idField: 'id',
    fields: ['id', 'name', 'type', 'stage', 'members', 'owner', 'guest', 'note', 'ts'],
    sort: { ts: 1 },
    // Layihə silinəndə ona bağlı təqvim hadisələri də silinir.
    cascade: [{ collection: 'events', field: 'pid' }],
  },
  events: {
    collection: 'events',
    idPrefix: 'e',
    idField: 'id',
    fields: ['id', 'pid', 'date', 'time', 'note', 'ts'],
    sort: { date: 1 },
  },
  attendance: {
    collection: 'attendance',
    idPrefix: 'att',
    idField: 'key',
    fields: ['key', 'v', 'm', 'mo'],
    sort: { m: 1 },
  },
  links: {
    collection: 'links',
    idPrefix: 'lnk',
    idField: 'linkId',
    fields: ['linkId', 'url'],
    sort: { linkId: 1 },
  },
  items: {
    collection: 'items',
    idPrefix: 'it',
    idField: 'id',
    fields: [
      'id', 'sec', 'title', 'status', 'meta', 'text', 'text2', 'date', 'plat',
      'proj', 'who', 'link', 'ptype', 'contact', 'next', 'val', 'area', 'ts',
    ],
    sort: { ts: -1 },
  },
};

/** Toplu /api/v1/data cavabında istifadə olunan açar adları. */
const BULK_KEYS = {
  members: 'members',
  projects: 'projects',
  events: 'events',
  attendance: 'att',
  links: 'links',
  items: 'items',
};

module.exports = { BULK_KEYS, RESOURCES };
