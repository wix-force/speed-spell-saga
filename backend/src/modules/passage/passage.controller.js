const svc = require('./passage.service');
const asyncHandler = require('../../utils/asyncHandler');
const sendResponse = require('../../utils/response');

exports.create = asyncHandler(async (req, res) => {
  const passage = await svc.create(req.body, req.user._id);
  sendResponse(res, 201, 'Passage created', passage);
});

exports.getAll = asyncHandler(async (req, res) => {
  const data = await svc.getAll(req.query);
  sendResponse(res, 200, 'Passages fetched', data);
});

exports.update = asyncHandler(async (req, res) => {
  const passage = await svc.update(req.params.id, req.body);
  sendResponse(res, 200, 'Passage updated', passage);
});

exports.remove = asyncHandler(async (req, res) => {
  await svc.remove(req.params.id);
  sendResponse(res, 200, 'Passage deleted');
});
