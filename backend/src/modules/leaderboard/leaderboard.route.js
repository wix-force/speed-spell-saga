const router = require('express').Router();
const ctrl = require('./leaderboard.controller');

router.get('/:contestId', ctrl.getLeaderboard);

module.exports = router;
