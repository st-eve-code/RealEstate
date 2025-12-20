import React from 'react';
import RoomCounter from './components/RoomCounter';
import AmenitySelector from './components/AmenitySelector';
import {
  PROPERTY_TYPES,
  RENTAL_PERIODS,
  CURRENCIES,
  COUNTRIES,
  getCitiesByCountry,
  COMMON_AMENITIES,
  FORM_LABELS,
  FORM_PLACEHOLDERS
} from './data/formConstants';

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
  
  // Get cities for selected country
  const availableCities = getCitiesByCountry(basic.location?.country || '');

  return (
    <div className="space-y-8">
      {/* Basic Details Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">{FORM_LABELS.basicDetails}</h2>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {FORM_LABELS.propertyType}
          </label>
          <select
            value={basic.propertyType}
            onChange={(e) => updateFormData('basic', 'propertyType', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.propertyType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select property type</option>
            {PROPERTY_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.propertyType && (
            <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>
          )}
        </div>

        {/* Availability & Visibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                checked={basic.available !== false}
                onChange={(e) => updateFormData('basic', 'available', e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="available" className="text-sm font-medium text-gray-700">
                {FORM_LABELS.available}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="visible"
                checked={basic.visible !== false}
                onChange={(e) => updateFormData('basic', 'visible', e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="visible" className="text-sm font-medium text-gray-700">
                {FORM_LABELS.visible}
              </label>
            </div>
        </div>

        {/* Total Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {FORM_LABELS.totalNumber}
          </label>
          <input
            type="number"
            value={basic.totalnumber || 1}
            onChange={(e) => updateFormData('basic', 'totalnumber', parseInt(e.target.value) || 1)}
            min="1"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Number of identical units available (e.g., if you have 3 identical apartments)
          </p>
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
                {COUNTRIES.map(country => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
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
                disabled={!basic.location.country}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                } ${!basic.location.country ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">{basic.location.country ? 'Select City' : 'Select country first'}</option>
                {availableCities.map(city => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
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
                placeholder={FORM_PLACEHOLDERS.address}
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

        {/* Payment Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">{FORM_LABELS.payment}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {FORM_LABELS.rentalPeriod}
              </label>
              <select
                value={basic.payment?.period || 'yearly'}
                onChange={(e) => updateNestedFormData('basic', 'payment', 'period', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {RENTAL_PERIODS.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {FORM_LABELS.price}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={basic.payment?.price || ''}
                  onChange={(e) => updateNestedFormData('basic', 'payment', 'price', e.target.value)}
                  placeholder={FORM_PLACEHOLDERS.price}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-20 ${
                    errors.rentalFee ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                  {basic.payment?.currency || 'XAF'}
                </span>
              </div>
              {errors.rentalFee && (
                <p className="text-red-500 text-sm mt-1">{errors.rentalFee}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {FORM_LABELS.currency}
              </label>
              <select
                value={basic.payment?.currency || 'XAF'}
                onChange={(e) => updateNestedFormData('basic', 'payment', 'currency', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {CURRENCIES.map(currency => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {FORM_LABELS.tax}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={basic.payment?.tax || ''}
                onChange={(e) => updateNestedFormData('basic', 'payment', 'tax', parseFloat(e.target.value) || 0)}
                placeholder="0.25"
                min="0"
                max="1"
                step="0.01"
                className="w-32 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-600">
                As decimal (e.g., 0.25 = 25%, 0.1 = 10%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Listing Details Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">{FORM_LABELS.listingDetails}</h2>

        {/* Property Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {FORM_LABELS.propertyName}
          </label>
          <input
            type="text"
            value={basic.propertyName}
            onChange={(e) => updateFormData('basic', 'propertyName', e.target.value)}
            placeholder={FORM_PLACEHOLDERS.propertyName}
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
            {FORM_LABELS.description}
          </label>
          <textarea
            value={basic.description}
            onChange={(e) => updateFormData('basic', 'description', e.target.value)}
            rows={4}
            placeholder={FORM_PLACEHOLDERS.description}
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
            {FORM_LABELS.houseRules}
          </label>
          <textarea
            value={basic.houseRules}
            onChange={(e) => updateFormData('basic', 'houseRules', e.target.value)}
            rows={3}
            placeholder={FORM_PLACEHOLDERS.houseRules}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          />
        </div>
      </div>

      {/* Amenities Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">{FORM_LABELS.amenities}</h2>

        {/* Amenities Included in Rent */}
        <AmenitySelector
          title={FORM_LABELS.amenitiesIncluded}
          selectedAmenities={basic.amenities || []}
          onAdd={(amenity) => {
            updateFormData('basic', 'amenities', [
              ...(basic.amenities || []),
              amenity
            ]);
          }}
          onRemove={(amenity) => {
            updateFormData(
              'basic',
              'amenities',
              (basic.amenities || []).filter(a => a !== amenity)
            );
          }}
          availableAmenities={COMMON_AMENITIES}
        />

        {/* Amenities with Extra Fees */}
        <AmenitySelector
          title={FORM_LABELS.amenitiesExtra}
          selectedAmenities={basic.extraAmenities || []}
          onAdd={(amenity) => {
            updateFormData('basic', 'extraAmenities', [
              ...(basic.extraAmenities || []),
              amenity
            ]);
          }}
          onRemove={(amenity) => {
            updateFormData(
              'basic',
              'extraAmenities',
              (basic.extraAmenities || []).filter(a => a !== amenity)
            );
          }}
          availableAmenities={COMMON_AMENITIES}
        />
      </div>
    </div>
  );
}

export default BasicInformationStep;

