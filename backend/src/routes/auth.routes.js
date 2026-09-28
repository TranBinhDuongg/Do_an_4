const express = require('express');
const { rateLimit } = require('express-rate-limit');
const controller = require('../controllers/auth.controller');
const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, statusCode: 429, message: 'Thử đăng nhập quá nhiều lần. Vui lòng thử lại sau 15 phút.' },
});

router.post('/login', loginLimiter, controller.login);
router.get('/me', controller.requireDispatcher, controller.me);

module.exports = router;
