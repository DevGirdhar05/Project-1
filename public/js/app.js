// API Configuration
const API_BASE_URL = '/api';

// Global state
let currentUser = null;
let authToken = localStorage.getItem('authToken');
let currentPage = 1;
let currentFilters = {};
let isLogin = true;

// DOM Elements
const elements = {
    // Auth elements
    authModal: document.getElementById('authModal'),
    authForm: document.getElementById('authForm'),
    authModalTitle: document.getElementById('authModalTitle'),
    authSubmitBtn: document.getElementById('authSubmitBtn'),
    switchAuthMode: document.getElementById('switchAuthMode'),
    nameField: document.getElementById('nameField'),
    loginBtn: document.getElementById('loginBtn'),
    signupBtn: document.getElementById('signupBtn'),
    authButtons: document.getElementById('authButtons'),
    userMenu: document.getElementById('userMenu'),
    userName: document.getElementById('userName'),
    logoutBtn: document.getElementById('logoutBtn'),
    
    // Search elements
    searchForm: document.getElementById('searchForm'),
    searchBtn: document.getElementById('searchBtn'),
    
    // Filter elements
    priceRange: document.getElementById('priceRange'),
    priceValue: document.getElementById('priceValue'),
    clearFilters: document.getElementById('clearFilters'),
    
    // Results elements
    hotelGrid: document.getElementById('hotelGrid'),
    loadingState: document.getElementById('loadingState'),
    resultsCount: document.getElementById('resultsCount'),
    sortBy: document.getElementById('sortBy'),
    
    // Pagination
    prevPage: document.getElementById('prevPage'),
    nextPage: document.getElementById('nextPage'),
    pageInfo: document.getElementById('pageInfo'),
    
    // Modals
    bookingModal: document.getElementById('bookingModal'),
    bookingContent: document.getElementById('bookingContent'),
    
    // Mobile menu
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileMenu: document.getElementById('mobileMenu'),
    
    // Dark mode
    darkModeToggle: document.getElementById('darkModeToggle')
};

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        type === 'error' ? 'bg-red-500 text-white' :
        type === 'success' ? 'bg-green-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// API Functions
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    
    if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
    }
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication Functions
async function login(email, password) {
    try {
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        authToken = response.data.token;
        currentUser = response.data.user;
        localStorage.setItem('authToken', authToken);
        
        updateAuthUI();
        closeModal(elements.authModal);
        showNotification('Login successful!', 'success');
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function register(name, email, password) {
    try {
        const response = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
        
        authToken = response.data.token;
        currentUser = response.data.user;
        localStorage.setItem('authToken', authToken);
        
        updateAuthUI();
        closeModal(elements.authModal);
        showNotification('Registration successful!', 'success');
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    updateAuthUI();
    showNotification('Logged out successfully', 'success');
}

function updateAuthUI() {
    if (currentUser) {
        elements.authButtons.classList.add('hidden');
        elements.userMenu.classList.remove('hidden');
        elements.userName.textContent = currentUser.name;
    } else {
        elements.authButtons.classList.remove('hidden');
        elements.userMenu.classList.add('hidden');
    }
}

// Hotel Functions
async function loadHotels(page = 1, filters = {}) {
    try {
        elements.loadingState.classList.remove('hidden');
        elements.hotelGrid.innerHTML = '';
        
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: '10',
            ...filters
        });
        
        const response = await apiCall(`/hotels?${queryParams}`);
        const hotels = response.data.hotels;
        const pagination = response.data.pagination;
        
        displayHotels(hotels);
        updatePagination(pagination);
        updateResultsCount(pagination.totalHotels);
        
    } catch (error) {
        showNotification('Failed to load hotels', 'error');
        console.error('Error loading hotels:', error);
    } finally {
        elements.loadingState.classList.add('hidden');
    }
}

async function loadRoomsForHotel(hotelId) {
    try {
        const response = await apiCall(`/rooms?hotelId=${hotelId}`);
        return response.data.rooms;
    } catch (error) {
        console.error('Error loading rooms:', error);
        return [];
    }
}

function displayHotels(hotels) {
    if (hotels.length === 0) {
        elements.hotelGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i data-lucide="hotel" class="w-16 h-16 mx-auto text-gray-400 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No hotels found</h3>
                <p class="text-gray-500 dark:text-gray-500">Try adjusting your search criteria</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    elements.hotelGrid.innerHTML = hotels.map(hotel => createHotelCard(hotel)).join('');
    lucide.createIcons();
    
    // Add event listeners for hotel cards
    document.querySelectorAll('.book-now-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const hotelId = e.target.dataset.hotelId;
            openBookingModal(hotelId);
        });
    });
}

