const router = require('express').Router();
const ctrl = require('./passage.controller');
const validate = require('../../middleware/validate');
const { passageSchema } = require('./passage.validation');
const { protect, adminOnly } = require('../../middleware/auth');

router.use(protect, adminOnly);
router.post('/', validate(passageSchema), ctrl.create);
router.get('/', ctrl.getAll);
router.patch('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
