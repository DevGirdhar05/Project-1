const db = require('./server/storage');
const { rooms } = require('./shared/schema');

const indianRooms = [
  // The Taj Mahal Palace - Mumbai (Hotel ID: 6)
  {
    hotelId: 6,
    roomNumber: 'TMH-101',
    roomType: 'Deluxe',
    description: 'Elegant room with harbor view and classic furnishings',
    pricePerNight: '25000.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Minibar', 'Sea View', 'Room Service']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },
  {
    hotelId: 6,
    roomNumber: 'TMH-201',
    roomType: 'Suite',
    description: 'Luxury suite with panoramic harbor views and separate living area',
    pricePerNight: '45000.00',
    maxGuests: 4,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Minibar', 'Sea View', 'Butler Service', 'Balcony']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // ITC Grand Chola - Chennai (Hotel ID: 7)
  {
    hotelId: 7,
    roomNumber: 'IGC-301',
    roomType: 'Deluxe',
    description: 'Spacious room with contemporary design and city views',
    pricePerNight: '18000.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Minibar', 'City View', 'Work Desk']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },
  {
    hotelId: 7,
    roomNumber: 'IGC-401',
    roomType: 'Suite',
    description: 'Presidential suite with traditional Chola architecture elements',
    pricePerNight: '35000.00',
    maxGuests: 4,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Minibar', 'Living Room', 'Butler Service']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // The Oberoi New Delhi (Hotel ID: 8)
  {
    hotelId: 8,
    roomNumber: 'OND-101',
    roomType: 'Deluxe',
    description: 'Modern room with city skyline views',
    pricePerNight: '22000.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Minibar', 'City View', 'Marble Bathroom']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // Taj Lake Palace - Udaipur (Hotel ID: 9)
  {
    hotelId: 9,
    roomNumber: 'TLP-201',
    roomType: 'Deluxe',
    description: 'Royal room with lake views and traditional Rajasthani decor',
    pricePerNight: '40000.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Lake View', 'Heritage Decor', 'Royal Treatment']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // The Leela Palace Bangalore (Hotel ID: 10)
  {
    hotelId: 10,
    roomNumber: 'LPB-301',
    roomType: 'Deluxe',
    description: 'Contemporary room with tech-friendly amenities',
    pricePerNight: '15000.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Work Station', 'Tech Support', 'High-Speed Internet']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // The Grand Hotel Kolkata (Hotel ID: 11)
  {
    hotelId: 11,
    roomNumber: 'GHK-201',
    roomType: 'Deluxe',
    description: 'Colonial-style room with cultural heritage touches',
    pricePerNight: '8000.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Heritage Decor', 'Cultural Artifacts']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // Goa Marriott Resort & Spa (Hotel ID: 12)
  {
    hotelId: 12,
    roomNumber: 'GMR-101',
    roomType: 'Double',
    description: 'Beach-facing room with tropical design',
    pricePerNight: '12000.00',
    maxGuests: 3,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Beach View', 'Balcony', 'Beach Access']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // Hotel Clarks Amer - Jaipur (Hotel ID: 13)
  {
    hotelId: 13,
    roomNumber: 'HCA-201',
    roomType: 'Deluxe',
    description: 'Rajasthani-themed room with fort views',
    pricePerNight: '6000.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Fort View', 'Traditional Decor']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // The Gateway Hotel Ganges - Varanasi (Hotel ID: 14)
  {
    hotelId: 14,
    roomNumber: 'GHG-301',
    roomType: 'Deluxe',
    description: 'Spiritual-themed room with Ganges river views',
    pricePerNight: '7000.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'River View', 'Meditation Corner']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // Zostel Pushkar (Hotel ID: 15)
  {
    hotelId: 15,
    roomNumber: 'ZP-101',
    roomType: 'Dormitory',
    description: 'Shared dormitory with modern amenities for backpackers',
    pricePerNight: '800.00',
    maxGuests: 1,
    amenities: JSON.stringify(['WiFi', 'AC', 'Shared Bathroom', 'Lockers', 'Common Area']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },
  {
    hotelId: 15,
    roomNumber: 'ZP-201',
    roomType: 'Private',
    description: 'Private room for couples with desert views',
    pricePerNight: '2000.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Desert View', 'Private Bathroom']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // Treebo Trend Royal Residency - Hyderabad (Hotel ID: 16)
  {
    hotelId: 16,
    roomNumber: 'TTR-101',
    roomType: 'Standard',
    description: 'Modern business room with essential amenities',
    pricePerNight: '3500.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Work Desk', 'Business Center Access']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // Wildflower Hall Shimla (Hotel ID: 17)
  {
    hotelId: 17,
    roomNumber: 'WHS-201',
    roomType: 'Mountain View',
    description: 'Luxury room with panoramic Himalayan views',
    pricePerNight: '28000.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Mountain View', 'Fireplace', 'Balcony']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  }
];

async function seedIndianRooms() {
  try {
    console.log('Starting Indian rooms seeding...');
    
    // Insert rooms
    console.log('Inserting rooms...');
    const insertedRooms = await db.insert(rooms).values(indianRooms).returning();
    console.log(`Inserted ${insertedRooms.length} rooms`);
    
    console.log('Indian rooms seeding completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error seeding Indian rooms:', error);
    process.exit(1);
  }
}

// Run the seed function
seedIndianRooms();