const mongoose = require('mongoose');
const Comment = require('./Comment');
const Like = require('./Like');

const discussionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  image: { type: String },
  hashtags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdOn: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 }
});

discussionSchema.pre('remove', async function (next) {
  try {
    await Comment.deleteMany({ post: this._id });
    await Like.deleteMany({ post: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Discussion', discussionSchema);
