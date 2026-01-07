'use client'

import { Heart, MapPin, Bed, Bath, UtensilsCrossed, Star, ArrowUpRight, Search, DollarSign, Home, Filter, X, TrendingUp, Sparkles, ArrowLeft, Phone, Mail, Share2, Calendar, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

// Property data with dynamic badges
const properties = [
  {
    id: 1,
    name: "Sunny Villa Apartments",
    location: "Molyko",
    fullLocation: "Molyko, Buea, Cameroon",
    price: 150000,
    priceDisplay: "150,000 FCFA/month",
    type: "apartments",
    status: "available",
    popularity: "popular",
    badges: ["hot", "verified"],
    scrollSpeed: 3000,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    beds: 2,
    bathrooms: 1,
    kitchens: 1,
    likes: 100,
    rating: 5,
    description: "Beautiful sunny villa apartments with modern amenities and stunning views. Perfect for families and professionals.",
    shortDescription: "Experience luxury living in this beautifully designed apartment featuring spacious rooms, modern fixtures, and a serene environment. Ideal for families seeking comfort and convenience in the heart of Molyko.",
    amenities: ["WiFi", "Parking", "Security", "Water Supply", "24/7 Power"],
    owner: "John Doe",
    phone: "+237 6XX XXX XXX",
    email: "sunny.villa@example.com"
  },
  {
    id: 2,
    name: "Mountain View Residence",
    location: "Great Soppo",
    fullLocation: "Great Soppo, Buea, Cameroon",
    price: 200000,
    priceDisplay: "200,000 FCFA/month",
    type: "hostels",
    status: "available",
    popularity: "recent",
    badges: ["new"],
    scrollSpeed: 4000,
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    beds: 2,
    bathrooms: 1,
    kitchens: 1,
    likes: 85,
    rating: 4.8,
    description: "Comfortable hostel accommodation with breathtaking mountain views. Ideal for students and young professionals.",
    shortDescription: "A cozy hostel offering spectacular mountain views and a peaceful atmosphere. Perfect for students and young professionals looking for affordable yet comfortable accommodation near the university.",
    amenities: ["WiFi", "Shared Kitchen", "Study Room", "Laundry", "Security"],
    owner: "Mary Tansi",
    phone: "+237 6XX XXX XXX",
    email: "mountain.view@example.com"
  },
  {
    id: 3,
    name: "Green Park Estate",
    location: "Bokwango",
    fullLocation: "Bokwango, Buea, Cameroon",
    price: 180000,
    priceDisplay: "180,000 FCFA/month",
    type: "studio",
    status: "available",
    popularity: "popular",
    badges: ["hot"],
    scrollSpeed: 2500,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    beds: 2,
    bathrooms: 1,
    kitchens: 1,
    likes: 92,
    rating: 3.9,
    description: "Cozy studio apartment in a peaceful green environment. Perfect for singles and couples.",
    shortDescription: "Nestled in a tranquil green neighborhood, this studio offers the perfect blend of comfort and nature. With modern amenities and a peaceful setting, it's ideal for singles and couples seeking serenity.",
    amenities: ["WiFi", "Parking", "Garden", "Backup Generator"],
    owner: "Peter Njoh",
    phone: "+237 6XX XXX XXX",
    email: "green.park@example.com"
  },
  {
    id: 4,
    name: "Coastal Breeze Apartments",
    location: "Molyko",
    fullLocation: "Molyko, Buea, Cameroon",
    price: 350000,
    priceDisplay: "350,000 FCFA/month",
    type: "apartments",
    status: "available",
    popularity: "recent",
    badges: ["premium"],
    scrollSpeed: 3500,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    beds: 3,
    bathrooms: 2,
    kitchens: 1,
    likes: 120,
    rating: 4.7,
    description: "Premium apartments with coastal breeze and luxury finishes. Designed for executives and discerning tenants.",
    shortDescription: "Indulge in premium living with this exquisite apartment featuring luxury finishes, spacious layouts, and top-tier amenities. Designed for executives who demand excellence in every detail.",
    amenities: ["WiFi", "Parking", "Swimming Pool", "Gym", "24/7 Security", "Elevator"],
    owner: "Sarah Nkeng",
    phone: "+237 6XX XXX XXX",
    email: "coastal.breeze@example.com"
  },
  {
    id: 5,
    name: "Student Haven Hostel",
    location: "Great Soppo",
    fullLocation: "Great Soppo, Buea, Cameroon",
    price: 80000,
    priceDisplay: "80,000 FCFA/month",
    type: "hostels",
    status: "available",
    popularity: "popular",
    badges: ["budget"],
    scrollSpeed: 3200,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    beds: 1,
    bathrooms: 1,
    kitchens: 1,
    likes: 65,
    rating: 4.2,
    description: "Affordable student accommodation near the university. Budget-friendly with all essential amenities.",
    shortDescription: "Budget-friendly student accommodation strategically located near the university. Offering essential amenities and a conducive environment for studying and socializing with fellow students.",
    amenities: ["WiFi", "Shared Kitchen", "Study Area", "Security", "Water Supply"],
    owner: "David Forchu",
    phone: "+237 6XX XXX XXX",
    email: "student.haven@example.com"
  },
  {
    id: 6,
    name: "Modern Studio Loft",
    location: "Bokwango",
    fullLocation: "Bokwango, Buea, Cameroon",
    price: 600000,
    priceDisplay: "600,000 FCFA/month",
    type: "studio",
    status: "available",
    popularity: "recent",
    badges: ["premium", "new"],
    scrollSpeed: 2800,
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    beds: 1,
    bathrooms: 1,
    kitchens: 1,
    likes: 110,
    rating: 4.9,
    description: "Ultra-modern studio loft with contemporary design and smart home features. Premium living experience.",
    shortDescription: "Step into the future with this ultra-modern studio loft featuring cutting-edge smart home technology, contemporary design, and premium finishes. A sophisticated living space for those who appreciate innovation.",
    amenities: ["WiFi", "Smart Home", "Parking", "Gym", "24/7 Power", "Modern Kitchen"],
    owner: "Grace Ayuk",
    phone: "+237 6XX XXX XXX",
    email: "modern.loft@example.com"
  }
];

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

// Badge Component
function PropertyBadge({ type }) {
  const badgeConfig = {
    hot: { bg: 'bg-gradient-to-r from-red-500 to-orange-500', text: 'Hot', icon: TrendingUp },
    new: { bg: 'bg-gradient-to-r from-green-500 to-emerald-500', text: 'New', icon: Sparkles },
    premium: { bg: 'bg-gradient-to-r from-purple-500 to-indigo-500', text: 'Premium', icon: Star },
    verified: { bg: 'bg-gradient-to-r from-blue-500 to-cyan-500', text: 'Verified', icon: CheckCircle },
    budget: { bg: 'bg-gradient-to-r from-teal-500 to-green-500', text: 'Budget', icon: DollarSign }
  };

  const config = badgeConfig[type];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <span className={`${config.bg} text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {config.text}
    </span>
  );
}

// Individual property card component
function PropertyCard({ property, isFavorite, onToggleFavorite, onViewDetails }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }, property.scrollSpeed);
    
    return () => clearInterval(timer);
  }, [property.images.length, property.scrollSpeed]);

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDotClick(index);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img 
          src={property.images[currentImageIndex]} 
          alt={`${property.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 max-w-[70%]">
          {property.badges.map((badge) => (
            <PropertyBadge key={badge} type={badge} />
          ))}
        </div>
        
        <div className="absolute top-2 right-2 flex items-center gap-1 sm:gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg">
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-red-500 text-red-500" />
          <span className="text-gray-700 font-semibold text-xs">{property.likes}</span>
        </div>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
          {property.images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white ${
                index === currentImageIndex 
                  ? 'bg-white w-6 h-2' 
                  : 'bg-white/60 hover:bg-white/80 w-2 h-2'
              }`}
              aria-label={`View image ${index + 1} of ${property.images.length}`}
              aria-pressed={index === currentImageIndex}
            />
          ))}
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-2">
        
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm sm:text-base font-bold text-gray-800 leading-tight flex-1 min-w-0 line-clamp-1">
            {property.name}
          </h3>
          <button 
            onClick={() => onToggleFavorite(property.id)}
            className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-full transition"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                isFavorite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-400 hover:text-red-400'
              }`} 
            />
          </button>
        </div>

        <div className="flex items-start gap-1.5">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <span className="text-gray-600 text-xs sm:text-sm leading-snug line-clamp-1">{property.fullLocation}</span>
        </div>

        <div className="flex items-center gap-2">
          <StarRating rating={property.rating} />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
          <div className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
            <span className="text-gray-700 text-xs sm:text-sm">{property.beds} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
            <span className="text-gray-700 text-xs sm:text-sm">{property.bathrooms} bathrooms</span>
          </div>
          <div className="flex items-center gap-1">
            <UtensilsCrossed className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
            <span className="text-gray-700 text-xs sm:text-sm">{property.kitchens} kitchen</span>
          </div>
        </div>

        <div className="flex items-center justify-between lg:gap-3 pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Starting from</p>
            <span className="text-base sm:text-base font-bold text-gray-800">
              {property.priceDisplay}
            </span>
          </div>
          <button 
            onClick={() => onViewDetails(property.id)}
            className="flex-shrink-0 p-2 sm:p-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg transition shadow-md hover:shadow-lg group"
            aria-label={`View details for ${property.name}`}
          >
            <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Property Details Page Component
function PropertyDetails({ property, onBack, isFavorite, onToggleFavorite }) {
  const [selectedSection, setSelectedSection] = useState(0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Properties
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
        
        {/* SECTION 1: Property Name, Location, Hearts, and Rating */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          {/* Left: Name and Location */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {property.name}
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5 text-red-500" />
              <span className="text-base sm:text-lg">{property.fullLocation}</span>
            </div>
          </div>

          {/* Right: Hearts and Rating */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Hearts/Likes */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
              <span className="text-gray-700 font-semibold text-lg">{property.likes}</span>
            </div>

            {/* Rating */}
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <StarRating rating={property.rating} />
            </div>
          </div>
        </div>

        {/* SECTION 2: Large Display Section + 4 Small Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          
          {/* Large/Medium Section - Shows selected content from small sections */}
          <div className="lg:col-span-3 order-1 lg:order-1">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl overflow-hidden w-full h-full min-h-[350px] sm:min-h-[400px] lg:min-h-0 flex items-center justify-center" style={{aspectRatio: '16/9'}}>
              {selectedSection === 0 && (
                <img 
                  src={property.images[0]} 
                  alt={`${property.name} - Image 1`}
                  className="w-full h-full object-cover"
                />
              )}
              {selectedSection === 1 && (
                <img 
                  src={property.images[1]} 
                  alt={`${property.name} - Image 2`}
                  className="w-full h-full object-cover"
                />
              )}
              {selectedSection === 2 && (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <video 
                    controls 
                    autoPlay 
                    muted
                    loop
                    className="w-full h-full object-cover"
                  >
                    <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {selectedSection === 3 && (
                <img 
                  src={property.images[2]} 
                  alt={`${property.name} - Image 3`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* 4 Small Sections - 2x2 Grid matching large section size */}
          <div className="lg:col-span-2 order-2 lg:order-2">
            <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4 w-full h-full">
              
              {/* Small Section 1 */}
              <button
                onClick={() => setSelectedSection(0)}
                className={`rounded-xl overflow-hidden transition-all duration-300 ${
                  selectedSection === 0 
                    ? 'ring-4 ring-blue-500 shadow-lg' 
                    : 'hover:ring-2 hover:ring-blue-300 shadow-md hover:shadow-lg'
                }`}
              >
                <img 
                  src={property.images[0]} 
                  alt="Preview 1"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Small Section 2 */}
              <button
                onClick={() => setSelectedSection(1)}
                className={`rounded-xl overflow-hidden transition-all duration-300 ${
                  selectedSection === 1 
                    ? 'ring-4 ring-blue-500 shadow-lg' 
                    : 'hover:ring-2 hover:ring-blue-300 shadow-md hover:shadow-lg'
                }`}
              >
                <img 
                  src={property.images[1]} 
                  alt="Preview 2"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Small Section 3 - Video */}
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
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </button>

              {/* Small Section 4 */}
              <button
                onClick={() => setSelectedSection(3)}
                className={`rounded-xl overflow-hidden transition-all duration-300 ${
                  selectedSection === 3 
                    ? 'ring-4 ring-blue-500 shadow-lg' 
                    : 'hover:ring-2 hover:ring-blue-300 shadow-md hover:shadow-lg'
                }`}
              >
                <img 
                  src={property.images[2]} 
                  alt="Preview 3"
                  className="w-full h-full object-cover"
                />
              </button>

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
                {property.shortDescription}
              </p>
              
              {/* Features */}
              <h3 className="text-lg font-bold text-gray-900 mb-4">Features</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Some of the key features of this property include spacious bedrooms, modern bathrooms, and
                a fully equipped kitchen designed for convenience and comfort.
              </p>
              <div className="flex flex-wrap gap-8 mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Bed className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-bold text-gray-800">{property.beds}</p>
                    <p className="text-sm text-gray-800">Bedrooms</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 rounded-full p-3">
                    <Bath className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-bold text-gray-800">{property.bathrooms}</p>
                    <p className="text-sm text-gray-800">Bathrooms</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-3">
                    <UtensilsCrossed className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-xl font-bold text-gray-800">{property.kitchens}</p>
                    <p className="text-sm text-gray-800">Kitchen{property.kitchens > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
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
              {/* Caretaker Contact Details */}
              <div className="bg-white rounded-xl mt-10 p-2 md:p-4 shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Caretaker Contact</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-3">{property.owner}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 rounded-full p-2">
                          <Phone className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <p className="text-sm font-medium text-gray-900">{property.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 rounded-full p-2">
                          <Mail className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm font-medium text-gray-900 break-all">{property.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                    <p className="text-3xl font-bold text-gray-900">{property.priceDisplay}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-green-50 rounded-lg px-4 py-3 border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-semibold">Available Now</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">{property.fullLocation}</p>
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
            </div>
          </div>

        </div>

        {/* You can continue adding more sections below */}
        
      </div>
    </div>
  );
}

// Main component with filters
function Property() {
  const [filters, setFilters] = useState({
    location: '',
    price: '',
    propertyType: '',
    sortBy: ''
  });

  const [favorites, setFavorites] = useState({});
  const [currentPage, setCurrentPage] = useState('product');
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  const locations = ['Molyko', 'Great Soppo', 'Bokwango'];
  const priceRanges = [
    { value: '0-100000', label: 'Under 100K' },
    { value: '100000-300000', label: '100K - 300K' },
    { value: '300000-500000', label: '300K - 500K' },
    { value: '500000-1000000', label: '500K - 1M' }
  ];
  const propertyTypes = [
    { value: 'apartments', label: 'Apartments' },
    { value: 'hostels', label: 'Hostels' },
    { value: 'studio', label: 'Studio' }
  ];
  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      location: '',
      price: '',
      propertyType: '',
      sortBy: ''
    });
  };

  const toggleFavorite = (propertyId) => {
    setFavorites(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }));
  };

  const handleViewDetails = (propertyId) => {
    setSelectedPropertyId(propertyId);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setCurrentPage('product');
    setSelectedPropertyId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const filterAndSortProperties = () => {
    let filtered = properties.filter(property => {
      if (filters.location && property.location !== filters.location) return false;

      if (filters.price) {
        const [min, max] = filters.price.split('-').map(Number);
        if (property.price < min || property.price > max) return false;
      }

      if (filters.propertyType && property.type !== filters.propertyType) return false;

      return true;
    });

    // Apply sorting
    if (filters.sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'popular':
            return a.popularity === 'popular' ? -1 : 1;
          case 'recent':
            return a.popularity === 'recent' ? -1 : 1;
          default:
            return 0;
        }
      });
    }

    return filtered;
  };

  const filteredProperties = filterAndSortProperties();
  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-3 sm:p-6 lg:p-8">
      {currentPage === 'product' && (
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-2">
              Featured Properties
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Discover your perfect home in Buea</p>
          </div>
          
          {/* Enhanced Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Filter className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Search Filters</h2>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              
              <div className="w-full group">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none appearance-none bg-white cursor-pointer text-sm sm:text-base hover:border-blue-300 transition-all"
                  >
                    <option value="">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-full group">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Price Range</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none group-focus-within:text-green-600 transition-colors" />
                  <select
                    value={filters.price}
                    onChange={(e) => handleFilterChange('price', e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none appearance-none bg-white cursor-pointer text-sm sm:text-base hover:border-blue-300 transition-all"
                  >
                    <option value="">Any Price</option>
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-full group">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Property Type</label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none group-focus-within:text-purple-600 transition-colors" />
                  <select
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none appearance-none bg-white cursor-pointer text-sm sm:text-base hover:border-blue-300 transition-all"
                  >
                    <option value="">All Types</option>
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="w-full group">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sort By</label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none group-focus-within:text-orange-600 transition-colors" />
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none appearance-none bg-white cursor-pointer text-sm sm:text-base hover:border-blue-300 transition-all"
                  >
                    <option value="">Default</option>
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2">
                {filters.location && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    {filters.location}
                    <button onClick={() => handleFilterChange('location', '')} className="hover:text-blue-900">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {filters.price && (
                  <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    <DollarSign className="w-3.5 h-3.5" />
                    {priceRanges.find(r => r.value === filters.price)?.label}
                    <button onClick={() => handleFilterChange('price', '')} className="hover:text-green-900">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {filters.propertyType && (
                  <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    <Home className="w-3.5 h-3.5" />
                    {propertyTypes.find(t => t.value === filters.propertyType)?.label}
                    <button onClick={() => handleFilterChange('propertyType', '')} className="hover:text-purple-900">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {filters.sortBy && (
                  <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {sortOptions.find(s => s.value === filters.sortBy)?.label}
                    <button onClick={() => handleFilterChange('sortBy', '')} className="hover:text-orange-900">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredProperties.length}</span> of <span className="font-semibold">{properties.length}</span> properties
            </p>
            {Object.values(favorites).filter(Boolean).length > 0 && (
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <Heart className="w-4 h-4 inline fill-red-500 text-red-500" /> <span className="font-semibold text-gray-900">{Object.values(favorites).filter(Boolean).length}</span> favorites
              </p>
            )}
          </div>

          {/* Property Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5">
            {filteredProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property}
                isFavorite={favorites[property.id] || false}
                onToggleFavorite={toggleFavorite}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Clear All Filters
              </button>
            </div>
          )}
          
        </div>
      )}
      
      {currentPage === 'details' && selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          onBack={handleBackToList}
          isFavorite={favorites[selectedProperty.id] || false}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}

export default Property;