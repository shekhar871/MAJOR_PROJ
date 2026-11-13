const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'pocketbridge-secret-key';

async function hashPassword(plainText) {
  return bcrypt.hash(plainText, 10);
}

async function comparePassword(plainText, hash) {
  return bcrypt.compare(plainText, hash);
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { hashPassword, comparePassword, signToken, verifyToken };
