import React, {useRef,useEffect, useState} from 'react';
import '../App.css';
import L from 'leaflet';
import Nav_bar from '../components/Navbar';
import Footer from './Footer';
import contact from '../assets/images/11.jpg';
import { Coins, DoorClosed, Lock, Mail, MailIcon, MapIcon, PersonStanding, PhoneCall, PhoneIncoming, Plane, Trophy, UserCircle, Voicemail } from 'lucide-react';
function Contact_us() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  // initialize the links for each member
  const [Links, sendToLink] = useState(null);
  
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

    const faqs = [
      {
        icon: Trophy,
        question: 'Is there a ree trial available ?',
        answer: 'No, there are no free trials , subscribe to a subscription plans and get enough views to continue browsing.'
      },
      {
        icon: Plane,
        question: 'Can i change my plan later ?',
        answer: 'Yes, you can later change your plan if it has expired and later subscribe to another plan.'
      },
      {
        icon: MailIcon,
        question: 'How do i change my email ?',
        answer: 'When you have created an account , you can access the dashboard and change your email in the profile section.'
      },
      {
        icon: Coins,
        question: 'How does billing work ?',
        answer: 'We provide accessible payment methods for all your billing transactions world wide .'
      },
      {
        icon: Lock,
        question: 'Is our data kept private and secure ?',
        answer: 'Yes, all your data are kept private and secure as far as you have agreed with our user terms and policies .'
      },
      {
        icon: UserCircle,
        question: 'Can i cancel or delete my account ?',
        answer: 'Yes, if you are tired of using the platform you can delete your account in the dashboard.'
      },
      {
        icon: PersonStanding,
        question: 'How does user support work ?',
        answer: 'You can contact our friendly team if you are facing any challenges or difficulties while using the platform.'
      },
      {
        icon: DoorClosed,
        question: 'How can i know if my subscription is finish ?',
        answer: 'When your subscription is finish, we shall keep you updated by sending you a notification .'
      },
    ]

    const team = [
      {
        name: 'Steve Caleb',
        position: 'Founder & System Designer & agent',
        link: 'http//www.steve.drive.google.com'
      },
      {
        name: 'Nji Rodney',
        position: 'Frontend Developer & Project Manager & agent',
        link: 'http//www.rodney.drive.google.com'
      },
      {
        name: 'Presly Takoh',
        position: 'Backend Developer & Database Manger',
        link: 'http//www.presly.drive.google.com'
      },
      {
        name: 'Dorine Blessing',
        position: 'Market Strategist & Customer Support',
        link: 'http//www.dorine.drive.google.com'
      },
      {
        name: 'Elakie Leonie',
        position: 'Market Strategist & Customer Support',
        link: 'http//www.leo.drive.google.com'
      },
      {
        name: 'Deland',
        position: 'Frontend & agent',
        link: 'http//www.deland.drive.google.com'
      },
      {
        name: 'Nkongho William',
        position: 'System Analyst & Data Scientist',
        link: 'http//www.william.drive.google.com'
      },
      {
        name: 'Wesly',
        position: 'Market Strategist & Social Media',
        link: 'http//www.wesly.drive.google.com'
      }
    ];

    const Contact = [
      {
        icon: Voicemail,
        title: 'Chat to sales ?',
        text: 'Speak to our friendly team .',
        link: 'rentspot.sales@gmail.com'
      },
      {
        icon: MapIcon,
        title: 'Visit Us ?',
        text: 'Visit our office HQ .',
        link: 'Molyko, Buea, SouthWest'
      },
      {
        icon: PhoneIncoming,
        title: 'Call Us ?',
        text: 'available services 24/7 .',
        link: '+237-6********9'
      },
      {
        icon: MailIcon,
        title: 'Email Us ?',
        text: 'Customer Support 24/7 .',
        link: 'rentspot@gmail.com'
      },
    ]

  return (
    <section className='bg-white'>
      <Nav_bar/>
      <section>
        <div className='mx-auto'>
          {/* grid for the form and map */}
           <div className='grid grid-cols-1 md:grid-cols-12 px-3 p-4 space-y-4 my-2' id='bg'>
              <div className='bg-gray-200/20 backdrop-blur-sm rounded-xl col-span-5 mx-auto p-4'>
                <h1 className='font-Custom text-center font-bold text-lg text-gray-700'>
                  How can we help ?
                </h1>
                <p className='font-Custom font-medium text-xs text-center text-gray-600 mb-4'>
                  Looking for support ? contact our friendly team 24/7.
                </p>
                <form action="" className='bg-white max-w-[20rem] border p-4 rounded-lg space-y-2'>
                  <div>
                    <label htmlFor="email" className='font-Custom font-bold text-sm text-gray-700'>
                      username
                    </label>
                    <input type="text" name="username" id="username" placeholder='your name' className='bg-white px-3 text-xs outline-blue-400 border w-full rounded-lg mt-2 h-10'/>
                  </div>
                  <div>
                    <label htmlFor="email" className='font-Custom font-bold text-sm text-gray-700'>
                      email
                    </label>
                    <input type="email" name="email" id="email" placeholder='your@gmail.com' className='bg-white px-3 text-xs outline-blue-400 border w-full rounded-lg mt-2 h-10'/>
                  </div>
                  <div>
                    <label htmlFor="email" className='font-Custom font-bold text-sm text-gray-700'>
                      message
                    </label>
                    <textarea name="message" id="message" placeholder='type here' className='p-3 mt-2 border rounded-lg w-full font-Custom font-normal text-sm text-gray-600 bg-white'>
                    
                    </textarea>
                  </div>
                  <button type="submit" className='w-full text-center bg-blue-600 text-white font-Custom h-10 rounded-full'>
                    Submit
                  </button>
                  <p className='font-Custom font-medium text-xs text-gray-600 text-center '>By contacting us you agree to our <span className='text-sm text-blue-600'>terms and conditions</span> and <span className='text-sm text-blue-600'>privacy policies</span></p>
                </form>
              </div>
              {/* Map container */}
                <div className='mt-0 z-10 col-span-7'>
                  <div ref={mapRef} className="h-[400px] md:h-[500px] w-full rounded-lg z-0"></div>
                </div>
           </div>
           {/* end of form and map section and beginning of faqs */}
           <div className='mx-auto flex justify-center mt-[5rem]'>
            <div>
              <h1 className='text-center mb-8 font-Custom font-bold text-2xl text-gray-800'>
                Frequently Asked Questions
              </h1>
              <div className='grid grid-cols-1 md:grid-cols-2 mx-2 md:mx-20 space-y-1 gap-5'>
                {faqs.map(
                  (data, index) => { const Icon = data.icon;
                    return (
                      <div key={index} className='flex items-start gap-2 py-2 px-2 rounded-lg bg-gray-100/40 max-w-full'>
                        <div className='size-10 rounded-lg p-2 border bg-white'><Icon size={20} className='text-blue-600/60 flex-shrink-0'/></div>
                        <div className='block'>
                          <h1 className='font-Custom font-bold text-xs text-gray-800'>
                            {data.question}
                          </h1>
                          <p className='font-Custom font-normal text-xs text-gray-500'>
                            {data.answer}
                          </p>
                        </div>
                      </div>
                    )
                  }
                )}
              </div>
            </div>
           </div>
           {/* <div className='mt-[5rem] mx-auto overflow-hidden'>
              <div className='mt-[5rem] mx-auto overflow-hidden'>
                <h1 className='font-Custom font-bold text-2xl text-center text-gray-800'>
                  Our Friendly Team
                </h1>
                <p className='font-Custom font-normal text-center text-xs text-gray-500'>
                  Meet our friendly team members and their specialties
                </p>
              </div>
              beginning of team members section
              <div className='grid grid-cols-1 lg:grid-cols-2 mt-12  w-full mx-auto gap-4 px-3'>
                <div className='max-w-full'><img src={contact} alt="" className='max-w-full rounded-xl'/></div>
                <div className='grid grid-cols-1 md:grid-cols-4 w-full max-lg:mt-8 p-2 gap-4'>
                  {team.map(
                    (member,index)=>{
                      return (
                        <div key={index}  className='w-full rounded-lg px-2 py-3 bg-white shadow-sm shadow-slate-300'>
                          <div className='size-7 rounded-full bg-blue-500 mx-auto my-2'></div>
                          <h1 className='font-Custom font-bold text-xs text-gray-800 text-center'>{member.name}</h1>
                          <p onClick={()=>sendToLink(member.link)}  className='font-Custom font-medium text-xs text-blue-600 text-center cursor-pointer'>{member.position}</p>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>
           </div> */}
           {/* contact information */}
           <div className='mt-[5rem] mx-auto overflow-hidden'>
            <div>
              <h1 className='font-Custom font-bold text-2xl text-center text-gray-800'>We'd love to hear from you</h1>
              <p className='font-Custom font-normal text-center text-xs text-gray-500'>chat with our friendly team</p>
            </div>
            <div className='mx-auto mt-10'>
              <div className='grid grid-cols-1 md:grid-cols-4 min-h-[8rem] w-full mx-auto p-4  gap-4  px-14'>
                {Contact.map(
                  (info,index)=>{ const Icon = info.icon ;
                    return (
                      <div key={index} className='max-w-[15rem] flex justify-center items-center gap-4 bg-gray-50 rounded-xl p-1 py-2 '>
                        <div className='size-8 my-4 p-2 rounded-md bg-blue-500'><Icon size={15} className='text-white'/></div>
                        <div>
                          <h1 className='font-Custom font-bold text-xl text-gray-800'>{info.title}</h1>
                          <p className='font-Custom font-normal text-xs text-gray-500'>{info.text}</p>
                          <p className='font-Custom font-normal text-xs text-gray-500'>{info.link}</p>
                        </div>
                      </div>
                    )
                  }
                )}
              </div>
            </div>
           </div>
        </div>
      </section>
      <Footer/>
    </section>
  )
}

export default Contact_us