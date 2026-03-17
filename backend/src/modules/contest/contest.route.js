const router = require('express').Router();
const ctrl = require('./contest.controller');
const validate = require('../../middleware/validate');
const { createContestSchema } = require('./contest.validation');
const { protect, adminOnly } = require('../../middleware/auth');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', protect, adminOnly, validate(createContestSchema), ctrl.create);
router.patch('/:id', protect, adminOnly, ctrl.update);
router.post('/join', protect, ctrl.join);

module.exports = router;
