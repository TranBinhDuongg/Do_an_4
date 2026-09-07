const app = require('./app');
const config = require('./config/app.config');

const server = app.listen(config.port, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${config.port} (${config.nodeEnv})`);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Đang tắt server...', err);
  server.close(() => process.exit(1));
});
