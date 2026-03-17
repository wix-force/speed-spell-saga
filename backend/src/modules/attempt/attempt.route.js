const router = require('express').Router();
const ctrl = require('./attempt.controller');
const validate = require('../../middleware/validate');
const { submitSchema } = require('./attempt.validation');
const { protect } = require('../../middleware/auth');

router.use(protect);
router.post('/start/:contestId', ctrl.start);
router.post('/submit', validate(submitSchema), ctrl.submit);
router.get('/user/:contestId', ctrl.getUserAttempts);

module.exports = router;
