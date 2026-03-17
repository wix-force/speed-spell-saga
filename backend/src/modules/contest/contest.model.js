const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  difficulty:   { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  startTime:    { type: Date, required: true },
  duration:     { type: Number, required: true }, // seconds
  maxAttempts:  { type: Number, default: 3, min: 1, max: 10 },
  passagePool:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Passage' }],
  randomPassage:  { type: Boolean, default: true },
  rankingMethod:  { type: String, enum: ['best', 'last', 'average'], default: 'best' },
  status:         { type: String, enum: ['upcoming', 'running', 'ended'], default: 'upcoming' },
  maxParticipants: { type: Number, default: 100 },
  participantsCount: { type: Number, default: 0 },
}, { timestamps: true });

contestSchema.index({ status: 1, startTime: 1 });

module.exports = mongoose.model('Contest', contestSchema);
