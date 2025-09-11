import React, { useState } from 'react';
import { MapPinHouse, BookOpenCheckIcon, PackageOpenIcon } from 'lucide-react';
import Properties from '../components/Properties';
import image1 from '../assets/images/6.jpg';
import image2 from '../assets/images/7.jpg';
import image3 from '../assets/images/8.jpg';
import '../App.css';
function Home() {
  const [Selected, setSelected] = useState('');
  const handleClick= (value) => {
    setSelected(value)
    console.log(value)
  }
  const values= [
    {
      icon: MapPinHouse,
      title: 'Locate Properties',
      body: 'We curate a selection that suits various lifestyles. Our expert team ensures a smooth renting process.'
    },
    {
      icon: PackageOpenIcon,
      title: 'Rent Properties',
      body: 'Trust us to handle the intricacies of negotiations, renting processes and making successful deals.'
    },
    {
      icon: BookOpenCheckIcon,
      title: 'Advertise Properties',
      body: 'We connect tenants with landlords, streaming the rental process for a hassle-free experience .'
    }
  ]
  return (
    <section className='w-full mx-auto'>
        <div className='bg-white border px-1 py-1 my-4 border-gray-300  mx-auto w-[17.8rem] h-10 rounded-full flex items-center justify-between '>
          <button className='bg-blue-400 text-white font-Custom font-medium px-1 text-md w-20 flex items-center justify-center h-8 rounded-full'>New</button>
          <p className='h-9 font-Custom text-gray-400 font-normal text-sm  pt-2'>We've just released an update</p>
        </div>
        <h1 className='font-Custom font-bold text-gray-800 lg:text-6xl text-5xl lg:max-w-[46rem] max-w-[38rem] mx-auto text-center flex justify-center items-center '>
          Trusted Real Estate Property Just For You
        </h1>
        <p className='font-Custom font-normal text-gray-500 text-sm text-center px-2 max-w-[45rem] flex justify-center items-center mx-auto my-3'>
          We prioritize your peace of mind throughout the entire home renting process. With unwavering commitment,
          We bring you more than just properties-We deliver trusted spaces that resonates with your lifestyle.
        </p>
        {/* buttons for view pricing and get more info */}
        <div className='flex justify-center items-center mx-auto gap-5 py-4'>
           {/* pricing */}
           <button className='bg-blue-500 min-w-[8rem] max-w-[10rem] px-2 h-10 flex justify-center py-2.5 rounded-full font-Custom font-medium text-sm text-white'>
            View Pricing
           </button>
           {/* get more info */}
           <button className='bg-white min-w-[8rem] max-w-[8rem] px-2 h-10 flex justify-center py-2.5 rounded-full font-Custom font-medium text-sm text-gray-700 border border-gray-600'>
            Get More Info
           </button>
        </div>
        <div className="grid grid-cols-12 gap-2 sm:gap-3 md:gap-4 lg:gap-6 h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 mt-8 px-3 lg:px-20">
          <div className="col-span-2 rounded-2xl overflow-hidden">
            <img 
              src={image3}
              alt="Image 3" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-4 sm:col-span-4 md:col-span-4 lg:col-span-4 rounded-2xl overflow-hidden">
            <img 
              src={image2}
              alt="Image 2" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className='col-span-6 sm:col-span-6 md:col-span-6 lg:col-span-6 rounded-2xl overflow-hidden'>
            <img src={image1}
             alt="image1"
             className='object-cover h-full w-full' />
          </div>
        </div>
        {/* values */}
        <div className='mt-24'>
          <h2 className='font-Custom font-semibold text-lg lg:text-2xl py-2 text-gray-800 flex justify-center items-center '>
            We Locate, Rent, Advertise Properties
          </h2>
          <p className='font-medium font-Custom text-gray-500 text-sm flex justify-center items-center text-center px-3'>Let us be your got-to partner for all your real estate endeavors</p>
          <div className='grid md:grid-cols-12 grid-cols-1 mx-auto gap-2 lg:px-20 md:px-10 px-8 mt-8'>
            {/* values or services */}
            {
              values.map(
                (items) => {const Icons = items.icon; return (
                  <div className='bg-white border col-span-4 shadow-xl shadow-gray-400/20 max-w-[22rem] mt-1 p-3 rounded-2xl'>
                    <div className='size-10 my-2 bg-blue-600 p-1 rounded-md'><Icons size={30} className='text-white'/></div>
                     <h1 className='font-Custom font-bold text-lg text-gray-700 py-2'>{items.title}</h1>
                     <p className='font-Custom font-medium text-sm text-gray-600 text-left'>{items.body}</p>
                     <button className='flex items-center gap-2 font-Custom font-bold text-gray-600 text-sm py-3'>Learn More <hr className='w-16 mt-1 border-y-1 border-gray-400'/></button>
                  </div>
                )}
              )
            }
          </div>
          {/* different properties (apartments, studios, hostels). this comes from 
          the backend of the api containing the properties  */}
          <div className='mt-32'>
             <h2 className='font-Custom font-semibold text-lg lg:text-2xl py-2 text-gray-800 flex justify-center items-center '>
              We Help You To Make Better Deals
            </h2>
            <p className='font-medium font-Custom text-gray-500 text-sm flex justify-center items-center text-center px-3'>Rely on our seasoned professionals who posses in-depth knowledge of the real estate landscape.</p>
            {/* search filter based on user clicks or selection */}
            <div className='grid max-md:grid-cols-1 justify-center mx-5 md:mx-32 mt-8 items-center gap-2 grid-cols-4'>
              <button id='apartment' onClick={()=>handleClick('apartment')} className='font-Custom font-semibold text-sm hover:text-blue-600 text-gray-600 w-full bg-gray-50 py-3 hover:bg-gray-100 rounded-md hover:border-b-blue-300 border-b-2 my-4'>Apartments</button>
              <button id='studio' onClick={()=>handleClick('Studios')} className='font-Custom font-semibold text-sm hover:text-blue-600 text-gray-600 w-full bg-gray-50 py-3 hover:bg-gray-100 rounded-md hover:border-b-blue-300 border-b-2 my-4'>Studios</button>
              <button id='hostel' onClick={()=>handleClick('Hostels')} className='font-Custom font-semibold text-sm hover:text-blue-600 text-gray-600 w-full bg-gray-50 py-3 hover:bg-gray-100 rounded-md hover:border-b-blue-300 border-b-2 my-4'>Hostels</button>
              <button id='all' onClick={()=>handleClick('all')} className='font-Custom font-semibold text-sm text-gray-700 hover:text-blue-600 w-full bg-gray-50 py-3 hover:bg-gray-100 rounded-md hover:border-b-blue-300 border-b-2 my-4'>All Properties</button>
            </div>
          </div>
          <Properties/>
        </div>
    </section>
  )
}

export default Home