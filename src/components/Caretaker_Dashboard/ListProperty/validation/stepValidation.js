/**
 * Step Validation Functions
 * 
 * Contains validation logic for each step of the property listing form.
 * Separated from form data utilities for better organization.
 */

import { getRequiredCategories, getCategoryDisplayName } from '../config/categoryMapping';
import { VALIDATION_RULES, ERROR_MESSAGES } from '../data/formConstants';

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
    errors.propertyType = ERROR_MESSAGES.required('Property type');
  }

  // Location validation
  if (!basic.location.country) {
    errors.country = ERROR_MESSAGES.required('Country');
  }

  if (!basic.location.city) {
    errors.city = ERROR_MESSAGES.required('City');
  }

  if (!basic.location.address) {
    errors.address = ERROR_MESSAGES.required('Address');
  }

  // Payment validation
  if (!basic.payment?.price || parseFloat(basic.payment.price) <= 0) {
    errors.rentalFee = ERROR_MESSAGES.invalidPrice;
  }

  // Property name validation
  if (!basic.propertyName || basic.propertyName.trim().length < VALIDATION_RULES.propertyName.minLength) {
    errors.propertyName = ERROR_MESSAGES.minLength('Property name', VALIDATION_RULES.propertyName.minLength);
  }

  // Description validation
  if (!basic.description || basic.description.trim().length < VALIDATION_RULES.description.minLength) {
    errors.description = ERROR_MESSAGES.minLength('Description', VALIDATION_RULES.description.minLength);
  }

  // Room validation - at least one room type should have a value
  const totalRooms = 
    basic.rooms.bedrooms + 
    basic.rooms.bathrooms + 
    basic.rooms.parlors + 
    basic.rooms.kitchens;
  
  if (totalRooms < VALIDATION_RULES.rooms.minTotal) {
    errors.rooms = VALIDATION_RULES.rooms.message;
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
    const maxVideoSize = VALIDATION_RULES.media.maxVideoSize * 1024 * 1024;
    if (media.walkthroughVideo.size > maxVideoSize) {
      errors.walkthroughVideo = ERROR_MESSAGES.maxFileSize('Video', VALIDATION_RULES.media.maxVideoSize);
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
    
    // Validate images (minimum required)
    if (!categoryData.images || categoryData.images.length < VALIDATION_RULES.media.imagesPerCategory) {
      errors[`${category}Images`] = ERROR_MESSAGES.minImages(getCategoryDisplayName(category));
    }

    // Validate videos (minimum required)
    if (!categoryData.videos || categoryData.videos.length < VALIDATION_RULES.media.videosPerCategory) {
      errors[`${category}Videos`] = ERROR_MESSAGES.minVideos(getCategoryDisplayName(category));
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

