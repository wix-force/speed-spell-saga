const router = require('express').Router();
const ctrl = require('./auth.controller');
const validate = require('../../middleware/validate');
const { registerSchema, loginSchema } = require('./auth.validation');
const { protect } = require('../../middleware/auth');

router.post('/register', validate(registerSchema), ctrl.register);
router.post('/login', validate(loginSchema), ctrl.login);
router.get('/me', protect, ctrl.getMe);

module.exports = router;
