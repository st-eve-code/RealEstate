'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Timestamp } from 'firebase/firestore';
import ProgressIndicator from '@/components/Caretaker_Dashboard/ListProperty/ProgressIndicator';
import BasicInformationStep from '@/components/Caretaker_Dashboard/ListProperty/BasicInformationStep';
import UploadMediaStep from '@/components/Caretaker_Dashboard/ListProperty/UploadMediaStep';
import ReviewListingStep from '@/components/Caretaker_Dashboard/ListProperty/ReviewListingStep';
import { getInitialFormData, formatFormDataForDatabase, unitToFormData } from '@/components/Caretaker_Dashboard/ListProperty/utils/formData';
import { validateStep } from '@/components/Caretaker_Dashboard/ListProperty/validation/stepValidation';
import { uploadPropertyMedia, generateUniqueId } from '@/lib/services/mediaUploadService';
import { selectDocumentsByConstraint } from '@/lib/utils/firestoreDocumentOperation';
import { updateDocumentById } from '@/lib/internal-firebase';

/**
 * EditProperty Component - Edit existing property
 * 
 * This component reuses the ListProperty form but pre-populates it with existing data
 * and updates the document instead of creating a new one.
 */
function EditProperty() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState({ category: '', progress: 0, message: '' });
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalProperty, setOriginalProperty] = useState(null);

  // Step definitions for the progress indicator
  const steps = [
    { id: 1, title: 'Basic Information' },
    { id: 2, title: 'Upload Media' },
    { id: 3, title: 'Review Listing' }
  ];

  // Fetch existing property data
  useEffect(() => {
    const fetchProperty = async () => {
      if (!user?.uid || !id) return;

      try {
        setLoading(true);
        const constraints = [
          {
            field: 'caretaker.id',
            operator: '==',
            value: user.uid
          }
        ];

        const result = await selectDocumentsByConstraint('units', constraints);
        
        if (result.success) {
          const foundProperty = result.data.find(unit => unit.id === id);
          if (foundProperty) {
            // Store original property for media preservation
            setOriginalProperty(foundProperty);
            // Convert Unit data to form data format
            const formDataFromUnit = unitToFormData(foundProperty);
            setFormData(formDataFromUnit);
          } else {
            alert('Property not found or you do not have permission to edit it.');
            router.push('/dashboard/properties');
          }
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        alert('Failed to load property data.');
        router.push('/dashboard/properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, user, router]);

  /**
   * Handle navigation to next step
   * Validates current step before proceeding
   */
  const handleNext = () => {
    const isValid = validateStep(currentStep, formData);
    
    if (isValid.isValid) {
      setErrors({});
      setCurrentStep(currentStep + 1);
    } else {
      setErrors(isValid.errors);
    }
  };

  /**
   * Handle navigation to previous step
   */
  const handlePrevious = () => {
    setErrors({});
    setCurrentStep(currentStep - 1);
  };

  /**
   * Update form data for a specific field
   */
  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  /**
   * Update nested form data (for complex objects)
   */
  const updateNestedFormData = (section, nestedKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedKey]: {
          ...prev[section][nestedKey],
          [field]: value
        }
      }
    }));
  };

  /**
   * Handle publishing/updating the property
   */
  const handlePublish = async () => {
    // Validate all steps before publishing
    for (let step = 1; step <= 3; step++) {
      const isValid = validateStep(step, formData);
      if (!isValid.isValid) {
        setErrors(isValid.errors);
        setCurrentStep(step);
        alert('Please fix all errors before updating the property.');
        return;
      }
    }

    try {
      setIsUploading(true);
      setUploadProgress({ category: 'initializing', progress: 0, message: 'Preparing update...' });
      
      const caretaker = user ? {
        id: user.uid,
        name: user.displayName || user.fullName || 'Caretaker'
      } : { id: '', name: '' };

      // Generate unique ID (reuse existing or generate new)
      const uniqueId = generateUniqueId(caretaker.name || 'property');
      
      // Upload all media files (only new files, preserve existing URLs)
      setUploadProgress({ category: 'media', progress: 0, message: 'Processing media files...' });
      
      // Pass original media to preserve existing URLs
      const originalMedia = {
        images: originalProperty?.images || [],
        videoUrl: originalProperty?.videoUrl || null
      };
      
      const uploadResult = await uploadPropertyMedia(
        formData.media,
        uniqueId,
        (category, progress, message) => {
          setUploadProgress({ category, progress, message });
        },
        originalMedia
      );
      
      if (!uploadResult.success && uploadResult.errors.length > 0) {
        console.error('Upload errors:', uploadResult.errors);
        const errorMessage = uploadResult.errors.length > 5 
          ? `${uploadResult.errors.slice(0, 5).join('\n')}\n... and ${uploadResult.errors.length - 5} more errors`
          : uploadResult.errors.join('\n');
        
        const shouldContinue = window.confirm(
          `Some files failed to upload:\n\n${errorMessage}\n\nContinue anyway?`
        );
        if (!shouldContinue) {
          setIsUploading(false);
          setUploadProgress({ category: '', progress: 0, message: '' });
          return;
        }
      }
      
      // Format data according to Unit interface with uploaded media URLs
      const unitData = formatFormDataForDatabase(
        formData,
        caretaker,
        {
          images: uploadResult.images.length > 0 ? uploadResult.images : undefined,
          videoUrl: uploadResult.videoUrl
        }
      );
      
      // Remove fields that should not be updated (preserve existing values)
      const { createdAt, rating, views, reportCount, status, isVerified, ...updateableFields } = unitData;
      
      // Add updatedAt timestamp
      const updateData = {
        ...updateableFields,
        updatedAt: Timestamp.now()
        // Note: createdAt, rating, views, reportCount, status, isVerified are preserved
        // updateDoc will merge, so these won't be overwritten
      };
      
      // Update unitData in Firestore 'units' collection
      setUploadProgress({ category: 'saving', progress: 95, message: 'Updating property in database...' });
      
      const updateResult = await updateDocumentById('units', id, updateData);
      
      if (!updateResult.success) {
        console.error('Failed to update unit in Firestore:', updateResult.error);
        throw new Error(updateResult.message || 'Failed to update property in database');
      }
      
      console.log('Property updated successfully');
      alert('Property updated successfully!');
      
      // Navigate back to property details
      router.push(`/dashboard/properties/${id}`);
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property. Please try again.');
      setIsUploading(false);
      setUploadProgress({ category: '', progress: 0, message: '' });
    }
  };

  /**
   * Handle discarding changes
   */
  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard your changes? All unsaved data will be lost.')) {
      router.push(`/dashboard/properties/${id}`);
    }
  };

  /**
   * Render the current step component based on currentStep state
   */
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInformationStep
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            updateNestedFormData={updateNestedFormData}
          />
        );
      case 2:
        return (
          <UploadMediaStep
            formData={formData}
            errors={errors}
            updateFormData={updateFormData}
            updateNestedFormData={updateNestedFormData}
          />
        );
      case 3:
        return (
          <ReviewListingStep
            formData={formData}
            onPublish={handlePublish}
            onDiscard={handleDiscard}
            isUploading={isUploading}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Loading property data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Edit Property
        </h1>

        {/* Progress Indicator */}
        <ProgressIndicator
          steps={steps}
          currentStep={currentStep}
        />

        {/* Form Content Container */}
        <div className="bg-white shadow-md rounded-lg p-6 lg:p-8 mt-8">
          {renderCurrentStep()}

          {/* Navigation Buttons - Only show on steps 1 and 2 */}
          {currentStep < 3 && (
            <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  disabled={isUploading}
                  className={`px-6 py-2.5 rounded-lg font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={isUploading}
                className={`px-6 py-2.5 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditProperty;

