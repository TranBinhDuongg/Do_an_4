const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const AppError = require('../utils/app-error');

// Still compare a hash when the email does not exist.
const dummyHash = bcrypt.hash(randomBytes(32).toString('hex'), 12);
const tokenOptions = { algorithm: 'HS256', issuer: 'cuu-ho-backend', audience: 'dieu-phoi' };

class AuthService {
  constructor(repository, secret, role = 'dieu_phoi') {
    this.repository = repository;
    this.secret = secret;
    this.role = role;
  }

  requireSecret() {
    if (typeof this.secret !== 'string' || Buffer.byteLength(this.secret) < 32) {
      throw new AppError('Máy chủ chưa cấu hình xác thực.', 503);
    }
  }

  publicUser(account) {
    return { id: String(account.id), name: account.ho_ten, email: account.email, role: account.ma_vai_tro };
  }

  isDispatcher(account) {
    return account && account.trang_thai === 'hoat_dong' && account.ma_vai_tro === this.role;
  }

  async login(body) {
    const { email, password } = body || {};
    if (typeof email !== 'string' || email.trim().length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
        typeof password !== 'string' || !password.length || Buffer.byteLength(password) > 72) {
      throw new AppError('Email hoặc mật khẩu không hợp lệ.', 400);
    }
    this.requireSecret();
    const account = await this.repository.findByEmail(email.trim().toLowerCase());
    const matches = await bcrypt.compare(password, account?.mat_khau_bam || await dummyHash);
    if (!matches || !this.isDispatcher(account)) {
      throw new AppError('Thông tin đăng nhập không đúng hoặc tài khoản không được phép truy cập.', 401);
    }
    return {
      accessToken: jwt.sign({}, this.secret, { ...tokenOptions, audience: this.role, subject: String(account.id), expiresIn: '1h' }),
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: this.publicUser(account),
    };
  }

  async authenticate(header) {
    this.requireSecret();
    const match = typeof header === 'string' && /^Bearer ([^\s]+)$/i.exec(header);
    if (!match) throw new AppError('Vui lòng đăng nhập.', 401);
    let payload;
    try {
      payload = jwt.verify(match[1], this.secret, {
        algorithms: ['HS256'], issuer: tokenOptions.issuer, audience: this.role,
      });
      if (typeof payload.sub !== 'string' || !/^\d+$/.test(payload.sub)) throw new Error('Invalid subject');
    } catch {
      throw new AppError('Phiên đăng nhập không hợp lệ hoặc đã hết hạn.', 401);
    }
    const account = await this.repository.findById(payload.sub);
    if (!this.isDispatcher(account)) throw new AppError('Tài khoản không được phép truy cập.', 401);
    return this.publicUser(account);
  }
}

module.exports = AuthService;
