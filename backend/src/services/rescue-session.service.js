const { randomBytes, createHash } = require('crypto');
const jwt = require('jsonwebtoken');
const AuthService = require('./auth.service');
const AppError = require('../utils/app-error');
const hash = value => createHash('sha256').update(value).digest('hex');

class RescueSessionService {
  constructor(accounts, sessions, secret) {
    this.auth = new AuthService(accounts, secret, 'cuu_ho');
    this.sessions = sessions;
  }
  token(value) {
    if (typeof value !== 'string' || !/^[a-f0-9]{64}$/.test(value)) throw new AppError('Phiên đăng nhập không hợp lệ.', 401);
    return hash(value);
  }
  async login(body) {
    const result = await this.auth.login(body);
    const refreshToken = randomBytes(32).toString('hex');
    await this.sessions.create(hash(refreshToken), result.user.id);
    return { ...result, refreshToken };
  }
  async refresh(body) {
    this.auth.requireSecret();
    const oldHash = this.token(body?.refreshToken);
    const session = await this.sessions.find(oldHash);
    if (!session) throw new AppError('Phiên đã hết hạn. Vui lòng đăng nhập lại.', 401);
    const account = await this.auth.repository.findById(String(session.account_id));
    if (!this.auth.isDispatcher(account)) {
      await this.sessions.remove(oldHash);
      throw new AppError('Tài khoản không được phép truy cập.', 401);
    }
    const refreshToken = randomBytes(32).toString('hex');
    if (!await this.sessions.rotate(oldHash, hash(refreshToken))) throw new AppError('Phiên đã được thay đổi. Vui lòng đăng nhập lại.', 401);
    return {
      accessToken: jwt.sign({}, this.auth.secret, { algorithm: 'HS256', issuer: 'cuu-ho-backend', audience: 'cuu_ho', subject: String(account.id), expiresIn: '1h' }),
      expiresIn: 3600, user: this.auth.publicUser(account), refreshToken,
    };
  }
  async logout(body) { await this.sessions.remove(this.token(body?.refreshToken)); }
}
module.exports = RescueSessionService;
