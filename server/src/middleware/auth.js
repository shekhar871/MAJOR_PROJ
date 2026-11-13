const { verifyToken } = require('../utils/security');
const db = require('../db');

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Authentication token required' } });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    const result = await db.query(
      'SELECT d.device_id, d.device_name, d.platform, d.is_active, u.user_id, u.full_name, u.email FROM devices d JOIN users u ON d.user_id = u.user_id WHERE d.device_id = $1 AND u.user_id = $2',
      [payload.deviceId, payload.userId]
    );

    if (result.rows.length === 0 || !result.rows[0].is_active) {
      return res.status(401).json({ error: { code: 'DEVICE_REVOKED', message: 'Device is no longer active or recognized' } });
    }

    req.user = { id: result.rows[0].user_id, name: result.rows[0].full_name, email: result.rows[0].email };
    req.device = { id: result.rows[0].device_id, name: result.rows[0].device_name, platform: result.rows[0].platform };
    next();
  } catch (err) {
    return res.status(401).json({ error: { code: 'INVALID_TOKEN', message: 'Token signature or expiry invalid' } });
  }
}

module.exports = requireAuth;
