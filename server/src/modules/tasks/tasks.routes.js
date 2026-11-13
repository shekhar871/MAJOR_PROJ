const express = require('express');
const router = express.Router();
const db = require('../../db');
const requireAuth = require('../../middleware/auth');

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT t.task_id, t.title, t.description, t.priority, t.status, t.due_at, t.created_at, d.device_name
       FROM tasks t
       JOIN devices d ON t.device_id = d.device_id
       WHERE d.user_id = $1
       ORDER BY CASE t.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, t.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, description, priority, status } = req.body;
    if (!title) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Task title is required' } });
    }

    const result = await db.query(
      'INSERT INTO tasks (device_id, title, description, priority, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.device.id, title.trim(), description || '', priority || 'medium', status || 'todo']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { status, priority } = req.body;
    const result = await db.query(
      `UPDATE tasks t
       SET status = COALESCE($1, t.status),
           priority = COALESCE($2, t.priority),
           updated_at = CURRENT_TIMESTAMP
       FROM devices d
       WHERE t.device_id = d.device_id AND t.task_id = $3 AND d.user_id = $4
       RETURNING t.*`,
      [status, priority, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Task not found or access denied' } });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
