const express = require('express');
const { 
  register, 
  login, 
  getProfile, 
  updateProfile 
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
// Sample request body:
// {
//   "name": "John Doe",
//   "email": "john@example.com",
//   "password": "password123",
//   "role": "user" // optional, defaults to "user"
// }
router.post('/register', validateRequest('register'), register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
// Sample request body:
// {
//   "email": "john@example.com",
//   "password": "password123"
// }
router.post('/login', validateRequest('login'), login);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
// Headers: Authorization: Bearer <token>
router.get('/profile', authMiddleware, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
// Sample request body:
// {
//   "name": "John Updated",
//   "email": "johnupdated@example.com"
// }
router.put('/profile', authMiddleware, validateRequest('updateProfile'), updateProfile);

module.exports = router;
