const mysql = require('mysql2/promise');
const config = require('./app.config');

class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cuu_ho_dong_vat',
      waitForConnections: true,
      connectionLimit: 10,
      connectTimeout: 10000,
      charset: 'utf8mb4',
      timezone: 'Z',
      supportBigNumbers: true,
      bigNumberStrings: true,
    });
  }

  async getConnection() {
    const connection = await this.pool.getConnection();
    try {
      await connection.query("SET time_zone = '+00:00'");
      return connection;
    } catch (error) {
      connection.destroy();
      throw error;
    }
  }

  async execute(sql, params = []) {
    const connection = await this.getConnection();
    try {
      return await connection.execute(sql, params);
    } finally {
      connection.release();
    }
  }

  async checkConnection() {
    await this.execute('SELECT 1');
  }

  async close() {
    await this.pool.end();
  }
}

module.exports = new Database();
