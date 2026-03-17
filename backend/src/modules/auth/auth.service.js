const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const AppError = require('../../errors/AppError');
const { jwtSecret, jwtExpiresIn } = require('../../config/env');

const signToken = (id) => jwt.sign({ id }, jwtSecret, { expiresIn: jwtExpiresIn });

exports.register = async ({ username, email, password }) => {
  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) throw new AppError('Email or username already taken', 409);
  const user = await User.create({ username, email, password });
  const token = signToken(user._id);
  return { token, user: { id: user._id, username: user.username, email: user.email, role: user.role } };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password)))
    throw new AppError('Invalid credentials', 401);
  if (user.isBanned) throw new AppError('Account banned', 403);
  const token = signToken(user._id);
  return { token, user: { id: user._id, username: user.username, email: user.email, role: user.role } };
};

exports.getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  return user;
};
