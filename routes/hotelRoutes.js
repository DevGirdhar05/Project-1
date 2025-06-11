const express = require('express');
const {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  searchHotels
} = require('../controllers/hotelController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// @route   GET /api/hotels/search
// @desc    Search hotels
// @access  Public
// Query params: ?query=luxury&location=delhi&minPrice=1000&maxPrice=5000&starRating=4
router.get('/search', searchHotels);

// @route   POST /api/hotels
// @desc    Add new hotel
// @access  Private/Admin
// Sample request body:
// {
//   "name": "Grand Palace Hotel",
//   "description": "A luxury hotel in the heart of the city",
//   "location": "Delhi",
//   "starRating": 5,
//   "amenities": ["WiFi", "Pool", "Gym", "Spa"],
//   "address": {
//     "street": "123 Main St",
//     "city": "Delhi",
//     "state": "Delhi",
//     "zipCode": "110001",
//     "country": "India"
//   },
//   "contact": {
//     "phone": "+91-11-12345678",
//     "email": "info@grandpalace.com"
//   }
// }
router.post('/', authMiddleware, isAdmin, validateRequest('createHotel'), createHotel);

// @route   GET /api/hotels
// @desc    Get list of hotels with optional filters
// @access  Public
// Query params: ?location=delhi&name=grand&star=5&page=1&limit=10&sortBy=starRating&sortOrder=desc
router.get('/', getHotels);

// @route   GET /api/hotels/:id
// @desc    Get hotel details by ID
// @access  Public
router.get('/:id', getHotelById);

// @route   PUT /api/hotels/:id
// @desc    Update hotel
// @access  Private/Admin
// Sample request body:
// {
//   "name": "Updated Hotel Name",
//   "description": "Updated description",
//   "starRating": 4,
//   "isActive": true
// }
router.put('/:id', authMiddleware, isAdmin, validateRequest('updateHotel'), updateHotel);

// @route   DELETE /api/hotels/:id
// @desc    Delete hotel (soft delete)
// @access  Private/Admin
router.delete('/:id', authMiddleware, isAdmin, deleteHotel);

module.exports = router;
