const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest', required: true },
  passageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Passage', required: true },
  attemptNumber: { type: Number, required: true },
  correctChars:  { type: Number, default: 0 },
  totalTyped:    { type: Number, default: 0 },
  wpm:      { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  errors:   { type: Number, default: 0 },
  status:   { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
  startedAt:  { type: Date, default: Date.now },
  finishedAt: { type: Date },
}, { timestamps: true });

attemptSchema.index({ userId: 1, contestId: 1 });
attemptSchema.index({ contestId: 1, wpm: -1 });

module.exports = mongoose.model('Attempt', attemptSchema);
