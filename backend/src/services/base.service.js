const AppError = require('../utils/app-error');

// [LỚP 2: BUSINESS LOGIC LAYER]
// Base Service - Chứa các xử lý logic nghiệp vụ dùng chung
class BaseService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id) {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new AppError('Dữ liệu không tồn tại', 404);
    }
    return item;
  }

  async delete(id) {
    await this.getById(id);
    return this.repository.delete(id);
  }
}

module.exports = BaseService;
