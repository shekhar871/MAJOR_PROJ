const express = require('express');
const router = express.Router();
const db = require('../../db');
const { hashPassword, comparePassword, signToken } = require('../../utils/security');
const requireAuth = require('../../middleware/auth');

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, fullName, deviceName, platform } = req.body;
    if (!email || !password || !fullName || !deviceName) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await db.query('SELECT user_id FROM users WHERE email = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: { code: 'EMAIL_EXISTS', message: 'User already exists' } });
    }

    const passwordHash = await hashPassword(password);
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

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password, deviceName, platform } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Email and password required' } });
    }

    const userRes = await db.query('SELECT user_id, full_name, email, password_hash FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }

    const user = userRes.rows[0];
    const match = await comparePassword(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }

    let deviceRes = await db.query(
      'SELECT device_id, device_name, platform FROM devices WHERE user_id = $1 AND device_name = $2 AND is_active = TRUE',
      [user.user_id, (deviceName || 'Desktop Client').trim()]
    );

    let device;
    if (deviceRes.rows.length > 0) {
      device = deviceRes.rows[0];
      await db.query('UPDATE devices SET last_seen_at = CURRENT_TIMESTAMP WHERE device_id = $1', [device.device_id]);
    } else {
      const newDev = await db.query(
        'INSERT INTO devices (user_id, device_name, platform) VALUES ($1, $2, $3) RETURNING device_id, device_name, platform',
        [user.user_id, (deviceName || 'Desktop Client').trim(), platform || 'desktop']
      );
      device = newDev.rows[0];
    }

    const token = signToken({ userId: user.user_id, deviceId: device.device_id });
    res.json({
      token,
      user: { id: user.user_id, name: user.full_name, email: user.email },
      device: { id: device.device_id, name: device.device_name, platform: device.platform }
    });
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user, device: req.device });
});

module.exports = router;
