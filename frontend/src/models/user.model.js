import { BaseModel } from './base.model';

// User Entity phía Frontend (OOP - đóng gói format, helper logic)
export class User extends BaseModel {
  constructor(data = {}) {
    super(data.id, data.createdAt, data.updatedAt);
    this.name = data.name || '';
    this.email = data.email || '';
    this.role = data.role || 'user';
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  get isAdmin() {
    return this.role === 'admin';
  }

  get formattedCreatedDate() {
    return this.createdAt.toLocaleDateString('vi-VN');
  }

  static fromJson(json) {
    return new User(json);
  }

  static fromJsonList(jsonArray = []) {
    return jsonArray.map(item => User.fromJson(item));
  }
}
