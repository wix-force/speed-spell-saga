const Passage = require('./passage.model');
const AppError = require('../../errors/AppError');

exports.create = async (data, userId) => {
  return Passage.create({ ...data, createdBy: userId });
};

exports.getAll = async ({ page = 1, limit = 20, difficulty }) => {
  const filter = difficulty ? { difficulty } : {};
  const passages = await Passage.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await Passage.countDocuments(filter);
  return { passages, total, page, pages: Math.ceil(total / limit) };
};

exports.update = async (id, data) => {
  const passage = await Passage.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!passage) throw new AppError('Passage not found', 404);
  return passage;
};

exports.remove = async (id) => {
  const passage = await Passage.findByIdAndDelete(id);
  if (!passage) throw new AppError('Passage not found', 404);
};
