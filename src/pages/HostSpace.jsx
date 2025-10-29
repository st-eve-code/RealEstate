import React, { useState } from 'react';
import { User, Home, DollarSign, Wrench, Camera, CheckCircle, AlertCircle } from 'lucide-react';

// Supabase Configuration
// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://qchznjlkhvkyfyndrkro.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjaHpuamxraHZreWZ5bmRya3JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NDg3MzksImV4cCI6MjA3MjUyNDczOX0.lyoLMgMUZtwM4JJ0yAL4eAdAkxJfSmN_OhThYo3KeRA';

// Simple fetch-based Supabase client (no npm install needed for demo)
const supabaseClient = {
  from: (table) => ({
    insert: async (data) => {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to insert data');
      }
      
      const result = await response.json();
      return { data: result, error: null };
    }
  })
};

export default function CaretakerPropertyForm() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    caretakerName: '',
    caretakerPhone: '',
    caretakerEmail: '',
    caretakerRole: '',
    propertyType: '',
    propertyName: '',
    location: '',
    price: '',
    status: '',
    beds: 1,
    bathrooms: 1,
    kitchens: 1,
    amenities: [],
    description: '',
    images: [],
    imageFiles: [], // Store actual file objects for upload
    videos: [],
    videoFiles: [], // Store actual file objects for upload
  });

  const [fade, setFade] = useState(true);

  const steps = [
    { number: 1, title: 'Caretaker Info', icon: User, shortTitle: 'Info' },
    { number: 2, title: 'Property Basics', icon: Home, shortTitle: 'Property' },
    { number: 3, title: 'Pricing & Status', icon: DollarSign, shortTitle: 'Pricing' },
    { number: 4, title: 'Features', icon: Wrench, shortTitle: 'Features' },
    { number: 5, title: 'Media Upload', icon: Camera, shortTitle: 'Media' },
    { number: 6, title: 'Review', icon: CheckCircle, shortTitle: 'Review' },
  ];

  // Validation functions for each step
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.caretakerName.trim()) {
      newErrors.caretakerName = 'Full name is required';
    }
    
    if (!formData.caretakerPhone.trim()) {
      newErrors.caretakerPhone = 'Phone number is required';
    } else if (!/^[\d\s+()-]+$/.test(formData.caretakerPhone)) {
      newErrors.caretakerPhone = 'Invalid phone number format';
    }
    
    if (!formData.caretakerEmail.trim()) {
      newErrors.caretakerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.caretakerEmail)) {
      newErrors.caretakerEmail = 'Invalid email format';
    }
    
    if (!formData.caretakerRole) {
      newErrors.caretakerRole = 'Please select your role';
    }
    
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.propertyType) {
      newErrors.propertyType = 'Please select a property type';
    }
    
    if (!formData.propertyName.trim()) {
      newErrors.propertyName = 'Property name is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    return newErrors;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.status) {
      newErrors.status = 'Please select availability status';
    }
    
    return newErrors;
  };

  const validateStep4 = () => {
    const newErrors = {};
    
    if (formData.beds < 0) {
      newErrors.beds = 'Bedrooms cannot be negative';
    }
    
    if (formData.bathrooms < 0) {
      newErrors.bathrooms = 'Bathrooms cannot be negative';
    }
    
    if (formData.kitchens < 0) {
      newErrors.kitchens = 'Kitchens cannot be negative';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    
    return newErrors;
  };

  const validateStep5 = () => {
    const newErrors = {};
    
    if (formData.images.length === 0 && formData.videos.length === 0) {
      newErrors.media = 'Please upload at least one image or video';
    }
    
    return newErrors;
  };

  const validateCurrentStep = () => {
    let newErrors = {};
    
    switch (step) {
      case 1:
        newErrors = validateStep1();
        break;
      case 2:
        newErrors = validateStep2();
        break;
      case 3:
        newErrors = validateStep3();
        break;
      case 4:
        newErrors = validateStep4();
        break;
      case 5:
        newErrors = validateStep5();
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Toggle amenities
  const toggleAmenity = (amenity) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({ 
      ...prev, 
      images: [...prev.images, ...urls],
      imageFiles: [...prev.imageFiles, ...files] // Store actual files
    }));
    if (errors.images || errors.media) {
      setErrors((prev) => ({ ...prev, images: '', media: '' }));
    }
  };

  // Handle video upload
  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({ 
      ...prev, 
      videos: [...prev.videos, ...urls],
      videoFiles: [...prev.videoFiles, ...files] // Store actual files
    }));
    if (errors.videos || errors.media) {
      setErrors((prev) => ({ ...prev, videos: '', media: '' }));
    }
  };

  // Remove image
  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
    }));
  };

  // Remove video
  const removeVideo = (index) => {
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
      videoFiles: prev.videoFiles.filter((_, i) => i !== index),
    }));
  };

  // Navigation with fade animation and validation
  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    setFade(false);
    setTimeout(() => {
      setStep((prev) => prev + 1);
      setFade(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  };

  const handleBack = () => {
    setFade(false);
    setErrors({});
    setTimeout(() => {
      setStep((prev) => prev - 1);
      setFade(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Step 1: Upload images to Supabase Storage
      const imageUrls = [];
      for (let i = 0; i < formData.imageFiles.length; i++) {
        const file = formData.imageFiles[i];
        const fileName = `${Date.now()}_image_${i}_${file.name}`;
        
        const formDataObj = new FormData();
        formDataObj.append('file', file);
        
        const response = await fetch(`${SUPABASE_URL}/storage/v1/object/property-images/${fileName}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: file
        });
        
        if (response.ok) {
          // Get public URL
          const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/property-images/${fileName}`;
          imageUrls.push(publicUrl);
        }
      }

      // Step 2: Upload videos to Supabase Storage
      const videoUrls = [];
      for (let i = 0; i < formData.videoFiles.length; i++) {
        const file = formData.videoFiles[i];
        const fileName = `${Date.now()}_video_${i}_${file.name}`;
        
        const response = await fetch(`${SUPABASE_URL}/storage/v1/object/property-videos/${fileName}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: file
        });
        
        if (response.ok) {
          // Get public URL
          const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/property-videos/${fileName}`;
          videoUrls.push(publicUrl);
        }
      }

      // Step 3: Prepare data for Supabase database
      const propertyData = {
        caretaker_name: formData.caretakerName,
        caretaker_phone: formData.caretakerPhone,
        caretaker_email: formData.caretakerEmail,
        caretaker_role: formData.caretakerRole,
        property_type: formData.propertyType,
        property_name: formData.propertyName,
        location: formData.location,
        price: parseFloat(formData.price),
        status: formData.status,
        beds: parseInt(formData.beds),
        bathrooms: parseInt(formData.bathrooms),
        kitchens: parseInt(formData.kitchens),
        amenities: formData.amenities,
        description: formData.description,
        images: imageUrls, // Use uploaded URLs
        videos: videoUrls  // Use uploaded URLs
      };

      // Step 4: Insert into Supabase database
      const { data, error } = await supabaseClient.from('properties').insert(propertyData);
      
      if (error) {
        throw error;
      }

      console.log('Successfully saved to Supabase:', data);
      setSubmitSuccess(true);
      
      // Optional: Reset form after successful submission
      setTimeout(() => {
        setFormData({
          caretakerName: '',
          caretakerPhone: '',
          caretakerEmail: '',
          caretakerRole: '',
          propertyType: '',
          propertyName: '',
          location: '',
          price: '',
          status: '',
          beds: 1,
          bathrooms: 1,
          kitchens: 1,
          amenities: [],
          description: '',
          images: [],
          imageFiles: [],
          videos: [],
          videoFiles: [],
        });
        setStep(1);
        setSubmitSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      setSubmitError(error.message || 'Failed to submit property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-6 mb-4 sm:mb-6">
          {/* Mobile Progress */}
          <div className="block sm:hidden mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Step {step} of 6</span>
              <span className="text-sm text-gray-600">{steps[step - 1].title}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((step - 1) / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop Progress */}
          <div className="hidden sm:block">
            <div className="flex items-center justify-between mb-4">
              {steps.map((s, index) => {
                const Icon = s.icon;
                const isCompleted = step > s.number;
                const isCurrent = step === s.number;
                
                return (
                  <React.Fragment key={s.number}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <Icon size={18} className="lg:w-5 lg:h-5" />
                      </div>
                      <p className={`text-xs mt-2 font-medium text-center ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}>
                        {s.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 h-1 mx-2">
                        <div
                          className={`h-full rounded transition-all duration-500 ${
                            isCompleted ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                          style={{ width: isCompleted ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((step - 1) / 5) * 100}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              {Math.round(((step - 1) / 5) * 100)}% Complete
            </p>
          </div>
        </div>

        {/* Error Summary */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5 w-5 h-5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-red-800 mb-1 text-sm sm:text-base">Please fix the following errors:</h4>
              <ul className="list-disc list-inside text-xs sm:text-sm text-red-700 space-y-1">
                {Object.values(errors).map((error, i) => (
                  <li key={i} className="break-words">{error}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Submit Success Message */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3">
            <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5 w-5 h-5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-green-800 mb-1 text-sm sm:text-base">Success!</h4>
              <p className="text-xs sm:text-sm text-green-700">Property has been successfully submitted to the database.</p>
            </div>
          </div>
        )}

        {/* Submit Error Message */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5 w-5 h-5" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-red-800 mb-1 text-sm sm:text-base">Submission Failed</h4>
              <p className="text-xs sm:text-sm text-red-700">{submitError}</p>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
            {steps[step - 1].title}
          </h2>

          <div
            className={`transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Step 1: Caretaker Profile */}
            {step === 1 && (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="caretakerName"
                    placeholder="Enter your full name"
                    value={formData.caretakerName}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.caretakerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.caretakerName && (
                    <p className="text-red-500 text-xs mt-1">{errors.caretakerName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="caretakerPhone"
                    placeholder="+237 6XX XXX XXX"
                    value={formData.caretakerPhone}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.caretakerPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.caretakerPhone && (
                    <p className="text-red-500 text-xs mt-1">{errors.caretakerPhone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="caretakerEmail"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.caretakerEmail}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.caretakerEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.caretakerEmail && (
                    <p className="text-red-500 text-xs mt-1">{errors.caretakerEmail}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="caretakerRole"
                    value={formData.caretakerRole}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.caretakerRole ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Select your role --</option>
                    <option value="caretaker">Caretaker</option>
                    <option value="agent">Real Estate Agent</option>
                    <option value="landlord">Property Owner/Landlord</option>
                  </select>
                  {errors.caretakerRole && (
                    <p className="text-red-500 text-xs mt-1">{errors.caretakerRole}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Property Basics */}
            {step === 2 && (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.propertyType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Select property type --</option>
                    <option value="hostel">Student Hostel</option>
                    <option value="apartment">Apartment</option>
                    <option value="studio">Studio</option>
                    <option value="house">House</option>
                    <option value="duplex">Duplex</option>
                    <option value="villa">Villa</option>
                  </select>
                  {errors.propertyType && (
                    <p className="text-red-500 text-xs mt-1">{errors.propertyType}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="propertyName"
                    placeholder="e.g., Sunrise Apartments"
                    value={formData.propertyName}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.propertyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.propertyName && (
                    <p className="text-red-500 text-xs mt-1">{errors.propertyName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="location"
                    placeholder="e.g., Ngoa Ekelle, Yaoundé"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.location ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.location && (
                    <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Pricing & Status */}
            {step === 3 && (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Rent (FCFA) <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="price"
                    type="number"
                    placeholder="e.g., 50000"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Enter the monthly rental price in CFA Francs</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.status ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">-- Select availability --</option>
                    <option value="available">Available Now</option>
                    <option value="occupied">Currently Occupied</option>
                    <option value="upcoming">Available Soon</option>
                  </select>
                  {errors.status && (
                    <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Features & Amenities */}
            {step === 4 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Room Configuration</label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Bedrooms</label>
                      <input
                        name="beds"
                        type="number"
                        min="0"
                        value={formData.beds}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-2 sm:px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.beds ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Bathrooms</label>
                      <input
                        name="bathrooms"
                        type="number"
                        min="0"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-2 sm:px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.bathrooms ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Kitchens</label>
                      <input
                        name="kitchens"
                        type="number"
                        min="0"
                        value={formData.kitchens}
                        onChange={handleChange}
                        className={`w-full border rounded-lg px-2 sm:px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.kitchens ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Amenities Available</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {['WiFi', 'Parking', 'Security', 'Water Supply', 'Laundry', 'Generator', 'Furnished', 'Air Conditioning'].map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => toggleAmenity(amenity)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Describe the property, its surroundings, nearby facilities, etc."
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length} characters (minimum 20)
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Upload Images & Videos */}
            {step === 5 && (
              <div className="space-y-4 sm:space-y-6">
                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Property Images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">Upload multiple images to showcase your property</p>
                </div>
                
                {formData.images.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">{formData.images.length} image(s) uploaded</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                      {formData.images.map((img, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={img}
                            alt={`Preview ${i + 1}`}
                            className="w-full h-24 sm:h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs font-bold"
                          >
                            ×
                          </button>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs opacity-0 group-hover:opacity-100">Image {i + 1}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Upload Section */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Property Videos
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-2">Upload videos to give a better view of your property</p>
                </div>

                {formData.videos.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">{formData.videos.length} video(s) uploaded</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {formData.videos.map((video, i) => (
                        <div key={i} className="relative group">
                          <video
                            src={video}
                            className="w-full h-32 sm:h-40 object-cover rounded-lg border-2 border-gray-200"
                            controls
                          />
                          <button
                            onClick={() => removeVideo(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-xs font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.media && (
                  <p className="text-red-500 text-sm mt-2">{errors.media}</p>
                )}
              </div>
            )}

            {/* Step 6: Review & Submit */}
            {step === 6 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Caretaker Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                    <p className="text-gray-700 break-words"><strong>Name:</strong> {formData.caretakerName || 'N/A'}</p>
                    <p className="text-gray-700 break-words"><strong>Role:</strong> {formData.caretakerRole || 'N/A'}</p>
                    <p className="text-gray-700 break-words"><strong>Phone:</strong> {formData.caretakerPhone || 'N/A'}</p>
                    <p className="text-gray-700 break-words"><strong>Email:</strong> {formData.caretakerEmail || 'N/A'}</p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Property Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                    <p className="text-gray-700 break-words"><strong>Name:</strong> {formData.propertyName || 'N/A'}</p>
                    <p className="text-gray-700 break-words"><strong>Type:</strong> {formData.propertyType || 'N/A'}</p>
                    <p className="text-gray-700 break-words"><strong>Location:</strong> {formData.location || 'N/A'}</p>
                    <p className="text-gray-700 break-words"><strong>Price:</strong> {formData.price ? `${formData.price} FCFA/month` : 'N/A'}</p>
                    <p className="text-gray-700 break-words"><strong>Status:</strong> {formData.status || 'N/A'}</p>
                    <p className="text-gray-700 break-words"><strong>Rooms:</strong> {formData.beds} bed(s), {formData.bathrooms} bath(s), {formData.kitchens} kitchen(s)</p>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Description</h3>
                  <p className="text-xs sm:text-sm text-gray-700 break-words">{formData.description || 'No description provided'}</p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
                  <h3 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">Amenities</h3>
                  <p className="text-xs sm:text-sm text-gray-700 break-words">
                    {formData.amenities.length > 0 ? formData.amenities.join(', ') : 'No amenities selected'}
                  </p>
                </div>

                {formData.images.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Property Images ({formData.images.length})</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {formData.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Property ${i + 1}`}
                          className="w-full h-20 sm:h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {formData.videos.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Property Videos ({formData.videos.length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {formData.videos.map((video, i) => (
                        <video
                          key={i}
                          src={video}
                          className="w-full h-32 sm:h-40 object-cover rounded-lg border-2 border-gray-200"
                          controls
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`order-2 sm:order-1 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                step === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ← Previous Step
            </button>
            
            {step < 6 ? (
              <button
                onClick={handleNext}
                className="order-1 sm:order-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                Continue to {steps[step].shortTitle} →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`order-1 sm:order-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg text-sm sm:text-base ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Property ✓'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}