const Attempt = require('../attempt/attempt.model');
const Contest = require('../contest/contest.model');
const AppError = require('../../errors/AppError');

exports.getLeaderboard = async (contestId) => {
  const contest = await Contest.findById(contestId);
  if (!contest) throw new AppError('Contest not found', 404);

  let pipeline = [];

  if (contest.rankingMethod === 'best') {
    pipeline = [
      { $match: { contestId: contest._id, status: 'completed' } },
      { $sort: { wpm: -1 } },
      { $group: {
        _id: '$userId',
        wpm: { $max: '$wpm' },
        accuracy: { $first: '$accuracy' },
        attemptUsed: { $first: '$attemptNumber' },
      }},
      { $sort: { wpm: -1 } },
    ];
  } else if (contest.rankingMethod === 'last') {
    pipeline = [
      { $match: { contestId: contest._id, status: 'completed' } },
      { $sort: { attemptNumber: -1 } },
      { $group: {
        _id: '$userId',
        wpm: { $first: '$wpm' },
        accuracy: { $first: '$accuracy' },
        attemptUsed: { $first: '$attemptNumber' },
      }},
      { $sort: { wpm: -1 } },
    ];
  } else {
    // average
    pipeline = [
      { $match: { contestId: contest._id, status: 'completed' } },
      { $group: {
        _id: '$userId',
        wpm: { $avg: '$wpm' },
        accuracy: { $avg: '$accuracy' },
        attemptUsed: { $sum: 1 },
      }},
      { $sort: { wpm: -1 } },
    ];
  }

  pipeline.push(
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: {
      _id: 0,
      userId: '$_id',
      username: '$user.username',
      avatar: '$user.avatar',
      wpm: { $round: ['$wpm', 0] },
      accuracy: { $round: ['$accuracy', 2] },
      attemptUsed: 1,
    }}
  );

  const results = await Attempt.aggregate(pipeline);
  return results.map((r, i) => ({ rank: i + 1, ...r }));
};
