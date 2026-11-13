const express = require('express');
const router = express.Router();
const db = require('../../db');
const requireAuth = require('../../middleware/auth');

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT n.note_id, n.title, n.body, n.is_pinned, n.created_at, n.updated_at, d.device_name
       FROM notes n
       JOIN devices d ON n.device_id = d.device_id
       WHERE d.user_id = $1
       ORDER BY n.is_pinned DESC, n.updated_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, body, isPinned } = req.body;
    if (!title) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Title is required' } });
    }

    const result = await db.query(
      'INSERT INTO notes (device_id, title, body, is_pinned) VALUES ($1, $2, $3, $4) RETURNING note_id, title, body, is_pinned, created_at',
      [req.device.id, title.trim(), body || '', Boolean(isPinned)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await db.query(
      `DELETE FROM notes n
       USING devices d
       WHERE n.device_id = d.device_id AND n.note_id = $1 AND d.user_id = $2
       RETURNING n.note_id`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Note not found or unauthorized' } });
    }
    res.json({ success: true, message: 'Note deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
