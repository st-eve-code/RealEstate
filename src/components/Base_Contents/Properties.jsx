import { Heart, MapPin, Bed, Bath, UtensilsCrossed, Star, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import '../../App.css';
// Property data - Replace image URLs with your actual property images
const properties = [
  {
    id: 1,
    name: "Sunny Villa Apartments",
    location: "Molyko, Buea, Cameroon",
    price: "150,000 FCFA/month",
    scrollSpeed: 3000, // Change image every 3 seconds (3000 milliseconds)
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
    location: "Great Soppo, Buea, Cameroon",
    price: "200,000 FCFA/month",
    scrollSpeed: 4000, // Change image every 4 seconds (4000 milliseconds)
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
    location: "Bokwango, Buea, Cameroon",
    price: "180,000 FCFA/month",
    scrollSpeed: 2500, // Change image every 2.5 seconds (2500 milliseconds)
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
  }
];

// Individual property card component
function Properties({ property }) {
  // State to track which image is currently showing (0, 1, or 2)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // State to track if user has favorited this property
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Auto-scroll through images using custom speed for each property
  useEffect(() => {
    const timer = setInterval(() => {
      // Move to next image, or back to first if at the end
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }, property.scrollSpeed); // Use the scrollSpeed from the property
    
    // Cleanup: stop the timer when component unmounts
    return () => clearInterval(timer);
  }, [property.images.length, property.scrollSpeed]);

  // Function to handle dot clicks
  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  // Function to toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const rate = properties.map((e)=>e.rating);
  console.log(rate);

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6">
      
      {/* Image Section */}
      <div className="relative rounded-xl h-48 mb-6 overflow-hidden">
        {/* Display current image */}
        <img 
          src={property.images[currentImageIndex]} 
          alt={property.name}
          className="w-full h-full object-cover transition-opacity duration-500"
        />

        {/* Hot and Free badges */}
        <div className="absolute top-3 left-3 flex gap-2 *:font-Poppins *:font-medium *:text-xs">
            <span className="px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-bold shadow-md uppercase tracking-wide">
              Hot
            </span>
          <span className="px-4 py-1.5 bg-green-100 text-green-600 rounded-full text-xs font-bold shadow-md uppercase tracking-wide">
            Free
          </span>
        </div>
        
        {/* Likes and rating badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-md">
          <Heart className="w-5 h-5 fill-red-500 text-red-500" />
          <span className="text-gray-700 font-medium font-Poppins text-sm">{property.likes}</span>
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-gray-700 font-medium text-sm font-Poppins">{property.rating}</span>
        </div>

        {/* Navigation dots for images */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {property.images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`rounded-full transition-all ${
                index === currentImageIndex 
                  ? 'bg-blue-500 w-6 h-2.5' 
                  : 'bg-blue-300 hover:bg-red-400 w-2.5 h-2.5'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Property Details Section */}
      <div className="space-y-4">
        
        {/* Property name with favorite button */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-Custom font-bold text-gray-800">
            {property.name}
          </h2>
          <button 
            onClick={toggleFavorite}
            className="ml-4 p-2 hover:bg-gray-100 rounded-full transition"
          >
            <Heart 
              className={`w-6 h-6 ${
                isFavorite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-400 hover:text-red-400'
              }`} 
            />
          </button>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-400" />
          <span className="text-gray-700 text-sm font-Poppins">{property.location}</span>
        </div>

        {/* Amenities (beds, toilets, kitchen) */}
        <div className="flex items-center flex-shrink-0 gap-3 lg:gap-6 ">
          <div className="flex items-center gap-2">
            <Bed className="w-5 h-5 text-red-400" />
            <span className="text-gray-700 font-medium text-xs">{property.beds} beds</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="w-5 h-5 text-red-400" />
            <span className="text-gray-700 text-xs font-medium">{property.toilets} toilet</span>
          </div>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-red-400" />
            <span className="text-gray-700 text-xs font-medium">{property.kitchens} kitchen</span>
          </div>
        </div>

        {/* Price and action button */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-800">
            {property.price}
          </span>
          <button className="ml-4 p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition shadow-lg hover:shadow-xl">
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Main component that displays all property cards
function Property() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Map through all properties and create a card for each */}
        {properties.map((property) => (
          <Properties key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
export default Property;