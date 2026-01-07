'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, MapPin, Bed, Bath, UtensilsCrossed, Star, ArrowLeft, CheckCircle, Phone, Mail, Edit, Trash2, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { selectDocumentsByConstraint } from '@/lib/utils/firestoreDocumentOperation';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Star Rating Component
function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400 fill-yellow-400" />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300" />
      ))}
      <span className="text-gray-700 font-medium text-xs ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function PropertyDetails() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSection, setSelectedSection] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch the specific property
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
            setProperty(foundProperty);
          }
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, user]);

  const toggleFavorite = () => {
    setIsFavorite(prev => !prev);
  };

  const handleEdit = () => {
    router.push(`/dashboard/edit-property/${id}`);
  };

  const handleDelete = async () => {
    if (!property) return;
    
    setIsDeleting(true);
    try {
      const docRef = doc(db, 'units', property.id);
      await deleteDoc(docRef);
      
      alert('Property deleted successfully');
      router.push('/dashboard/properties');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('An error occurred while deleting the property. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">
            The property you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link
            to="/dashboard/properties"
            className="inline-flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  // Extract all images from property.images array
  const getAllImages = () => {
    const images = [];
    if (property.images && Array.isArray(property.images)) {
      property.images.forEach(category => {
        if (category.urls && Array.isArray(category.urls)) {
          images.push(...category.urls);
        }
      });
    }
    return images.length > 0 ? images : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'];
  };

  const propertyImages = getAllImages();
  const videoUrl = property.videoUrl;

  // Get location string
  const fullLocation = property.location
    ? `${property.location.address || ''}, ${property.location.city || ''}, ${property.location.country || ''}`.replace(/^,\s*|,\s*$/g, '')
    : 'Location not set';

  // Format price
  const priceDisplay = property.payment
    ? `${parseFloat(property.payment.price || 0).toLocaleString()} ${property.payment.currency || 'XAF'}/${property.payment.period || 'monthly'}`
    : 'Price not set';

  // Calculate rating
  const rating = property.rating && property.rating.total > 0
    ? property.rating.value / property.rating.total
    : 0;

  // Get likes count (placeholder - you might want to fetch this from a subcollection)
  const likes = 0; // This would come from a likes subcollection

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-3 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/dashboard/properties"
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Properties
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
          
          {/* SECTION 1: Property Name, Location, Hearts, and Rating */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
            {/* Left: Name and Location */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  {property.name || 'Untitled Property'}
                </h1>
                <button
                  onClick={handleEdit}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Property"
                  aria-label="Edit Property"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-red-500" />
                <span className="text-base sm:text-lg">{fullLocation}</span>
              </div>
            </div>

            {/* Right: Hearts, Rating, and Actions */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Hearts/Likes */}
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                <span className="text-gray-700 font-semibold text-lg">{likes}</span>
              </div>

              {/* Rating */}
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                <StarRating rating={rating} />
              </div>

              {/* Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Property"
                  aria-label="Delete Property"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 2: Large Display Section + 4 Small Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
            
            {/* Large/Medium Section - Shows selected content from small sections */}
            <div className="lg:col-span-3 order-1 lg:order-1">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl overflow-hidden w-full h-full min-h-[350px] sm:min-h-[400px] lg:min-h-0 flex items-center justify-center" style={{aspectRatio: '16/9'}}>
                {selectedSection === 0 && propertyImages[0] && (
                  <img 
                    src={propertyImages[0]} 
                    alt={`${property.name} - Image 1`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop';
                    }}
                  />
                )}
                {selectedSection === 1 && propertyImages[1] && (
                  <img 
                    src={propertyImages[1]} 
                    alt={`${property.name} - Image 2`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop';
                    }}
                  />
                )}
                {selectedSection === 2 && videoUrl && (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <video 
                      controls 
                      autoPlay 
                      muted
                      loop
                      className="w-full h-full object-cover"
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                {selectedSection === 3 && propertyImages[2] && (
                  <img 
                    src={propertyImages[2]} 
                    alt={`${property.name} - Image 3`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop';
                    }}
                  />
                )}
                {!propertyImages[selectedSection] && !videoUrl && selectedSection === 2 && (
                  <div className="text-gray-400">No media available</div>
                )}
              </div>
            </div>

            {/* 4 Small Sections - 2x2 Grid matching large section size */}
            <div className="lg:col-span-2 order-2 lg:order-2">
              <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 w-full h-full">
                
                {/* Small Section 1 */}
                {propertyImages[0] && (
                  <button
                    onClick={() => setSelectedSection(0)}
                    className={`rounded-xl overflow-hidden transition-all duration-300 ${
                      selectedSection === 0 
                        ? 'ring-4 ring-blue-500 shadow-lg' 
                        : 'hover:ring-2 hover:ring-blue-300 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <img 
                      src={propertyImages[0]} 
                      alt="Preview 1"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop';
                      }}
                    />
                  </button>
                )}

                {/* Small Section 2 */}
                {propertyImages[1] && (
                  <button
                    onClick={() => setSelectedSection(1)}
                    className={`rounded-xl overflow-hidden transition-all duration-300 ${
                      selectedSection === 1 
                        ? 'ring-4 ring-blue-500 shadow-lg' 
                        : 'hover:ring-2 hover:ring-blue-300 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <img 
                      src={propertyImages[1]} 
                      alt="Preview 2"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop';
                      }}
                    />
                  </button>
                )}

                {/* Small Section 3 - Video */}
                {videoUrl && (
                  <button
                    onClick={() => setSelectedSection(2)}
                    className={`rounded-xl overflow-hidden bg-black transition-all duration-300 relative ${
                      selectedSection === 2 
                        ? 'ring-4 ring-blue-500 shadow-lg' 
                        : 'hover:ring-2 hover:ring-blue-300 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <video 
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                      onMouseEnter={(e) => e.target.play()}
                      onMouseLeave={(e) => e.target.pause()}
                    >
                      <source src={videoUrl} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center pointer-events-none">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </button>
                )}

                {/* Small Section 4 */}
                {propertyImages[2] && (
                  <button
                    onClick={() => setSelectedSection(3)}
                    className={`rounded-xl overflow-hidden transition-all duration-300 ${
                      selectedSection === 3 
                        ? 'ring-4 ring-blue-500 shadow-lg' 
                        : 'hover:ring-2 hover:ring-blue-300 shadow-md hover:shadow-lg'
                    }`}
                  >
                    <img 
                      src={propertyImages[2]} 
                      alt="Preview 3"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop';
                      }}
                    />
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* SECTION 3 & 4: Two sections with 8:4 ratio */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mt-6">
            
            {/* Section 1 - Larger section (8 columns) */}
            <div className="lg:col-span-8">
              <div className="bg-gray-100/30 rounded-xl p-2 sm:p-6 min-h-[300px]">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About this property</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {property.description || 'No description available.'}
                </p>
                
                {/* Features */}
                <h3 className="text-lg font-bold text-gray-900 mb-4">Features</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  This property features spacious bedrooms, modern bathrooms, and a fully equipped kitchen designed for convenience and comfort.
                </p>
                <div className="flex flex-wrap gap-8 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 rounded-full p-3">
                      <Bed className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-xl font-bold text-gray-800">{property.rooms?.bedrooms || 0}</p>
                      <p className="text-sm text-gray-800">Bedrooms</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 rounded-full p-3">
                      <Bath className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-xl font-bold text-gray-800">{property.rooms?.bathrooms || 0}</p>
                      <p className="text-sm text-gray-800">Bathrooms</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 rounded-full p-3">
                      <UtensilsCrossed className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className="text-xl font-bold text-gray-800">{property.rooms?.kitchens || 0}</p>
                      <p className="text-sm text-gray-800">Kitchen{(property.rooms?.kitchens || 0) > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {property.amenities && property.amenities.length > 0 && (
                  <>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Amenities</h3>
                    <div className="flex flex-wrap gap-3">
                      {property.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {/* Property Items (Props) */}
                {property.props && Object.keys(property.props).length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Property Items</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {Object.entries(property.props).map(([itemName, count]) => (
                        <div key={itemName} className="p-3 bg-white rounded-lg border border-gray-200">
                          <div className="text-sm font-medium text-gray-900">{itemName}</div>
                          <div className="text-xs text-gray-600 mt-1">Quantity: {count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Caretaker Contact Details */}
                {property.caretaker && (
                  <div className="bg-white rounded-xl mt-10 p-2 md:p-4 shadow-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Caretaker Contact</h3>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-3">{property.caretaker.name || 'Caretaker'}</p>
                        
                        <div className="space-y-2">
                          {user?.phoneNumber && (
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 rounded-full p-2">
                                <Phone className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="text-sm font-medium text-gray-900">{user.phoneNumber}</p>
                              </div>
                            </div>
                          )}
                          
                          {user?.email && (
                            <div className="flex items-center gap-3">
                              <div className="bg-green-100 rounded-full p-2">
                                <Mail className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="text-sm font-medium text-gray-900 break-all">{user.email}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2 - Property Information Sidebar */}
            <div className="lg:col-span-4">
              <div className="space-y-4 sticky top-6">
                
                {/* Price & Availability */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Price & Availability</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                      <p className="text-3xl font-bold text-gray-900">{priceDisplay}</p>
                    </div>
                    <div className={`flex items-center gap-2 rounded-lg px-4 py-3 border ${
                      property.available 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <CheckCircle className={`w-5 h-5 ${property.available ? 'text-green-600' : 'text-red-600'}`} />
                      <span className={`font-semibold ${property.available ? 'text-green-700' : 'text-red-700'}`}>
                        {property.available ? 'Available Now' : 'Not Available'}
                      </span>
                    </div>
                    {property.status && (
                      <div className="text-sm text-gray-600">
                        Status: <span className="capitalize font-medium">{property.status}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{fullLocation}</p>
                    </div>
                    {/* Map Placeholder */}
                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden relative">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127143.0!2d9.2348!3d4.1560!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1061339db09679ab%3A0x21f5f3b3f2f1e7e3!2sBuea%2C%20Cameroon!5e0!3m2!1sen!2s!4v1234567890"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Property Location Map"
                      ></iframe>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Support */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg border-2 border-green-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Need Help?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Join our WhatsApp group for instant support and property inquiries
                  </p>

                  <a href="https://wa.me/237123456789"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Join WhatsApp Group
                  </a>
                </div>

                {/* Edit All Button */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 shadow-lg border-2 border-purple-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Manage Property</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Edit all property details in one comprehensive form
                  </p>

                  <button
                    onClick={handleEdit}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <Settings className="w-5 h-5" />
                    Edit All Properties
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Delete Property</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <span className="font-semibold">"{property?.name}"</span>? 
              This will permanently remove the property and all its data.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyDetails;
