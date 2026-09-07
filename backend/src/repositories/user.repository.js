const BaseRepository = require('./base.repository');
const User = require('../models/user.model');

// UserRepository mở rộng BaseRepository cho các truy vấn riêng của User
class UserRepository extends BaseRepository {
  constructor() {
    const defaultUsers = [
      new User({ id: '1', name: 'Nguyễn Văn A', email: 'vana@example.com', role: 'admin' }),
      new User({ id: '2', name: 'Trần Thị B', email: 'thib@example.com', role: 'user' }),
      new User({ id: '3', name: 'Lê Văn C', email: 'vanc@example.com', role: 'user' })
    ];
    super(defaultUsers);
  }

  async findByEmail(email) {
    const users = await this.findAll();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }
}

module.exports = new UserRepository();
