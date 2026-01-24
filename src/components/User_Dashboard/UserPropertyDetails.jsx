'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { 
  ChevronLeft, MapPin, Bed, Bath, Maximize, Heart, Share2, 
  DollarSign, Star, Eye, Phone, Mail, MessageCircle, Home,
  Sofa, UtensilsCrossed, ShieldCheck, AlertCircle, Images,
  Video, Tag, Calendar,
  X
} from 'lucide-react'
import Loader from '../ado/loader'

export default function UserPropertyDetails({ propertyId }) {
  const router = useRouter()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyDoc = await getDoc(doc(db, 'units', propertyId))
        if (propertyDoc.exists()) {
          const data = propertyDoc.data()
          // Transform the unit data to match the component's expected format
          const transformedProperty = {
            id: propertyDoc.id,
            title: data.name || 'Untitled Property',
            type: data.type || 'apartment',
            address: data.location?.address || '',
            city: data.location?.city || '',
            country: data.location?.country || '',
            location: `${data.location?.city || ''}, ${data.location?.country || ''}`,
            price: data.payment?.price || 0,
            currency: data.payment?.currency || 'FCFA',
            period: data.payment?.period || 'month',
            tax: data.payment?.tax || 0,
            bedrooms: data.rooms?.bedrooms || 0,
            bathrooms: data.rooms?.bathrooms || 0,
            parlors: data.rooms?.parlors || 0,
            kitchens: data.rooms?.kitchens || 0,
            size: data.size || 0,
            description: data.description || 'No description available.',
            images: data.images ? data.images.flatMap(img => img.urls || []) : [],
            videoUrls: data.images ? data.images.flatMap(img => img.videoUrls || []) : [],
            amenities: data.amenities || [],
            extraAmenities: data.extraAmenities || [],
            houseRules: data.houseRules || [],
            remarks: data.remarks || [],
            status: data.available ? 'available' : 'unavailable',
            rating: data.rating?.total > 0 ? (data.rating.value / data.rating.total) : 0,
            reviews: data.rating?.total || 0,
            views: data.views || 0,
            tags: data.tags || [],
            caretaker: {
              name: data.caretaker?.name || '',
              phone: data.caretaker?.phone || '',
              whatsapp: data.caretaker?.whatsapp || '',
              email: data.caretaker?.email || ''
            },
            ownerId: data.ownerId || '',
            createdAt: data.createdAt || null,
          }
          setProperty(transformedProperty)
        }
      } catch (error) {
        console.error('Error fetching property:', error)
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader style="dot-121" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Property not found</p>
      </div>
    )
  }

  const images = property.images || []
  const amenities = property.amenities || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10 animate-slideDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back to Properties</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8 animate-fadeIn">
          <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden shadow-xl group">
            <img
              src={images[selectedImage] || '/public/houses/1.jpg'}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110"
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </button>
              <button className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110">
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-2 gap-4">
            {images.slice(0, 4).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative h-44 lg:h-72 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  selectedImage === idx ? 'ring-4 ring-blue-500 scale-95' : 'hover:scale-105'
                }`}
              >
                <img
                  src={img}
                  alt={`View ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {idx === 3 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">+{images.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Price */}
            <div className="bg-white rounded-2xl p-6 shadow-lg animate-slideUp" style={{animationDelay: '0.1s'}}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize">
                      {property.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="w-5 h-5" />
                    <span>{property.address}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {property.city}, {property.country}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {property.price?.toLocaleString() || '0'} {property.currency || 'FCFA'}
                  </div>
                  <div className="text-sm text-gray-500">per {property.period || 'month'}</div>
                  {property.tax > 0 && (
                    <div className="text-xs text-gray-400 mt-1">+ {property.tax}% tax</div>
                  )}
                </div>
              </div>

              {/* Rating and Views */}
              <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(property.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {property.rating?.toFixed(1) || '0'} ({property.reviews || 0} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="w-5 h-5" />
                  <span>{property.views?.toLocaleString() || 0} views</span>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-white rounded-2xl p-6 shadow-lg animate-slideUp" style={{animationDelay: '0.2s'}}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Property Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <Bed className="w-8 h-8 text-blue-600 mb-2" />
                  <span className="text-2xl font-bold text-gray-900">{property.bedrooms || 0}</span>
                  <span className="text-sm text-gray-600">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                  <Bath className="w-8 h-8 text-purple-600 mb-2" />
                  <span className="text-2xl font-bold text-gray-900">{property.bathrooms || 0}</span>
                  <span className="text-sm text-gray-600">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                  <Sofa className="w-8 h-8 text-green-600 mb-2" />
                  <span className="text-2xl font-bold text-gray-900">{property.parlors || 0}</span>
                  <span className="text-sm text-gray-600">Parlors</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                  <UtensilsCrossed className="w-8 h-8 text-orange-600 mb-2" />
                  <span className="text-2xl font-bold text-gray-900">{property.kitchens || 0}</span>
                  <span className="text-sm text-gray-600">Kitchens</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                  <Maximize className="w-8 h-8 text-indigo-600 mb-2" />
                  <span className="text-2xl font-bold text-gray-900">{property.size || 0}</span>
                  <span className="text-sm text-gray-600">m²</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-lg animate-slideUp" style={{animationDelay: '0.3s'}}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{property.description || 'No description available.'}</p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg animate-slideUp" style={{animationDelay: '0.4s'}}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Amenities */}
            {property.extraAmenities?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg animate-slideUp" style={{animationDelay: '0.45s'}}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {property.extraAmenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* House Rules */}
            {property.houseRules?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg animate-slideUp" style={{animationDelay: '0.5s'}}>
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">House Rules</h2>
                </div>
                <div className="space-y-3">
                  {property.houseRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                      <span className="text-gray-700 flex-1">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Important Remarks */}
            {property.remarks?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg animate-slideUp border-l-4 border-yellow-500" style={{animationDelay: '0.55s'}}>
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                  <h2 className="text-xl font-bold text-gray-900">Important Information</h2>
                </div>
                <div className="space-y-3">
                  {property.remarks.map((remark, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 flex-1">{remark}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Media Gallery & Video */}
            {(property.images?.length > 4 || property.videoUrls?.length > 0) && (
              <div className="bg-white rounded-2xl p-6 shadow-lg animate-slideUp" style={{animationDelay: '0.6s'}}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Media & Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.images?.length > 4 && (
                    <button
                      onClick={() => router.push(`/dashboard/properties/${propertyId}/gallery`)}
                      className="flex items-center justify-center gap-3 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:shadow-lg group"
                    >
                      <Images className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">View Full Gallery</div>
                        <div className="text-sm text-gray-600">{property.images.length} photos</div>
                      </div>
                    </button>
                  )}
                  {property.videoUrls?.length > 0 && (
                    <button
                      onClick={() => {
                        const videoModal = document.getElementById('video-modal')
                        if (videoModal) {
                          videoModal.classList.remove('hidden')
                        }
                      }}
                      className="flex items-center justify-center gap-3 p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:shadow-lg group"
                    >
                      <Video className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
                      <div className="text-left">
                        <div className="font-semibold text-gray-900">Watch Video Tour</div>
                        <div className="text-sm text-gray-600">{property.videoUrls.length} videos</div>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {property.tags?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg animate-slideUp" style={{animationDelay: '0.65s'}}>
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-bold text-gray-900">Tags</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {property.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24 animate-slideUp space-y-6" style={{animationDelay: '0.2s'}}>
              {/* Contact Caretaker */}
              {property.caretaker?.name && (
                <div className="pb-6 border-b">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Property Manager</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Home className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-500">Manager</div>
                        <div className="font-medium text-gray-900">{property.caretaker.name}</div>
                      </div>
                    </div>
                    
                    {property.caretaker.phone && (
                      <a
                        href={`tel:${property.caretaker.phone}`}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                      >
                        <Phone className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-sm text-gray-500">Phone</div>
                          <div className="font-medium text-blue-600 group-hover:underline">{property.caretaker.phone}</div>
                        </div>
                      </a>
                    )}

                    {property.caretaker.email && (
                      <a
                        href={`mailto:${property.caretaker.email}`}
                        className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
                      >
                        <Mail className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="text-sm text-gray-500">Email</div>
                          <div className="font-medium text-purple-600 group-hover:underline text-sm">{property.caretaker.email}</div>
                        </div>
                      </a>
                    )}

                    <button
                      onClick={() => {
                        // Will be handled by Tawk.to widget
                        if (window.Tawk_API) {
                          window.Tawk_API.maximize();
                        }
                      }}
                      className="w-full flex items-center justify-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 hover:shadow-lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium">Chat with Manager</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Booking Section */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Book This Property</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-900">
                      <DollarSign className="w-5 h-5" />
                      <span className="font-semibold">Price per {property.period || 'month'}</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mt-1">
                      {property.price?.toLocaleString() || '0'} {property.currency || 'FCFA'}
                    </div>
                    {property.tax > 0 && (
                      <div className="text-xs text-gray-600 mt-1">+ {property.tax}% tax</div>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-600 mb-2">Status</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      property.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {property.status || 'Unknown'}
                    </div>
                  </div>
                </div>

                <button 
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                  disabled={property.status !== 'available'}
                >
                  {property.status === 'available' ? 'Request to Book' : 'Not Available'}
                </button>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Rent</span>
                    <span>{property.price?.toLocaleString() || '0'} {property.currency || 'FCFA'}</span>
                  </div>
                  {property.tax > 0 && (
                    <div className="flex justify-between">
                      <span>Tax ({property.tax}%)</span>
                      <span>{((property.price * property.tax) / 100).toLocaleString()} {property.currency || 'FCFA'}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>50 {property.currency || 'FCFA'}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span>{(property.price + (property.price * (property.tax || 0)) / 100 + 50).toLocaleString()} {property.currency || 'FCFA'}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> You won't be charged yet. Review your booking before confirming.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(property.rating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 font-medium">
                    {property.rating?.toFixed(1) || '0'} out of 5
                  </span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-600">{property.reviews || 0} reviews</span>
                </div>
              </div>
            </div>

            {/* Reviews List Placeholder */}
            {property.reviews > 0 ? (
              <div className="space-y-6">
                {/* Sample review structure - replace with actual reviews from Firestore */}
                <div className="border-t pt-6">
                  <div className="text-gray-600 text-center py-8">
                    <p className="text-lg">Reviews will be loaded from Firestore</p>
                    <p className="text-sm mt-2">You can implement this by querying the reviews collection</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border-t">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600">Be the first to review this property!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {property.videoUrls?.length > 0 && (
        <div
          id="video-modal"
          className="hidden fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target.id === 'video-modal') {
              const videoModal = document.getElementById('video-modal')
              const videoPlayer = document.getElementById('video-player') /* as HTMLVideoElement */
              if (videoModal) {
                videoModal.classList.add('hidden')
              }
              if (videoPlayer) {
                videoPlayer.pause()
              }
            }
          }}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => {
                const videoModal = document.getElementById('video-modal')
                const videoPlayer = document.getElementById('video-player') /* as HTMLVideoElement */
                if (videoModal) {
                  videoModal.classList.add('hidden')
                }
                if (videoPlayer) {
                  videoPlayer.pause()
                }
              }}
              className="absolute -top-12 right-0 p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all duration-300 z-10"
            >
              <X className="w-8 h-8 text-white" />
            </button>
            
            <video
              id="video-player"
              controls
              className="w-full rounded-lg shadow-2xl"
              src={property.videoUrls[0]}
            >
              Your browser does not support the video tag.
            </video>
            
            {property.videoUrls.length > 1 && (
              <div className="mt-4 text-center text-white text-sm">
                <p>{property.videoUrls.length} videos available</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
        }

        /* Smooth transitions */
        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Image hover effects */
        img {
          transition: transform 0.7s ease;
        }

        /* Button effects */
        button {
          transition: all 0.3s ease;
        }

        /* Card hover effects */
        .bg-white {
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }

        .bg-white:hover {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </div>
  )
}
