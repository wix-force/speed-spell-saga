const Attempt = require('./attempt.model');
const Contest = require('../contest/contest.model');
const AppError = require('../../errors/AppError');

exports.start = async (userId, contestId) => {
  const contest = await Contest.findById(contestId).populate('passagePool');
  if (!contest) throw new AppError('Contest not found', 404);
  if (contest.status !== 'running') throw new AppError('Contest is not running', 400);

  const userAttempts = await Attempt.find({ userId, contestId });
  if (userAttempts.length >= contest.maxAttempts)
    throw new AppError(`Max attempts (${contest.maxAttempts}) reached`, 400);

  // Prevent duplicate in-progress attempts
  const inProgress = userAttempts.find(a => a.status === 'in_progress');
  if (inProgress) throw new AppError('You have an attempt in progress', 400);

  // Select passage not yet used
  const usedPassageIds = userAttempts.map(a => a.passageId.toString());
  const available = contest.passagePool.filter(p => !usedPassageIds.includes(p._id.toString()));
  if (available.length === 0) throw new AppError('No more passages available', 400);

  let passage;
  if (contest.randomPassage) {
    passage = available[Math.floor(Math.random() * available.length)];
  } else {
    passage = available[0];
  }

  const attempt = await Attempt.create({
    userId,
    contestId,
    passageId: passage._id,
    attemptNumber: userAttempts.length + 1,
  });

  return { attempt, passage: { id: passage._id, text: passage.text, difficulty: passage.difficulty } };
};

exports.submit = async (userId, { attemptId, correctChars, totalTyped, errors }) => {
  const attempt = await Attempt.findOne({ _id: attemptId, userId, status: 'in_progress' });
  if (!attempt) throw new AppError('Attempt not found or already submitted', 404);

  const finishedAt = new Date();
  const minutes = (finishedAt - attempt.startedAt) / 60000;
  const wpm = Math.round((correctChars / 5) / Math.max(minutes, 0.01));
  const accuracy = Math.round((correctChars / Math.max(totalTyped, 1)) * 10000) / 100;

  attempt.correctChars = correctChars;
  attempt.totalTyped = totalTyped;
  attempt.errors = errors;
  attempt.wpm = wpm;
  attempt.accuracy = accuracy;
  attempt.status = 'completed';
  attempt.finishedAt = finishedAt;
  await attempt.save();

  return attempt;
};

exports.getUserAttempts = async (userId, contestId) => {
  return Attempt.find({ userId, contestId }).sort({ attemptNumber: 1 }).populate('passageId', 'text difficulty');
};
