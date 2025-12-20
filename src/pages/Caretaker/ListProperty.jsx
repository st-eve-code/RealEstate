import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import ProgressIndicator from '@/components/Caretaker_Dashboard/ListProperty/ProgressIndicator';
import BasicInformationStep from '@/components/Caretaker_Dashboard/ListProperty/BasicInformationStep';
import UploadMediaStep from '@/components/Caretaker_Dashboard/ListProperty/UploadMediaStep';
import ReviewListingStep from '@/components/Caretaker_Dashboard/ListProperty/ReviewListingStep';
import { getInitialFormData, formatFormDataForDatabase } from '@/components/Caretaker_Dashboard/ListProperty/utils/formData';
import { validateStep } from '@/components/Caretaker_Dashboard/ListProperty/validation/stepValidation';
import { uploadPropertyMedia, generateUniqueId } from '@/lib/services/mediaUploadService';

/**
 * ListProperty Component - Main container for property listing flow
 * 
 * This component manages a 3-step property listing process:
 * 1. Basic Information - Property details, location, amenities
 * 2. Upload Media - Images and videos for different property areas
 * 3. Review Listing - Preview and publish the listing
 */
function ListProperty() {
  // Get current user (caretaker) from auth context
  const { user } = useAuth();
  
  // Current step in the multi-step form (1, 2, or 3)
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data containing all property listing information
  const [formData, setFormData] = useState(getInitialFormData());
  
  // Form validation errors
  const [errors, setErrors] = useState({});
  
  // Upload progress state
  const [uploadProgress, setUploadProgress] = useState({ category: '', progress: 0, message: '' });
  const [isUploading, setIsUploading] = useState(false);

  // Step definitions for the progress indicator
  const steps = [
    { id: 1, title: 'Basic Information' },
    { id: 2, title: 'Upload Media' },
    { id: 3, title: 'Review Listing' }
  ];

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
   * @param {string} section - The section name (e.g., 'basic', 'media')
   * @param {string} field - The field name
   * @param {any} value - The new value
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
   * @param {string} section - The section name
   * @param {string} subsection - The subsection name
   * @param {string} field - The field name (or object key)
   * @param {any} value - The new value
   */
  const updateNestedFormData = (section, subsection, field, value) => {
    setFormData(prev => {
      // Handle special case for categories where field is actually a category name
      if (section === 'media' && subsection === 'categories') {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [subsection]: {
              ...(prev[section]?.[subsection] || {}),
              [field]: value
            }
          }
        };
      }
      
      // Default nested update
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: {
            ...(prev[section]?.[subsection] || {}),
            [field]: value
          }
        }
      };
    });
  };

  /**
   * Handle publishing the listing
   * This will save the property to the database
   */
  const handlePublish = async () => {
    // Validate all steps before publishing
    const step1Validation = validateStep(1, formData);
    const step2Validation = validateStep(2, formData);
    
    if (!step1Validation.isValid || !step2Validation.isValid) {
      setErrors({
        ...step1Validation.errors,
        ...step2Validation.errors
      });
      setCurrentStep(1); // Go back to first step with errors
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress({ category: 'initializing', progress: 0, message: 'Preparing upload...' });
      
      // Get caretaker info from current user
      const caretaker = user ? {
        id: user.uid,
        name: user.displayName || user.fullName || 'Caretaker'
      } : { id: '', name: '' };

      // Generate unique ID for this property listing
      const uniqueId = generateUniqueId(caretaker.name || 'property');
      
      // Upload all media files
      setUploadProgress({ category: 'media', progress: 0, message: 'Uploading media files...' });
      
      const uploadResult = await uploadPropertyMedia(
        formData.media,
        uniqueId,
        (category, progress, message) => {
          setUploadProgress({ category, progress, message });
        }
      );
      
      if (!uploadResult.success && uploadResult.errors.length > 0) {
        console.error('Upload errors:', uploadResult.errors);
        // Show detailed error message
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
          images: uploadResult.images,
          videoUrl: uploadResult.videoUrl
        }
      );
      
      // TODO: Save unitData to Firestore 'units' collection
      // Example:
      // const docRef = await addDoc(collection(db, 'units'), unitData);
      // console.log('Property saved with ID:', docRef.id);
      
      console.log('Publishing property:', unitData);
      alert('Property listed successfully! It will be reviewed by an admin before going live.');
      
      // Reset form after successful publish
      setFormData(getInitialFormData());
      setCurrentStep(1);
      setIsUploading(false);
      setUploadProgress({ category: '', progress: 0, message: '' });
    } catch (error) {
      console.error('Error publishing property:', error);
      alert('Failed to publish property. Please try again.');
      setIsUploading(false);
      setUploadProgress({ category: '', progress: 0, message: '' });
    }
  };

  /**
   * Handle discarding the listing
   * Resets the form to initial state
   */
  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard this listing? All entered data will be lost.')) {
      setFormData(getInitialFormData());
      setCurrentStep(1);
      setErrors({});
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

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          List Your First Property
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

export default ListProperty;