function createHotelCard(hotel) {
    const amenities = hotel.amenities || [];
    const images = hotel.images || [];
    const defaultImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60';
    
    return `
        <article class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            <div class="relative">
                <img src="${images[0] || defaultImage}" alt="${hotel.name}" class="w-full h-48 object-cover">
                <div class="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full">
                    <i data-lucide="heart" class="w-4 h-4"></i>
                </div>
            </div>
            <div class="p-6">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-bold">${hotel.name}</h3>
                    <div class="flex items-center">
                        <span class="text-yellow-400">${'★'.repeat(hotel.starRating || 3)}</span>
                        <span class="ml-1 text-sm text-gray-600 dark:text-gray-400">${hotel.starRating || 3}.0</span>
                    </div>
                </div>
                <p class="text-gray-600 dark:text-gray-400 mb-3 flex items-center">
                    <i data-lucide="map-pin" class="w-4 h-4 mr-1"></i>
                    ${hotel.location}
                </p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${amenities.slice(0, 3).map(amenity => `
                        <span class="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 py-1 rounded-full text-xs">
                            ${amenity}
                        </span>
                    `).join('')}
                </div>
                <div class="flex items-center justify-between">
                    <div>
                        <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">From $99</span>
                        <span class="text-gray-600 dark:text-gray-400">/night</span>
                    </div>
                    <div class="flex space-x-2">
                        <button class="px-4 py-2 border border-primary-600 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                            View Details
                        </button>
                        <button class="book-now-btn px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors" data-hotel-id="${hotel.id}">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </article>
    `;
}

function updatePagination(pagination) {
    elements.pageInfo.textContent = `Page ${pagination.currentPage} of ${pagination.totalPages}`;
    elements.prevPage.disabled = !pagination.hasPrevPage;
    elements.nextPage.disabled = !pagination.hasNextPage;
    
    elements.prevPage.onclick = () => {
        if (pagination.hasPrevPage) {
            currentPage = pagination.currentPage - 1;
            loadHotels(currentPage, currentFilters);
        }
    };
    
    elements.nextPage.onclick = () => {
        if (pagination.hasNextPage) {
            currentPage = pagination.currentPage + 1;
            loadHotels(currentPage, currentFilters);
        }
    };
}

function updateResultsCount(total) {
    elements.resultsCount.textContent = `${total} properties found`;
}

// Booking Functions
async function openBookingModal(hotelId) {
    if (!currentUser) {
        showModal(elements.authModal);
        return;
    }
    
    try {
        const hotel = await apiCall(`/hotels/${hotelId}`);
        const rooms = await loadRoomsForHotel(hotelId);
        
        elements.bookingContent.innerHTML = createBookingForm(hotel.data.hotel, rooms);
        showModal(elements.bookingModal);
        
        // Add event listeners for booking form
        const bookingForm = document.getElementById('bookingForm');
        bookingForm.addEventListener('submit', handleBookingSubmit);
        
    } catch (error) {
        showNotification('Failed to load booking details', 'error');
    }
}

