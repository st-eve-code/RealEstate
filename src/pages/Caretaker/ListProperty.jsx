import React, { useState } from 'react';
import ProgressIndicator from '@/components/Caretaker_Dashboard/ListProperty/ProgressIndicator';
import BasicInformationStep from '@/components/Caretaker_Dashboard/ListProperty/BasicInformationStep';
import UploadMediaStep from '@/components/Caretaker_Dashboard/ListProperty/UploadMediaStep';
import ReviewListingStep from '@/components/Caretaker_Dashboard/ListProperty/ReviewListingStep';
import { getInitialFormData } from '@/components/Caretaker_Dashboard/ListProperty/utils/formData';
import { validateStep } from '@/components/Caretaker_Dashboard/ListProperty/validation/stepValidation';

/**
 * ListProperty Component - Main container for property listing flow
 * 
 * This component manages a 3-step property listing process:
 * 1. Basic Information - Property details, location, amenities
 * 2. Upload Media - Images and videos for different property areas
 * 3. Review Listing - Preview and publish the listing
 */
function ListProperty() {
  // Current step in the multi-step form (1, 2, or 3)
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data containing all property listing information
  const [formData, setFormData] = useState(getInitialFormData());
  
  // Form validation errors
  const [errors, setErrors] = useState({});

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
      // TODO: Implement Firebase save logic here
      console.log('Publishing property:', formData);
      alert('Property listed successfully!');
      // Reset form after successful publish
      setFormData(getInitialFormData());
      setCurrentStep(1);
    } catch (error) {
      console.error('Error publishing property:', error);
      alert('Failed to publish property. Please try again.');
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
                  className="px-6 py-2.5 rounded-lg font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
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

