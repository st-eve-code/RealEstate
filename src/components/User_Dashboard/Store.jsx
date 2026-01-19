'use client'

import React, { useState } from 'react';
import { ArrowBigDown, ChevronDown, Eye, MapPin, Calendar, Tag } from 'lucide-react';

function Store({ sidebar = null }) {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isOpen, setIsOpen] = useState(false);
  
  const Data = [
    {
      id: 1,
      name: 'Chariot Hotel',
      category: 'Hotel',
      price: 500000,
      date: '20/08/2025',
      location: 'Malingo',
      status: 'viewed'
    },
    {
      id: 2,
      name: 'Italio Hostel',
      category: 'Hostel',
      price: 450000,
      date: '20/08/2025',
      location: 'South',
      status: 'viewed'
    },
    {
      id: 3,
      name: 'Evan Studio',
      category: 'Studio',
      price: 800000,
      date: '22/08/2025',
      location: 'Checkpoint',
      status: 'viewed'
    },
    {
      id: 4,
      name: 'Akansas',
      category: 'Hostel',
      price: 320000,
      date: '22/08/2025',
      location: 'South',
      status: 'viewed'
    },
  ];

  const handlePropertyClick = (id) => {
    console.log(`Navigating to property ${id}`);
    // router.push(`/dashboard/property/details/${id}`);
  };

  const filteredData = selectedCategory === 'All Categories' 
    ? Data 
    : Data.filter(item => item.category === selectedCategory);

  return (
    <section className={`w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 min-h-screen transition-all ${
      sidebar ? 'lg:max-w-5xl' : 'lg:max-w-7xl'
    } mx-auto`}>
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-bold text-xl sm:text-2xl text-gray-700">My Store</h1>
        <p className="text-gray-500 text-sm mt-1.5">
          View and manage all properties you've explored. Keep track of your favorites in one place.
        </p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <button 
          onClick={() => setSelectedCategory('All Categories')}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg font-medium text-sm py-2.5 px-6 transition-colors">
          Show All
        </button>
        
        <div className="relative w-full sm:w-48">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="w-full flex items-center justify-between gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 shadow-sm rounded-lg font-medium text-sm transition-colors">
            <span className="truncate">{selectedCategory}</span>
            <ChevronDown size={18} className={`transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isOpen && (
            <div className="absolute w-full bg-white shadow-lg rounded-md mt-1 z-10 overflow-hidden border border-gray-200">
              <button 
                onClick={() => {
                  setSelectedCategory('Hotel');
                  setIsOpen(false);
                }} 
                className="w-full text-left hover:bg-gray-100 font-medium text-sm text-gray-600 py-2.5 px-4 transition-colors">
                Hotels
              </button>
              <button 
                onClick={() => {
                  setSelectedCategory('Hostel');
                  setIsOpen(false);
                }} 
                className="w-full text-left hover:bg-gray-100 font-medium text-sm text-gray-600 py-2.5 px-4 border-t transition-colors">
                Hostels
              </button>
              <button 
                onClick={() => {
                  setSelectedCategory('Studio');
                  setIsOpen(false);
                }} 
                className="w-full text-left hover:bg-gray-100 font-medium text-sm text-gray-600 py-2.5 px-4 border-t transition-colors">
                Studios
              </button>
            </div>
          )}
        </div>

        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg font-medium text-sm py-2.5 px-6 transition-colors">
          Date
          <ArrowBigDown size={18} className="flex-shrink-0" />
        </button>
      </div>

      {/* Empty State */}
      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Eye size={48} className="sm:w-16 sm:h-16 text-gray-300" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Properties Found</h3>
          <p className="text-sm text-gray-500 text-center max-w-md">
            {selectedCategory === 'All Categories' 
              ? "You haven't viewed any properties yet" 
              : `No ${selectedCategory.toLowerCase()}s found in your store`}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gray-50">
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">S/N</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-600">{index + 1}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                      <button 
                        onClick={() => handlePropertyClick(item.id)}
                        className="hover:text-blue-600 hover:underline text-left transition-colors">
                        {item.name}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.category}</td>
                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                      {item.price.toLocaleString()} FCFA
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{item.location}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredData.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => handlePropertyClick(item.id)}
                      className="text-base font-semibold text-gray-800 hover:text-blue-600 transition-colors text-left block w-full">
                      {item.name}
                    </button>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">
                        {item.category}
                      </span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">#{index + 1}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="font-semibold text-gray-800">
                      {item.price.toLocaleString()} FCFA
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{item.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Results Summary */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Showing {filteredData.length} {filteredData.length === 1 ? 'property' : 'properties'}
          </div>
        </>
      )}
    </section>
  );
}

export default Store;