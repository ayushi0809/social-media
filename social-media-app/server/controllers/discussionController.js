const Discussion = require('../models/Discussion');
const decodeURIComponent = require('querystring').decode;


// Create Discussion
exports.createDiscussion = async (req, res) => {
  const { text, hashtags } = req.body;
  const image = req.file ? req.file.path : null;
  // console.log(req.user);
  const hashtagsArray = hashtags ? hashtags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
  try {
    const discussion = new Discussion({ text, image, hashtags : hashtagsArray, createdBy: req.user._id });
    await discussion.save();
    res.status(201).json({ message: 'Discussion created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create discussion' });
  }
};

// Update Discussion
exports.updateDiscussion = async (req, res) => {
  const { id } = req.params;
  const { text, hashtags } = req.body;
  const image = req.file ? req.file.path : null;
  try {
    const post = await Discussion.findById(id);
    console.log(post.createdBy);
    console.log(req.user._id);
    if(post.createdBy.toString() !== req.user._id.toString()){
      return res.status(404).json({ error: 'This post was not created by the current logged in user' });
    }
    const updatedData = {};
    if (text) updatedData.text = text;
    if (hashtags) {
      const hashtagsArray = hashtags.split(',').map(tag => tag.trim()).filter(tag => tag);
      updatedData.hashtags = hashtagsArray;
    }
    if (image) updatedData.image = image;

    const discussion = await Discussion.findByIdAndUpdate(id, updatedData, { new: true });
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }
    res.json(discussion);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update discussion' });
  }
};

exports.getAllDiscussion = async (req, res) => {
  try {
    const post = await Discussion.find();
    res.json(post);
  }catch(eror){
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}

// Delete Discussion
exports.deleteDiscussion = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Discussion.findById(id);
    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'This post was not created by the current logged in user' });
    }
    await post.remove(); // Trigger the pre 'remove' middleware
    res.json({ message: 'Discussion and related comments and likes deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete discussion' });
  }
};

// Get list of discussions based on tags
exports.getDiscussionsByTags = async (req, res) => {
  const { tags } = req.query;
  try {
    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    console.log(tagsArray);
    const regexArray = tagsArray.map(tag => new RegExp(tag, 'i'));
    const discussions = await Discussion.find({ hashtags: { $in: regexArray  } });
    res.json(discussions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to get discussions' });
  }
};

// Get list of discussions based on text
exports.getDiscussionsByText = async (req, res) => {
  const { text } = req.query;
  try {
    const regText = new RegExp(text, 'i');
    const discussions = await Discussion.find({ text: {$in : regText} });
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get discussions' });
  }
};

exports.getDiscussionsByID = async(req, res) => {
  const id = req.params.id;
  try{
    const post = await Discussion.findById(id);
    res.json(post);
  }catch (error) {
    res.status(500).json({ error: 'Failed to get discussions' });
  }
}
