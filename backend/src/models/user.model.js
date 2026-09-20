const BaseModel = require('./base.model');

// User Entity - Đóng gói dữ liệu và logic thuộc tính của User
class User extends BaseModel {
  constructor({ id, name, email, role = 'user', isActive = true, createdAt, updatedAt }) {
    super(id, createdAt, updatedAt);
    this.name = name;
    this.email = email;
    this.role = role;
    this.isActive = isActive;
  }
}

module.exports = User;
