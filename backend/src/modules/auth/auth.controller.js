const authService = require('./auth.service');
const asyncHandler = require('../../utils/asyncHandler');
const sendResponse = require('../../utils/response');

exports.register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  sendResponse(res, 201, 'Registration successful', data);
});

exports.login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  sendResponse(res, 200, 'Login successful', data);
});

exports.getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  sendResponse(res, 200, 'User profile', user);
});
