const { test } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthService = require('../src/services/auth.service');

const secret = 'test-secret-only-'.repeat(4);
const password = 'Dispatcher-test-123';

test('dispatcher authentication', async (t) => {
  let account = {
    id: '9007199254740993', ho_ten: 'Test Dispatcher', email: 'dispatch@example.com',
    mat_khau_bam: await bcrypt.hash(password, 4), trang_thai: 'hoat_dong', ma_vai_tro: 'dieu_phoi',
  };
  const original = { ...account };
  const repository = {
    findByEmail: async (email) => email === 'dispatch@example.com' ? account : null,
    findById: async (id) => account && id === account.id ? account : null,
  };
  const service = new AuthService(repository, secret);
  let token;
  await t.test('normalizes email, preserves BIGINT and returns usable token without password', async () => {
    const result = await service.login({ email: ' Dispatch@Example.com ', password });
    token = result.accessToken;
    assert.equal(result.user.id, original.id);
    assert.equal(result.expiresIn, 3600);
    assert.equal(JSON.stringify(result).includes('mat_khau_bam'), false);
    assert.deepEqual(await service.authenticate(`Bearer ${token}`), result.user);
  });
  await t.test('rejects malformed input and passwords longer than bcrypt limit', async () => {
    for (const body of [null, {}, { email: [], password }, { email: original.email, password: 'a'.repeat(73) }]) {
      await assert.rejects(service.login(body), { statusCode: 400 });
    }
  });
  await t.test('rejects unknown email and wrong password', async () => {
    await assert.rejects(service.login({ email: 'missing@example.com', password }), { statusCode: 401 });
    await assert.rejects(service.login({ email: original.email, password: 'wrong' }), { statusCode: 401 });
  });
  await t.test('rejects locked accounts and other roles, including previously issued tokens', async () => {
    for (const patch of [{ trang_thai: 'bi_khoa' }, { ma_vai_tro: 'quan_tri_vien' }, { ma_vai_tro: 'cuu_ho' }]) {
      account = { ...original, ...patch };
      await assert.rejects(service.login({ email: original.email, password }), { statusCode: 401 });
      await assert.rejects(service.authenticate(`Bearer ${token}`), { statusCode: 401 });
    }
    account = null;
    await assert.rejects(service.authenticate(`Bearer ${token}`), { statusCode: 401 });
    account = { ...original };
  });
  await t.test('rejects missing, tampered, expired and wrong audience tokens', async () => {
    const options = { algorithm: 'HS256', subject: original.id, issuer: 'cuu-ho-backend', audience: 'dieu-phoi' };
    for (const header of [undefined, 'Bearer invalid', `Bearer ${token}x`,
      `Bearer ${jwt.sign({}, secret, { ...options, expiresIn: -1 })}`,
      `Bearer ${jwt.sign({}, secret, { ...options, audience: 'other' })}`]) {
      await assert.rejects(service.authenticate(header), { statusCode: 401 });
    }
  });
  await t.test('fails closed without signing secret', async () => {
    await assert.rejects(new AuthService(repository, '').login({ email: original.email, password }), { statusCode: 503 });
  });
  await t.test('HTTP routes return expected envelope and limit repeated attempts', async () => {
    require('../src/config/app.config');
    process.env.JWT_SECRET = secret;
    const dbRepo = require('../src/repositories/auth.repository');
    const previous = { findByEmail: dbRepo.findByEmail, findById: dbRepo.findById };
    Object.assign(dbRepo, repository);
    const app = require('../src/app');
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    const base = `http://127.0.0.1:${server.address().port}/api/auth`;
    const login = body => fetch(`${base}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    try {
      const response = await login({ email: original.email, password });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      const body = await response.json();
      assert.equal(body.success, true);
      const me = await fetch(`${base}/me`, { headers: { Authorization: `Bearer ${body.data.accessToken}` } });
      assert.equal(me.status, 200);
      assert.equal((await me.json()).data.role, 'dieu_phoi');
      for (let i = 0; i < 10; i++) assert.equal((await login({})).status, 400);
      assert.equal((await login({})).status, 429);
    } finally {
      await new Promise(resolve => server.close(resolve));
      Object.assign(dbRepo, previous);
      await require('../src/config/database').close();
    }
  });
});
