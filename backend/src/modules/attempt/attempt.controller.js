const svc = require('./attempt.service');
const asyncHandler = require('../../utils/asyncHandler');
const sendResponse = require('../../utils/response');

exports.start = asyncHandler(async (req, res) => {
  const data = await svc.start(req.user._id, req.params.contestId);
  sendResponse(res, 201, 'Attempt started', data);
});

exports.submit = asyncHandler(async (req, res) => {
  const attempt = await svc.submit(req.user._id, req.body);
  sendResponse(res, 200, 'Attempt submitted', attempt);
});

exports.getUserAttempts = asyncHandler(async (req, res) => {
  const attempts = await svc.getUserAttempts(req.user._id, req.params.contestId);
  sendResponse(res, 200, 'User attempts', attempts);
});
