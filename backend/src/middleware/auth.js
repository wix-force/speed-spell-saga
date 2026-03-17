const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');
const User = require('../modules/user/user.model');
const AppError = require('../errors/AppError');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    throw new AppError('Not authorized', 401);

  const decoded = jwt.verify(header.split(' ')[1], jwtSecret);
  const user = await User.findById(decoded.id).select('-password');
  if (!user) throw new AppError('User not found', 401);
  if (user.isBanned) throw new AppError('Account banned', 403);

  req.user = user;
  next();
});

const adminOnly = (req, _res, next) => {
  if (req.user.role !== 'admin') throw new AppError('Admin access required', 403);
  next();
};

module.exports = { protect, adminOnly };
