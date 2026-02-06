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
  const [cannotEdit, setCannotEdit] = useState({ blocked: false, status: '', message: '' });

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
            // Check if property can be edited
            const status = foundProperty.status?.toLowerCase();
            if (status === 'pending' || status === 'deleted') {
              const messages = {
                pending: 'This property is currently under admin review. You cannot make changes until the review is complete.',
                deleted: 'This property has been deleted and cannot be edited. Please contact an administrator for assistance.'
              };
              setCannotEdit({
                blocked: true,
                status: status,
                message: messages[status] || 'This property cannot be edited at this time.'
              });
              setLoading(false);
              return;
            }
            
            // Store original property for media preservation
            setOriginalProperty(foundProperty);
            // Convert Unit data to form data format
            const formDataFromUnit = unitToFormData(foundProperty);
            setFormData(formDataFromUnit);
          } else {
            setCannotEdit({
              blocked: true,
              status: 'not-found',
              message: 'Property not found or you do not have permission to edit it.'
            });
            setLoading(false);
            return;
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
        name: user.displayName || user.fullName || 'Caretaker',
        email: user.email || '',
        phoneNumber: user.phoneNumber || user.phone || undefined
      } : { id: '', name: '', email: '' };

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
      const { createdAt, rating, views, reportCount, isVerified, ...updateableFields } = unitData;
      
      const now = Timestamp.now();
      
      // Add updatedAt timestamp and set status to pending for admin review
      const updateData = {
        ...updateableFields,
        status: 'pending', // Always set to pending when edited
        updatedAt: now
        // Note: createdAt, rating, views, reportCount, isVerified are preserved
      };
      
      // Update unitData in Firestore 'units' collection
      setUploadProgress({ category: 'saving', progress: 95, message: 'Updating property in database...' });
      
      const updateResult = await updateDocumentById('units', id, updateData);
      
      if (!updateResult.success) {
        console.error('Failed to update unit in Firestore:', updateResult.error);
        throw new Error(updateResult.message || 'Failed to update property in database');
      }
      
      console.log('Property updated successfully');
      alert('Property updated successfully! It will be reviewed by an admin before going live.');
      
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Loading property data...</p>
        </div>
      </div>
    );
  }

  // Show premium error UI if property cannot be edited
  if (cannotEdit.blocked) {
    const statusConfig = {
      pending: {
        icon: '⏳',
        color: 'orange',
        bgGradient: 'from-orange-50 to-amber-50',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        borderColor: 'border-orange-200',
        animated: true,
      },
      deleted: {
        icon: '🗑️',
        color: 'red',
        bgGradient: 'from-red-50 to-rose-50',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        borderColor: 'border-red-200',
      },
      'not-found': {
        icon: '🔍',
        color: 'gray',
        bgGradient: 'from-gray-50 to-slate-50',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600',
        borderColor: 'border-gray-200',
      }
    };

    const config = statusConfig[cannotEdit.status] || statusConfig['not-found'];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Premium Error Card */}
          <div className={`bg-gradient-to-br ${config.bgGradient} rounded-3xl shadow-2xl overflow-hidden border-2 ${config.borderColor}`}>
            {/* Icon Section */}
            <div className="pt-12 pb-6 text-center">
              <div className={`${config.iconBg} w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${config.animated ? 'animate-pulse' : ''}`}>
                <span className={`text-5xl ${config.animated ? 'inline-block animate-bounce' : ''}`} style={config.animated ? { animationDuration: '2s' } : {}}>
                  {config.icon}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {cannotEdit.status === 'pending' && 'Under Review'}
                {cannotEdit.status === 'deleted' && 'Property Deleted'}
                {cannotEdit.status === 'not-found' && 'Not Found'}
              </h1>
              <p className="text-lg text-gray-600 px-6 max-w-xl mx-auto leading-relaxed">
                {cannotEdit.message}
              </p>
            </div>

            {/* Info Section */}
            <div className="bg-white/60 backdrop-blur-sm px-8 py-6 border-t-2 border-white">
              <div className="space-y-4">
                {cannotEdit.status === 'pending' && (
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-sm">ℹ️</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Why can't I edit?</p>
                      <p className="text-sm text-gray-600">
                        When a property is under admin review, editing is temporarily disabled to maintain data integrity. 
                        Once approved, you'll be able to make changes again.
                      </p>
                    </div>
                  </div>
                )}
                {cannotEdit.status === 'deleted' && (
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-sm">⚠️</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Need help?</p>
                      <p className="text-sm text-gray-600">
                        If you believe this property was deleted by mistake, please contact an administrator 
                        to review the case and potentially restore it.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-8 py-6 bg-white/80 backdrop-blur-sm space-y-3">
              <button
                onClick={() => router.push('/dashboard/properties')}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                ← Back to Properties
              </button>
              {cannotEdit.status === 'deleted' && (
                <button
                  onClick={() => router.push('/dashboard/messages')}
                  className="w-full px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:bg-gray-50 transition-all duration-200"
                >
                  Contact Support
                </button>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Property ID: <span className="font-mono font-semibold text-gray-700">{id}</span>
            </p>
          </div>
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

