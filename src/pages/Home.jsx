import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Questions from '../components/Questions';
import { MapPinHouse, BookOpenCheckIcon, PackageOpenIcon, Map } from 'lucide-react';
import Navbar from '../components/Navbar';
import Testimonial from '../components/ScrollTestimonials';
import Properties from '../components/Properties';

import image1 from '../assets/images/mobile-money.jpg';
import image2 from '../assets/images/mastercard.png';
import image6 from '../assets/images/paypal.jpg'
import image3 from '../assets/images/8.jpg';
import image4 from '../assets/images/9.jpg';
import image5 from '../assets/images/10.jpg';
import plan from '../assets/images/plan.jpg';
import map from '../assets/houses/map.jpg';
import '../App.css';
import L from 'leaflet';
import { GrPlan, GrTransaction } from 'react-icons/gr';
import Footer from './Footer';

function Home() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Initialize the map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      try {
        const mapInstance = L.map(mapRef.current, {
          center: [51.5074, -0.1278],
          zoom: 14,
          maxBounds: [
            [40, -10],
            [60, 10]
          ],
          maxBoundsViscosity: 1.0
        });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          minZoom: 2,
          attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapInstance);

        mapInstanceRef.current = mapInstance;
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const navigate = useNavigate()
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
      <Navbar/>
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
              src={image5}
              alt="Image 2" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className='col-span-6 sm:col-span-6 md:col-span-6 lg:col-span-6 rounded-2xl overflow-hidden'>
            <img src={image4}
             alt="image1"
             className='object-cover h-full w-full' />
          </div>
        </div>
        {/* values */}
        <div className='mt-20'>
          <h2 className='font-Custom font-semibold text-2xl px-2 text-center  py-2 text-gray-800 flex justify-center items-center '>
            We Locate, Rent, Advertise Properties
          </h2>
          <p className='font-medium font-Custom text-gray-500 text-sm flex justify-center items-center text-center px-3'>Let us be your got-to partner for all your real estate endeavors</p>
          <div className='grid md:grid-cols-12 grid-cols-1 mx-auto gap-2 lg:px-20 md:px-10 px-8 mt-8'>
            {/* values or services */}
            {
              values.map(
                (items, index) => {const Icons = items.icon; return (
                  <div key={index} className='bg-white border col-span-4 shadow-md shadow-gray-400/20 max-w-[22rem] mt-1 p-3  rounded-2xl'>
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
             <h2 className='font-Custom font-semibold text-2xl text-center px-2 lg:text-2xl py-2 text-gray-800 flex justify-center items-center '>
              We Help You To Make Better Deals
             </h2>
            <p className='font-medium font-Custom text-gray-500 text-sm flex justify-center items-center text-center px-3'>Rely on our seasoned professionals who posses in-depth knowledge of the real estate landscape.</p>
            {/* search filter based on user clicks or selection */}
            <Properties/>
            <button onClick={()=> navigate('/dashboard')} className='bg-blue-600 text-white font-Custom font-medium text-sm rounded-full max-w-[10rem] px-5 py-2 my-5 flex justify-center items-center mx-auto'>
              Load More
            </button>
          </div>
          <div className='mt-32'>
             <h2 className='font-Custom font-semibold text-2xl text-center px-2 lg:text-2xl py-2 text-gray-800 flex justify-center items-center '>
              Why Choose Us ?
            </h2>
            <p className='font-medium font-Custom text-gray-500 text-sm flex justify-center items-center text-center px-3'>
              Your satisfaction is our priority, and we look forward to being the key to unlock your renting process
            </p>
            <div className="grid grid-cols-1 md:grid-cols-12 justify-center lg:px-20 mt-4 gap-8 md:mt-16">
              <div className='md:col-span-7 border bg-white shadow-md shadow-gray-200/60 border-gray-200/40 mx-2 rounded-xl p-4 max-w-full transition-colors duration-100 hover:shadow-md'>
                <div className='flex justify-items-start gap-3 items-center'>
                    <button className='max-w-[4rem] h-12 bg-white shadow-xl shadow-gray-300/40 p-4 rounded-lg py-4'>
                      <GrTransaction size={20} className='text-blue-500'/>
                    </button>
                    <div>
                      <h2 className='font-Custom font-medium text-lg text-gray-800'>
                        Transparent Transaction Process
                      </h2>
                      <p className='font-Custom font-medium text-xs text-gray-400'>
                        We kick off our partnership with open and honest communication
                      </p>
                    </div>
                </div>
                <Questions/>
              </div>
              <div className='md:col-span-5 max-w-[28rem] py-3 px-4  mx-2 bg-white rounded-lg shadow-sm border border-gray-100/60 overflow-hidden transition-all duration-200 hover:shadow-md'>
                <div className='flex-1 mx-auto '>
                  <div className='flex justify-items-start gap-3 items-center'>
                      <button className='max-w-[4rem] h-12 bg-white shadow-xl shadow-gray-300/40 p-4 rounded-lg py-4'>
                        <GrTransaction size={20} className='text-blue-500'/>
                      </button>
                      <div>
                        <h2 className='font-Custom font-medium text-lg text-gray-800'>
                          Easy Payment
                        </h2>
                        <p className='font-Custom font-medium text-xs text-gray-400 max-w-[18rem]'>
                          Our commitment to providing an easy payment process ensures
                          that you can navigate the financial aspects of your platform transactions effortlessly.
                        </p>
                      </div>
                  </div>
                  {/* main payment methods */}
                  <div className='mt-10 mx-auto'>
                    <div className='flex items-center gap-1 md:gap-3 justify-center'>
                      <img src={image1} alt="mtn" className='object-cover max-w-full h-12 rounded-md' />
                      <img src={image2} alt="mastercard" className='object-cover w-auto h-14 rounded-lg' />
                      <img src={image6} alt="paypal" className='object-cover w-auto h-16 rounded-lg' />
                    </div>
                    <div className='flex items-center justify-center mt-6 w-full'>
                      <p className='font-Custom font-normal text-xs text-gray-500 leading-4 flex-wrap w-full'>
                        <span className='text-red-600/80 font-bold text-sm'>Note !</span> not all payment methods are available for now. We are still under continous development , but we can assure you that these missing features will soon be made available for everyone .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* second section for the map and others */}
            <div className='px-3 md:px-1 lg:px-10 mt-8 grid grid-cols-1 md:grid-cols-12 md:mx-0.5 lg:mx-12 items-center gap-8 mx-auto '>
              <div className='md:col-span-5 max-w-full p-3 py-4 mx-auto bg-white rounded-lg shadow-sm border border-gray-100/60 overflow-hidden transition-all duration-200 hover:shadow-md'>
                <div className='flex-1'>
                  <div className='flex justify-items-start gap-3 items-center'>
                      <button className='max-w-[4rem] h-12 bg-white shadow-xl shadow-gray-300/40 p-4 rounded-lg py-4'>
                        <GrPlan size={20} className='text-blue-500'/>
                      </button>
                      <div>
                        <h2 className='font-Custom font-medium text-lg text-gray-800'>
                          Data Security
                        </h2>
                        <p className='font-Custom font-medium text-xs text-gray-400 max-w-[18rem]'>
                          Time is valuable and your needs are unique, that's why we have curated a subscription.
                        </p>
                      </div>
                  </div>
                  {/* subscription plan */}
                  <div className='mt-12'>
                    <img src={plan} alt="plan" className='rounded-lg'/>
                  </div>
                </div>
              </div>
              {/* map */}
              <div className='md:col-span-7 w-full py-3 mx-auto px-2 rounded-lg shadow-sm border border-gray-100/60 overflow-hidden transition-all duration-200 hover:shadow-md'>
                <div className='flex-1'>
                  <div className='flex justify-items-start gap-3 items-center'>
                      <button className='max-w-[4rem] h-12 bg-white shadow-xl shadow-gray-300/40 p-4 rounded-lg py-4'>
                        <Map size={20} className='text-blue-500'/>
                      </button>
                      <div>
                        <h2 className='font-Custom font-medium text-lg text-gray-800'>
                          Comprehensive Property Listings
                        </h2>
                        <p className='font-Custom font-medium text-xs text-gray-400 max-w-[28rem]'>
                          We pride ourselves on offering an extensive and diverse range of property listings to carter to every unique situation
                        </p>
                      </div>
                  </div>
                  {/* Map container */}
                  <div className='mt-5'>
                    <div ref={mapRef} className="h-[230px] w-full rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end of why choose us */}
          {/* testimonials */}
          <div className='mt-8 md:mt-28'>
             <h2 className='font-Custom font-semibold text-2xl text-center px-2 lg:text-2xl py-2 text-gray-800 flex justify-center items-center '>
              Hear From Our Clients Around The World
             </h2>
            <p className='font-medium font-Custom text-gray-500 text-sm flex justify-center items-center text-center px-3'>explore the first hand experience of individuals who have us with their real estate journeys.</p>
            {/* search filter based on user clicks or selection */}
            <Testimonial/>
          </div>
          {/* section for  */}
          <div className='mt-8 md:mt-28 w-full bg-blue-700/80 py-8'>
             <h2 className='font-Custom font-semibold text-3xl text-center px-2 lg:text-4xl md:max-w-[24rem] mx-auto py-2 text-white flex justify-center items-center '>
              Personalized Services, Globally Recognized 
             </h2>
            <p className='font-medium font-Custom text-white text-sm flex justify-center md:max-w-[34rem] leading-5 mx-auto items-center text-center px-3'>whether renting, investing or advertising, our clients appreciate the tailored approach that transcends geographical boundaries.</p>
            <button className='max-w-[10rem] mx-auto flex mt-5 h-8 bg-white font-Custom font-medium text-xs text-blue-700 rounded-full px-8 py-2'>
              Contact Us
            </button>
          </div>
        </div>
        <Footer/>
    </section>
  )
}

export default Home