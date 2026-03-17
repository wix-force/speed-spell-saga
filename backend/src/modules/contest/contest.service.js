const Contest = require('./contest.model');
const AppError = require('../../errors/AppError');

exports.create = async (data) => Contest.create(data);

exports.getAll = async ({ page = 1, limit = 20, status }) => {
  const filter = status ? { status } : {};
  const contests = await Contest.find(filter)
    .sort({ startTime: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('passagePool', 'text difficulty');
  const total = await Contest.countDocuments(filter);
  return { contests, total, page, pages: Math.ceil(total / limit) };
};

exports.getById = async (id) => {
  const contest = await Contest.findById(id).populate('passagePool', 'text difficulty');
  if (!contest) throw new AppError('Contest not found', 404);
  return contest;
};

exports.update = async (id, data) => {
  const contest = await Contest.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!contest) throw new AppError('Contest not found', 404);
  return contest;
};

exports.join = async (contestId) => {
  const contest = await Contest.findById(contestId);
  if (!contest) throw new AppError('Contest not found', 404);
  if (contest.status !== 'running' && contest.status !== 'upcoming')
    throw new AppError('Contest not available to join', 400);
  if (contest.participantsCount >= contest.maxParticipants)
    throw new AppError('Contest is full', 400);
  contest.participantsCount += 1;
  await contest.save();
  return contest;
};
