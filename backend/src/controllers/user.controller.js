const BaseController = require('./base.controller');
const userService = require('../services/user.service');

// UserController kế thừa BaseController, tiếp nhận Req và trả về Res
class UserController extends BaseController {
  constructor() {
    super();
    // Bind context methods
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
    this.createUser = this.createUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAll();
      return this.sendSuccess(res, users, 'Lấy danh sách người dùng thành công');
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await userService.getById(req.params.id);
      return this.sendSuccess(res, user, 'Lấy thông tin người dùng thành công');
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const newUser = await userService.createUser(req.body);
      return this.sendCreated(res, newUser, 'Tạo người dùng mới thành công');
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const updatedUser = await userService.updateUser(req.params.id, req.body);
      return this.sendSuccess(res, updatedUser, 'Cập nhật người dùng thành công');
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      await userService.delete(req.params.id);
      return this.sendSuccess(res, null, 'Xóa người dùng thành công');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
