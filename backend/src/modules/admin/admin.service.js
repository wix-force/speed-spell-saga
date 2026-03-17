const User = require('../user/user.model');
const Contest = require('../contest/contest.model');
const Attempt = require('../attempt/attempt.model');
const AppError = require('../../errors/AppError');

exports.getUsers = async ({ page = 1, limit = 20, search }) => {
  const filter = search ? { username: { $regex: search, $options: 'i' } } : {};
  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await User.countDocuments(filter);
  return { users, total, page, pages: Math.ceil(total / limit) };
};

exports.banUser = async (userId, ban = true) => {
  const user = await User.findByIdAndUpdate(userId, { isBanned: ban }, { new: true });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

exports.getAnalytics = async () => {
  const [totalUsers, totalContests, totalAttempts, activeContests] = await Promise.all([
    User.countDocuments(),
    Contest.countDocuments(),
    Attempt.countDocuments(),
    Contest.countDocuments({ status: 'running' }),
  ]);

  const avgResult = await Attempt.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, avgWPM: { $avg: '$wpm' } } },
  ]);

  return {
    totalUsers,
    totalContests,
    totalAttempts,
    activeContests,
    averageWPM: Math.round(avgResult[0]?.avgWPM || 0),
  };
};
