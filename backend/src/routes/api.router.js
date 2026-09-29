const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');

// Mount routes
router.use('/users', userRoutes);
router.use('/auth', require('./auth.routes'));
router.use('/rescue', require('./rescue.routes'));

router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

module.exports = router;
