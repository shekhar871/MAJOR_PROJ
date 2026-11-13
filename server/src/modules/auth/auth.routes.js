const express = require('express');
const router = express.Router();
const db = require('../../db');
const { hashPassword, comparePassword, signToken } = require('../../utils/security');

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, fullName, deviceName, platform } = req.body;
    if (!email || !password || !fullName || !deviceName) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Missing required registration fields' } });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await db.query('SELECT user_id FROM users WHERE email = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: 'User with this email already exists' } });
    }

    const passwordHash = await hashPassword(password);

    // Atomic transaction for user and initial device
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const userRes = await client.query(
        'INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING user_id, full_name, email',
        [fullName.trim(), cleanEmail, passwordHash]
      );
      const user = userRes.rows[0];

      const deviceRes = await client.query(
        'INSERT INTO devices (user_id, device_name, platform) VALUES ($1, $2, $3) RETURNING device_id, device_name, platform',
        [user.user_id, deviceName.trim(), platform || 'desktop']
      );
      const device = deviceRes.rows[0];

      await client.query('COMMIT');

      const token = signToken({ userId: user.user_id, deviceId: device.device_id });
      res.status(201).json({
        token,
        user: { id: user.user_id, name: user.full_name, email: user.email },
        device: { id: device.device_id, name: device.device_name, platform: device.platform }
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
