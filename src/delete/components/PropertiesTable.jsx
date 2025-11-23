import React, { useState, useEffect } from 'react';
import { Account } from '../Lib/supabaseClient';
import { 
  Search, 
  Filter, 
  Phone, 
  Mail,
  Bed, 
  Bath, 
  Utensils, 
  MapPin,
  Home,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  User
} from 'lucide-react';

const PropertiesTable = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  // Real-time updates
  useEffect(() => {
    const subscription = Account
      .channel('properties-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties'
        },
        () => {
          fetchProperties();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await Account
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.property_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.property_type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'recent' ? true :
      filter === 'available' ? property.status === 'available' : true;

    return matchesSearch && matchesFilter;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const getStatusConfig = (status) => {
    const config = {
      available: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="w-3 h-3" />,
        text: 'Available'
      },
      occupied: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="w-3 h-3" />,
        text: 'Occupied'
      },
      upcoming: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Clock className="w-3 h-3" />,
        text: 'Coming Soon'
      }
    };
    return config[status] || config.available;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-sans">Loading properties...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center font-sans">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Properties</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProperties}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-sans font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans">Registered Properties</h1>
          <p className="text-gray-600 font-sans">View all properties in the system</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search properties by name, location, type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans appearance-none bg-white"
                >
                  <option value="all">All Properties</option>
                  <option value="recent">Recently Added</option>
                  <option value="available">Available Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600 font-sans">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
        </div>

        {/* Mobile View - Cards */}
        <div className="block md:hidden space-y-4">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-lg p-8">
                <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-sans">No properties found</h3>
                <p className="text-gray-600 font-sans">Try adjusting your search criteria</p>
              </div>
            </div>
          ) : (
            filteredProperties.map((property) => {
              const statusConfig = getStatusConfig(property.status);
              return (
                <div key={property.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 font-sans">{property.property_name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded capitalize font-sans">
                      {property.property_type}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600 mb-3 font-sans">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Bed className="w-4 h-4 mr-1" />
                      <span>{property.beds}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Bath className="w-4 h-4 mr-1" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Utensils className="w-4 h-4 mr-1" />
                      <span>{property.kitchens}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-gray-900 font-sans">
                      {formatPrice(property.price)}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                      {statusConfig.icon}
                      {statusConfig.text}
                    </span>
                  </div>

                  {/* Contact Info - Mobile */}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 font-sans">{property.caretaker_name}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 font-sans">{property.caretaker_phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 font-sans truncate">{property.caretaker_email}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-sans">
                    Property Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-sans">
                    Location & Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-sans">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-sans">
                    Rooms
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-sans">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider font-sans">
                    Contact Information
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-sans">
                      <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p>No properties found matching your criteria.</p>
                    </td>
                  </tr>
                ) : (
                  filteredProperties.map((property) => {
                    const statusConfig = getStatusConfig(property.status);
                    return (
                      <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900 font-sans">
                              {property.property_name}
                            </div>
                            <div className="text-sm text-gray-500 mt-1 line-clamp-2 font-sans">
                              {property.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-900 mb-1 font-sans">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            {property.location}
                          </div>
                          <div className="text-sm text-gray-500 capitalize font-sans">
                            {property.property_type}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900 font-sans">
                            {formatPrice(property.price)}
                          </div>
                          <div className="text-sm text-gray-500 font-sans">per month</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4 text-sm text-gray-600 font-sans">
                            <div className="flex items-center gap-1">
                              <Bed className="w-4 h-4" />
                              <span>{property.beds}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bath className="w-4 h-4" />
                              <span>{property.bathrooms}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Utensils className="w-4 h-4" />
                              <span>{property.kitchens}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                            {statusConfig.icon}
                            {statusConfig.text}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="font-medium text-gray-900 text-sm font-sans">{property.caretaker_name}</div>
                                <div className="text-xs text-gray-500 capitalize font-sans">{property.caretaker_role}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 font-sans">{property.caretaker_phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 font-sans truncate">{property.caretaker_email}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-500 text-center font-sans">
          Total registered properties: {properties.length}
        </div>
      </div>
    </div>
  );
};

// export default PropertiesTable;