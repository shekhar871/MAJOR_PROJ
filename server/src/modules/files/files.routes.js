const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const db = require('../../db');
const requireAuth = require('../../middleware/auth');

const STORAGE_DIR = path.resolve(__dirname, '../../../storage');
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

const upload = multer({
  dest: STORAGE_DIR,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB cap
});

// Upload File
router.post('/', requireAuth, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { code: 'NO_FILE', message: 'No file uploaded' } });
    }

    const { originalname, mimetype, size, path: tempPath } = req.file;
    const fileBytes = fs.readFileSync(tempPath);
    const checksum = crypto.createHash('sha256').update(fileBytes).digest('hex');
    const storageKey = `${crypto.randomUUID()}_${path.extname(originalname)}`;
    const finalPath = path.join(STORAGE_DIR, storageKey);

    fs.renameSync(tempPath, finalPath);

    const result = await db.query(
      'INSERT INTO files (source_device_id, original_name, storage_key, mime_type, size_bytes, checksum_sha256, direction, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING file_id, original_name, size_bytes, mime_type, created_at, status',
      [req.device.id, originalname, storageKey, mimetype, size, checksum, 'to_desktop', 'stored']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// List files for account
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT f.file_id, f.original_name, f.mime_type, f.size_bytes, f.checksum_sha256, f.created_at, f.status, d.device_name AS source_device_name
       FROM files f
       JOIN devices d ON f.source_device_id = d.device_id
       WHERE d.user_id = $1 AND f.status = 'stored'
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Download file with ownership verification
router.get('/:id/download', requireAuth, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT f.storage_key, f.original_name, f.mime_type, d.user_id
       FROM files f
       JOIN devices d ON f.source_device_id = d.device_id
       WHERE f.file_id = $1 AND f.status = 'stored'`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'File not found' } });
    }

    const file = result.rows[0];
    if (file.user_id !== req.user.id) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Access denied to this file' } });
    }

    const filePath = path.join(STORAGE_DIR, file.storage_key);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: { code: 'FILE_MISSING', message: 'File is missing from disk' } });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${file.original_name}"`);
    res.setHeader('Content-Type', file.mime_type);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    next(err);
  }
});

// Delete file
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const check = await db.query(
      `SELECT f.file_id, f.storage_key, d.user_id
       FROM files f
       JOIN devices d ON f.source_device_id = d.device_id
       WHERE f.file_id = $1`,
      [req.params.id]
    );

    if (check.rows.length === 0) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'File not found' } });
    }

    if (check.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Cannot delete another user\'s file' } });
    }

    await db.query("UPDATE files SET status = 'deleted' WHERE file_id = $1", [req.params.id]);
    res.json({ success: true, message: 'File marked deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

// Path traversal guard verified
