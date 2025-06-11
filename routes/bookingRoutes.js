const express = require('express');
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
  getBookingStats
} = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
// Sample request body:
// {
//   "roomId": "60d5ec49f1b2c8b1b8c8d456",
//   "startDate": "2024-01-15",
//   "endDate": "2024-01-20",
//   "guests": 2,
//   "guestDetails": {
//     "primaryGuest": {
//       "name": "John Doe",
//       "email": "john@example.com",
//       "phone": "+91-9876543210"
//     },
//     "additionalGuests": [
//       {
//         "name": "Jane Doe",
//         "age": 28
//       }
//     ]
//   },
//   "specialRequests": "Late check-in requested",
//   "paymentMethod": "credit_card"
// }
router.post('/', authMiddleware, validateRequest('createBooking'), createBooking);

// @route   GET /api/bookings/stats
// @desc    Get booking statistics
// @access  Private/Admin
router.get('/stats', authMiddleware, isAdmin, getBookingStats);

// @route   GET /api/bookings/all
// @desc    Get all bookings (Admin only)
// @access  Private/Admin
// Query params: ?status=confirmed&hotelId=123&userId=456&page=1&limit=10&sortBy=createdAt&sortOrder=desc
router.get('/all', authMiddleware, isAdmin, getAllBookings);

// @route   GET /api/bookings
// @desc    Get bookings of logged-in user
// @access  Private
// Query params: ?status=confirmed&page=1&limit=10&sortBy=startDate&sortOrder=asc
router.get('/', authMiddleware, getUserBookings);

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', authMiddleware, getBookingById);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
// Sample request body:
// {
//   "cancelReason": "Change of plans"
// }
router.put('/:id/cancel', authMiddleware, validateRequest('cancelBooking'), cancelBooking);

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (Admin only)
// @access  Private/Admin
// Sample request body:
// {
//   "status": "completed",
//   "paymentStatus": "paid"
// }
router.put('/:id/status', authMiddleware, isAdmin, validateRequest('updateBookingStatus'), updateBookingStatus);

module.exports = router;
