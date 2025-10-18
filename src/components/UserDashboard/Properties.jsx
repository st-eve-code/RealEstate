import { Heart, MapPin, Bed, Bath, UtensilsCrossed, Star, ArrowUpRight, Search, DollarSign, Home, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

// Property data
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
    scrollSpeed: 3000,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    beds: 2,
    toilets: 1,
    kitchens: 1,
    likes: 100,
    rating: 5
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
    scrollSpeed: 4000,
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    beds: 2,
    toilets: 1,
    kitchens: 1,
    likes: 85,
    rating: 4.8
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
    scrollSpeed: 2500,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    beds: 2,
    toilets: 1,
    kitchens: 1,
    likes: 92,
    rating: 3.9
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
    scrollSpeed: 3500,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop"
    ],
    beds: 3,
    toilets: 2,
    kitchens: 1,
    likes: 120,
    rating: 4.7
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
    scrollSpeed: 3200,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    beds: 1,
    toilets: 1,
    kitchens: 1,
    likes: 65,
    rating: 4.2
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
    scrollSpeed: 2800,
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop"
    ],
    beds: 1,
    toilets: 1,
    kitchens: 1,
    likes: 110,
    rating: 4.9
  }
];

// Individual property card component
function PropertyCard({ property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }, property.scrollSpeed);
    
    return () => clearInterval(timer);
  }, [property.images.length, property.scrollSpeed]);

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
      
      <div className="relative w-full aspect-video overflow-hidden">
        <img 
          src={property.images[currentImageIndex]} 
          alt={property.name}
          className="w-full h-full object-cover transition-opacity duration-500"
        />

        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex gap-1.5 sm:gap-2">
          <span className="px-2 py-1 sm:px-4 sm:py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-bold shadow-md uppercase tracking-wide">
            Hot
          </span>
          <span className="px-2 py-1 sm:px-4 sm:py-1.5 bg-green-100 text-green-600 rounded-full text-xs font-bold shadow-md uppercase tracking-wide">
            Free
          </span>
        </div>
        
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1 sm:gap-2 bg-white rounded-full px-2 py-1 sm:px-3 sm:py-1.5 shadow-md">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-red-500 text-red-500" />
          <span className="text-gray-700 font-medium text-xs sm:text-sm">{property.likes}</span>
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-gray-700 font-medium text-xs sm:text-sm">{property.rating}</span>
        </div>

        <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {property.images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`rounded-full transition-all ${
                index === currentImageIndex 
                  ? 'bg-blue-500 w-6 h-2.5' 
                  : 'bg-blue-300 hover:bg-red-400 w-2.5 h-2.5'
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 leading-tight flex-1 min-w-0">
            {property.name}
          </h2>
          <button 
            onClick={toggleFavorite}
            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-full transition"
            aria-label="Add to favorites"
          >
            <Heart 
              className={`w-5 h-5 sm:w-6 sm:h-6 ${
                isFavorite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-400 hover:text-red-400'
              }`} 
            />
          </button>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">{property.fullLocation}</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Bed className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <span className="text-gray-700 font-medium text-xs sm:text-sm whitespace-nowrap">{property.beds} beds</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Bath className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <span className="text-gray-700 text-xs sm:text-sm font-medium whitespace-nowrap">{property.toilets} toilet</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            <span className="text-gray-700 text-xs sm:text-sm font-medium whitespace-nowrap">{property.kitchens} kitchen</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-lg sm:text-xl font-bold text-gray-800">
            {property.priceDisplay}
          </span>
          <button 
            className="flex-shrink-0 p-2.5 sm:p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition shadow-lg hover:shadow-xl"
            aria-label="View property details"
          >
            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
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
    filter: ''
  });

  const locations = ['Molyko', 'Great Soppo', 'Bokwango'];
  const priceRanges = [
    { value: '0-300000', label: '0 - 300K FCFA' },
    { value: '300000-500000', label: '300K - 500K FCFA' },
    { value: '500000-800000', label: '500K - 800K FCFA' },
    { value: '800000-above', label: '800K+ FCFA' }
  ];
  const propertyTypes = [
    { value: 'apartments', label: 'Apartments' },
    { value: 'hostels', label: 'Hostels' },
    { value: 'studio', label: 'Studio' }
  ];
  const filterOptions = [
    { value: 'recent', label: 'Recent' },
    { value: 'popular', label: 'Popular' },
    { value: 'apartments', label: 'Apartments' },
    { value: 'hostels', label: 'Hostels' },
    { value: 'studio', label: 'Studio' },
    { value: 'available', label: 'Available' }
  ];

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const [searchTriggered, setSearchTriggered] = useState(false);

  const handleSearch = () => {
    setSearchTriggered(true);
  };

  const filterProperties = () => {
    if (!searchTriggered) return properties;
    
    return properties.filter(property => {
      if (filters.location && property.location !== filters.location) return false;

      if (filters.price) {
        const [min, max] = filters.price.split('-');
        const minPrice = parseInt(min);
        const maxPrice = max === 'above' ? Infinity : parseInt(max);
        if (property.price < minPrice || property.price > maxPrice) return false;
      }

      if (filters.propertyType && property.type !== filters.propertyType) return false;

      if (filters.filter) {
        if (filters.filter === 'recent' && property.popularity !== 'recent') return false;
        if (filters.filter === 'popular' && property.popularity !== 'popular') return false;
        if (['apartments', 'hostels', 'studio'].includes(filters.filter) && property.type !== filters.filter) return false;
        if (filters.filter === 'available' && property.status !== 'available') return false;
      }

      return true;
    });
  };

  const filteredProperties = filterProperties();

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">
          Featured Properties
        </h1>
        
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-2 mb-6 sm:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            
            <div className="w-full">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-blue-600 appearance-none bg-white cursor-pointer text-sm sm:text-base hover:border-blue-300 transition-colors font-Poppins"
                >
                  <option value="">Location</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
                <select
                  value={filters.price}
                  onChange={(e) => handleFilterChange('price', e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-blue-600 appearance-none bg-white cursor-pointer text-sm sm:text-base hover:border-blue-300 transition-colors font-Custom"
                >
                  <option value="">Price Range</option>
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full">
              <div className="relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-blue-600 appearance-none bg-white cursor-pointer text-sm sm:text-base hover:border-blue-300 transition-colors font-Custom"
                >
                  <option value="">Type</option>
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
                <select
                  value={filters.filter}
                  onChange={(e) => handleFilterChange('filter', e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-blue-600 appearance-none bg-white cursor-pointer text-sm sm:text-base hover:border-blue-300 transition-colors font-Custom"
                >
                  <option value="">Sort By</option>
                  {filterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 font-semibold text-sm sm:text-base font-Custom"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Property Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTriggered(false);
                setFilters({ location: '', price: '', propertyType: '', filter: '' });
              }}
              className="mt-4 text-red-500 hover:text-red-600 font-semibold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Property;