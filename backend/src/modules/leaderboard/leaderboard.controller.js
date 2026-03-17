const svc = require('./leaderboard.service');
const asyncHandler = require('../../utils/asyncHandler');
const sendResponse = require('../../utils/response');

exports.getLeaderboard = asyncHandler(async (req, res) => {
  const data = await svc.getLeaderboard(req.params.contestId);
  sendResponse(res, 200, 'Leaderboard', data);
});
