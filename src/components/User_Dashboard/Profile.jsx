// import { useAuth } from '@/lib/auth-context';
import { Edit3, Save, Trash2, Upload, Camera, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
// import { User } from '@/lib/types';
import Loader from '../ado/loader';


function Profile({user}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const {user} = useAuth();
  // const user = param.user;
  const [formData, setFormData] = useState({
    username: user?.fullName || 'John Doe',
    email: user?.email || 'user@mail.com',
    password: '*********',
    phone: user?.phoneNumber || '',
    role: user?.role.role || 'user'
  });

  // Placeholder images - replace with actual user images
  const coverImage = "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop";
  const profileImage = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop";

  const userDetails = [
    {
      info: 'User Name',
      detail: formData.username
    },
    {
      info: 'Country',
      detail: 'Cameroon'
    },
    {
      info: 'Email Address',
      detail: formData.email
    },
    {
      info: 'Password',
      detail: '••••••••••••'
    },
    {
      info: 'Phone Number',
      detail: formData.phone
    },
    {
      info: 'User Role',
      detail: formData.role
    },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    console.log('Saving profile changes:', formData);
    setIsEditing(false);
    // Add your save logic here
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Deleting account');
      // Add your delete logic here
    }
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
          <button className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white hover:bg-gray-100 p-2 sm:p-2.5 rounded-full shadow-lg transition-colors">
            <Camera size={18} className="text-gray-700" />
          </button>
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
                <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full shadow-lg transition-colors">
                  <Upload size={16} className="text-white" />
                </button>
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex-1 pt-2 sm:pt-0 sm:pb-2">
              <h2 className="font-bold text-lg sm:text-xl text-gray-800">
                {formData.username}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">Cameroon</p>
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
          {userDetails.map((user, index) => (
            <div key={index} className="space-y-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {user.info}
              </p>
              <h3 className="text-sm font-semibold text-gray-800">
                {user.detail}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Edit Profile Section */}
      <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="font-bold text-base sm:text-lg text-gray-700">Update Profile</h2>
            <p className="text-sm text-gray-500 mt-1">Edit your profile details</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors self-start sm:self-auto">
            <Edit3 size={18} className="text-gray-600" />
            <span className="font-medium text-sm text-gray-700">
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </span>
          </button>
        </div>

        {isEditing && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter new username"
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
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter new email"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter new phone number"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-4 mt-8">
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all">
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