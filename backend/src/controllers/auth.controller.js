const BaseController = require('./base.controller');
const AuthService = require('../services/auth.service');
const repository = require('../repositories/auth.repository');

class AuthController extends BaseController {
  constructor() {
    super();
    this.service = new AuthService(repository, process.env.JWT_SECRET);
    this.login = this.login.bind(this);
    this.requireDispatcher = this.requireDispatcher.bind(this);
    this.me = this.me.bind(this);
  }

  async login(req, res, next) {
    try {
      res.set('Cache-Control', 'no-store');
      return this.sendSuccess(res, await this.service.login(req.body), 'Đăng nhập thành công');
    } catch (error) { next(error); }
  }

  async requireDispatcher(req, res, next) {
    try {
      res.set('Cache-Control', 'no-store');
      req.user = await this.service.authenticate(req.get('Authorization'));
      next();
    } catch (error) { next(error); }
  }

  me(req, res) {
    return this.sendSuccess(res, req.user);
  }
}

module.exports = new AuthController();
