const BaseService = require('./base.service');
const userRepository = require('../repositories/user.repository');
const User = require('../models/user.model');
const AppError = require('../utils/app-error');

// UserService xử lý logic nghiệp vụ đặc thù của Người dùng
class UserService extends BaseService {
  constructor() {
    super(userRepository);
  }

  async createUser(userData) {
    // 1. Kiểm tra validation & logic nghiệp vụ
    if (!userData.name || !userData.email) {
      throw new AppError('Tên và Email là bắt buộc', 400);
    }

    const existingUser = await this.repository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('Email này đã được sử dụng', 409);
    }

    // 2. Tạo đối tượng Entity User
    const newUser = new User({
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });

    // 3. Lưu qua Repository
    return this.repository.create(newUser);
  }

  async updateUser(id, updateData) {
    await this.getById(id); // Check existence
    
    if (updateData.email) {
      const existingUser = await this.repository.findByEmail(updateData.email);
      if (existingUser && existingUser.id !== id) {
        throw new AppError('Email này đã được tài khoản khác sử dụng', 409);
      }
    }

    return this.repository.update(id, updateData);
  }
}

module.exports = new UserService();
