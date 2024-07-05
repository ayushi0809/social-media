const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Discussion', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Like', likeSchema);
