const database = require('../config/database');

class AuthRepository {
  async findByEmail(email) {
    const [rows] = await database.execute(
      `SELECT tk.id, tk.ho_ten, tk.email, tk.mat_khau_bam, tk.trang_thai,
              vt.ma_vai_tro
       FROM tai_khoan tk JOIN vai_tro vt ON vt.id = tk.vai_tro_id
       WHERE tk.email = ? LIMIT 1`, [email]
    );
    return rows[0] || null;
  }

  async findById(id) {
    const [rows] = await database.execute(
      `SELECT tk.id, tk.ho_ten, tk.email, tk.trang_thai, vt.ma_vai_tro
       FROM tai_khoan tk JOIN vai_tro vt ON vt.id = tk.vai_tro_id
       WHERE tk.id = ? LIMIT 1`, [id]
    );
    return rows[0] || null;
  }
}

module.exports = new AuthRepository();
