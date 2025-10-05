import React, { useEffect, useState, useMemo } from 'react';
import image from '../assets/images/11.jpg';
import { 
  DoorOpenIcon, 
  EggFried, 
  ToiletIcon, 
  StarIcon, 
  Heart, 
  Building, 
  MapPin,
  AlertCircle 
} from 'lucide-react';
import '../App.css';

function List_products({number}) {
  // State management
  const [likedProperties, setLikedProperties] = useState({});
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch houses data
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        setHouses(data);
      } catch (error) {
        console.error('Error fetching houses:', error);
        setError(error.message);
        // Fallback to hardcoded data if fetch fails
        setHouses(fallbackProperties);
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, []);

  // Fallback properties
  const fallbackProperties = [
    {
      id: 1,
      image: image,
      name: 'Akansas Cite',
      location: 'Dirty South',
      type: 'Hostel',
      rooms: 2,
      kitchen: 1,
      toilet: 1,
      price: '500,000',
      rating: 5.0
    },
    {
      id: 2,
      image: image,
      name: 'Big Brother Studio',
      location: 'Dirty South',
      type: 'Studio',
      rooms: 2,
      kitchen: 1,
      toilet: 2,
      price: '800,000',
      rating: 4.5
    },
    {
      id: 3,
      image: image,
      name: 'Camtel Apartmentt',
      location: 'Biaka streets',
      type: 'Flat',
      rooms: 2,
      kitchen: 1,
      toilet: 2,
      price: '350,000',
      rating: 4.5
    },
    {
      id: 4,
      image: image,
      name: 'Covenant Cite',
      location: 'Mayor street',
      type: 'Hostel',
      rooms: 2,
      kitchen: 1,
      toilet: 1,
      price: '650,000',
      rating: 4.5
    },
    {
      id: 5,
      image: image,
      name: 'Sinners Studio',
      location: 'Malingo junction',
      type: 'Studio',
      rooms: 2,
      kitchen: 1,
      toilet: 1,
      price: '500,000',
      rating: 5.0
    },
    {
      id: 6,
      image: image,
      name: 'Italio Apartment',
      location: 'Dirty South',
      type: 'Flat',
      rooms: 2,
      kitchen: 1,
      toilet: 1,
      price: '400,000',
      rating: 4.5
    },
    {
      id: 7,
      image: image,
      name: 'Premier Cite',
      location: 'Dirty South',
      type: 'Hostel',
      rooms: 2,
      kitchen: 1,
      toilet: 1,
      price: '450,000',
      rating: 5.0
    },
    {
      id: 8,
      image: image,
      name: 'Kameni Studio',
      location: 'Dirty South',
      type: 'Studio',
      rooms: 2,
      kitchen: 1,
      toilet: 2,
      price: '500,000',
      rating: 4.5
    },
    {
      id: 9,
      image: image,
      name: 'Vegas Apartment',
      location: 'Biaka streets',
      type: 'Flat',
      rooms: 2,
      kitchen: 1,
      toilet: 2,
      price: '450,000',
      rating: 5.0
    },
    {
      id: 10,
      image: image,
      name: 'Basil Cite',
      location: 'Mayor street',
      type: 'Hostel',
      rooms: 2,
      kitchen: 1,
      toilet: 1,
      price: '450,000',
      rating: 4.5
    },
    {
      id: 11,
      image: image,
      name: 'Cartier Studio',
      location: 'Malingo junction',
      type: 'Studio',
      rooms: 2,
      kitchen: 1,
      toilet: 1,
      price: '600,000',
      rating: 4.5
    },
    {
      id: 12,
      image: image,
      name: 'Dangote Apartment',
      location: 'Dirty South',
      type: 'Flat',
      rooms: 2,
      kitchen: 1,
      toilet: 1,
      price: '800,000',
      rating: 5
    },
    
  ];

  // Filter houses based on selected type - FIXED FILTERING LOGIC
  const filteredHouses = useMemo(() => {
    if (selectedFilter === 'all') {
      return houses;
    }
    return houses.filter(house => house.type === selectedFilter);
  }, [houses, selectedFilter]);

  // Handle filter button clicks
  const handleFilter = (filterType) => {
    setSelectedFilter(filterType);
  };

  // Handle heart/like functionality
  const handleHeartClick = (propertyId) => {
    setLikedProperties(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }));
  };

  // Filter button component for cleaner code
  const FilterButton = ({ type, label, isActive }) => (
    <button
      onClick={() => handleFilter(type)}
      className={`px-3 py-2 rounded-lg font-Custom font-medium text-sm transition-all duration-200 transform hover:scale-105 ${
        isActive 
          ? 'bg-blue-500 text-white shadow-md' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {label}
    </button>
  );

  // Loading state
  if (loading) {
    return (
      <section className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500 font-Custom">Loading properties...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error && houses.length === 0) {
    return (
      <section className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-500 font-Custom mb-2">Failed to load properties</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto  px-4 lg:px-16 py-4 ">
      {/* Filter Buttons - IMPROVED LAYOUT */}
      <div className="mb-8 flex flex-wrap gap-3 justify-center  md:justify-center">
        <FilterButton 
          type="all" 
          label="All Houses" 
          isActive={selectedFilter === 'all'} 
        />
        <FilterButton 
          type="Studio" 
          label="Studios" 
          isActive={selectedFilter === 'Studio'} 
        />
        <FilterButton 
          type="Flat" 
          label="Flats" 
          isActive={selectedFilter === 'Flat'} 
        />
        <FilterButton 
          type="Hostel" 
          label="Hostels" 
          isActive={selectedFilter === 'Hostel'} 
        />
      </div>

      {/* Results counter */}
      {/* <div className="mb-6">
        <p className="text-gray-600 font-Custom text-sm">
          Showing {filteredHouses.length} {filteredHouses.length === 1 ? 'property' : 'properties'}
          {selectedFilter !== 'all' && ` in ${selectedFilter}s`}
        </p>
      </div> */}

      {/* Properties Grid - IMPROVED RESPONSIVE LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 mx-auto justify-center lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredHouses.map((property) => {
          const isLiked = likedProperties[property.id] || false;
          
          return (
            <div 
              key={property.id} 
              className="rounded-2xl block-animate shadow-md shadow-gray-200 bg-white p-3 relative hover:shadow-lg transition-shadow duration-300"
            >
              {/* Heart/Like Button */}
              <button
                onClick={() => handleHeartClick(property.id)}
                className="size-9 rounded-full bg-white shadow-md shadow-gray-200 p-2 transition-all duration-200 absolute top-4 right-4 z-20 hover:scale-110"
                aria-label={isLiked ? 'Unlike property' : 'Like property'}
              >
                <Heart 
                  size={20} 
                  className={`transition-all duration-200 ${
                    isLiked 
                      ? 'text-red-600 fill-red-600' 
                      : 'text-gray-400 hover:text-red-600'
                  }`}
                />
              </button>

              {/* Property Image */}
              <img 
                src={property.image || image} 
                alt={property.name}
                className="w-full h-[11rem] rounded-xl object-cover"
              />

              {/* Property Details */}
              <div className="bg-gray-50 rounded-xl my-2 px-2 py-2">
                {/* Header with name and type */}
                <div className="flex items-center justify-between mb-2">
                  <h1 className="font-Custom font-bold text-gray-800 text-lg truncate">
                    {property.name}
                  </h1>
                  <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
                    <Building size={16} className="text-blue-500" />
                    <span className="font-Custom font-medium text-xs text-blue-600">
                      {property.type}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={16} className="text-gray-400" />
                  <p className="font-Custom font-medium text-gray-600 text-sm truncate">
                    {property.location}
                  </p>
                </div>

                {/* Features */}
                <div className="flex justify-between items-center mb-3 text-xs">
                  <div className="flex items-center gap-1">
                    <DoorOpenIcon size={12} className="text-gray-600" />
                    <span className="font-Custom text-gray-600">
                      {property.rooms} Room{property.rooms > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <EggFried size={12} className="text-gray-600" />
                    <span className="font-Custom text-gray-600">
                      {property.kitchen} Kitchen{property.kitchen > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ToiletIcon size={12} className="text-gray-600" />
                    <span className="font-Custom text-gray-600">
                      {property.toilet} Toilet{property.toilet > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Price and Rating */}
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-blue-600 font-Custom font-bold text-lg">
                      {property.price} <span className="text-sm">frs</span>
                    </h2>
                  </div>
                  <div className="flex items-center gap-1">
                    <StarIcon size={14} fill="orange" color="orange" />
                    <span className="text-sm font-Custom font-medium text-gray-600">
                      {property.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No results message */}
      {filteredHouses.length === 0 && (
        <div className="text-center py-12">
          <Building size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 font-Custom text-lg">
            No {selectedFilter !== 'all' ? selectedFilter.toLowerCase() + 's' : 'properties'} found
          </p>
          <button
            onClick={() => handleFilter('all')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg font-Custom text-sm hover:bg-blue-600 transition-colors"
          >
            Show All Properties
          </button>
        </div>
      )}
    </section>
  );
}

export default List_products;