const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Follow = require('../models/Follow');

// Create User
exports.createUser = async (req, res) => {
  const { name, mobile, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or Mobile number already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, mobile, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, mobile, email } = req.body;
  const userId = req.user._id;
  console.log(id);
  console.log(userId);
  try {
    if(userId.toString() !== id){
      return res.status(404).json({ error: 'You cannot update another user' });
    }
    const updatedData = {};
    if (name) updatedData.name = name;
    if (mobile) updatedData.mobile = mobile;
    if (email) updatedData.email = email;
    
    const user = await User.findByIdAndUpdate(id, updatedData, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    if(userId.toString() !== id){
      return res.status(404).json({ error: 'You cannot delete another user' });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Show list of users
exports.listUsers = async (req, res) => {
  const currentUserId = req.user._id;

  try {
    const users = await User.find({ _id: { $ne: currentUserId } }).select('-password');
    const followings = await Follow.find({ follower: currentUserId }).select('following');
    const followingIds = followings.map(follow => follow.following.toString());

    const usersWithFollowStatus = users.map(user => ({
      ...user.toObject(),
      isFollowing: followingIds.includes(user._id.toString())
    }));
    res.json(usersWithFollowStatus);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

exports.updatePassword = async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id;
  try {
    if(userId.toString() !== id){
      return res.status(404).json({ error: 'You cannot update password of another user' });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password' });
  }
};

exports.searchUsersByName = async (req, res) => {
  const { name } = req.query;
  try {
    const users = await User.find({ name: new RegExp(name, 'i') }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search users' });
  }
};

exports.followUser = async(req,res) => {
  const  userId  = req.params.id; 
  const  id  = req.user._id;
  try {
    if(userId.toString() === id){
      return res.status(404).json({ error: 'You cannot follow your account' });
    }
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingFollow = await Follow.findOne({ follower: id, following: userId });
    if (existingFollow) {
      return res.status(400).json({ error: 'You are already following this user' });
    }

    const follow = new Follow({ follower: id, following: userId });
    await follow.save();

    res.json({ message: `You are now following ${userToFollow.name}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to follow user' });
  }
}

exports.unfollowUser = async (req, res) => {
  const { id } = req.params; 
  const  userId  = req.user._id; 
  try {
    if(userId.toString() === id){
      return res.status(404).json({ error: 'You cannot unfollow your account' });
    }
    const userToUnfollow = await User.findById(id);
    if (!userToUnfollow) {
      return res.status(404).json({ error: 'User not found' });
    }

    const follow = await Follow.findOneAndDelete({ follower: userId, following: id });
    if (!follow) {
      return res.status(400).json({ error: 'You are not following this user' });
    }

    res.json({ message: `You have unfollowed ${userToUnfollow.name}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
};
