const express = require('express');
const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  checkRoomAvailability
} = require('../controllers/roomController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

// @route   POST /api/rooms
// @desc    Add room to a hotel
// @access  Private/Admin
// Sample request body:
// {
//   "hotelId": "60d5ec49f1b2c8b1b8c8d123",
//   "roomNumber": "101",
//   "roomType": "Deluxe",
//   "pricePerNight": 2500,
//   "amenities": ["WiFi", "AC", "TV", "Minibar"],
//   "maxGuests": 2,
//   "description": "Spacious deluxe room with city view",
//   "images": ["https://example.com/room1.jpg"],
//   "floor": 1,
//   "size": 35
// }
router.post('/', authMiddleware, isAdmin, validateRequest('createRoom'), createRoom);

// @route   GET /api/rooms
// @desc    List rooms with filters
// @access  Public
// Query params: ?hotelId=123&roomType=Deluxe&priceMin=1000&priceMax=4000&amenities=WiFi,AC&maxGuests=2&isAvailable=true&page=1&limit=10
router.get('/', getRooms);

// @route   GET /api/rooms/:id/availability
// @desc    Check room availability
// @access  Public
// Query params: ?startDate=2024-01-15&endDate=2024-01-20
router.get('/:id/availability', checkRoomAvailability);

// @route   GET /api/rooms/:id
// @desc    Get room details
// @access  Public
router.get('/:id', getRoomById);

// @route   PUT /api/rooms/:id
// @desc    Update room information
// @access  Private/Admin
// Sample request body:
// {
//   "pricePerNight": 3000,
//   "amenities": ["WiFi", "AC", "TV", "Minibar", "Balcony"],
//   "isAvailable": true,
//   "description": "Updated room description"
// }
router.put('/:id', authMiddleware, isAdmin, validateRequest('updateRoom'), updateRoom);

// @route   DELETE /api/rooms/:id
// @desc    Delete room
// @access  Private/Admin
router.delete('/:id', authMiddleware, isAdmin, deleteRoom);

module.exports = router;
