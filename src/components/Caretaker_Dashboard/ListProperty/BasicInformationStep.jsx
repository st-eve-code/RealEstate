import React from 'react';
import RoomCounter from './components/RoomCounter';
import AmenitySelector from './components/AmenitySelector';

/**
 * BasicInformationStep Component
 * 
 * Step 1 of the property listing form
 * Collects all basic property information including:
 * - Property type and status
 * - Room counts
 * - Location details
 * - Rental information
 * - Property description
 * - House rules
 * - Amenities
 * 
 * @param {object} formData - Current form data
 * @param {object} errors - Validation errors
 * @param {function} updateFormData - Function to update form data
 * @param {function} updateNestedFormData - Function to update nested form data
 */
function BasicInformationStep({
  formData,
  errors,
  updateFormData,
  updateNestedFormData
}) {
  const { basic } = formData;

  // Common amenities list
  const commonAmenities = [
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
    '24/7 Security'
  ];

  return (
    <div className="space-y-8">
      {/* Basic Details Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Basic Details</h2>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property type
          </label>
          <select
            value={basic.propertyType}
            onChange={(e) => updateFormData('basic', 'propertyType', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.propertyType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select property type</option>
            <option value="apartment">Apartment</option>
            <option value="studio">Studio</option>
            <option value="hostel">Hostel</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
          </select>
          {errors.propertyType && (
            <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>
          )}
        </div>

        {/* Property Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property status
          </label>
          <select
            value={basic.propertyStatus}
            onChange={(e) => updateFormData('basic', 'propertyStatus', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Number of Rooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Number of Rooms
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <RoomCounter
              label="No of Bedrooms"
              value={basic.rooms.bedrooms}
              onChange={(value) =>
                updateNestedFormData('basic', 'rooms', 'bedrooms', value)
              }
            />
            <RoomCounter
              label="No of Bathrooms"
              value={basic.rooms.bathrooms}
              onChange={(value) =>
                updateNestedFormData('basic', 'rooms', 'bathrooms', value)
              }
            />
            <RoomCounter
              label="No of Parlors"
              value={basic.rooms.parlors}
              onChange={(value) =>
                updateNestedFormData('basic', 'rooms', 'parlors', value)
              }
            />
            <RoomCounter
              label="No of Kitchens"
              value={basic.rooms.kitchens}
              onChange={(value) =>
                updateNestedFormData('basic', 'rooms', 'kitchens', value)
              }
            />
          </div>
          {errors.rooms && (
            <p className="text-red-500 text-sm mt-2">{errors.rooms}</p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <select
                value={basic.location.country}
                onChange={(e) =>
                  updateNestedFormData('basic', 'location', 'country', e.target.value)
                }
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Country</option>
                <option value="Cameroon">Cameroon</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option>
              </select>
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>
            <div>
              <select
                value={basic.location.city}
                onChange={(e) =>
                  updateNestedFormData('basic', 'location', 'city', e.target.value)
                }
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select City</option>
                <option value="Yaounde">Yaounde</option>
                <option value="Douala">Douala</option>
                <option value="Buea">Buea</option>
                <option value="Bamenda">Bamenda</option>
              </select>
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                value={basic.location.address}
                onChange={(e) =>
                  updateNestedFormData('basic', 'location', 'address', e.target.value)
                }
                placeholder="Address"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Rental Period and Fee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rental period
            </label>
            <select
              value={basic.rentalPeriod}
              onChange={(e) => updateFormData('basic', 'rentalPeriod', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Yearly">Yearly</option>
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Daily">Daily</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rental fee
            </label>
            <div className="relative">
              <input
                type="number"
                value={basic.rentalFee}
                onChange={(e) => updateFormData('basic', 'rentalFee', e.target.value)}
                placeholder="Amount"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-24 ${
                  errors.rentalFee ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                XAF / {basic.rentalPeriod}
              </span>
            </div>
            {errors.rentalFee && (
              <p className="text-red-500 text-sm mt-1">{errors.rentalFee}</p>
            )}
          </div>
        </div>
      </div>

      {/* Listing Details Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Listing Details</h2>

        {/* Property Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property name
          </label>
          <input
            type="text"
            value={basic.propertyName}
            onChange={(e) => updateFormData('basic', 'propertyName', e.target.value)}
            placeholder="Ex. Cozy 3 Bedroom Apartment"
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.propertyName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.propertyName && (
            <p className="text-red-500 text-sm mt-1">{errors.propertyName}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={basic.description}
            onChange={(e) => updateFormData('basic', 'description', e.target.value)}
            rows={4}
            placeholder="Spacious apartment near Mvan market and schools. Close to hospitals and malls. Perfect for families or professionals."
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* House Rules & Policies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            House Rules & Policies
          </label>
          <textarea
            value={basic.houseRules}
            onChange={(e) => updateFormData('basic', 'houseRules', e.target.value)}
            rows={3}
            placeholder="Ex. - This property is pet-friendly - Smoking is not allowed"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>
      </div>

      {/* Amenities Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Amenities</h2>

        {/* Amenities Included in Rent */}
        <AmenitySelector
          title="Amenities included in rent"
          selectedAmenities={basic.amenitiesIncluded}
          onAdd={(amenity) => {
            updateFormData('basic', 'amenitiesIncluded', [
              ...basic.amenitiesIncluded,
              amenity
            ]);
          }}
          onRemove={(amenity) => {
            updateFormData(
              'basic',
              'amenitiesIncluded',
              basic.amenitiesIncluded.filter(a => a !== amenity)
            );
          }}
          availableAmenities={commonAmenities}
        />

        {/* Amenities with Extra Fees */}
        <AmenitySelector
          title="Amenities with extra fees"
          selectedAmenities={basic.amenitiesExtra}
          onAdd={(amenity) => {
            updateFormData('basic', 'amenitiesExtra', [
              ...basic.amenitiesExtra,
              amenity
            ]);
          }}
          onRemove={(amenity) => {
            updateFormData(
              'basic',
              'amenitiesExtra',
              basic.amenitiesExtra.filter(a => a !== amenity)
            );
          }}
          availableAmenities={commonAmenities}
        />
      </div>
    </div>
  );
}

export default BasicInformationStep;

