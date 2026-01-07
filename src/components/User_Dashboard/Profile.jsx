'use client'

import { Edit3, Save, Trash2, Upload, Camera, Eye, EyeOff, Bell, Mail, Shield, Calendar, Building2, FileText, CheckCircle, X } from 'lucide-react';
import React, { useState, useRef } from 'react';
import Loader from '../ado/loader';
import { useAuth } from '@/lib/auth-context';
import { updatePassword, updateProfile } from 'firebase/auth';
import { updateDocumentById } from '@/lib/internal-firebase';
import { uploadFile, generateUniqueId } from '@/lib/services/mediaUploadService';
import Swal from 'sweetalert2';
import { Timestamp } from 'firebase/firestore';
import { unde_find } from '@/lib/utils/filter';

/**
 * Enhanced Profile Component
 * Supports all User interface properties and works for both regular users and caretakers (landlords)
 * @param {{user: User}} param0 
 * @returns 
 */
function Profile({user}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editPass, setEditPass] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const { firebaseUser } = useAuth();
  
  const profileImageInputRef = useRef(null);
  const coverImageInputRef = useRef(null);
  
  // Initialize form data with all User properties
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    password: '',
    phoneNumber: user?.phoneNumber || '',
    dateOfBirth: user?.dateOfBirth || '',
    imageUrl: user?.imageUrl || '',
    coverImageUrl: '', // Not in User interface, but useful feature
    // Permissions
    shareContactInfo: user?.permissions?.shareContactInfo ?? true,
    sharePhoto: user?.permissions?.sharePhoto ?? true,
    // Notifications
    inAppNotifications: user?.inAppNotification || [],
    emailSubscriptions: user?.emailSubscription || [],
    // Landlord specific
    licenseNumber: user?.role?.role === 'landlord' ? (user.role.landlord?.licenseNumber || '') : '',
    // Auto renewal
    autoRenewal: user?.autoRenewal ?? false,
  });

  // Placeholder images
  const coverImage = formData.coverImageUrl || "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop";
  const profileImage = formData.imageUrl || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop";

  const isLandlord = user?.role?.role === 'landlord';
  const roleDisplay = user?.role?.role || 'user';
  const isVerified = isLandlord && user.role.landlord?.verified === 'verified';

  // Build user details array with all relevant information
  const userDetails = [
    {
      info: 'Full Name',
      detail: formData.fullName || formData.displayName || 'Not set'
    },
    {
      info: 'Display Name',
      detail: formData.displayName || 'Not set'
    },
    {
      info: 'Email Address',
      detail: formData.email
    },
    {
      info: 'Phone Number',
      detail: formData.phoneNumber || 'Not set'
    },
    {
      info: 'Date of Birth',
      detail: formData.dateOfBirth || 'Not set'
    },
    {
      info: 'User Role',
      detail: roleDisplay.charAt(0).toUpperCase() + roleDisplay.slice(1)
    },
    ...(isLandlord ? [{
      info: 'License Number',
      detail: formData.licenseNumber || 'Not set'
    }] : []),
    ...(isLandlord ? [{
      info: 'Verification Status',
      detail: isVerified ? 'Verified' : 'Pending'
    }] : []),
    {
      info: 'Properties Listed',
      detail: user?.numberOfProperties || 0
    },
    {
      info: 'Auto Renewal',
      detail: formData.autoRenewal ? 'Enabled' : 'Disabled'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if(name === 'password'){
      setEditPass(true);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (file, type = 'profile') => {
    if (!file || !(file instanceof File)) {
      Swal.fire({
        title: 'Error',
        text: 'Please select a valid image file',
        icon: 'error'
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Error',
        text: 'Please select an image file',
        icon: 'error'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'Error',
        text: 'Image size should be less than 5MB',
        icon: 'error'
      });
      return;
    }

    try {
      if (type === 'profile') {
        setIsUploadingImage(true);
      } else {
        setIsUploadingCover(true);
      }

      const uniqueId = generateUniqueId(user?.uid || 'user');
      const result = await uploadFile(file, uniqueId, 'profile', 'image');

      if (result.success) {
        if (type === 'profile') {
          setFormData(prev => ({ ...prev, imageUrl: result.url }));
          Swal.fire({
            title: 'Success',
            text: 'Profile image uploaded successfully',
            icon: 'success',
            timer: 2000
          });
        } else {
          setFormData(prev => ({ ...prev, coverImageUrl: result.url }));
          Swal.fire({
            title: 'Success',
            text: 'Cover image uploaded successfully',
            icon: 'success',
            timer: 2000
          });
        }
      } else {
        Swal.fire({
          title: 'Upload Failed',
          text: result.error || 'Failed to upload image',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Failed to upload image',
        icon: 'error'
      });
    } finally {
      setIsUploadingImage(false);
      setIsUploadingCover(false);
    }
  };

  const handleProfileImageClick = () => {
    profileImageInputRef.current?.click();
  };

  const handleCoverImageClick = () => {
    coverImageInputRef.current?.click();
  };

  const handleSave = async () => {
    if(!firebaseUser || firebaseUser.uid !== user.uid) return;
    
    try{
      console.log('Saving profile changes:', formData);
      
      // Build update data object
      const updateData = {
        displayName: formData.displayName,
        fullName: formData.fullName || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        dateOfBirth: formData.dateOfBirth || undefined,
        imageUrl: formData.imageUrl || undefined,
        permissions: {
          shareContactInfo: formData.shareContactInfo,
          sharePhoto: formData.sharePhoto
        },
        autoRenewal: formData.autoRenewal,
        updatedAt: Timestamp.now()
      };

      // Update password if changed
      if(editPass && formData.password.trim().length) {
        if(formData.password.trim().length < 6) {
          setEditPass(false);
          return Swal.fire({
            title: "Password Security",
            text: "Password not Updated, Your Password should be at least 6 characters",
            icon: "warning"
          });
        }
        
        try {
          await updatePassword(firebaseUser, formData.password);
        } catch (passwordError) {
          return Swal.fire({
            title: 'Password Update Failed',
            text: passwordError.message || 'Failed to update password',
            icon: 'error'
          });
        }
      }

      // Update Firebase Auth profile
      try {
        await updateProfile(firebaseUser, {
          displayName: formData.displayName,
          photoURL: formData.imageUrl || undefined
        });
      } catch (profileError) {
        console.error('Error updating Firebase profile:', profileError);
      }

      // Update landlord-specific fields if user is a landlord
      if (isLandlord && formData.licenseNumber) {
        updateData.role = {
          ...user.role,
          landlord: {
            ...user.role.landlord,
            licenseNumber: formData.licenseNumber
          }
        };
      }

      // Update Firestore document
      const res = await updateDocumentById('users', user.uid, unde_find(updateData));
      
      if(!res.success) {
        // Revert Firebase Auth profile
        await updateProfile(firebaseUser, {
          displayName: user.displayName,
          photoURL: user.imageUrl || undefined
        });
        
        return Swal.fire({
          title: 'Error',
          text: res.message || 'Failed to update profile',
          icon: 'error'
        });
      }

      setIsEditing(false);
      setEditPass(false);
      setFormData(prev => ({ ...prev, password: '' }));
      
      Swal.fire({
        title: 'Success',
        text: 'Profile updated successfully',
        icon: 'success',
        timer: 2000
      });

    } catch(e) {
      console.error('Error saving profile:', e);
      Swal.fire({
        title: 'Error',
        text: e.message || 'Failed to save profile',
        icon: 'error'
      });
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: 'Delete Account',
      text: 'Are you sure you want to delete your account? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Add your delete logic here
        console.log('Deleting account');
        Swal.fire({
          title: 'Account Deletion',
          text: 'Account deletion feature is not yet implemented',
          icon: 'info'
        });
      }
    });
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      displayName: user?.displayName || '',
      fullName: user?.fullName || '',
      email: user?.email || '',
      password: '',
      phoneNumber: user?.phoneNumber || '',
      dateOfBirth: user?.dateOfBirth || '',
      imageUrl: user?.imageUrl || '',
      coverImageUrl: '',
      shareContactInfo: user?.permissions?.shareContactInfo ?? true,
      sharePhoto: user?.permissions?.sharePhoto ?? true,
      inAppNotifications: user?.inAppNotification || [],
      emailSubscriptions: user?.emailSubscription || [],
      licenseNumber: isLandlord ? (user.role.landlord?.licenseNumber || '') : '',
      autoRenewal: user?.autoRenewal ?? false,
    });
    setIsEditing(false);
    setEditPass(false);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="font-bold text-xl sm:text-2xl text-gray-700 mb-6">My Account</h1>
      
      {/* Cover Image and Profile Picture Section */}
      <section className="relative bg-white rounded-lg shadow-md overflow-hidden mb-8">
        {/* Cover Image */}
        <div className="relative h-32 sm:h-48 md:h-56 bg-gradient-to-r from-blue-500 to-purple-600">
          <img 
            src={coverImage}
            alt="Cover" 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={handleCoverImageClick}
            disabled={isUploadingCover}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white hover:bg-gray-100 p-2 sm:p-2.5 rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isUploadingCover ? (
              <Loader />
            ) : (
              <Camera size={18} className="text-gray-700" />
            )}
          </button>
          <input
            type="file"
            ref={coverImageInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file, 'cover');
              e.target.value = ''; // Reset input
            }}
          />
        </div>
        
        {/* Profile Picture and Info */}
        <div className="relative px-4 sm:px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            {/* Profile Picture */}
            <div className="relative -mt-12 sm:-mt-16">
              <div className="relative">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <button 
                  onClick={handleProfileImageClick}
                  disabled={isUploadingImage}
                  className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {isUploadingImage ? (
                    <Loader />
                  ) : (
                    <Upload size={16} className="text-white" />
                  )}
                </button>
                <input
                  type="file"
                  ref={profileImageInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, 'profile');
                    e.target.value = ''; // Reset input
                  }}
                />
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex-1 pt-2 sm:pt-0 sm:pb-2">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg sm:text-xl text-gray-800">
                  {formData.displayName || formData.fullName || 'User'}
                </h2>
                {isVerified && (
                  <CheckCircle className="w-5 h-5 text-green-500" title="Verified Landlord" />
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                {roleDisplay.charAt(0).toUpperCase() + roleDisplay.slice(1)}
                {isLandlord && formData.licenseNumber && ` • License: ${formData.licenseNumber}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Information Section */}
      <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
        <div className="mb-6">
          <h2 className="font-bold text-base sm:text-lg text-gray-700">Personal Information</h2>
          <p className="text-sm text-gray-500 mt-1">View your account details</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userDetails.map((detail, index) => (
            <div key={index} className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {detail.info}
              </p>
              <h3 className="text-sm font-semibold text-gray-800">
                {detail.detail}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Edit Profile Section */}
      <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="font-bold text-base sm:text-lg text-gray-700">Update Profile</h2>
            <p className="text-sm text-gray-500 mt-1">Edit your profile details</p>
          </div>
          <button
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors self-start sm:self-auto">
            <Edit3 size={18} className="text-gray-600" />
            <span className="font-medium text-sm text-gray-700">
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </span>
          </button>
        </div>

        {isEditing && (
          <>
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Shield size={18} />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      id="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Display Name */}
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      id="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      placeholder="Enter display name"
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      readOnly
                      value={formData.email}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar size={16} />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      id="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Enter new password (min 6 characters)"
                        className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Leave empty to keep current password</p>
                  </div>
                </div>
              </div>

              {/* Landlord Specific Fields */}
              {isLandlord && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Building2 size={18} />
                    Landlord Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <FileText size={16} />
                        License Number
                      </label>
                      <input
                        type="text"
                        name="licenseNumber"
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        placeholder="Enter license number"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    {isVerified && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={20} />
                        <span className="text-sm font-medium">Verified Landlord</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Privacy & Permissions */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Shield size={18} />
                  Privacy & Permissions
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="shareContactInfo"
                      checked={formData.shareContactInfo}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Share Contact Information</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="sharePhoto"
                      checked={formData.sharePhoto}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Share Profile Photo</span>
                  </label>
                </div>
              </div>

              {/* Subscription Settings */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Bell size={18} />
                  Subscription Settings
                </h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="autoRenewal"
                    checked={formData.autoRenewal}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Enable Auto Renewal</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4 mt-8 pt-6 border-t">
              <button
                onClick={handleSave}
                disabled={!formData.displayName || isUploadingImage || isUploadingCover}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <Save size={18} />
                <span className="font-medium text-sm">Save Changes</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-lg shadow-sm hover:shadow-md transition-all">
                <Trash2 size={18} />
                <span className="font-medium text-sm">Delete Account</span>
              </button>
            </div>
          </>
        )}
      </section>
    </section>
  );
}

export default Profile;
