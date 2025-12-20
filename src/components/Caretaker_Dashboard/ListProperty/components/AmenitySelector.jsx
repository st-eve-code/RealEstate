import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

/**
 * AmenitySelector Component
 * 
 * A component for selecting amenities with two categories:
 * - Amenities included in rent
 * - Amenities with extra fees
 * 
 * @param {string} title - Title for the amenity section
 * @param {Array} selectedAmenities - Array of currently selected amenities
 * @param {function} onAdd - Callback when an amenity is added
 * @param {function} onRemove - Callback when an amenity is removed
 * @param {Array} availableAmenities - List of available amenities to choose from
 */
function AmenitySelector({
  title,
  selectedAmenities,
  onAdd,
  onRemove,
  availableAmenities = []
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter available amenities based on search term and exclude already selected ones
  const filteredAmenities = availableAmenities.filter(
    amenity =>
      amenity.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedAmenities.includes(amenity)
  );

  const handleSelectAmenity = (amenity) => {
    onAdd(amenity);
    setSearchTerm('');
    setShowDropdown(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {title}
      </label>

      {/* Search/Add Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search or add amenity"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

        {/* Dropdown Suggestions */}
        {showDropdown && filteredAmenities.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredAmenities.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => handleSelectAmenity(amenity)}
                className="w-full px-4 py-2 text-left hover:bg-purple-50 transition-colors"
              >
                {amenity}
              </button>
            ))}
          </div>
        )}

        {/* Add custom amenity if search term doesn't match */}
        {searchTerm &&
          !availableAmenities.some(
            a => a.toLowerCase() === searchTerm.toLowerCase()
          ) &&
          !selectedAmenities.some(
            a => a.toLowerCase() === searchTerm.toLowerCase()
          ) && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              <button
                type="button"
                onClick={() => handleSelectAmenity(searchTerm)}
                className="w-full px-4 py-2 text-left hover:bg-purple-50 transition-colors text-purple-600 font-medium"
              >
                + Add "{searchTerm}"
              </button>
            </div>
          )}
      </div>

      {/* Selected Amenities Tags */}
      {selectedAmenities.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedAmenities.map((amenity) => (
            <span
              key={amenity}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
            >
              {amenity}
              <button
                type="button"
                onClick={() => onRemove(amenity)}
                className="hover:text-purple-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}

export default AmenitySelector;

