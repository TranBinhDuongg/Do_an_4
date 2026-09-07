const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/app.config');
const apiRouter = require('./routes/api.router');
const errorHandler = require('./middlewares/error.middleware');

class App {
  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandler();
  }

  setupMiddlewares() {
    this.app.use(cors({ origin: config.clientUrl, credentials: true }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan('dev'));
  }

  setupRoutes() {
    this.app.use('/api', apiRouter);
    this.app.get('/', (req, res) => {
      res.json({ message: 'Backend API 3-Layer OOP is running 🚀' });
    });
  }

  setupErrorHandler() {
    this.app.use(errorHandler);
  }

  getExpressApp() {
    return this.app;
  }
}

module.exports = new App().getExpressApp();
