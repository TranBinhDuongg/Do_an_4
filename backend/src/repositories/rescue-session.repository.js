const db = require('../config/database');
module.exports = {
  async create(hash, id) {
    await db.execute('DELETE FROM rescue_sessions WHERE expires_at <= UTC_TIMESTAMP()');
    await db.execute('INSERT INTO rescue_sessions (token_hash, account_id, expires_at) VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 DAY))', [hash, id]);
  },
  async find(hash) {
    const [rows] = await db.execute('SELECT account_id FROM rescue_sessions WHERE token_hash = ? AND expires_at > UTC_TIMESTAMP()', [hash]);
    return rows[0];
  },
  async rotate(oldHash, newHash) {
    const [result] = await db.execute('UPDATE rescue_sessions SET token_hash = ? WHERE token_hash = ? AND expires_at > UTC_TIMESTAMP()', [newHash, oldHash]);
    return result.affectedRows === 1;
  },
  async remove(hash) { await db.execute('DELETE FROM rescue_sessions WHERE token_hash = ?', [hash]); },
  async setPush(hash, token, accountId) {
    const [result] = await db.execute('UPDATE rescue_sessions SET push_token = ? WHERE token_hash = ? AND account_id = ? AND expires_at > UTC_TIMESTAMP()', [token, hash, accountId]);
    return result.affectedRows === 1;
  },
};
