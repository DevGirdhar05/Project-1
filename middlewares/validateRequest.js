const validateRequest = (validationType) => {
  return (req, res, next) => {
    const { body } = req;
    let errors = [];

    switch (validationType) {
      case 'register':
        if (!body.name || body.name.trim().length < 2) {
          errors.push('Name is required and must be at least 2 characters long');
        }
        if (!body.email || !isValidEmail(body.email)) {
          errors.push('Valid email is required');
        }
        if (!body.password || body.password.length < 6) {
          errors.push('Password is required and must be at least 6 characters long');
        }
        if (body.role && !['user', 'admin'].includes(body.role)) {
          errors.push('Role must be either "user" or "admin"');
        }
        break;

      case 'login':
        if (!body.email || !isValidEmail(body.email)) {
          errors.push('Valid email is required');
        }
        if (!body.password) {
          errors.push('Password is required');
        }
        break;

      case 'updateProfile':
        if (body.name && body.name.trim().length < 2) {
          errors.push('Name must be at least 2 characters long');
        }
        if (body.email && !isValidEmail(body.email)) {
          errors.push('Valid email format is required');
        }
        break;

      case 'createHotel':
        if (!body.name || body.name.trim().length < 3) {
          errors.push('Hotel name is required and must be at least 3 characters long');
        }
        if (!body.description || body.description.trim().length < 10) {
          errors.push('Hotel description is required and must be at least 10 characters long');
        }
        if (!body.location || body.location.trim().length < 3) {
          errors.push('Hotel location is required and must be at least 3 characters long');
        }
        if (!body.starRating || !Number.isInteger(body.starRating) || body.starRating < 1 || body.starRating > 5) {
          errors.push('Star rating is required and must be an integer between 1 and 5');
        }
        if (body.contact && body.contact.email && !isValidEmail(body.contact.email)) {
          errors.push('Valid contact email format is required');
        }
        break;

      case 'updateHotel':
        if (body.name && body.name.trim().length < 3) {
          errors.push('Hotel name must be at least 3 characters long');
        }
        if (body.description && body.description.trim().length < 10) {
          errors.push('Hotel description must be at least 10 characters long');
        }
        if (body.location && body.location.trim().length < 3) {
          errors.push('Hotel location must be at least 3 characters long');
        }
        if (body.starRating && (!Number.isInteger(body.starRating) || body.starRating < 1 || body.starRating > 5)) {
          errors.push('Star rating must be an integer between 1 and 5');
        }
        if (body.contact && body.contact.email && !isValidEmail(body.contact.email)) {
          errors.push('Valid contact email format is required');
        }
        break;

      case 'createRoom':
        if (!body.hotelId || !isValidObjectId(body.hotelId)) {
          errors.push('Valid hotel ID is required');
        }
        if (!body.roomNumber || body.roomNumber.trim().length < 1) {
          errors.push('Room number is required');
        }
        if (!body.roomType || !['Single', 'Double', 'Twin', 'Suite', 'Deluxe', 'Standard'].includes(body.roomType)) {
          errors.push('Valid room type is required (Single, Double, Twin, Suite, Deluxe, Standard)');
        }
        if (!body.pricePerNight || isNaN(body.pricePerNight) || body.pricePerNight < 0) {
          errors.push('Valid price per night is required (must be a positive number)');
        }
        if (!body.maxGuests || !Number.isInteger(body.maxGuests) || body.maxGuests < 1 || body.maxGuests > 10) {
          errors.push('Max guests is required and must be an integer between 1 and 10');
        }
        break;

      case 'updateRoom':
        if (body.pricePerNight && (isNaN(body.pricePerNight) || body.pricePerNight < 0)) {
          errors.push('Price per night must be a positive number');
        }
        if (body.maxGuests && (!Number.isInteger(body.maxGuests) || body.maxGuests < 1 || body.maxGuests > 10)) {
          errors.push('Max guests must be an integer between 1 and 10');
        }
        if (body.roomType && !['Single', 'Double', 'Twin', 'Suite', 'Deluxe', 'Standard'].includes(body.roomType)) {
          errors.push('Valid room type is required (Single, Double, Twin, Suite, Deluxe, Standard)');
        }
        break;

      case 'createBooking':
        if (!body.roomId || !isValidObjectId(body.roomId)) {
          errors.push('Valid room ID is required');
        }
        if (!body.startDate || !isValidDate(body.startDate)) {
          errors.push('Valid start date is required (YYYY-MM-DD format)');
        }
        if (!body.endDate || !isValidDate(body.endDate)) {
          errors.push('Valid end date is required (YYYY-MM-DD format)');
        }
        if (body.startDate && body.endDate && new Date(body.startDate) >= new Date(body.endDate)) {
          errors.push('End date must be after start date');
        }
        if (!body.guests || !Number.isInteger(body.guests) || body.guests < 1) {
          errors.push('Number of guests is required and must be at least 1');
        }
        if (!body.guestDetails || !body.guestDetails.primaryGuest) {
          errors.push('Primary guest details are required');
        } else {
          const primaryGuest = body.guestDetails.primaryGuest;
          if (!primaryGuest.name || primaryGuest.name.trim().length < 2) {
            errors.push('Primary guest name is required and must be at least 2 characters long');
          }
          if (!primaryGuest.email || !isValidEmail(primaryGuest.email)) {
            errors.push('Valid primary guest email is required');
          }
          if (!primaryGuest.phone || primaryGuest.phone.trim().length < 10) {
            errors.push('Primary guest phone is required and must be at least 10 characters long');
          }
        }
        break;

      case 'cancelBooking':
        // Optional validation for cancel reason
        if (body.cancelReason && body.cancelReason.length > 500) {
          errors.push('Cancel reason cannot exceed 500 characters');
        }
        break;

      case 'updateBookingStatus':
        if (body.status && !['confirmed', 'cancelled', 'completed', 'pending'].includes(body.status)) {
          errors.push('Status must be one of: confirmed, cancelled, completed, pending');
        }
        if (body.paymentStatus && !['pending', 'paid', 'refunded', 'failed'].includes(body.paymentStatus)) {
          errors.push('Payment status must be one of: pending, paid, refunded, failed');
        }
        break;

      default:
        // No validation rules for this type
        break;
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

// Helper functions
const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

module.exports = validateRequest;
