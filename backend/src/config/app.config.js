require('dotenv').config();

class AppConfig {
  constructor() {
    this.port = process.env.PORT || 5000;
    this.nodeEnv = process.env.NODE_ENV || 'development';
    this.clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  }
}

module.exports = new AppConfig();
