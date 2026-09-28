const app = require('./app');
const config = require('./config/app.config');
const database = require('./config/database');

let server;
let shuttingDown = false;

async function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  const timeout = setTimeout(() => process.exit(1), 10000);
  timeout.unref();
  if (server) await new Promise((resolve) => server.close(resolve));
  await database.close();
  process.exit(exitCode);
}

async function start() {
  try {
    await database.checkConnection();
    console.log('MySQL connected');
    server = app.listen(config.port, () => {
      console.log(`Server running at http://localhost:${config.port} (${config.nodeEnv})`);
    });
    server.on('error', (error) => {
      console.error('HTTP server failed:', error.code);
      void shutdown(1);
    });
  } catch (error) {
    console.error('MySQL connection failed. Check backend/.env:', error.code || error.message);
    await shutdown(1);
  }
}

process.on('SIGINT', () => void shutdown());
process.on('SIGTERM', () => void shutdown());
process.on('unhandledRejection', () => {
  console.error('Unhandled rejection. Shutting down...');
  void shutdown(1);
});

void start();
