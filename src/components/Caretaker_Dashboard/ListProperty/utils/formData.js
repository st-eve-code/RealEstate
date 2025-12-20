/**
 * Form Data Utilities
 * 
 * This file contains:
 * - Initial form data structure
 * - Database formatting functions
 * - Helper functions for form data management
 * 
 * Note: Validation logic has been moved to validation/stepValidation.js
 */

/**
 * Get initial form data structure
 * This defines the complete structure of the property listing form
 */
export const getInitialFormData = () => ({
  // Step 1: Basic Information
  basic: {
    propertyType: '',
    propertyStatus: 'Available',
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
    rentalPeriod: 'Yearly',
    rentalFee: '',
    propertyName: '',
    description: '',
    houseRules: '',
    amenitiesIncluded: [], // Amenities included in rent
    amenitiesExtra: [] // Amenities with extra fees
  },
  
  // Step 2: Upload Media
  media: {
    walkthroughVideo: null,
    categories: {
      parlor: {
        images: [],
        videos: []
      },
      kitchen: {
        images: [],
        videos: []
      },
      toilet: {
        images: [],
        videos: []
      },
      parking: {
        images: [],
        videos: []
      }
    },
    customCategories: [] // For dynamically added categories
  }
});

// Validation has been moved to validation/stepValidation.js
// Import validateStep from there instead

/**
 * Format form data for database storage
 * Converts the form data structure to match the database schema
 * @param {object} formData - The form data to format
 * @returns {object} - Formatted data ready for database
 */
export const formatFormDataForDatabase = (formData) => {
  const { basic, media } = formData;

  return {
    // Basic property information
    name: basic.propertyName,
    description: basic.description,
    type: basic.propertyType,
    available: basic.propertyStatus === 'Available',
    state: basic.propertyStatus === 'Available' ? 1 : 0,
    
    // Location
    location: `${basic.location.address}, ${basic.location.city}, ${basic.location.country}`,
    
    // Pricing
    price: parseFloat(basic.rentalFee),
    period: basic.rentalPeriod,
    currency: 'XAF',
    
    // Rooms
    rooms: [
      ...Array(basic.rooms.bedrooms).fill('bedroom'),
      ...Array(basic.rooms.bathrooms).fill('bathroom'),
      ...Array(basic.rooms.parlors).fill('parlor'),
      ...Array(basic.rooms.kitchens).fill('kitchen')
    ],
    
    // Features and tags
    features: [...basic.amenitiesIncluded, ...basic.amenitiesExtra],
    tags: [basic.propertyType, basic.location.city],
    
    // Media (will be uploaded separately and URLs stored)
    imageUrl: [], // Will be populated after image upload
    videoUrl: media.walkthroughVideo ? 'pending' : null,
    
    // House rules (can be stored as a remark or separate field)
    houseRules: basic.houseRules,
    
    // Initial values
    totalnumber: 1,
    views: 0,
    rating: {
      value: 0,
      total: 0
    }
  };
};

