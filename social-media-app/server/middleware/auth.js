const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    const user =  await User.findById(decoded.userId).select('-password');
    if (!user) {
      res.status(401).json({ error: 'No user find' });
  }
    req.user = user;
    next();
  } catch (error) {
    // console.log(error);
    res.status(401).json({ error: 'Token is not valid' });
  }
};
