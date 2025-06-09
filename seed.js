const db = require('./server/storage');
const { hotels, rooms } = require('./shared/schema');

const sampleHotels = [
  {
    name: 'Grand Plaza Hotel',
    description: 'Luxury hotel in the heart of Manhattan with world-class amenities and stunning city views.',
    location: 'Manhattan, New York',
    starRating: 5,
    contact: JSON.stringify({
      phone: '+1-212-555-0123',
      email: 'info@grandplaza.com'
    }),
    amenities: JSON.stringify(['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service', 'Concierge']),
    images: JSON.stringify([
      'https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc=',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60'
    ]),
    isActive: true
  },
  {
    name: 'Luxury Suites Downtown',
    description: 'Modern suites with premium amenities in the vibrant downtown area.',
    location: 'Brooklyn, New York', 
    starRating: 4,
    contact: JSON.stringify({
      phone: '+1-718-555-0456',
      email: 'reservations@luxurysuites.com'
    }),
    amenities: JSON.stringify(['WiFi', 'Gym', 'Business Center', 'Parking', 'Kitchen']),
    images: JSON.stringify([
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKFoo8y4kLV98oUwTZTAQCzqmlJUqOR0NLFg&s',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60'
    ]),
    isActive: true
  },
  {
    name: 'Budget Inn Central',
    description: 'Comfortable and affordable accommodation with essential amenities.',
    location: 'Queens, New York',
    starRating: 3,
    contact: JSON.stringify({
      phone: '+1-718-555-0789',
      email: 'info@budgetinncentral.com'
    }),
    amenities: JSON.stringify(['WiFi', 'Parking', 'TV']),
    images: JSON.stringify([
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlPWOnFVw7KNAT1jnySzwcq_4CxW8WkrMFlA&s'
    ]),
    isActive: true
  },
  {
    name: 'Boutique Hotel SoHo',
    description: 'Stylish boutique hotel featuring unique design and personalized service.',
    location: 'SoHo, New York',
    starRating: 5,
    contact: JSON.stringify({
      phone: '+1-212-555-0987',
      email: 'contact@boutiquesoho.com'
    }),
    amenities: JSON.stringify(['WiFi', 'Restaurant', 'Bar', 'Spa', 'Art Gallery']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWx8ZW58MHx8MHx8fDA%3D'
    ]),
    isActive: true
  },
  {
    name: 'Seaside Resort & Spa',
    description: 'Beachfront resort with stunning ocean views and full spa services.',
    location: 'Long Island, New York',
    starRating: 4,
    contact: JSON.stringify({
      phone: '+1-516-555-0321',
      email: 'reservations@seasideresort.com'
    }),
    amenities: JSON.stringify(['WiFi', 'Pool', 'Spa', 'Beach Access', 'Restaurant', 'Water Sports']),
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&auto=format&fit=crop&q=60'
    ]),
    isActive: true
  }
];

const sampleRooms = [
  // Grand Plaza Hotel rooms
  {
    hotelId: 1,
    roomNumber: '101',
    roomType: 'Deluxe',
    description: 'Spacious deluxe room with city view and premium amenities',
    pricePerNight: '199.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Minibar', 'Room Service']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },
  {
    hotelId: 1,
    roomNumber: '201',
    roomType: 'Suite',
    description: 'Luxury suite with separate living area and panoramic views',
    pricePerNight: '399.00',
    maxGuests: 4,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Minibar', 'Balcony', 'Room Service']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },
  // Luxury Suites Downtown rooms
  {
    hotelId: 2,
    roomNumber: '301',
    roomType: 'Suite',
    description: 'Modern suite with full kitchen and workspace',
    pricePerNight: '299.00',
    maxGuests: 3,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Kitchen', 'Workspace']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },
  // Budget Inn Central rooms
  {
    hotelId: 3,
    roomNumber: '105',
    roomType: 'Double',
    description: 'Comfortable double room with essential amenities',
    pricePerNight: '89.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },
  {
    hotelId: 3,
    roomNumber: '106',
    roomType: 'Single',
    description: 'Cozy single room perfect for solo travelers',
    pricePerNight: '69.00',
    maxGuests: 1,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },
  // Boutique Hotel SoHo rooms
  {
    hotelId: 4,
    roomNumber: '401',
    roomType: 'Deluxe',
    description: 'Artistically designed room with unique decor',
    pricePerNight: '349.00',
    maxGuests: 2,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Minibar', 'Art Collection']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },
  // Seaside Resort rooms
  {
    hotelId: 5,
    roomNumber: '501',
    roomType: 'Double',
    description: 'Ocean view room with private balcony',
    pricePerNight: '249.00',
    maxGuests: 3,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Balcony', 'Ocean View']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  },
  {
    hotelId: 5,
    roomNumber: '502',
    roomType: 'Suite',
    description: 'Beachfront suite with direct beach access',
    pricePerNight: '449.00',
    maxGuests: 4,
    amenities: JSON.stringify(['WiFi', 'AC', 'TV', 'Balcony', 'Beach Access', 'Kitchenette']),
    images: JSON.stringify(['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&auto=format&fit=crop&q=60']),
    isAvailable: true
  }
];

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Insert hotels
    console.log('Inserting hotels...');
    const insertedHotels = await db.insert(hotels).values(sampleHotels).returning();
    console.log(`Inserted ${insertedHotels.length} hotels`);
    
    // Insert rooms
    console.log('Inserting rooms...');
    const insertedRooms = await db.insert(rooms).values(sampleRooms).returning();
    console.log(`Inserted ${insertedRooms.length} rooms`);
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();