function createBookingForm(hotel, rooms) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    return `
        <div class="mb-6">
            <h4 class="text-lg font-semibold">${hotel.name}</h4>
            <p class="text-gray-600 dark:text-gray-400">${hotel.location}</p>
        </div>
        
        <form id="bookingForm" class="space-y-4">
            <input type="hidden" name="hotelId" value="${hotel.id}">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Check-in Date</label>
                    <input type="date" name="startDate" min="${today}" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Check-out Date</label>
                    <input type="date" name="endDate" min="${tomorrow}" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Select Room</label>
                <select name="roomId" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="">Choose a room</option>
                    ${rooms.map(room => `
                        <option value="${room.id}" data-price="${room.pricePerNight}">
                            ${room.roomType} - Room ${room.roomNumber} (${formatCurrency(room.pricePerNight)}/night, Max ${room.maxGuests} guests)
                        </option>
                    `).join('')}
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Number of Guests</label>
                <select name="guests" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Guests</option>
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Guest Details</label>
                <div class="space-y-3">
                    <input type="text" name="guestName" placeholder="Primary guest name" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <input type="email" name="guestEmail" placeholder="Contact email" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <input type="tel" name="guestPhone" placeholder="Phone number" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                </div>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Special Requests (Optional)</label>
                <textarea name="specialRequests" rows="3" placeholder="Any special requests or requirements..."
                          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"></textarea>
            </div>
            
            <div>
                <label class="block text-sm font-medium mb-2">Payment Method</label>
                <select name="paymentMethod" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="credit_card">Credit Card</option>
                    <option value="debit_card">Debit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="bank_transfer">Bank Transfer</option>
                </select>
            </div>
            
            <div class="border-t pt-4">
                <div class="flex justify-between items-center mb-4">
                    <span class="text-lg font-semibold">Total Amount:</span>
                    <span id="totalAmount" class="text-xl font-bold text-primary-600">$0</span>
                </div>
                <button type="submit" class="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold">
                    Confirm Booking
                </button>
            </div>
        </form>
    `;
}

