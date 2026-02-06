/**
 * Category Mapping Configuration
 * 
 * Maps room types from Step 1 to media categories in Step 2.
 * This ensures we only validate media uploads for rooms that were actually specified.
 */

/**
 * Maps room property names to their corresponding media category names
 * This matches the Unit interface rooms structure: {bedrooms, bathrooms, parlors, kitchens}
 */
export const ROOM_TO_CATEGORY_MAP = {
  bedrooms: 'bedroom', // Bedrooms use the "bedroom" category
  bathrooms: 'toilet', // Bathrooms use the "toilet" category
  parlors: 'parlor', // Parlors use the "parlor" category
  kitchens: 'kitchen' // Kitchens use the "kitchen" category
};

/**
 * Default categories that are always required (not tied to room counts)
 * These are general property features that should always have media
 */
export const DEFAULT_REQUIRED_CATEGORIES = []; // No default required categories

/**
 * Get which media categories should be validated based on room counts
 * @param {object} rooms - Object with room counts {bedrooms, bathrooms, parlors, kitchens}
 * @returns {Array} - Array of category names that should be validated
 */
export const getRequiredCategories = (rooms) => {
  const requiredCategories = [...DEFAULT_REQUIRED_CATEGORIES];
  
  // Check each room type and add its corresponding category if count > 0
  Object.keys(ROOM_TO_CATEGORY_MAP).forEach(roomType => {
    const category = ROOM_TO_CATEGORY_MAP[roomType];
    const roomCount = rooms[roomType] || 0;
    
    // If room count > 0 and has a mapped category, add it to required categories
    if (roomCount > 0 && category) {
      requiredCategories.push(category);
    }
  });
  
  return requiredCategories;
};

/**
 * Get human-readable category name for display
 * @param {string} category - Category key (e.g., 'parlor', 'kitchen')
 * @returns {string} - Capitalized category name
 */
export const getCategoryDisplayName = (category) => {
  return category.charAt(0).toUpperCase() + category.slice(1);
};

