const express = require('express');
const { createComment, getComments, likeComment, unlikeComment, updateComment, deleteComment } = require('../controllers/commentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/create', auth, createComment);
router.get('/:postId', getComments);
router.put('/like/:commentId', auth, likeComment);
router.put('/unlike/:commentId', auth, unlikeComment);
router.put('/update/:commentId', auth, updateComment); // New route to update a comment
router.delete('/delete/:commentId', auth, deleteComment); 
router.get('/:id' , auth, )

module.exports = router;
