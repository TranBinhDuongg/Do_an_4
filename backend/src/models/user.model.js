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

  // Phương thức nghiệp vụ nội tại của đối tượng (Encapsulation)
  isAdmin() {
    return this.role === 'admin';
  }

  formatDisplayName() {
    return `${this.name} (${this.role.toUpperCase()})`;
  }
}

module.exports = User;
