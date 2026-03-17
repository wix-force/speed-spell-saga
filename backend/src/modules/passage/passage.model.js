const mongoose = require('mongoose');

const passageSchema = new mongoose.Schema({
  text:       { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  language:   { type: String, default: 'english' },
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

passageSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Passage', passageSchema);
