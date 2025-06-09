const db = require('./server/storage');
const { hotels, rooms } = require('./shared/schema');

const indianHotels = [
  {
    name: 'The Taj Mahal Palace',
    description: 'Iconic luxury hotel overlooking the Gateway of India and Arabian Sea, offering world-class hospitality since 1903.',
    location: 'Mumbai, Maharashtra',
    starRating: 5,
    contact: JSON.stringify({
      phone: '+91-22-6665-3366',
      email: 'reservations.mumbai@tajhotels.com'
    }),
    amenities: JSON.stringify(['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Business Center', 'Concierge', 'Valet Parking']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&auto=format&fit=crop&q=60'
    ]),
    isActive: true
  },
  {
    name: 'ITC Grand Chola',
    description: 'Palatial luxury hotel inspired by Chola architecture, featuring extensive dining options and premium amenities.',
    location: 'Chennai, Tamil Nadu',
    starRating: 5,
    contact: JSON.stringify({
      phone: '+91-44-2220-0000',
      email: 'reservations.itcgrandchola@itchotels.in'
    }),
    amenities: JSON.stringify(['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Business Center', 'Airport Transfer']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60'
    ]),
    isActive: true
  },
  {
    name: 'The Oberoi New Delhi',
    description: 'Contemporary luxury hotel in the heart of Delhi, known for exceptional service and modern amenities.',
    location: 'New Delhi, Delhi',
    starRating: 5,
    contact: JSON.stringify({
      phone: '+91-11-2436-3030',
      email: 'reservations.newdelhi@oberoihotels.com'
    }),
    amenities: JSON.stringify(['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Business Center', 'Airport Transfer', 'Butler Service']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&auto=format&fit=crop&q=60'
    ]),
    isActive: true
  },
  {
    name: 'Taj Lake Palace',
    description: 'Floating palace hotel on Lake Pichola, offering a magical experience with stunning views and royal heritage.',
    location: 'Udaipur, Rajasthan',
    starRating: 5,
    contact: JSON.stringify({
      phone: '+91-294-242-8800',
      email: 'lakepalace.udaipur@tajhotels.com'
    }),
    amenities: JSON.stringify(['WiFi', 'Restaurant', 'Spa', 'Boat Transfer', 'Heritage Tours', 'Palace Views']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1520637836862-4d197d17c50a?w=600&auto=format&fit=crop&q=60'
    ]),
    isActive: true
  },
  {
    name: 'The Leela Palace Bangalore',
    description: 'Art Deco-inspired luxury hotel offering sophisticated accommodation in India\'s Silicon Valley.',
    location: 'Bangalore, Karnataka',
    starRating: 5,
    contact: JSON.stringify({
      phone: '+91-80-2521-1234',
      email: 'reservations.bangalore@theleela.com'
    }),
    amenities: JSON.stringify(['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Business Center', 'Tech Support']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop&q=60'
    ]),
    isActive: true
  },
  {
    name: 'The Grand Hotel Kolkata',
    description: 'Historic luxury hotel in the cultural capital of India, blending colonial charm with modern comfort.',
    location: 'Kolkata, West Bengal',
    starRating: 4,
    contact: JSON.stringify({
      phone: '+91-33-2249-2323',
      email: 'reservations@thegrandhotelkolkata.com'
    }),
    amenities: JSON.stringify(['WiFi', 'Restaurant', 'Bar', 'Business Center', 'Cultural Tours']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&auto=format&fit=crop&q=60'
    ]),
    isActive: true
  },
  {
    name: 'Goa Marriott Resort & Spa',
    description: 'Beachfront resort offering tropical paradise experience with pristine beaches and water sports.',
    location: 'Panaji, Goa',
    starRating: 4,
    contact: JSON.stringify({
      phone: '+91-832-246-3333',
      email: 'reservations@goamarriott.com'
    }),
    amenities: JSON.stringify(['WiFi', 'Beach Access', 'Pool', 'Spa', 'Water Sports', 'Restaurant', 'Bar']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&auto=format&fit=crop&q=60'
    ]),
    isActive: true
  },
  {
    name: 'Hotel Clarks Amer',
    description: 'Heritage-style hotel near Amer Fort, offering authentic Rajasthani hospitality and cultural experiences.',
    location: 'Jaipur, Rajasthan',
    starRating: 4,
    contact: JSON.stringify({
      phone: '+91-141-255-0616',
      email: 'reservations@hotelclarksamer.com'
    }),
    amenities: JSON.stringify(['WiFi', 'Pool', 'Restaurant', 'Cultural Shows', 'Heritage Tours', 'Spa']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=60'
    ]),
    isActive: true
  },
  {
    name: 'The Gateway Hotel Ganges',
    description: 'Riverside hotel offering serene views of the holy Ganges with modern amenities and spiritual ambiance.',
    location: 'Varanasi, Uttar Pradesh',
    starRating: 4,
    contact: JSON.stringify({
      phone: '+91-542-666-0001',
      email: 'reservations.varanasi@tajhotels.com'
    }),
    amenities: JSON.stringify(['WiFi', 'Restaurant', 'River Views', 'Yoga Center', 'Boat Rides', 'Temple Tours']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&auto=format&fit=crop&q=60'
    ]),
    isActive: true
  },
  {
    name: 'Zostel Pushkar',
    description: 'Budget-friendly hostel in the holy city of Pushkar, perfect for backpackers and young travelers.',
    location: 'Pushkar, Rajasthan',
    starRating: 3,
    contact: JSON.stringify({
      phone: '+91-145-277-2946',
      email: 'pushkar@zostel.com'
    }),
    amenities: JSON.stringify(['WiFi', 'Common Areas', 'Rooftop Cafe', 'Laundry', 'Travel Desk']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&auto=format&fit=crop&q=60'
    ]),
    isActive: true
  },
  {
    name: 'Treebo Trend Royal Residency',
    description: 'Modern business hotel offering comfortable accommodation with contemporary amenities in Hyderabad.',
    location: 'Hyderabad, Telangana',
    starRating: 3,
    contact: JSON.stringify({
      phone: '+91-40-4020-4040',
      email: 'reservations@treebohotels.com'
    }),
    amenities: JSON.stringify(['WiFi', 'Restaurant', 'Business Center', 'Airport Transfer', 'Parking']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop&q=60'
    ]),
    isActive: true
  },
  {
    name: 'Wildflower Hall Shimla',
    description: 'Luxury mountain resort offering breathtaking Himalayan views and adventure activities.',
    location: 'Shimla, Himachal Pradesh',
    starRating: 5,
    contact: JSON.stringify({
      phone: '+91-177-264-8585',
      email: 'reservations.shimla@oberoihotels.com'
    }),
    amenities: JSON.stringify(['WiFi', 'Mountain Views', 'Spa', 'Adventure Sports', 'Restaurant', 'Hiking Trails']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=60'
    ]),
    isActive: true
  }
];

