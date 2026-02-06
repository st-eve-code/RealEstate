import React, { useState } from 'react';
import RoomCounter from './components/RoomCounter';
import AmenitySelector from './components/AmenitySelector';
import {
  PROPERTY_TYPES,
  RENTAL_PERIODS,
  CURRENCIES,
  COUNTRIES,
  getCitiesByCountry,
  COMMON_AMENITIES,
  COMMON_PROPS,
  FORM_LABELS,
  FORM_PLACEHOLDERS
} from './data/formConstants';
import { Plus, X } from 'lucide-react';

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
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Publishing Options
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Available Toggle */}
            <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              basic.available !== false 
                ? 'border-green-300 bg-green-50' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="available"
                  checked={basic.available !== false}
                  onChange={(e) => updateFormData('basic', 'available', e.target.checked)}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="available" className="text-sm font-semibold text-gray-900 cursor-pointer">
                    {FORM_LABELS.available}
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Property is ready for tenants
                  </p>
                </div>
              </div>
            </div>

            {/* Visible Toggle */}
            <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              basic.visible !== false 
                ? 'border-blue-300 bg-blue-50' 
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="visible"
                  checked={basic.visible !== false}
                  onChange={(e) => updateFormData('basic', 'visible', e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="visible" className="text-sm font-semibold text-gray-900 cursor-pointer">
                    {FORM_LABELS.visible}
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    {basic.visible !== false 
                      ? 'Status: Pending admin approval' 
                      : 'Status: Archived (hidden)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Info Box */}
          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-xs text-blue-800">
                <p className="font-semibold mb-1">About Visibility:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Visible ON:</strong> Property will be submitted for admin review (status: pending)</li>
                  <li><strong>Visible OFF:</strong> Property will be saved as archived (not visible to public)</li>
                </ul>
              </div>
            </div>
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

      {/* Property Items (Props) Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {FORM_LABELS.propertyItems}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {FORM_LABELS.propertyItemsDescription}
          </p>
        </div>

        {/* Existing Props */}
        {basic.props && Object.keys(basic.props).length > 0 && (
          <div className="space-y-3">
            {Object.entries(basic.props).map(([itemName, count]) => (
              <div key={itemName} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700">{itemName}</div>
                  <div className="text-xs text-gray-500">Count: {count}</div>
                </div>
                <input
                  type="number"
                  min="0"
                  value={count}
                  onChange={(e) => {
                    const newCount = parseInt(e.target.value) || 0;
                    if (newCount === 0) {
                      // Remove item if count is 0
                      const newProps = { ...basic.props };
                      delete newProps[itemName];
                      updateFormData('basic', 'props', newProps);
                    } else {
                      // Update count
                      updateFormData('basic', 'props', {
                        ...basic.props,
                        [itemName]: newCount
                      });
                    }
                  }}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newProps = { ...basic.props };
                    delete newProps[itemName];
                    updateFormData('basic', 'props', newProps);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label={`Remove ${itemName}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Item */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <PropertyItemAdder
            onAdd={(itemName, count) => {
              const newProps = {
                ...(basic.props || {}),
                [itemName]: count
              };
              updateFormData('basic', 'props', newProps);
            }}
            existingItems={Object.keys(basic.props || {})}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Property Item Adder Component
 * Allows users to add new property items with a name and count
 */
function PropertyItemAdder({ onAdd, existingItems = [] }) {
  const [itemName, setItemName] = useState('');
  const [count, setCount] = useState(1);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customItemName, setCustomItemName] = useState('');

  const availableItems = COMMON_PROPS.filter(item => !existingItems.includes(item));

  const handleAddFromList = (name) => {
    if (name && !existingItems.includes(name)) {
      onAdd(name, 1);
      setItemName('');
    }
  };

  const handleAddCustom = () => {
    const name = customItemName.trim();
    if (name && !existingItems.includes(name)) {
      onAdd(name, count);
      setCustomItemName('');
      setCount(1);
      setShowCustomInput(false);
    }
  };

  return (
    <div className="space-y-3">
      {availableItems.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select from common items
          </label>
          <div className="flex flex-wrap gap-2">
            {availableItems.slice(0, 8).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleAddFromList(item)}
                className="px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {!showCustomInput ? (
        <button
          type="button"
          onClick={() => setShowCustomInput(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Custom Item
        </button>
      ) : (
        <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {FORM_LABELS.itemName}
            </label>
            <input
              type="text"
              value={customItemName}
              onChange={(e) => setCustomItemName(e.target.value)}
              placeholder="e.g., Beds, Tables, Chairs"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {FORM_LABELS.itemCount}
            </label>
            <input
              type="number"
              min="1"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddCustom}
              disabled={!customItemName.trim() || existingItems.includes(customItemName.trim())}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {FORM_LABELS.addItem}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCustomInput(false);
                setCustomItemName('');
                setCount(1);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BasicInformationStep;

