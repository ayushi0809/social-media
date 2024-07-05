const Like = require('../models/Like');
const Discussion = require('../models/Discussion');

// Like a Post
exports.likePost = async (req, res) => {
  const  postId  = req.params.id;
  const  userId  = req.user._id;

  try {
    const post = await Discussion.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const existingLike = await Like.findOne({ createdBy: userId, post: postId });
    if (existingLike) {
      return res.status(400).json({ error: 'You have already liked this post' });
    }

    const like = new Like({ createdBy: userId, post: postId });
    await like.save();

    post.likes += 1; // Increment the like count
    await post.save();

    res.status(201).json({ message: 'Post liked successfully', like });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like post' });
  }
};

// Unlike a Post
exports.unlikePost = async (req, res) => {
  const postId  = req.params.id;
  const  userId  = req.user._id;

  try {
    const post = await Discussion.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const like = await Like.findOneAndDelete({ createdBy: userId, post: postId });
    if (!like) {
      return res.status(400).json({ error: 'You have not liked this post' });
    }
    post.likes -= 1;
    await post.save();

    res.json({ message: 'Post unliked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unlike post' });
  }
};

exports.getlike = async (req, res) => {
  const postId  = req.params.id;
  const  userId  = req.user._id;
  try{
  const like = await Like.findOne({ createdBy: userId, post: postId });
  if (like) {
    return res.status(201).json({ isLiked : true });
  }}catch (error) {
    res.status(500).json({ error: 'Failed to unlike post' });
  }
}
