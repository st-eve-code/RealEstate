'use client'

import React, { useState } from 'react';
import '../App.css';

/**
 * HostSpace Component - Multi-step property listing form
 *
 * This component provides a comprehensive form for property owners to list their properties.
 * The form is divided into 3 steps:
 * 1. Owner Information - Collects personal details of the property owner
 * 2. Property Details - Gathers property information including category, amenities, etc.
 * 3. Media Upload - Allows uploading images for different rooms and property video tour with camera access
 *
 * All data collected in steps 1 & 2 will be stored in the database for property listings.
 */
function HostSpace() {
  // Current step in the multi-step form (1, 2, or 3)
  const [currentStep, setCurrentStep] = useState(1);
  // Form data state containing all property listing information
  const [formData, setFormData] = useState({
    // Owner information section
    owner: {
      name: '',
      email: '',
      phone: '',
      location: ''
    },
    // Property details section - data that will be stored in database
    property: {
      name: '',
      location: '',
      description: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      toilets: '',
      category: '', // Property type: 'hostel', 'studio', or 'apartment'
      amenities: []
    },
    // Media uploads section
    images: {
      parlour: null,
      kitchen: null,
      toilet: null,
      bedroom: null,
      exterior: null
    },
    video: null // Property video tour
  });
  // Form validation errors state
  const [errors, setErrors] = useState({});

  // Step definitions for the progress indicator
  const steps = [
    { id: 1, title: 'Owner Information' },
    { id: 2, title: 'Property Details' },
    { id: 3, title: 'Upload Media' }
  ];

  // Validate form data for each step before proceeding
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Validate owner information
      if (!formData.owner.name.trim()) newErrors.name = 'Name is required';
      if (!formData.owner.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.owner.email)) newErrors.email = 'Email is invalid';
      if (!formData.owner.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.owner.location.trim()) newErrors.location = 'Location is required';
    } else if (step === 2) {
      // Validate property details - these fields are required for database storage
      if (!formData.property.name.trim()) newErrors.propertyName = 'Property name is required';
      if (!formData.property.location.trim()) newErrors.propertyLocation = 'Property location is required';
      if (!formData.property.description.trim()) newErrors.description = 'Description is required';
      if (!formData.property.price.trim()) newErrors.price = 'Price is required';
      if (!formData.property.category) newErrors.category = 'Property category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation handlers
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  // Generic input change handler for form fields
  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle media file uploads (images and videos)
  const handleMediaUpload = (type, key, file) => {
    setFormData(prev => ({
      ...prev,
      [type]: type === 'images'
        ? { ...prev.images, [key]: file }
        : file
    }));
  };

  // Handle amenity checkbox changes (add/remove from array)
  const handleAmenityChange = (amenity, checked) => {
    setFormData(prev => ({
      ...prev,
      property: {
        ...prev.property,
        amenities: checked
          ? [...prev.property.amenities, amenity]
          : prev.property.amenities.filter(a => a !== amenity)
      }
    }));
  };

  // Render Step 1: Owner Information Form
  const renderStep1 = () => (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Owner Information</h2>
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={formData.owner.name}
            onChange={(e) => handleInputChange('owner', 'name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={formData.owner.email}
            onChange={(e) => handleInputChange('owner', 'email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            value={formData.owner.phone}
            onChange={(e) => handleInputChange('owner', 'phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Enter your phone number"
          />
          {errors.phone && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={formData.owner.location}
            onChange={(e) => handleInputChange('owner', 'location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Enter your location"
          />
          {errors.location && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.location}</p>}
        </div>
      </div>
    </div>
  );

  // Render Step 2: Property Details Form - Contains database fields
  const renderStep2 = () => (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Property Details</h2>
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
          <input
            type="text"
            value={formData.property.name}
            onChange={(e) => handleInputChange('property', 'name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Enter property name"
          />
          {errors.propertyName && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.propertyName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Location</label>
          <input
            type="text"
            value={formData.property.location}
            onChange={(e) => handleInputChange('property', 'location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Enter property location"
          />
          {errors.propertyLocation && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.propertyLocation}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.property.description}
            onChange={(e) => handleInputChange('property', 'description', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            rows="3"
            placeholder="Describe the property"
          />
          {errors.description && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.description}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price per month</label>
          <input
            type="number"
            value={formData.property.price}
            onChange={(e) => handleInputChange('property', 'price', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Enter price"
          />
          {errors.price && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.price}</p>}
        </div>

        {/* Property Category Selection - Required for database categorization */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Property Category</label>
          <div className="space-y-2">
            {[
              { value: 'hostel', label: 'Hostel' },
              { value: 'studio', label: 'Studio' },
              { value: 'apartment', label: 'Apartment' }
            ].map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={option.value}
                  name="category"
                  value={option.value}
                  checked={formData.property.category === option.value}
                  onChange={(e) => handleInputChange('property', 'category', e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor={option.value} className="ml-2 text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          {errors.category && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.category}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <input
              type="number"
              value={formData.property.bedrooms}
              onChange={(e) => handleInputChange('property', 'bedrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="No. of bedrooms"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <input
              type="number"
              value={formData.property.bathrooms}
              onChange={(e) => handleInputChange('property', 'bathrooms', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="No. of bathrooms"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Toilets</label>
            <input
              type="number"
              value={formData.property.toilets}
              onChange={(e) => handleInputChange('property', 'toilets', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              placeholder="No. of toilets"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Amenities</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {[
              'WiFi',
              'Parking',
              'Air Conditioning',
              'Washing Machine',
              'Dishwasher',
              'Balcony',
              'Garden',
              'Security System',
              'Elevator',
              'Pet Friendly',
              'Furnished',
              'Gym Access'
            ].map((amenity) => (
              <div key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  id={amenity}
                  checked={formData.property.amenities.includes(amenity)}
                  onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={amenity} className="ml-2 text-xs sm:text-sm text-gray-700">
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render Step 3: Media Upload Form - Images and video with camera access
  const renderStep3 = () => (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Upload Media</h2>

      {/* Video Upload Section */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Property Video Tour</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload a video tour of your property (optional)
          </label>
          <input
            type="file"
            accept="video/*"
            capture="environment"
            onChange={(e) => handleMediaUpload('video', null, e.target.files[0])}
            className="w-full text-sm sm:text-base"
          />
          {formData.video && (
            <p className="text-xs sm:text-sm text-green-600 mt-2">Video selected: {formData.video.name}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Recommended: MP4 format, max 100MB, landscape orientation for best viewing experience
          </p>
        </div>
      </div>

      {/* Image Upload Section */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">Property Images</h3>
        <div className="space-y-3 sm:space-y-4">
          {Object.keys(formData.images).map((room) => (
            <div key={room} className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{room}</label>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => handleMediaUpload('images', room, e.target.files[0])}
                className="w-full text-sm sm:text-base"
              />
              {formData.images[room] && (
                <p className="text-xs sm:text-sm text-green-600 mt-1">Image selected: {formData.images[room].name}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render the current step based on currentStep state
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  // Main component render
  return (
    <div className="min-h-screen bg-gray-50 py-6 px-3 sm:py-12 sm:px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6 sm:mb-8">List Your Property</h1>

        {/* Progress Indicator - Shows current step in the form process */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-center items-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-xs font-medium ${
                  currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                <span className={`ml-1 sm:ml-2 text-xs sm:text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  <span className="hidden sm:inline">{step.title}</span>
                  <span className="sm:hidden">
                    {step.id === 1 ? 'Info' : step.id === 2 ? 'Details' : 'Media'}
                  </span>
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-4 sm:w-6 lg:w-8 h-0.5 mx-1 sm:mx-2 lg:mx-3 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content Container */}
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 lg:p-8">
          {renderCurrentStep()}

          {/* Navigation Buttons - Previous/Next step controls */}
          <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 space-y-3 sm:space-y-0">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-4 sm:px-6 py-2 rounded-md font-medium text-sm sm:text-base ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              Previous
            </button>
            <button
              onClick={currentStep === 3 ? () => alert('Property listed successfully!') : handleNext}
              className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 text-sm sm:text-base"
            >
              {currentStep === 3 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostSpace;