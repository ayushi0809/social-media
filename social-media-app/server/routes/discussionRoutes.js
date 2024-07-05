const express = require('express');
const { createDiscussion, updateDiscussion, deleteDiscussion, getDiscussionsByTags, getDiscussionsByText, getAllDiscussion, getDiscussionsByID } = require('../controllers/discussionController');
const auth = require('../middleware/auth');
const multer = require('multer');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/create', auth, upload.single('image'), createDiscussion);
router.put('/update/:id', auth, upload.single('image'), updateDiscussion);
router.delete('/delete/:id', auth, deleteDiscussion);
router.get('/tags', auth, getDiscussionsByTags);
router.get('/text', auth, getDiscussionsByText);
router.get('/' , auth, getAllDiscussion);
router.get('/:id' , auth, getDiscussionsByID);

module.exports = router;
