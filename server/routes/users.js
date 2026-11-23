'use strict';

const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb, sendDbUnavailable } = require('../db');
const { hashPassword, publicUser, requireAuth, requireRole } = require('../auth');
const { ApiError, isEmail, isNonEmptyString, wrap } = require('../utils');

const router = express.Router();

// Bütün /users route-ları üçün ən azı admin tələb olunur.
router.use(requireAuth);
router.use(requireRole('owner', 'admin'));

// GET /api/v1/users
router.get(
  '/',
  wrap(async (req, res) => {
    const db = await getDb();
    if (!db) return sendDbUnavailable(res);

    const docs = await db
      .collection('users')
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ users: docs.map((doc) => ({ ...doc, _id: String(doc._id) })), callerRole: req.user.role });
  })
);

// POST /api/v1/users
router.post(
  '/',
  wrap(async (req, res) => {
    const { email, password, displayName, department, role } = req.body || {};

    if (!isEmail(email)) throw new ApiError(400, 'Düzgün email ünvanı daxil edin.');
    if (!isNonEmptyString(displayName, 2)) throw new ApiError(400, 'Ad və soyad daxil edilməlidir.');
    if (typeof password !== 'string' || password.length < 6) {
      throw new ApiError(400, 'Şifrə ən azı 6 simvoldan ibarət olmalıdır.');
    }

    // Owner istənilən rolu, admin yalnız "member" yarada bilər.
    let finalRole = 'member';
    if (req.user.role === 'owner') {
      if (['owner', 'admin', 'member'].includes(role)) finalRole = role;
    } else if (role && role !== 'member') {
      throw new ApiError(403, 'Admin yalnız "member" rolu təyin edə bilər.');
    }

    const db = await getDb();
    if (!db) return sendDbUnavailable(res);

    const users = db.collection('users');
    const normalizedEmail = email.trim().toLowerCase();

    if (await users.findOne({ email: normalizedEmail })) {
      throw new ApiError(409, 'Bu email ilə istifadəçi artıq mövcuddur.');
    }

    const doc = {
      email: normalizedEmail,
      password: await hashPassword(password),
      displayName: displayName.trim(),
      department: (department || 'Layihələrin idarə olunması').toString().trim(),
      role: finalRole,
      createdAt: Date.now(),
    };

    const result = await users.insertOne(doc);
    res.status(201).json({ success: true, user: publicUser({ ...doc, _id: result.insertedId }) });
  })
);

// PATCH /api/v1/users/:id
router.patch(
  '/:id',
  wrap(async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) throw new ApiError(400, 'Yanlış istifadəçi ID-si.');

    const db = await getDb();
    if (!db) return sendDbUnavailable(res);

    const users = db.collection('users');
    const target = await users.findOne({ _id: new ObjectId(req.params.id) });
    if (!target) throw new ApiError(404, 'İstifadəçi tapılmadı.');

    const { displayName, department, role, password } = req.body || {};

    const update = {};
    if (isNonEmptyString(displayName, 2)) update.displayName = displayName.trim();
    if (isNonEmptyString(department, 2)) update.department = department.trim();

    if (role && role !== target.role) {
      if (req.user.role !== 'owner') {
        throw new ApiError(403, 'Rol dəyişikliyi yalnız Owner-ə məxsusdur.');
      }
      if (!['owner', 'admin', 'member'].includes(role)) {
        throw new ApiError(400, 'Naməlum rol.');
      }
      update.role = role;
    }

    if (password !== undefined) {
      if (typeof password !== 'string' || password.length < 6) {
        throw new ApiError(400, 'Şifrə ən azı 6 simvoldan ibarət olmalıdır.');
      }
      update.password = await hashPassword(password);
    }

    if (Object.keys(update).length === 0) throw new ApiError(400, 'Dəyişdiriləcək sahə göndərilməyib.');

    await users.updateOne({ _id: target._id }, { $set: update });
    const saved = await users.findOne({ _id: target._id });

    res.json({ success: true, user: publicUser(saved) });
  })
);

// DELETE /api/v1/users/:id — yalnız owner, özünü silə bilməz.
router.delete(
  '/:id',
  requireRole('owner'),
  wrap(async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) throw new ApiError(400, 'Yanlış istifadəçi ID-si.');
    if (req.params.id === req.user.userId) throw new ApiError(400, 'Öz hesabınızı silə bilməzsiniz.');

    const db = await getDb();
    if (!db) return sendDbUnavailable(res);

    const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) throw new ApiError(404, 'İstifadəçi tapılmadı.');

    res.json({ success: true, deleted: req.params.id });
  })
);

module.exports = router;
