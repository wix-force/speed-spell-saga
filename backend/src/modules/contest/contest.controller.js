const svc = require('./contest.service');
const asyncHandler = require('../../utils/asyncHandler');
const sendResponse = require('../../utils/response');

exports.create = asyncHandler(async (req, res) => {
  const contest = await svc.create(req.body);
  sendResponse(res, 201, 'Contest created', contest);
});

exports.getAll = asyncHandler(async (req, res) => {
  const data = await svc.getAll(req.query);
  sendResponse(res, 200, 'Contests fetched', data);
});

exports.getById = asyncHandler(async (req, res) => {
  const contest = await svc.getById(req.params.id);
  sendResponse(res, 200, 'Contest details', contest);
});

exports.update = asyncHandler(async (req, res) => {
  const contest = await svc.update(req.params.id, req.body);
  sendResponse(res, 200, 'Contest updated', contest);
});

exports.join = asyncHandler(async (req, res) => {
  const contest = await svc.join(req.body.contestId);
  sendResponse(res, 200, 'Joined contest', contest);
});
