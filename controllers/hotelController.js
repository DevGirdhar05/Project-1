const Hotel = require('../models/Hotel');
const Room = require('../models/Room');

// @desc    Add new hotel
// @route   POST /api/hotels
// @access  Private/Admin
const createHotel = async (req, res, next) => {
  try {
    const { 
      name, 
      description, 
      location, 
      starRating, 
      amenities, 
      contact 
    } = req.body;

    const hotel = await Hotel.create({
      name,
      description,
      location,
      starRating,
      amenities: amenities || [],
      contact: contact || {}
    });

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: { hotel }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res, next) => {
  try {
    const { 
      location,
      name,
      star,
      starRating,
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (location) {
      filter.location = location;
    }
    
    if (name) {
      filter.name = name;
    }
    
    if (star || starRating) {
      filter.starRating = parseInt(star || starRating);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const hotels = await Hotel.find(filter, {
      sort,
      skip,
      limit: parseInt(limit)
    });

    // Get total count for pagination
    const totalHotels = await Hotel.countDocuments(filter);
    const totalPages = Math.ceil(totalHotels / parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Hotels retrieved successfully',
      data: {
        hotels,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalHotels,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hotel retrieved successfully',
      data: { hotel }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hotel updated successfully',
      data: { hotel }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      });
    }

    // Check if hotel has any rooms
    const roomCount = await Room.countDocuments({ hotelId: req.params.id });
    
    if (roomCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete hotel with existing rooms. Please delete all rooms first.'
      });
    }

    await Hotel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search hotels
// @route   GET /api/hotels/search
// @access  Public
const searchHotels = async (req, res, next) => {
  try {
    const { 
      query, 
      location, 
      checkIn, 
      checkOut, 
      guests,
      minPrice,
      maxPrice,
      starRating,
      amenities,
      page = 1,
      limit = 10
    } = req.query;

    const filter = { isActive: true };
    
    // Add search filters
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    
    if (starRating) {
      const ratings = starRating.split(',').map(r => parseInt(r));
      filter.starRating = { $in: ratings };
    }
    
    if (amenities) {
      const amenityList = amenities.split(',');
      filter.amenities = { $in: amenityList };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const hotels = await Hotel.find(filter, {
      skip,
      limit: parseInt(limit)
    });

    // Get total count
    const totalHotels = await Hotel.countDocuments(filter);
    const totalPages = Math.ceil(totalHotels / parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Hotels search completed',
      data: {
        hotels,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalHotels,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  searchHotels
};