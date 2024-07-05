const Comment = require('../models/Comment');
const Discussion = require('../models/Discussion');

// Create Comment
exports.createComment = async (req, res) => {
  const { text, postId, parentCommentId } = req.body;
  const userId = req.user._id;

  try {
    const post = await Discussion.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = new Comment({ text, createdBy: userId, post: postId, parentComment: parentCommentId || null });

    if (parentCommentId) {
      const parentComment = await Comment.findOne({_id : parentCommentId , post:postId});
      if (!parentComment) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }
      parentComment.replies.push(comment._id);
      await parentComment.save();
      await comment.save();
      return res.status(201).json({ message: 'Reply created successfully', parentComment });
    }

    await comment.save();
    res.status(201).json({ message: 'Comment created successfully', comment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
};

// Get Comments for a Post
exports.getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Discussion.findById(postId);
    if(!post){
      return res.status(404).json({ error: 'Post not found' });
    }
    const comments = await Comment.find({ post: postId }).populate('createdBy', 'name').populate({
      path: 'replies',
      populate: { path: 'createdBy', select: 'name' }
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get comments' });
  }
};
exports.likeComment = async (req, res) => {
    const { commentId } = req.params;
    const userId  = req.user._id;
  
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
  
      if (comment.likes.includes(userId)) {
        return res.status(400).json({ error: 'You have already liked this comment' });
      }
  
      comment.likes.push(userId);
      await comment.save();
  
      res.json({ message: 'Comment liked successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to like comment' });
    }
  };

  exports.unlikeComment = async (req, res) => {
    const { commentId } = req.params;
    const  userId  = req.user._id;
  
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
  
      if (!comment.likes.includes(userId.toString())) {
        return res.status(400).json({ error: 'You have not liked this comment' });
      }
  
      comment.likes = comment.likes.filter(id => id.toString() !== userId.toString());
      await comment.save();
  
      res.json({ message: 'Comment unliked successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to unlike comment' });
    }
  };

  exports.updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const  userId  = req.user._id;
  
    try {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
  
      if (comment.createdBy.toString() !== userId) {
        return res.status(403).json({ error: 'You are not authorized to update this comment' });
      }
  
      comment.text = text;
      await comment.save();
  
      res.json({ message: 'Comment updated successfully', comment });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update comment' });
    }
  };
  
  // Delete Comment
  exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const  userId  = req.user._id;
  
    try {
      const comment = await Comment.findById(commentId);
      console.log(comment);
      const post = await Discussion.findById(comment.post);
      console.log(post);
      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      if (comment.createdBy.toString() !== userId.toString() && post.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({ error: 'You are not authorized to delete this comment' });
      }
  
      await comment.remove();
  
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to delete comment' });
    }
  };

  // exports.getCommentReply = async (req, res) => {
  //   const { commentId } = req.params;
  //   try {
  //     const comments = await Comment.find(commentId).populate('createdBy', 'name').populate({
  //       path: 'replies',
  //       populate: { path: 'createdBy', select: 'name' }
  //     });
  //     console.log(comments);
  //   }catch(error){
  //     res.status(500).json({ error: 'Failed to fetch comment' });
  //   }
  // }
