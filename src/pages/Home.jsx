'use client'

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import About_us from './About_us';
import Questions from '../components/Questions';
import { Map, Facebook, Linkedin, Mail, AtSign } from 'lucide-react';
import { TEAM_MEMBERS, COMPANY_VALUES } from '@/constants';
import Navbar from '../components/Navbar';
import Testimonial from '../components/ScrollTestimonials';
import List_products from '../components/Properties';
import image1 from '../assets/images/mobile-money.jpg';
import image2 from '../assets/images/mastercard.png';
import image6 from '../assets/images/paypal.jpg'
import image3 from '../assets/images/8.jpg';
import image4 from '../assets/images/9.jpg';
import image5 from '../assets/images/10.jpg';
import plan from '../assets/images/plan.png';
import '../App.css';
import { GrMoney, GrPlan, GrTransaction } from 'react-icons/gr';
import Footer from './Footer';
import Services from '../components/Services';

function Home() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const aboutRef = useRef(null);

  // Initialize the map
  useEffect(() => {
    let mounted = true;
    
    if (mapRef.current && !mapInstanceRef.current) {
      // Dynamically import leaflet only on client side
      import('leaflet').then((L) => {
        if (!mounted) return;
        
        const leaflet = L.default;
        try {
          const mapInstance = leaflet.map(mapRef.current, {
            center: [51.5074, -0.1278],
            zoom: 14,
            maxBounds: [
              [40, -10],
              [60, 10]
            ],
            maxBoundsViscosity: 1.0
          });

          leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            minZoom: 2,
            attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }).addTo(mapInstance);

          mapInstanceRef.current = mapInstance;
        } catch (error) {
          console.error('Error initializing map:', error);
        }
      }).catch((error) => {
        console.error('Error loading leaflet:', error);
      });
    }

    // Cleanup function
    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const router = useRouter()
  
  // Constants imported from @/constants
  return (
    <section className='w-full mx-auto'>
      <Navbar/>
        <div className='block-animate bg-white border px-1 py-1 my-4 border-gray-300  mx-auto w-[17.8rem] h-10 rounded-full flex items-center justify-between '>
          <button className='bg-blue-400 text-white font-Custom font-medium px-1 text-md w-20 flex items-center justify-center h-8 rounded-full'>New</button>
          <p className='h-9 font-Custom text-gray-400 font-normal text-sm  pt-2'>We've just released an update</p>
        </div>
        <h1 className='block-animate font-Custom font-bold text-gray-800 lg:text-6xl text-5xl lg:max-w-[46rem] max-w-[38rem] mx-auto text-center flex justify-center items-center '>
          Trusted Real Estate Property Just For You
        </h1>
        <p className='block-animate font-Custom font-normal text-gray-500 text-sm text-center px-2 max-w-[45rem] flex justify-center items-center mx-auto my-3'>
          We prioritize your peace of mind throughout the entire home renting process. With unwavering commitment,
          We bring you more than just properties-We deliver trusted spaces that resonates with your lifestyle.
        </p>
        {/* buttons for view pricing and get more info */}
        <div className='block-animate flex justify-center items-center mx-auto gap-5 py-4'>
           {/* pricing */}
           <button onClick={()=>router.push('/signup')}  className='bg-blue-500 min-w-[8rem] max-w-[10rem] px-2 h-10 flex justify-center py-2.5 rounded-full font-Custom font-medium text-sm text-white'>
            Get Started
           </button>
           {/* get more info */}
           <button onClick={()=>router.push('/contact')}  className='bg-white min-w-[8rem] max-w-[8rem] px-2 h-10 flex justify-center py-2.5 rounded-full font-Custom font-medium text-sm text-gray-700 border border-gray-600'>
            Get More Info
           </button>
        </div>
        <div className="grid grid-cols-12 gap-2 sm:gap-3 md:gap-4 lg:gap-6 h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 mt-8 px-3 lg:px-20">
          <div className="block-animate col-span-2 rounded-2xl overflow-hidden">
            <img 
              src={image3.src || image3}
              alt="Image 3" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="block-animate col-span-4 sm:col-span-4 md:col-span-4 lg:col-span-4 rounded-2xl overflow-hidden">
            <img 
              src={image5.src || image5}
              alt="Image 2" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className='block-animate col-span-6 sm:col-span-6 md:col-span-6 lg:col-span-6 rounded-2xl overflow-hidden'>
            <img src={image4.src || image4}
             alt="image1"
             className='object-cover h-full w-full' />
          </div>
        </div>
        {/* values */}
        <div ref={aboutRef} id='about-us' className='mt-20'>
          <div>
            <h2 className='font-Custom font-semibold text-2xl px-2 text-center  py-2 text-gray-800 flex justify-center items-center '>
              We Locate, Rent, Advertise Properties
            </h2>
          <p className='font-medium font-Custom text-gray-500 text-sm flex justify-center items-center text-center px-3'>Let us be your got-to partner for all your real estate endeavors</p>
          </div>
          <div className='grid md:grid-cols-12 grid-cols-1 mx-auto gap-3 lg:px-20 md:px-10 px-8 mt-10'>
            {/* values or services */}
            {
              COMPANY_VALUES.map(
                (items, index) => {const Icons = items.icon; return (
                  <div key={index} className='block-animate bg-white border col-span-4 shadow-md shadow-gray-300/40 max-w-[22rem] mt-1 p-3 rounded-2xl'>
                    <div className='size-10 my-2 bg-blue-600 p-1 rounded-md'><Icons size={30} className='text-white'/></div>
                     <h1 className='font-Custom font-bold text-lg text-gray-700 py-2'>{items.title}</h1>
                     <p className='font-Custom font-medium text-xs text-gray-400 text-left'>{items.body}</p>
                     <button className='flex items-center gap-2 font-Custom font-bold text-gray-600 text-sm py-3'>Learn More <hr className='w-16 mt-1 border-y-1 border-gray-400'/></button>
                  </div>
                )}
              )
            }
          </div>
          {/* different properties (apartments, studios, hostels). this comes from 
          the backend of the api containing the properties  */}
          <div className='mt-32'>
             <h2 className='font-Custom font-semibold text-2xl text-center px-2 lg:text-2xl py-2 text-gray-800 flex justify-center items-center'>
              Explore Our Property Collection
            </h2>
            <p className='font-medium font-Custom text-gray-500 text-sm flex justify-center items-center text-center px-3'>
              From hostels to studios, our curated gallery showcases diverse living spaces backed by expert insight into the real estate landscape.
            </p>
            {/* Interactive filters to help users browse by property type */}
            <List_products/>
            
          </div>
          {/* services */}
          <div className='mx-auto mt-24'>
            <span className='font-Custom font-semibold text-2xl text-center px-2 lg:text-2xl py-2 text-gray-800 flex justify-center items-center '>
              Our  <span className='text-blue-600 px-2'>Unique</span> Services !
            </span>
            <p className='font-medium font-Custom text-gray-500 text-sm flex justify-center items-center text-center px-3'>
              We provide the best tailored services for all your renting and real estate problems
            </p>
            <Services/>
          </div>
          <div className='mt-32'>
             <h2 className='font-Custom font-semibold text-2xl text-center px-2 lg:text-2xl py-2 text-gray-800 flex justify-center items-center '>
              Why Choose Us ?
            </h2>
            <p className='font-medium font-Custom text-gray-500 text-sm flex justify-center items-center text-center px-3'>
              Your satisfaction is our priority, and we look forward to being the key to unlock your renting process
            </p>
            <div className="grid grid-cols-1 md:grid-cols-12 justify-center lg:px-20 mt-4 gap-8 md:mt-16">
              <div className='block-animate md:col-span-7 border bg-white shadow-md shadow-gray-200/60 border-gray-200/40 mx-2 rounded-xl p-4 max-w-full transition-colors duration-100 hover:shadow-md'>
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
              <div className='block-animate md:col-span-5 max-w-[28rem] py-3 px-4  mx-2 bg-white rounded-lg shadow-sm border border-gray-100/60 overflow-hidden transition-all duration-200 hover:shadow-md'>
                <div className='flex-1 mx-auto '>
                  <div className='flex justify-items-start gap-3 items-center'>
                      <button className='max-w-[4rem] h-12 bg-white shadow-xl shadow-gray-300/40 p-4 rounded-lg py-4'>
                        <GrMoney size={20} className='text-blue-500'/>
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
                      <img src={image1.src || image1} alt="mtn" className='object-cover max-w-full h-12 rounded-md' />
                      <img src={image2.src || image2} alt="mastercard" className='object-cover w-auto h-14 rounded-lg' />
                      <img src={image6.src || image6} alt="paypal" className='object-cover w-auto h-16 rounded-lg' />
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
              <div className='block-animate md:col-span-5 max-w-full p-3 py-4 mx-auto bg-white rounded-lg shadow-sm border border-gray-100/60 overflow-hidden transition-all duration-200 hover:shadow-md'>
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
                    <img src={plan.src || plan} alt="plan" className='rounded-lg'/>
                  </div>
                </div>
              </div>
              {/* map */}
              <div className='block-animate md:col-span-7 w-full py-3 mx-auto px-2 rounded-lg shadow-sm border border-gray-100/60 overflow-hidden transition-all duration-200 hover:shadow-md'>
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
                  <div className='mt-5 z-10'>
                    <div ref={mapRef} className="h-[230px] w-full rounded-lg z-0"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end of why choose us */}
          {/* meet our team section */}
          <section className='mt-20 mx-auto'>
            <h2 className='font-Custom font-semibold text-2xl text-center px-2 lg:text-2xl py-2 text-gray-800 flex justify-center items-center '>
              Meet Our Team 
            </h2>
            <p className='font-medium font-Custom text-gray-500 text-sm flex justify-center items-center text-center px-3'>
              Unleashing creativity our team of design visionaries turns ordinary spaces into extraordinary experiences.
            </p>
            <div className='flex flex-1 justify-center items-center gap-2 mt-5'>
               <button onClick={()=>router.push('/signup')} className='bg-red-500 text-white px-5 py-2 rounded-md shadow font-Poppins font-normal'>
                Get started
               </button>
               <button onClick={()=>router.push('/contact')} className='bg-white border text-gray-600 px-5 py-2 rounded-md shadow font-Custom font-normal'>
                Support Us !
               </button>
            </div>
            <div className='mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 px-10 '>
               {TEAM_MEMBERS.map(
                (person, index) => {
                  return (
                    <div key={index} className='block-animate mx-auto mt-4 bg-gray-50/20 p-3 rounded-lg hover:shadow-lg  max-w-[20rem]'>
                      <img src={image4.src || image4} alt="" className='size-24 rounded-full shrink-0 mx-auto my-4'/>
                      <div className='mx-auto text-center'>
                        <h1 className='font-Poppins font-bold text-sm text-gray-800/70'>
                          {person.name}
                        </h1>
                        <p className='font-Custom font-medium text-xs text-gray-500 max-w-[28rem] py-2'>
                          {person.position}
                        </p>
                      </div>
                      <div className='flex justify-center items-center gap-2'>
                        <button onClick={()=>window.location.href=person.linkin}>
                          <Linkedin size={20} fill='white' color='' className='bg-black/60 px-[2px] rounded'/>
                        </button>
                        <button onClick={()=>window.location.href=person.email}>
                          <AtSign size={20} className='text-red-500'/>
                        </button>
                      </div>
                    </div>
                  );
                }
               )};
            </div>
          </section>
          {/* testimonials */}
          <div className='mt-8 md:mt-28'>
             <h2 className='font-Custom font-semibold text-2xl text-center px-2 lg:text-2xl py-2 text-gray-800 flex justify-center items-center '>
              Hear From Our Clients Around The World
             </h2>
            <p className='font-medium font-Custom text-gray-500 text-sm flex justify-center items-center text-center px-3'>explore the first hand experience of individuals who have us with their real estate journeys.</p>
            {/* search filter based on user clicks or selection */}
            <Testimonial/>
          </div>
          {/* section for contact us */}
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