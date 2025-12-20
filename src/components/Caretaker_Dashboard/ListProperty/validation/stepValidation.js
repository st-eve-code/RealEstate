/**
 * Step Validation Functions
 * 
 * Contains validation logic for each step of the property listing form.
 * Separated from form data utilities for better organization.
 */

import { getRequiredCategories, getCategoryDisplayName } from '../config/categoryMapping';

/**
 * Validate Step 1: Basic Information
 * @param {object} formData - The current form data
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateBasicInformation = (formData) => {
  const errors = {};
  const { basic } = formData;

  // Property type validation
  if (!basic.propertyType) {
    errors.propertyType = 'Property type is required';
  }

  // Location validation
  if (!basic.location.country) {
    errors.country = 'Country is required';
  }

  if (!basic.location.city) {
    errors.city = 'City is required';
  }

  if (!basic.location.address) {
    errors.address = 'Address is required';
  }

  // Rental fee validation
  if (!basic.rentalFee || parseFloat(basic.rentalFee) <= 0) {
    errors.rentalFee = 'Valid rental fee is required';
  }

  // Property name validation
  if (!basic.propertyName || basic.propertyName.trim().length < 3) {
    errors.propertyName = 'Property name must be at least 3 characters';
  }

  // Description validation
  if (!basic.description || basic.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters';
  }

  // Room validation - at least one room type should have a value
  const totalRooms = 
    basic.rooms.bedrooms + 
    basic.rooms.bathrooms + 
    basic.rooms.parlors + 
    basic.rooms.kitchens;
  
  if (totalRooms === 0) {
    errors.rooms = 'At least one room must be specified';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate Step 2: Upload Media
 * Only validates media for categories that correspond to rooms with count > 0
 * @param {object} formData - The current form data
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateMediaUpload = (formData) => {
  const errors = {};
  const { media, basic } = formData;

  // Validate walkthrough video (optional, but if provided, check size)
  if (media.walkthroughVideo) {
    const maxVideoSize = 100 * 1024 * 1024; // 100MB
    if (media.walkthroughVideo.size > maxVideoSize) {
      errors.walkthroughVideo = 'Video size must be less than 100MB';
    }
  }

  // Get which categories should be validated based on room counts
  const requiredCategories = getRequiredCategories(basic.rooms);
  
  // Only validate categories that correspond to rooms with count > 0
  requiredCategories.forEach(category => {
    const categoryData = media.categories?.[category];
    
    if (!categoryData) {
      // Category doesn't exist in media data
      errors[`${category}Images`] = `${getCategoryDisplayName(category)} must have at least 2 images`;
      errors[`${category}Videos`] = `${getCategoryDisplayName(category)} must have at least 1 video`;
      return;
    }
    
    // Validate images (minimum 2 required)
    if (!categoryData.images || categoryData.images.length < 2) {
      errors[`${category}Images`] = `${getCategoryDisplayName(category)} must have at least 2 images`;
    }

    // Validate videos (minimum 1 required)
    if (!categoryData.videos || categoryData.videos.length < 1) {
      errors[`${category}Videos`] = `${getCategoryDisplayName(category)} must have at least 1 video`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Main validation function that routes to appropriate step validator
 * @param {number} step - The step number (1, 2, or 3)
 * @param {object} formData - The current form data
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateStep = (step, formData) => {
  switch (step) {
    case 1:
      return validateBasicInformation(formData);
    case 2:
      return validateMediaUpload(formData);
    case 3:
      // Step 3 (Review) doesn't need validation - it's just a preview
      return { isValid: true, errors: {} };
    default:
      return { isValid: false, errors: { step: 'Invalid step number' } };
  }
};

