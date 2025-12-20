import React from 'react';
import { MapPin, Bed, Bath, Check } from 'lucide-react';

/**
 * ReviewListingStep Component
 * 
 * Step 3 of the property listing form
 * Displays a preview of all entered information before publishing
 * Allows the user to publish or discard the listing
 * 
 * @param {object} formData - Complete form data to preview
 * @param {function} onPublish - Callback when user clicks publish
 * @param {function} onDiscard - Callback when user clicks discard
 */
function ReviewListingStep({ formData, onPublish, onDiscard }) {
  const { basic, media } = formData;

  // Get first few images for preview
  const getPreviewImages = () => {
    const allImages = [];
    
    // Collect images from all categories
    const categories = media?.categories || {};
    Object.keys(categories).forEach(category => {
      const categoryImages = categories[category]?.images || [];
      allImages.push(...categoryImages.slice(0, 2)); // Get first 2 from each category
    });

    return allImages.slice(0, 4); // Show max 4 images
  };

  const previewImages = getPreviewImages();
  const categories = media?.categories || {};
  const totalImages = Object.values(categories).reduce(
    (sum, cat) => sum + (cat?.images?.length || 0),
    0
  );

  // Create preview URL for images
  const getImagePreview = (file) => {
    if (typeof file === 'string') return file;
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-8">
      {/* Property Images Preview */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {previewImages.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <img
                src={getImagePreview(image)}
                alt={`Property ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {totalImages > 4 && (
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">View more</p>
                <p className="text-xs text-gray-500">({totalImages - 4}+)</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Property Details */}
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            {/* Room Icons */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-600">
                <Bed className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {basic.rooms.bedrooms} Bedroom{basic.rooms.bedrooms !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Bath className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {basic.rooms.bathrooms} Bathroom{basic.rooms.bathrooms !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Property Name */}
            <h2 className="text-2xl font-bold text-gray-900">
              {basic.propertyName || 'Untitled Property'}
            </h2>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span className="text-sm">
                {basic.location.city}, {basic.location.country}
              </span>
            </div>

            {/* Price */}
            <div className="pt-2">
              <span className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold">
                {basic.rentalFee ? `${parseFloat(basic.rentalFee).toLocaleString()} XAF/${basic.rentalPeriod}` : 'Price not set'}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
          <p className="text-gray-600 leading-relaxed">{basic.description}</p>
        </div>

        {/* Landlord Provides */}
        {basic.amenitiesIncluded.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Landlord provides</h3>
            <ul className="space-y-2">
              {basic.amenitiesIncluded.map((amenity, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>{amenity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* House Rules & Policies */}
        {basic.houseRules && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              House Rules & Policies
            </h3>
            <div className="text-gray-600 whitespace-pre-line">
              {basic.houseRules.split('\n').map((rule, index) => (
                <p key={index} className="mb-1">
                  {rule.trim() && `• ${rule.trim()}`}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Amenities */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
          
          {/* Amenities Included in Rent */}
          {basic.amenitiesIncluded.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Amenities included in rent
              </p>
              <div className="flex flex-wrap gap-2">
                {basic.amenitiesIncluded.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Amenities with Extra Fees */}
          {basic.amenitiesExtra.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Amenities with extra fees
              </p>
              <div className="flex flex-wrap gap-2">
                {basic.amenitiesExtra.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t">
        <button
          onClick={onDiscard}
          className="px-6 py-2.5 rounded-lg font-medium text-purple-600 bg-white border-2 border-purple-600 hover:bg-purple-50 transition-colors"
        >
          Discard Listing
        </button>
        <div className="flex gap-4">
          <button
            onClick={onPublish}
            className="px-6 py-2.5 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            Publish Listing
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewListingStep;

