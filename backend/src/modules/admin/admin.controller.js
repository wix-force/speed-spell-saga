const svc = require('./admin.service');
const asyncHandler = require('../../utils/asyncHandler');
const sendResponse = require('../../utils/response');

exports.getUsers = asyncHandler(async (req, res) => {
  const data = await svc.getUsers(req.query);
  sendResponse(res, 200, 'Users fetched', data);
});

exports.banUser = asyncHandler(async (req, res) => {
  const ban = req.body.ban !== false;
  const user = await svc.banUser(req.params.userId, ban);
  sendResponse(res, 200, `User ${ban ? 'banned' : 'unbanned'}`, user);
});

exports.getAnalytics = asyncHandler(async (req, res) => {
  const data = await svc.getAnalytics();
  sendResponse(res, 200, 'Analytics', data);
});
