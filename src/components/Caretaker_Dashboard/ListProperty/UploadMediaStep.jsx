import React from 'react';
import { Plus, X } from 'lucide-react';
import MediaUploadBox from './components/MediaUploadBox';
import { getRequiredCategories } from './config/categoryMapping';

/**
 * UploadMediaStep Component
 * 
 * Step 2 of the property listing form
 * Handles uploading media files:
 * - Walkthrough video
 * - Images and videos for different property categories (Parlor, Kitchen, Toilet, Parking)
 * - Ability to add custom categories
 * 
 * @param {object} formData - Current form data
 * @param {object} errors - Validation errors
 * @param {function} updateFormData - Function to update form data
 * @param {function} updateNestedFormData - Function to update nested form data
 */
function UploadMediaStep({
  formData,
  errors,
  updateFormData,
  updateNestedFormData
}) {
  const { media } = formData;
  
  // Ensure media.categories exists with default structure
  const categories = media?.categories || {
    parlor: { images: [], videos: [] },
    kitchen: { images: [], videos: [] },
    toilet: { images: [], videos: [] },
    parking: { images: [], videos: [] }
  };

  // Handle walkthrough video upload
  const handleWalkthroughVideoUpload = (file) => {
    if (file && file.size > 100 * 1024 * 1024) {
      alert('Video size must be less than 100MB');
      return;
    }
    updateFormData('media', 'walkthroughVideo', file);
  };

  // Handle image upload for a category
  const handleCategoryImageUpload = (category, file) => {
    const currentImages = categories[category]?.images || [];
    updateNestedFormData('media', 'categories', category, {
      ...categories[category],
      images: [...currentImages, file]
    });
  };

  // Handle video upload for a category
  const handleCategoryVideoUpload = (category, file) => {
    const currentVideos = categories[category]?.videos || [];
    updateNestedFormData('media', 'categories', category, {
      ...categories[category],
      videos: [...currentVideos, file]
    });
  };

  // Handle image removal for a category
  const handleCategoryImageRemove = (category, index) => {
    const currentImages = categories[category]?.images || [];
    updateNestedFormData('media', 'categories', category, {
      ...categories[category],
      images: currentImages.filter((_, i) => i !== index)
    });
  };

  // Handle video removal for a category
  const handleCategoryVideoRemove = (category, index) => {
    const currentVideos = categories[category]?.videos || [];
    updateNestedFormData('media', 'categories', category, {
      ...categories[category],
      videos: currentVideos.filter((_, i) => i !== index)
    });
  };

  // Handle adding a new custom category
  const handleAddCustomCategory = () => {
    const categoryName = prompt('Enter category name (e.g., "Balcony", "Garden"):');
    if (categoryName && categoryName.trim()) {
      const newCategory = categoryName.trim().toLowerCase();
      updateNestedFormData('media', 'categories', newCategory, {
        images: [],
        videos: []
      });
    }
  };

  // Handle removing a custom category
  const handleRemoveCustomCategory = (category) => {
    if (window.confirm(`Remove category "${category}"?`)) {
      const updatedCategories = { ...categories };
      delete updatedCategories[category];
      updateFormData('media', 'categories', updatedCategories);
    }
  };

  // Get required categories based on room counts from Step 1
  const rooms = formData.basic?.rooms || {};
  const requiredCategories = getRequiredCategories(rooms);
  
  // Get custom categories (categories that were manually added but aren't in required list)
  // These are categories added via "Add new category" button
  const customCategories = Object.keys(categories).filter(
    cat => !requiredCategories.includes(cat) && !['parlor', 'kitchen', 'toilet', 'parking'].includes(cat)
  );
  
  // Only show required categories + custom categories (not all default categories)
  // This ensures we only display categories that are actually needed
  const allCategories = [...new Set([...requiredCategories, ...customCategories])];
  
  // Debug: Uncomment to see what categories are being shown
  // console.log('Rooms:', rooms);
  // console.log('Required categories:', requiredCategories);
  // console.log('All categories to display:', allCategories);

  return (
    <div className="space-y-8">
      {/* Walkthrough Video Section */}
      <div>
        <MediaUploadBox
          title="Walkthrough Video"
          instruction="Upload a walkthrough video of the house (Max video size: 100mb)"
          videos={media?.walkthroughVideo ? [media.walkthroughVideo] : []}
          onVideoUpload={(file) => handleWalkthroughVideoUpload(file)}
          onVideoRemove={() => updateFormData('media', 'walkthroughVideo', null)}
          allowVideo={true}
          allowImages={false}
          maxVideoSize={100}
        />
        {errors.walkthroughVideo && (
          <p className="text-red-500 text-sm mt-2">{errors.walkthroughVideo}</p>
        )}
      </div>

      {/* Property Category Sections */}
      {allCategories.map((category) => {
        const categoryData = categories[category];
        const isDefaultCategory = ['parlor', 'kitchen', 'toilet', 'parking'].includes(category);

        return (
          <div key={category}>
            <MediaUploadBox
              title={category.charAt(0).toUpperCase() + category.slice(1)}
              instruction="At least 2 images and 1 video"
              images={categoryData?.images || []}
              videos={categoryData?.videos || []}
              onImageUpload={(file) => handleCategoryImageUpload(category, file)}
              onVideoUpload={(file) => handleCategoryVideoUpload(category, file)}
              onImageRemove={(index) => handleCategoryImageRemove(category, index)}
              onVideoRemove={(index) => handleCategoryVideoRemove(category, index)}
              allowVideo={true}
            />
            {errors[`${category}Images`] && (
              <p className="text-red-500 text-sm mt-2">
                {errors[`${category}Images`]}
              </p>
            )}
            {errors[`${category}Videos`] && (
              <p className="text-red-500 text-sm mt-2">
                {errors[`${category}Videos`]}
              </p>
            )}
            {!isDefaultCategory && (
              <button
                type="button"
                onClick={() => handleRemoveCustomCategory(category)}
                className="mt-2 text-red-600 text-sm hover:text-red-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Remove category
              </button>
            )}
          </div>
        );
      })}

      {/* Add New Category Button */}
      <button
        type="button"
        onClick={handleAddCustomCategory}
        className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
      >
        <Plus className="w-5 h-5" />
        Add new category
      </button>
    </div>
  );
}

export default UploadMediaStep;

