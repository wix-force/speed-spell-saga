const AppError = require('../errors/AppError');

const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const msg = result.error.errors.map(e => e.message).join(', ');
    throw new AppError(msg, 400);
  }
  req.body = result.data;
  next();
};

module.exports = validate;
