const { test } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const { createHash } = require('crypto');
const Service = require('../src/services/rescue-session.service');
const secret = 'rescue-test-only-secret-longer-than-32-characters';
async function setup(role = 'cuu_ho') {
  const account = { id: '9007199254740993', ho_ten: 'Nhân viên', email: 'staff@example.test', ma_vai_tro: role, trang_thai: 'hoat_dong', mat_khau_bam: await bcrypt.hash('test-password', 4) };
  const records = new Map();
  const sessions = {
    create: async (hash, id) => records.set(hash, { account_id: id }),
    find: async hash => records.get(hash),
    remove: async hash => records.delete(hash),
    rotate: async (oldHash, nextHash) => { if (!records.has(oldHash)) return false; records.set(nextHash, records.get(oldHash)); records.delete(oldHash); return true; },
  };
  const service = new Service({ findByEmail: async () => account, findById: async () => account }, sessions, secret);
  return { service, account, records };
}
const credentials = { email: 'staff@example.test', password: 'test-password' };
test('rescue session rotates refresh tokens, stores only hashes and revokes on logout', async () => {
  const { service, records } = await setup();
  const first = await service.login(credentials);
  assert.equal(first.user.id, '9007199254740993');
  assert.ok(!records.has(first.refreshToken));
  assert.ok(records.has(createHash('sha256').update(first.refreshToken).digest('hex')));
  const next = await service.refresh(first);
  assert.notEqual(first.refreshToken, next.refreshToken);
  await assert.rejects(service.refresh(first), { statusCode: 401 });
  await service.logout(next);
  await assert.rejects(service.refresh(next), { statusCode: 401 });
});
test('only rescue staff can log in', async () => {
  const { service } = await setup('dieu_phoi');
  await assert.rejects(service.login(credentials), { statusCode: 401 });
});
test('locked accounts lose their persistent session', async () => {
  const { service, account, records } = await setup();
  const session = await service.login(credentials);
  account.trang_thai = 'khoa';
  await assert.rejects(service.refresh(session), { statusCode: 401 });
  assert.equal(records.size, 0);
});
test('malformed refresh tokens rejected before database lookup', async () => {
  const { service } = await setup();
  for (const refreshToken of [null, {}, '', 'a'.repeat(63)]) await assert.rejects(service.refresh({ refreshToken }), { statusCode: 401 });
});
