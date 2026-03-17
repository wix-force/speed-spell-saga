const router = require('express').Router();
const ctrl = require('./admin.controller');
const { protect, adminOnly } = require('../../middleware/auth');

router.use(protect, adminOnly);
router.get('/users', ctrl.getUsers);
router.patch('/ban/:userId', ctrl.banUser);
router.get('/analytics', ctrl.getAnalytics);

module.exports = router;
