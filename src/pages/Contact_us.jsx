import React, { useRef, useEffect, useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import Navbar from '../components/Navbar';
import Footer from './Footer';
import { 
  Coins, 
  DoorClosed, 
  Lock, 
  MailIcon, 
  MapIcon, 
  PersonStanding, 
  PhoneIncoming, 
  Plane, 
  Trophy, 
  UserCircle 
} from 'lucide-react';

function ContactUs() {
  // initialize navigation
  const navigate = useNavigate();

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Add your form submission logic here
      console.log('Form submitted:', formData);
      // Reset form after successful submission
      setFormData({ username: '', email: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      icon: Trophy,
      question: 'Is there a free trial available?',
      answer: 'No, there are no free trials. Subscribe to a subscription plan and get enough views to continue browsing.'
    },
    {
      icon: Plane,
      question: 'Can I change my plan later?',
      answer: 'Yes, you can change your plan after it has expired and subscribe to another plan.'
    },
    {
      icon: MailIcon,
      question: 'How do I change my email?',
      answer: 'After creating an account, you can access the dashboard and change your email in the profile section.'
    },
    {
      icon: Coins,
      question: 'How does billing work?',
      answer: 'We provide accessible payment methods for all your billing transactions worldwide.'
    },
    {
      icon: Lock,
      question: 'Is our data kept private and secure?',
      answer: 'Yes, all your data is kept private and secure as long as you have agreed with our terms and policies.'
    },
    {
      icon: UserCircle,
      question: 'Can I cancel or delete my account?',
      answer: 'Yes, if you no longer wish to use the platform, you can delete your account in the dashboard.'
    },
    {
      icon: PersonStanding,
      question: 'How does user support work?',
      answer: 'You can contact our friendly team if you face any challenges or difficulties while using the platform.'
    },
    {
      icon: DoorClosed,
      question: 'How can I know if my subscription has finished?',
      answer: 'When your subscription ends, we will keep you updated by sending you a notification.'
    },
  ];

  const contactInfo = [
    {
      icon: MapIcon,
      title: 'Visit Us',
      link: 'Molyko, Buea, SouthWest',
      ariaLabel: 'Our office address'
    },
    {
      icon: PhoneIncoming,
      title: 'Call Us',
      link: '+237681906850',
      ariaLabel: 'Call us at +237681906850'
    },
    {
      icon: MailIcon,
      title: 'Email Us',
      link: 'rentspot@gmail.com',
      ariaLabel: 'Send us an email'
    },
  ];

  return (
    <main>
      <Navbar />
      
      {/* Contact Form Section */}
      <section className='mx-auto bg-cover px-4 md:px-8 rounded-ee-full bg' >
        <div className='grid grid-cols-1 md:grid-cols-2 max-w-6xl mx-auto py-12 gap-12'>
          
          {/* Contact Information */}
          <div className='w-full'>
            <h1 className='font-bold text-3xl text-center md:text-left text-white mb-4'>
              We'd Love to Hear From You
            </h1>
            <p className='font-medium text-sm text-center md:text-left text-white mb-8 leading-relaxed'>
              Are you seeking to have a one-on-one conversation with our amazing team members? 
              Fill in the contact form and we shall attend to all your unique needs.
            </p>
            
            <div className='space-y-4 max-w-sm mx-auto md:mx-0'>
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div 
                    key={index} 
                    className='flex items-center gap-4 p-2  backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-shadow'
                    role="button"
                    aria-label={info.ariaLabel}
                  >
                    <div className='w-12 h-12 p-3 rounded-full bg-white flex-shrink-0'>
                      <Icon size={24} className='text-blue-600' />
                    </div>
                    <div>
                      <h2 className='font-bold text-sm text-white'>{info.title}</h2>
                      <p className={`font-medium text-sm ${
                        info.link.includes('@') ? 'text-blue-600' : 'text-white'
                      }`}>
                        {info.link}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Contact Form */}
          <div className='px-2'>
            <div className='bg-white max-w-sm shadow-2xl rounded-2xl mx-auto p-4'>
              <form onSubmit={handleSubmit} className='space-y-5'>
                <div>
                  <label htmlFor="username" className='block font-bold text-sm text-gray-700 mb-2'>
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    name="username" 
                    id="username" 
                    placeholder='Your full name' 
                    value={formData.username}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className='block font-bold text-sm text-gray-700 mb-2'>
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    placeholder='your@email.com' 
                    value={formData.email}
                    onChange={handleInputChange}
                    className='w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className='block font-bold text-sm text-gray-700 mb-2'>
                    Message
                  </label>
                  <textarea 
                    name="message" 
                    id="message" 
                    placeholder='Tell us how we can help you...' 
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className='w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none'
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className='w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors duration-200'
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                
                <p className='text-xs text-gray-500 text-center leading-relaxed'>
                  By contacting us you agree to our{' '}
                  <a href="/terms" className='text-blue-600 hover:underline'>terms and conditions</a>{' '}
                  and{' '}
                  <a href="/privacy" className='text-blue-600 hover:underline'>privacy policy</a>
                </p>
                
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map and FAQ Section */}
      <section className='my-20'>
        <div className='max-w-full mx-auto px-2'>
          <div className='text-center mb-12'>
            <h2 className='font-bold text-4xl text-gray-800 mb-4'>Let's Talk</h2>
            <p className='font-medium text-lg text-gray-700 mb-2'>Tell us your needs, and we'll contact you</p>
            <p className='text-gray-600 max-w-2xl mx-auto leading-relaxed'>
              If you have any questions about RentSpot or you're not sure which plan is right for you, 
              contact our friendly team and let's schedule a call.
            </p>
          </div>

          {/* Map */}
          <div className='mb-16 w-full z-0'>
            <div ref={mapRef} className="z-0 h-96 w-full rounded-xl shadow-lg" />
          </div>

          {/* FAQ Section */}
          <div id='faqs'>
            <h3 className='text-center mb-12 font-bold text-3xl text-gray-800'>
              Frequently Asked Questions
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {faqs.map((faq, index) => {
                const Icon = faq.icon;
                return (
                  <div key={index} className='flex items-start gap-4 p-6 rounded-xl bg-gray-100/50 hover:bg-gray-200 transition-colors'>
                    <div className='w-12 h-12 rounded-lg p-3 border bg-white flex-shrink-0'>
                      <Icon size={24} className='text-blue-600' />
                    </div>
                    <div>
                      <h4 className='font-bold text-sm text-gray-800 mb-2'>
                        {faq.question}
                      </h4>
                      <p className='text-sm text-gray-600 leading-relaxed'>
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* section for contact us */}
          <div className='mt-8 md:mt-28 w-full bg-blue-700/80 py-8'>
             <h2 className='font-Custom font-semibold text-3xl text-center px-2 lg:text-4xl md:max-w-[24rem] mx-auto py-2 text-white flex justify-center items-center '>
              Personalized Services, Globally Recognized 
             </h2>
            <p className='font-medium font-Custom text-white text-sm flex justify-center md:max-w-[34rem] leading-5 mx-auto items-center text-center px-3'>whether renting, investing or advertising, our clients appreciate the tailored approach that transcends geographical boundaries.</p>
            <button onClick={()=>navigate('/signup')} className='max-w-[10rem] mx-auto flex mt-5 h-8 bg-white font-Custom font-medium text-xs text-blue-700 rounded-full px-8 py-2'>
              Get Started
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default ContactUs;