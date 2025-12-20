/**
 * Form Constants and Static Data
 * 
 * Centralized location for all dropdown options, lists, and static data
 * used throughout the property listing form.
 * 
 * This makes it easy to update values in one place and maintain consistency.
 */

/**
 * Property Types (RentingType)
 * Must match the Unit.type field in types.ts
 */
export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'studio', label: 'Studio' },
  { value: 'hostel', label: 'Hostel' }
];

/**
 * Rental Periods
 * Must match Unit.payment.period values
 */
export const RENTAL_PERIODS = [
  { value: 'yearly', label: 'Yearly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'daily', label: 'Daily' }
];

/**
 * Currencies
 * Common currencies for the platform
 */
export const CURRENCIES = [
  { value: 'XAF', label: 'XAF (Central African CFA Franc)', symbol: 'XAF' },
  { value: 'USD', label: 'USD (US Dollar)', symbol: '$' },
  { value: 'EUR', label: 'EUR (Euro)', symbol: '€' },
  { value: 'NGN', label: 'NGN (Nigerian Naira)', symbol: '₦' },
  { value: 'GBP', label: 'GBP (British Pound)', symbol: '£' }
];

/**
 * Countries
 * List of countries where properties can be listed
 */
export const COUNTRIES = [
  { value: 'Cameroon', label: 'Cameroon' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'Tanzania', label: 'Tanzania' },
  { value: 'Uganda', label: 'Uganda' }
];

/**
 * Cities by Country
 * Maps countries to their cities
 */
export const CITIES_BY_COUNTRY = {
  'Cameroon': [
    { value: 'Yaounde', label: 'Yaounde' },
    { value: 'Douala', label: 'Douala' },
    { value: 'Buea', label: 'Buea' },
    { value: 'Bamenda', label: 'Bamenda' },
    { value: 'Bafoussam', label: 'Bafoussam' },
    { value: 'Limbe', label: 'Limbe' }
  ],
  'Nigeria': [
    { value: 'Lagos', label: 'Lagos' },
    { value: 'Abuja', label: 'Abuja' },
    { value: 'Port Harcourt', label: 'Port Harcourt' },
    { value: 'Kano', label: 'Kano' },
    { value: 'Ibadan', label: 'Ibadan' }
  ],
  'Ghana': [
    { value: 'Accra', label: 'Accra' },
    { value: 'Kumasi', label: 'Kumasi' },
    { value: 'Tamale', label: 'Tamale' },
    { value: 'Takoradi', label: 'Takoradi' }
  ],
  'Kenya': [
    { value: 'Nairobi', label: 'Nairobi' },
    { value: 'Mombasa', label: 'Mombasa' },
    { value: 'Kisumu', label: 'Kisumu' }
  ],
  'South Africa': [
    { value: 'Johannesburg', label: 'Johannesburg' },
    { value: 'Cape Town', label: 'Cape Town' },
    { value: 'Durban', label: 'Durban' }
  ],
  'Tanzania': [
    { value: 'Dar es Salaam', label: 'Dar es Salaam' },
    { value: 'Arusha', label: 'Arusha' }
  ],
  'Uganda': [
    { value: 'Kampala', label: 'Kampala' },
    { value: 'Entebbe', label: 'Entebbe' }
  ]
};

/**
 * Get cities for a specific country
 * @param {string} country - Country name
 * @returns {Array} - Array of city options
 */
export const getCitiesByCountry = (country) => {
  return CITIES_BY_COUNTRY[country] || [];
};

/**
 * Common Amenities
 * List of amenities that can be included in rent or charged extra
 */
export const COMMON_AMENITIES = [
  'Security Guard',
  'CCTV Surveillance',
  'Smoke Detector',
  'Water Supply',
  'Wifi',
  'Laundry Facilities',
  'Backup Generator',
  'Parking',
  'Air Conditioning',
  'Furnished',
  'Pet Friendly',
  'Gym Access',
  'Swimming Pool',
  'Elevator',
  '24/7 Security',
  'Garden',
  'Balcony',
  'Dishwasher',
  'Microwave',
  'Refrigerator',
  'Cable TV',
  'Internet',
  'Heating',
  'Fireplace',
  'Storage Space'
];

/**
 * Room Types
 * Used for room counter labels
 */
export const ROOM_TYPES = [
  { key: 'bedrooms', label: 'No of Bedrooms', singular: 'Bedroom', plural: 'Bedrooms' },
  { key: 'bathrooms', label: 'No of Bathrooms', singular: 'Bathroom', plural: 'Bathrooms' },
  { key: 'parlors', label: 'No of Parlors', singular: 'Parlor', plural: 'Parlors' },
  { key: 'kitchens', label: 'No of Kitchens', singular: 'Kitchen', plural: 'Kitchens' }
];

/**
 * Default Form Values
 * Used to initialize form fields
 */
export const DEFAULT_VALUES = {
  propertyType: '',
  propertyName: '',
  description: '',
  rooms: {
    bedrooms: 0,
    bathrooms: 0,
    parlors: 0,
    kitchens: 0
  },
  location: {
    country: '',
    city: '',
    address: ''
  },
  payment: {
    price: '',
    period: 'yearly',
    currency: 'XAF',
    tax: 0
  },
  available: true,
  visible: true,
  totalnumber: 1,
  houseRules: '',
  amenities: [],
  extraAmenities: [],
  tags: []
};

/**
 * Validation Rules
 * Used for form validation
 */
export const VALIDATION_RULES = {
  propertyName: {
    minLength: 3,
    message: 'Property name must be at least 3 characters'
  },
  description: {
    minLength: 20,
    message: 'Description must be at least 20 characters'
  },
  price: {
    min: 0,
    message: 'Valid rental price is required'
  },
  rooms: {
    minTotal: 1,
    message: 'At least one room must be specified'
  },
  media: {
    imagesPerCategory: 2,
    videosPerCategory: 1,
    maxVideoSize: 100, // MB
    maxImageSize: 10 // MB
  }
};

/**
 * Form Labels and Placeholders
 * Centralized text content for the form
 */
export const FORM_LABELS = {
  basicDetails: 'Basic Details',
  listingDetails: 'Listing Details',
  amenities: 'Amenities',
  propertyType: 'Property type',
  propertyName: 'Property name',
  description: 'Description',
  houseRules: 'House Rules & Policies',
  location: 'Location',
  payment: 'Payment Information',
  rentalPeriod: 'Rental period',
  price: 'Price',
  currency: 'Currency',
  tax: 'Tax (optional)',
  totalNumber: 'Total number of units',
  available: 'Available for rent',
  visible: 'Visible to public',
  amenitiesIncluded: 'Amenities included in rent',
  amenitiesExtra: 'Amenities with extra fees',
  addCategory: 'Add new category',
  walkthroughVideo: 'Walkthrough Video',
  uploadImages: 'Click to upload images or Drag and drop here',
  uploadVideo: 'Click to upload video or Drag and drop here',
  uploadMore: 'Upload more'
};

/**
 * Form Placeholders
 */
export const FORM_PLACEHOLDERS = {
  propertyName: 'Ex. Cozy 3 Bedroom Apartment',
  description: 'Spacious apartment near Mvan market and schools. Close to hospitals and malls. Perfect for families or professionals.',
  houseRules: 'Ex. - This property is pet-friendly - Smoking is not allowed',
  address: 'Address',
  price: 'Amount',
  searchAmenity: 'Search or add amenity',
  categoryName: 'Enter category name (e.g., "Balcony", "Garden"):'
};

/**
 * Error Messages
 * Centralized error messages
 */
export const ERROR_MESSAGES = {
  required: (field) => `${field} is required`,
  minLength: (field, min) => `${field} must be at least ${min} characters`,
  invalidPrice: 'Valid rental price is required',
  minRooms: 'At least one room must be specified',
  minImages: (category) => `${category} must have at least 2 images`,
  minVideos: (category) => `${category} must have at least 1 video`,
  maxFileSize: (type, size) => `${type} size must be less than ${size}MB`,
  invalidFileType: (type) => `Please upload a valid ${type} file`
};