const indianRooms = [
  // The Taj Mahal Palace - Mumbai
  {
    hotelId: 1,
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
    hotelId: 1,
    roomNumber: 'TMH-201',
    roomType: 'Suite',
    description: 'Luxury suite with panoramic harbor views and separate living area',
    pricePerNight: '45000.00',
    maxGuests: 4,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Minibar', 'Sea View', 'Butler Service', 'Balcony']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // ITC Grand Chola - Chennai
  {
    hotelId: 2,
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
    hotelId: 2,
    roomNumber: 'IGC-401',
    roomType: 'Suite',
    description: 'Presidential suite with traditional Chola architecture elements',
    pricePerNight: '35000.00',
    maxGuests: 4,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Minibar', 'Living Room', 'Butler Service']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // The Oberoi New Delhi
  {
    hotelId: 3,
    roomNumber: 'OND-101',
    roomType: 'Deluxe',
    description: 'Modern room with city skyline views',
    pricePerNight: '22000.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Minibar', 'City View', 'Marble Bathroom']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // Taj Lake Palace - Udaipur
  {
    hotelId: 4,
    roomNumber: 'TLP-201',
    roomType: 'Deluxe',
    description: 'Royal room with lake views and traditional Rajasthani decor',
    pricePerNight: '40000.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Lake View', 'Heritage Decor', 'Royal Treatment']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // The Leela Palace Bangalore
  {
    hotelId: 5,
    roomNumber: 'LPB-301',
    roomType: 'Deluxe',
    description: 'Contemporary room with tech-friendly amenities',
    pricePerNight: '15000.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Work Station', 'Tech Support', 'High-Speed Internet']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // The Grand Hotel Kolkata
  {
    hotelId: 6,
    roomNumber: 'GHK-201',
    roomType: 'Deluxe',
    description: 'Colonial-style room with cultural heritage touches',
    pricePerNight: '8000.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Heritage Decor', 'Cultural Artifacts']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // Goa Marriott Resort & Spa
  {
    hotelId: 7,
    roomNumber: 'GMR-101',
    roomType: 'Double',
    description: 'Beach-facing room with tropical design',
    pricePerNight: '12000.00',
    maxGuests: 3,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Beach View', 'Balcony', 'Beach Access']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // Hotel Clarks Amer - Jaipur
  {
    hotelId: 8,
    roomNumber: 'HCA-201',
    roomType: 'Deluxe',
    description: 'Rajasthani-themed room with fort views',
    pricePerNight: '6000.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Fort View', 'Traditional Decor']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // The Gateway Hotel Ganges - Varanasi
  {
    hotelId: 9,
    roomNumber: 'GHG-301',
    roomType: 'Deluxe',
    description: 'Spiritual-themed room with Ganges river views',
    pricePerNight: '7000.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'River View', 'Meditation Corner']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // Zostel Pushkar
  {
    hotelId: 10,
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
    hotelId: 10,
    roomNumber: 'ZP-201',
    roomType: 'Private',
    description: 'Private room for couples with desert views',
    pricePerNight: '2000.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Desert View', 'Private Bathroom']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // Treebo Trend Royal Residency - Hyderabad
  {
    hotelId: 11,
    roomNumber: 'TTR-101',
    roomType: 'Standard',
    description: 'Modern business room with essential amenities',
    pricePerNight: '3500.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Work Desk', 'Business Center Access']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },

  // Wildflower Hall Shimla
  {
    hotelId: 12,
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

async function seedIndianDatabase() {
  try {
    console.log('Starting Indian hotel database seeding...');
    
    // Clear existing data
    console.log('Clearing existing data...');
    await db.delete(rooms);
    await db.delete(hotels);
    
    // Insert Indian hotels
    console.log('Inserting Indian hotels...');
    const insertedHotels = await db.insert(hotels).values(indianHotels).returning();
    console.log(`Inserted ${insertedHotels.length} Indian hotels`);
    
    // Insert rooms
    console.log('Inserting rooms...');
    const insertedRooms = await db.insert(rooms).values(indianRooms).returning();
    console.log(`Inserted ${insertedRooms.length} rooms`);
    
    console.log('Indian hotel database seeding completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error seeding Indian database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedIndianDatabase();