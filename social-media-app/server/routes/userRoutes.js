const express = require('express');
const { createUser, updateUser, deleteUser, listUsers, login, updatePassword, searchUsersByName, followUser, unfollowUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/create', createUser);
router.put('/update/:id', auth, updateUser);
router.delete('/delete/:id', auth, deleteUser);
router.get('/list', auth, listUsers);
router.put('/update-password/:id', auth, updatePassword);
router.post('/login', login);
router.get('/search', auth, searchUsersByName);
router.put('/follow/:id', auth, followUser);
router.put('/unfollow/:id', auth, unfollowUser);

module.exports = router;
