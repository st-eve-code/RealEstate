import React, { useState } from 'react';
import { ArrowBigDown, ChevronDown, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
function Store({sidebar}) {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const Data = [
    {
      id:1, name:'Chariot Hotel',category:'Hotel',price:500000,date:'20/08/2025',location:'Malingo',status:'viewed'
    },
    {
      id:2, name:'Italio Hostel',category:'Hostel',price:450000,date:'20/08/2025',location:'South',status:'viewed'
    },
    {
      id:3, name:'Evan Studio',category:'Studio',price:800000,date:'22/08/2025',location:'Checkpoint',status:'viewed'
    },
    {
      id:4, name:'Akansas',category:'Hostel',price:320000,date:'22/08/2025',location:'South',status:'viewed'
    },
  ];

  const handlePropertyClick = (id) => {
    navigate(`/dashboard/property/details/${id}`);
  };

  const filteredData = selectedCategory === 'All Categories' 
    ? Data 
    : Data.filter(item => item.category === selectedCategory);

  return (
    <section className={`md:px-4 max-w-full lg:max-w-full px-4 py-2 min-h-screen ${sidebar ? 'md:max-w-[33rem]':'md:max-w-[33rem]' }`}>
      <div>
        <h1 className='font-bold text-xl text-gray-700'>My Store</h1>
        <p className="text-gray-500 text-sm mt-1">View and manage all properties you've explored. Keep track of your favorites in one place.</p>
      </div>
      
      {/* filters */}
      <div className='mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4'>
        <button 
          onClick={() => setSelectedCategory('All Categories')}
          className='flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg font-medium text-sm py-2.5 px-6 transition-colors'>
          Show All
        </button>
        
        <div className='relative flex-1 sm:flex-none'>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className='w-full flex items-center justify-between gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 shadow-sm rounded-lg font-medium text-sm transition-colors'>
            {selectedCategory}
            <ChevronDown size={18} className={`transition-transform ${isOpen ? '' : '-rotate-90'}`} />
          </button>
          
          {isOpen && (
            <div className='absolute w-full bg-white shadow-lg rounded-md mt-1 z-10 overflow-hidden'>
              <button 
                onClick={() => {
                  setSelectedCategory('Apartment');
                  setIsOpen(false);
                }} 
                className='w-full text-left hover:bg-gray-100 font-medium text-sm text-gray-600 py-2 px-4'>
                Apartments
              </button>
              <button 
                onClick={() => {
                  setSelectedCategory('Hostel');
                  setIsOpen(false);
                }} 
                className='w-full text-left hover:bg-gray-100 font-medium text-sm text-gray-600 py-2 px-4 border-t'>
                Hostels
              </button>
              <button 
                onClick={() => {
                  setSelectedCategory('Studio');
                  setIsOpen(false);
                }} 
                className='w-full text-left hover:bg-gray-100 font-medium text-sm text-gray-600 py-2 px-4 border-t'>
                Studios
              </button>
            </div>
          )}
        </div>

        {/* filter by date */}
        <button className='flex-1 sm:flex-none flex items-center justify-between gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg font-medium text-sm py-2.5 px-6 transition-colors'>
          Date
          <ArrowBigDown size={18}/>
        </button>
      </div>

      {/* Data Display - Table */}
      <div className='mt-6 overflow-x-auto'>
        {filteredData.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16'>
            <div className='w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
              <Eye size={64} className='text-gray-300' />
            </div>
            <h3 className='text-lg font-Custom font-semibold text-gray-700 mb-2'>No Properties Viewed</h3>
            <p className='text-sm font-Custom text-gray-500'>You haven't viewed any properties yet</p>
          </div>
        ) : (
          <table className='w-full border-collapse'>
            <thead>
              <tr className='border-b-2 border-gray-200 *:font-Custom'>
                <th className='text-left py-3 px-4 font-semibold text-sm text-gray-700'>S/S</th>
                <th className='text-left py-3 px-4 font-semibold text-sm text-gray-700'>Name</th>
                <th className='text-left py-3 px-4 font-semibold text-sm text-gray-700'>Category</th>
                <th className='text-left py-3 px-4 font-semibold text-sm text-gray-700'>Price</th>
                <th className='text-left py-3 px-4 font-semibold text-sm text-gray-700'>Date</th>
                <th className='text-left py-3 px-4 font-semibold text-sm text-gray-700'>Location</th>
                <th className='text-left py-3 px-4 font-semibold text-sm text-gray-700'>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id} className='border-b border-gray-200 hover:bg-gray-50 *:font-Custom'>
                  <td className='py-3 px-4 text-sm text-gray-600'>{index + 1}</td>
                  <td className='py-3 px-4 text-sm text-gray-800 font-medium'>
                    <button 
                      onClick={() => handlePropertyClick(item.id)}
                      className='hover:text-blue-600 hover:underline text-left'>
                      {item.name}
                    </button>
                  </td>
                  <td className='py-3 px-4 text-sm text-gray-600'>{item.category}</td>
                  <td className='py-3 px-4 text-sm text-gray-800 font-medium'>${item.price.toLocaleString()}</td>
                  <td className='py-3 px-4 text-sm text-gray-600'>{item.date}</td>
                  <td className='py-3 px-4 text-sm text-gray-600'>{item.location}</td>
                  <td className='py-3 px-4'>
                    <span className='text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full'>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default Store;