const router = require('express').Router();

router.use('/auth', require('../modules/auth/auth.route'));
router.use('/passages', require('../modules/passage/passage.route'));
router.use('/contests', require('../modules/contest/contest.route'));
router.use('/attempt', require('../modules/attempt/attempt.route'));
router.use('/leaderboard', require('../modules/leaderboard/leaderboard.route'));
router.use('/admin', require('../modules/admin/admin.route'));

module.exports = router;
