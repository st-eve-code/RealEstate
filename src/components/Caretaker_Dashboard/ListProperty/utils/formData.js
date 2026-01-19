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

import { DEFAULT_VALUES } from '../data/formConstants';

/**
 * Get initial form data structure
 * This defines the complete structure of the property listing form
 */
export const getInitialFormData = () => ({
  // Step 1: Basic Information
  basic: {
    // Unit.name
    propertyName: DEFAULT_VALUES.propertyName,
    
    // Unit.type (RentingType: 'hostel' | 'apartment' | 'studio')
    propertyType: DEFAULT_VALUES.propertyType,
    
    // Unit.description
    description: DEFAULT_VALUES.description,
    
    // Unit.rooms
    rooms: { ...DEFAULT_VALUES.rooms },
    
    // Unit.location
    location: { ...DEFAULT_VALUES.location },
    
    // Unit.payment
    payment: { ...DEFAULT_VALUES.payment },
    
    // Unit.available & Unit.visible
    available: DEFAULT_VALUES.available,
    visible: DEFAULT_VALUES.visible,
    
    // Unit.totalnumber
    totalnumber: DEFAULT_VALUES.totalnumber,
    
    // Unit.houseRules
    houseRules: DEFAULT_VALUES.houseRules,
    
    // Unit.amenities & Unit.extraAmenities
    amenities: [...DEFAULT_VALUES.amenities],
    extraAmenities: [...DEFAULT_VALUES.extraAmenities],
    
    // Unit.tags (for search)
    tags: [...DEFAULT_VALUES.tags],
    
    // Unit.props (property items like beds, tables, etc.)
    props: { ...DEFAULT_VALUES.props }
  },
  
  // Step 2: Upload Media
  media: {
    // Unit.videoUrl
    walkthroughVideo: null,
    
    // Unit.images (array of {category, urls, files?})
    categories: {
      // Categories are dynamically created based on room counts
      // Only categories for rooms with count > 0 will be initialized
    },
    customCategories: [] // For dynamically added categories
  }
});

/**
 * Convert Unit data from database to form data format
 * Used when editing an existing property
 * @param {object} unit - Unit data from Firestore
 * @returns {object} - Form data structure ready for editing
 */
export const unitToFormData = (unit) => {
  if (!unit) return getInitialFormData();

  // Convert images array to categories object
  const categories = {};
  const customCategories = [];
  
  if (unit.images && Array.isArray(unit.images)) {
    unit.images.forEach((imageCategory) => {
      if (imageCategory.category) {
        categories[imageCategory.category] = {
          images: imageCategory.urls || [],
          videos: imageCategory.videoUrls || []
        };
      } else {
        customCategories.push(imageCategory);
      }
    });
  }

  return {
    basic: {
      propertyName: unit.name || '',
      propertyType: unit.type || '',
      description: unit.description || '',
      rooms: {
        bedrooms: unit.rooms?.bedrooms || 0,
        bathrooms: unit.rooms?.bathrooms || 0,
        parlors: unit.rooms?.parlors || 0,
        kitchens: unit.rooms?.kitchens || 0
      },
      location: {
        country: unit.location?.country || '',
        city: unit.location?.city || '',
        address: unit.location?.address || ''
      },
      payment: {
        price: unit.payment?.price || '',
        period: unit.payment?.period || 'yearly',
        currency: unit.payment?.currency || 'XAF',
        tax: unit.payment?.tax || 0
      },
      available: unit.available !== false,
      visible: unit.visible !== false,
      totalnumber: unit.totalnumber || 1,
      houseRules: unit.houseRules || '',
      amenities: unit.amenities || [],
      extraAmenities: unit.extraAmenities || [],
      tags: unit.tags || [],
      props: unit.props || {}
    },
    media: {
      walkthroughVideo: unit.videoUrl || null,
      categories: categories,
      customCategories: customCategories
    }
  };
};

// Validation has been moved to validation/stepValidation.js
// Import validateStep from there instead

/**
 * Format form data for database storage
 * Converts the form data structure to match the Unit interface exactly
 * @param {object} formData - The form data to format
 * @param {object} caretaker - Caretaker info {id: string, name: string, email: string, phoneNumber?: string}
 * @param {object} uploadedMedia - Uploaded media with URLs {images: Array, videoUrl?: string}
 * @returns {object} - Formatted data ready for database (matches Unit interface)
 */
export const formatFormDataForDatabase = (formData, caretaker, uploadedMedia = null) => {
  const { basic, media } = formData;

  // Use uploaded media URLs if provided, otherwise use empty arrays
  const images = uploadedMedia?.images || [];
  const videoUrl = uploadedMedia?.videoUrl || undefined;

  return {
    // Unit.name
    name: basic.propertyName,
    
    // Unit.description
    description: basic.description,
    
    // Unit.type (RentingType)
    type: basic.propertyType,
    
    // Unit.caretaker (includes id, name, email, and optional phoneNumber)
    caretaker: caretaker || { id: '', name: '', email: '' },
    
    // Unit.building (optional, can be set later)
    building: { id: '', name: '' },
    
    // Unit.payment
    payment: {
      price: parseFloat(basic.payment?.price) || 0,
      period: basic.payment?.period || 'yearly',
      currency: basic.payment?.currency || 'XAF',
      ...(basic.payment?.tax > 0 && { tax: basic.payment.tax })
    },
    
    // Unit.totalnumber
    totalnumber: basic.totalnumber || 1,
    
    // Unit.visible & Unit.available
    visible: basic.visible !== false, // Default to true
    available: basic.available !== false, // Default to true
    
    // Unit.location
    location: {
      country: basic.location.country,
      city: basic.location.city,
      address: basic.location.address
    },
    
    // Unit.rooms
    rooms: {
      bedrooms: basic.rooms.bedrooms || 0,
      bathrooms: basic.rooms.bathrooms || 0,
      parlors: basic.rooms.parlors || 0,
      kitchens: basic.rooms.kitchens || 0
    },
    
    // Unit.images (array of {category, urls, videoUrls?})
    images: images,
    
    // Unit.videoUrl (walkthrough video URL)
    ...(videoUrl && { videoUrl: videoUrl }),
    
    // Unit.amenities & Unit.extraAmenities
    amenities: basic.amenities || [],
    extraAmenities: basic.extraAmenities || [],
    
    // Unit.houseRules
    houseRules: basic.houseRules || '',
    
    // Unit.tags
    tags: basic.tags || [basic.propertyType, basic.location.city].filter(Boolean),
    
    // Unit.rating (initial values)
    rating: {
      value: 0,
      total: 0,
      reviews: 0
    },
    
    // Unit.views
    views: 0,
    
    // Unit.status - Based on visibility toggle:
    // - visible: true → status: 'pending' (awaiting admin approval)
    // - visible: false → status: 'archived' (hidden from public)
    status: basic.visible ? 'pending' : 'archived',
    
    // Unit.isVerified
    isVerified: false,
    
    // Unit.reportCount
    reportCount: 0,
    
    // Unit.props (property items)
    ...(basic.props && Object.keys(basic.props).length > 0 && { props: basic.props })
    
    // Unit.createdAt & Unit.updatedAt will be set by Firebase serverTimestamp()
  };
};
