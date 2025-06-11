const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

// @desc    Add room to a hotel
// @route   POST /api/rooms
// @access  Private/Admin
const createRoom = async (req, res, next) => {
  try {
    const {
      hotelId,
      roomNumber,
      roomType,
      pricePerNight,
      amenities,
      maxGuests,
      description,
      images,
      floor,
      size
    } = req.body;

    // Check if hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Check if room number already exists in this hotel
    const existingRoom = await Room.findOne({ 
      hotelId, 
      roomNumber 
    });
    
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: 'Room number already exists in this hotel'
      });
    }

    const room = await Room.create({
      hotelId,
      roomNumber,
      roomType,
      pricePerNight,
      amenities: amenities || [],
      maxGuests,
      description,
      images: images || [],
      floor,
      size
    });

    // Populate hotel information
    await room.populate('hotelId', 'name location');

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: { room }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List rooms for a hotel with filters
// @route   GET /api/rooms
// @access  Public
const getRooms = async (req, res, next) => {
  try {
    const {
      hotelId,
      roomType,
      priceMin,
      priceMax,
      amenities,
      maxGuests,
      isAvailable,
      page = 1,
      limit = 10,
      sortBy = 'pricePerNight',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (hotelId) {
      filter.hotelId = hotelId;
    }
    
    if (roomType) {
      filter.roomType = roomType;
    }
    
    if (priceMin || priceMax) {
      filter.pricePerNight = {};
      if (priceMin) filter.pricePerNight.$gte = parseFloat(priceMin);
      if (priceMax) filter.pricePerNight.$lte = parseFloat(priceMax);
    }
    
    if (amenities) {
      const amenityList = amenities.split(',').map(a => a.trim());
      filter.amenities = { $in: amenityList };
    }
    
    if (maxGuests) {
      filter.maxGuests = { $gte: parseInt(maxGuests) };
    }
    
    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === 'true';
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const rooms = await Room.find(filter)
      .populate('hotelId', 'name location starRating')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalRooms = await Room.countDocuments(filter);
    const totalPages = Math.ceil(totalRooms / parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Rooms retrieved successfully',
      data: {
        rooms,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRooms,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get room details
// @route   GET /api/rooms/:id
// @access  Public
const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('hotelId', 'name description location starRating amenities contact');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Room retrieved successfully',
      data: { room }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room information
// @route   PUT /api/rooms/:id
// @access  Private/Admin
const updateRoom = async (req, res, next) => {
  try {
    const {
      roomNumber,
      roomType,
      pricePerNight,
      amenities,
      maxGuests,
      isAvailable,
      description,
      images,
      floor,
      size
    } = req.body;

    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if room number is being changed and if it conflicts
    if (roomNumber && roomNumber !== room.roomNumber) {
      const existingRoom = await Room.findOne({
        hotelId: room.hotelId,
        roomNumber,
        _id: { $ne: req.params.id }
      });

      if (existingRoom) {
        return res.status(400).json({
          success: false,
          message: 'Room number already exists in this hotel'
        });
      }
    }

    // Update fields
    const updateData = {};
    if (roomNumber !== undefined) updateData.roomNumber = roomNumber;
    if (roomType !== undefined) updateData.roomType = roomType;
    if (pricePerNight !== undefined) updateData.pricePerNight = pricePerNight;
    if (amenities !== undefined) updateData.amenities = amenities;
    if (maxGuests !== undefined) updateData.maxGuests = maxGuests;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    if (description !== undefined) updateData.description = description;
    if (images !== undefined) updateData.images = images;
    if (floor !== undefined) updateData.floor = floor;
    if (size !== undefined) updateData.size = size;

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('hotelId', 'name location');

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: { room: updatedRoom }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
const deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if room has any active bookings
    const activeBookings = await Booking.countDocuments({
      roomId: req.params.id,
      status: { $in: ['confirmed', 'pending'] },
      endDate: { $gte: new Date() }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with active bookings'
      });
    }

    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check room availability
// @route   GET /api/rooms/:id/availability
// @access  Public
const checkRoomAvailability = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const roomId = req.params.id;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      roomId,
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        {
          startDate: { $lte: start },
          endDate: { $gt: start }
        },
        {
          startDate: { $lt: end },
          endDate: { $gte: end }
        },
        {
          startDate: { $gte: start },
          endDate: { $lte: end }
        }
      ]
    });

    const isAvailable = room.isAvailable && overlappingBookings.length === 0;

    res.status(200).json({
      success: true,
      message: 'Availability checked successfully',
      data: {
        roomId,
        startDate: start,
        endDate: end,
        isAvailable,
        room: {
          roomNumber: room.roomNumber,
          roomType: room.roomType,
          pricePerNight: room.pricePerNight
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  checkRoomAvailability
};
