const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const db = require('../../db');
const requireAuth = require('../../middleware/auth');
const { signToken } = require('../../utils/security');

// Create pairing code (Called by Desktop)
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const rawCode = crypto.randomBytes(16).toString('hex');
    const codeHash = crypto.createHash('sha256').update(rawCode).digest('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    await db.query(
      'INSERT INTO pairing_codes (created_by_device_id, code_hash, expires_at) VALUES ($1, $2, $3)',
      [req.device.id, codeHash, expiresAt]
    );

    res.status(201).json({
      code: rawCode,
      expiresAt: expiresAt.toISOString(),
      qrPayload: JSON.stringify({ code: rawCode, serverUrl: `http://${req.hostname}:${process.env.PORT || 4000}/api` })
    });
  } catch (err) {
    next(err);
  }
});

// Consume pairing code (Called by Mobile) - ACID Row Lock Concurrency
router.post('/consume', async (req, res, next) => {
  const { code, deviceName, platform } = req.body;
  if (!code || !deviceName) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Pairing code and device name required' } });
  }

  const codeHash = crypto.createHash('sha256').update(code.trim()).digest('hex');
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    // SELECT ... FOR UPDATE ensures race condition lock
    const pairRes = await client.query(
      'SELECT pairing_id, created_by_device_id, expires_at, used_at FROM pairing_codes WHERE code_hash = $1 FOR UPDATE',
      [codeHash]
    );

    if (pairRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Invalid pairing code' } });
    }

    const pairing = pairRes.rows[0];
    if (pairing.used_at !== null) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: { code: 'CODE_ALREADY_USED', message: 'Pairing code has already been consumed' } });
    }

    if (new Date() > new Date(pairing.expires_at)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: { code: 'CODE_EXPIRED', message: 'Pairing code has expired' } });
    }

    // Find account of the host device
    const hostDev = await client.query('SELECT user_id FROM devices WHERE device_id = $1', [pairing.created_by_device_id]);
    const userId = hostDev.rows[0].user_id;

    // Create newly paired device
    const newDevRes = await client.query(
      'INSERT INTO devices (user_id, device_name, platform) VALUES ($1, $2, $3) RETURNING device_id, device_name, platform',
      [userId, deviceName.trim(), platform || 'android']
    );
    const newDevice = newDevRes.rows[0];

    // Mark pairing code consumed
    await client.query(
      'UPDATE pairing_codes SET used_at = CURRENT_TIMESTAMP, consumed_by_device_id = $1 WHERE pairing_id = $2',
      [newDevice.device_id, pairing.pairing_id]
    );

    await client.query('COMMIT');

    const token = signToken({ userId, deviceId: newDevice.device_id });
    res.json({
      token,
      device: newDevice,
      message: 'Device successfully paired'
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
});

module.exports = router;
