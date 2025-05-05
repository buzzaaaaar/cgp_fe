const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  console.log('Auth middleware - Token received:', token ? 'Yes' : 'No');

  // Check if no token
  if (!token) {
    console.log('Auth middleware - No token found');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    console.log('Auth middleware - Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Token decoded:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware - Token verification failed:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 