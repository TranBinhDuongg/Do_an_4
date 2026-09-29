const router = require('express').Router();
const { rateLimit } = require('express-rate-limit');
const Service = require('../services/rescue-session.service');
const sessions = require('../repositories/rescue-session.repository');
const AppError = require('../utils/app-error');
const service = new Service(require('../repositories/auth.repository'), sessions, process.env.JWT_SECRET);
const handle = fn => async (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  try { res.json({ success: true, data: await fn(req) }); } catch (error) { next(error); }
};
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false,
  message: { success: false, message: 'Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.' } });
router.post('/login', limiter, handle(req => service.login(req.body)));
router.post('/refresh', limiter, handle(req => service.refresh(req.body)));
router.post('/logout', limiter, handle(async req => { await service.logout(req.body); return null; }));
router.get('/me', handle(req => service.auth.authenticate(req.get('Authorization'))));
router.post('/device', limiter, handle(async req => {
  const user = await service.auth.authenticate(req.get('Authorization'));
  const token = req.body?.pushToken;
  if (typeof token !== 'string' || !/^(ExponentPushToken|ExpoPushToken)\[[A-Za-z0-9_-]+\]$/.test(token) || token.length > 255) throw new AppError('Thiết bị không hợp lệ.', 400);
  if (!await sessions.setPush(service.token(req.body?.refreshToken), token, user.id)) throw new AppError('Phiên đã hết hạn.', 401);
  return { registered: true };
}));
module.exports = router;