async function handleBookingSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = {
        roomId: parseInt(formData.get('roomId')),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        guests: parseInt(formData.get('guests')),
        guestDetails: {
            primaryGuest: {
                name: formData.get('guestName'),
                email: formData.get('guestEmail'),
                phone: formData.get('guestPhone')
            }
        },
        specialRequests: formData.get('specialRequests'),
        paymentMethod: formData.get('paymentMethod')
    };
    
    try {
        const response = await apiCall('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
        
        closeModal(elements.bookingModal);
        showNotification('Booking confirmed successfully!', 'success');
        
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Filter Functions
function collectFilters() {
    const filters = {};
    
    // Price range
    const priceValue = elements.priceRange.value;
    if (priceValue < 50000) {
        filters.maxPrice = priceValue;
    }
    
    // Star rating
    const selectedStars = Array.from(document.querySelectorAll('.star-filter:checked')).map(cb => cb.value);
    if (selectedStars.length > 0) {
        filters.starRating = selectedStars.join(',');
    }
    
    // Room type
    const selectedRoomTypes = Array.from(document.querySelectorAll('.room-type-filter:checked')).map(cb => cb.value);
    if (selectedRoomTypes.length > 0) {
        filters.roomType = selectedRoomTypes.join(',');
    }
    
    // Amenities
    const selectedAmenities = Array.from(document.querySelectorAll('.amenity-filter:checked')).map(cb => cb.value);
    if (selectedAmenities.length > 0) {
        filters.amenities = selectedAmenities.join(',');
    }
    
    return filters;
}

function applyFilters() {
    currentFilters = collectFilters();
    currentPage = 1;
    loadHotels(currentPage, currentFilters);
}

// Modal Functions
function showModal(modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    if (authToken) {
        apiCall('/auth/profile').then(response => {
            currentUser = response.data.user;
            updateAuthUI();
        }).catch(() => {
            // Token is invalid, remove it
            localStorage.removeItem('authToken');
            authToken = null;
        });
    }
    
    // Load initial hotels
    loadHotels();
    
    // Auth modal events
    elements.loginBtn.addEventListener('click', () => {
        isLogin = true;
        elements.authModalTitle.textContent = 'Login';
        elements.authSubmitBtn.textContent = 'Login';
        elements.nameField.classList.add('hidden');
        elements.switchAuthMode.textContent = "Don't have an account? Sign up";
        showModal(elements.authModal);
    });
    
    elements.signupBtn.addEventListener('click', () => {
        isLogin = false;
        elements.authModalTitle.textContent = 'Sign Up';
        elements.authSubmitBtn.textContent = 'Sign Up';
        elements.nameField.classList.remove('hidden');
        elements.switchAuthMode.textContent = "Already have an account? Login";
        showModal(elements.authModal);
    });
    
    elements.switchAuthMode.addEventListener('click', () => {
        isLogin = !isLogin;
        if (isLogin) {
            elements.authModalTitle.textContent = 'Login';
            elements.authSubmitBtn.textContent = 'Login';
            elements.nameField.classList.add('hidden');
            elements.switchAuthMode.textContent = "Don't have an account? Sign up";
        } else {
            elements.authModalTitle.textContent = 'Sign Up';
            elements.authSubmitBtn.textContent = 'Sign Up';
            elements.nameField.classList.remove('hidden');
            elements.switchAuthMode.textContent = "Already have an account? Login";
        }
    });
    
    elements.authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        if (isLogin) {
            await login(formData.get('email'), formData.get('password'));
        } else {
            await register(formData.get('name'), formData.get('email'), formData.get('password'));
        }
    });
    
    elements.logoutBtn.addEventListener('click', logout);
    
    // Modal close events
    document.getElementById('closeAuthModal').addEventListener('click', () => closeModal(elements.authModal));
    document.getElementById('closeBookingModal').addEventListener('click', () => closeModal(elements.bookingModal));
    
    // Search form
    elements.searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchFilters = {
            location: formData.get('location'),
            checkIn: formData.get('checkIn'),
            checkOut: formData.get('checkOut'),
            guests: formData.get('guests')
        };
        
        // Filter out empty values
        Object.keys(searchFilters).forEach(key => {
            if (!searchFilters[key]) delete searchFilters[key];
        });
        
        currentFilters = { ...currentFilters, ...searchFilters };
        currentPage = 1;
        loadHotels(currentPage, currentFilters);
    });
    
    // Filter events
    elements.priceRange.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        elements.priceValue.textContent = `₹${value.toLocaleString('en-IN')}`;
    });
    
    elements.priceRange.addEventListener('change', applyFilters);
    
    document.querySelectorAll('.star-filter, .room-type-filter, .amenity-filter').forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    elements.clearFilters.addEventListener('click', () => {
        // Reset all filters
        elements.priceRange.value = 15000;
        elements.priceValue.textContent = '₹15,000';
        document.querySelectorAll('.star-filter, .room-type-filter, .amenity-filter').forEach(cb => {
            cb.checked = false;
        });
        
        currentFilters = {};
        currentPage = 1;
        loadHotels(currentPage, currentFilters);
    });
    
    // Sort change
    elements.sortBy.addEventListener('change', (e) => {
        currentFilters.sortBy = e.target.value;
        currentPage = 1;
        loadHotels(currentPage, currentFilters);
    });
    
    // Mobile menu toggle
    elements.mobileMenuBtn.addEventListener('click', () => {
        elements.mobileMenu.classList.toggle('hidden');
    });
    
    // Dark mode toggle
    elements.darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
    });
    
    // Load dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
    }
    
    // Close modals when clicking outside
    elements.authModal.addEventListener('click', (e) => {
        if (e.target === elements.authModal) {
            closeModal(elements.authModal);
        }
    });
    
    elements.bookingModal.addEventListener('click', (e) => {
        if (e.target === elements.bookingModal) {
            closeModal(elements.bookingModal);
        }
    });
});