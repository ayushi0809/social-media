const express = require('express');
const { likePost, unlikePost, getlike } = require('../controllers/likeController');
const auth = require('../middleware/auth');

const router = express.Router();

router.put('/like/:id', auth, likePost);
router.put('/unlike/:id', auth, unlikePost);
router.get('/:id' , auth , getlike);

module.exports = router;
