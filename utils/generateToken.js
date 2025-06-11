const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  try {
    const payload = {
      id: userId
    };

    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const options = {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d', // Default to 7 days
      issuer: 'hotel-booking-api',
      audience: 'hotel-booking-users'
    };

    const token = jwt.sign(payload, secret, options);
    return token;
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw new Error('Failed to generate authentication token');
  }
};

// Function to verify token (utility function)
const verifyToken = (token) => {
  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw error;
  }
};

// Function to decode token without verification (for debugging)
const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};
