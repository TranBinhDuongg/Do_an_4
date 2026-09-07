import { BaseApiService } from './base.service';
import { User } from '../models/user.model';

class UserService extends BaseApiService {
  constructor() {
    super('/users');
  }

  async getAllUsers() {
    const data = await this.getAll();
    return User.fromJsonList(data);
  }

  async createUser(userData) {
    const data = await this.create(userData);
    return User.fromJson(data);
  }
}

export const userService = new UserService();
