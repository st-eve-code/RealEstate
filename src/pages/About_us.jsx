import React from 'react';
import Footer from './Footer';
import { 
  Building2, Home, Target, Users, Star, Award, 
  MapPin, Phone, Mail, ArrowRight,
  Linkedin, Twitter, Instagram, Sparkles,
  ChevronDown, Heart, Shield, Zap,
  Eye, Search, CheckCircle, Hammer,
  Clock, ShieldCheck, Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  // Updated Team Members Array - 8 members with LinkedIn and Email only
  const teamMembers = [
    {
      id: 1,
      name: 'Alexandre Dubois',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
      bio: 'Visionary leader with 15+ years in construction innovation. Passionate about creating exceptional living spaces.',
      social: {
        linkedin: '#',
        email: 'alexandre@carlingspaces.com'
      }
    },
    {
      id: 2,
      name: 'Sophie Laurent',
      role: 'Project Director',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
      bio: 'Expert in construction management and client relations. Ensures every project exceeds expectations.',
      social: {
        linkedin: '#',
        email: 'sophie@carlingspaces.com'
      }
    },
    {
      id: 3,
      name: 'Marcus Johnson',
      role: 'Lead Architect',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: 'Creative architect blending innovative design with practical construction solutions.',
      social: {
        linkedin: '#',
        email: 'marcus@carlingspaces.com'
      }
    },
    {
      id: 4,
      name: 'Isabelle Chen',
      role: 'Construction Manager',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      bio: 'Detail-oriented manager ensuring precision and quality in every construction phase.',
      social: {
        linkedin: '#',
        email: 'isabelle@carlingspaces.com'
      }
    },
    {
      id: 5,
      name: 'David Rodriguez',
      role: 'Site Operations Head',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'Expert in construction operations with 12+ years experience in residential and commercial projects.',
      social: {
        linkedin: '#',
        email: 'david@carlingspaces.com'
      }
    },
    {
      id: 6,
      name: 'Emma Watson',
      role: 'Design & Planning Specialist',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      bio: 'Creative designer transforming concepts into buildable, beautiful architectural plans.',
      social: {
        linkedin: '#',
        email: 'emma@carlingspaces.com'
      }
    },
    {
      id: 7,
      name: 'James Wilson',
      role: 'Quality Control Manager',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      bio: 'Ensures every project meets the highest standards of construction quality and safety.',
      social: {
        linkedin: '#',
        email: 'james@carlingspaces.com'
      }
    },
    {
      id: 8,
      name: 'Lisa Thompson',
      role: 'Client Relations Director',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
      bio: 'Dedicated to providing exceptional client experiences throughout the construction journey.',
      social: {
        linkedin: '#',
        email: 'lisa@carlingspaces.com'
      }
    }
  ];

  // Stats Array - Updated for construction focus
  const stats = [
    { 
      icon: <Building2 className="w-6 h-6" />, 
      number: '500+', 
      label: 'Projects Completed',
      description: 'Successful construction projects'
    },
    { 
      icon: <Users className="w-6 h-6" />, 
      number: '8', 
      label: 'Expert Team Members',
      description: 'Dedicated professionals'
    },
    { 
      icon: <Award className="w-6 h-6" />, 
      number: '15+', 
      label: 'Years Experience',
      description: 'Industry expertise'
    },
    { 
      icon: <ShieldCheck className="w-6 h-6" />, 
      number: '100%', 
      label: 'Client Satisfaction',
      description: 'Quality guaranteed'
    }
  ];

  // Values Array - Updated for construction
  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Precision Building',
      description: 'Meticulous attention to detail in every construction project, ensuring quality and durability.',
      features: ['Quality Materials', 'Expert Craftsmanship', 'Precision Engineering']
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Quality Excellence',
      description: 'Every project meets the highest standards of construction quality and safety regulations.',
      features: ['Rigorous Inspections', 'Safety Compliance', 'Premium Finishes']
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Timely Delivery',
      description: 'We respect deadlines and ensure projects are completed on schedule without compromising quality.',
      features: ['Project Planning', 'Efficient Execution', 'On-Time Completion']
    }
  ];

  // Process Array - Updated for construction
  const processSteps = [
    {
      step: '01',
      title: 'Consultation & Planning',
      description: 'Understand your vision, requirements, and create detailed construction plans.',
      icon: <Search className="w-6 h-6" />
    },
    {
      step: '02',
      title: 'Design & Development',
      description: 'Transform concepts into architectural designs and prepare for construction.',
      icon: <Eye className="w-6 h-6" />
    },
    {
      step: '03',
      title: 'Construction & Delivery',
      description: 'Execute the project with expert craftsmanship and deliver your dream space.',
      icon: <Hammer className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Sophisticated Hero Section with Refined Orange-Blue Scheme */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        
        {/* Subtle Orange Accent Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-600/5"></div>
        
        {/* Geometric Construction Patterns */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-20 left-20 w-40 h-40 border-2 border-orange-400 rounded-lg rotate-45"></div>
          <div className="absolute bottom-40 right-32 w-32 h-32 border-2 border-blue-400 rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-orange-500 rounded-lg rotate-12"></div>
          <div className="absolute bottom-1/4 left-1/3 w-28 h-28 border-2 border-blue-300 rotate-45"></div>
        </div>

        {/* Construction Icons Subtle */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-1/4 left-1/4 text-6xl">🏗️</div>
          <div className="absolute top-1/3 right-1/4 text-5xl">🔨</div>
          <div className="absolute bottom-1/4 left-1/3 text-4xl">🏠</div>
          <div className="absolute bottom-1/3 right-1/3 text-6xl">⚡</div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Elegant Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-sm font-semibold text-white">Building Excellence Since 2010</span>
          </div>

          {/* Clean Typography */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Carling Spaces,
              <span className="block bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                Singing Futures
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed mb-8 font-light">
              <span className="font-semibold text-amber-200">Built on Experience, Driven by Quality.</span>{' '}
              Our team of 8 experts transforms your vision into exceptional living spaces that stand the test of time.
            </p>
          </div>

          {/* Clean CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button 
              onClick={() => navigate('/projects')}
              className="group bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center gap-3 shadow-lg transform hover:scale-105"
            >
              <span>View Our Projects</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => navigate('/contact')}
              className="border-2 border-amber-400 text-amber-400 px-8 py-4 rounded-xl font-semibold hover:bg-amber-400 hover:text-slate-900 transition-all duration-300 backdrop-blur-sm"
            >
              Start Your Project
            </button>
          </div>

          {/* Simple Scroll Indicator */}
          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 text-amber-300/80 mx-auto" />
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute bottom-10 left-10 animate-float">
          <div className="w-4 h-4 bg-amber-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-20 right-20 animate-float delay-1000">
          <div className="w-3 h-3 bg-blue-400 rounded-full opacity-60"></div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Built on Excellence</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              With over 15 years of combined experience, our 8-member team delivers exceptional 
              construction results that exceed expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white hover:from-amber-50 hover:to-white hover:shadow-xl transition-all duration-300 group border border-slate-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-slate-700 mb-2">{stat.label}</div>
                <div className="text-sm text-slate-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Mission Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-amber-600 font-semibold mb-4 uppercase tracking-wide text-sm">Our Mission</div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Building Dreams,
                <span className="block text-amber-600">Creating Legacies</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                At Carling Spaces, we believe every construction project is an opportunity to create 
                something extraordinary. Our mission is to transform your vision into reality with 
                unparalleled craftsmanship, innovative solutions, and unwavering commitment to quality.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-amber-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Quality Guarantee</h3>
                    <p className="text-slate-600 text-sm">Every project backed by our comprehensive quality assurance</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-amber-100">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 flex-shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Innovative Solutions</h3>
                    <p className="text-slate-600 text-sm">Cutting-edge construction techniques and sustainable practices</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <img 
                    src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&h=400&fit=crop" 
                    alt="Modern construction"
                    className="rounded-xl shadow-lg h-48 w-full object-cover border-2 border-white"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&h=300&fit=crop" 
                    alt="Architectural design"
                    className="rounded-xl shadow-lg h-40 w-full object-cover border-2 border-white"
                  />
                </div>
                <div className="space-y-6 pt-12">
                  <img 
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=300&fit=crop" 
                    alt="Luxury home"
                    className="rounded-xl shadow-lg h-40 w-full object-cover border-2 border-white"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=400&fit=crop" 
                    alt="Construction site"
                    className="rounded-xl shadow-lg h-48 w-full object-cover border-2 border-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Team Section with 8 Members */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-amber-600 font-semibold mb-4 uppercase tracking-wide text-sm">Our Expert Team</div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Meet Our 8 Construction Experts</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              A dedicated team of construction professionals, architects, and project managers 
              committed to excellence in every project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="group text-center bg-gradient-to-b from-white to-slate-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-amber-200">
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden shadow-lg border-4 border-white group-hover:border-amber-200 transition-colors duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-amber-600 font-semibold mb-3">{member.role}</p>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
                
                <div className="flex justify-center space-x-4">
                  <a 
                    href={member.social.linkedin} 
                    className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a 
                    href={`mailto:${member.social.email}`}
                    className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 hover:bg-amber-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                    title="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Build Your Vision?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of satisfied clients who trusted Carling Spaces to bring their dreams to life. 
            Your perfect space is just a conversation away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/contact')} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg transform hover:scale-105">
              Start Your Project
            </button>
            <button onClick={() => navigate('/about')} className="border-2 border-amber-400 text-amber-400 px-8 py-4 rounded-xl font-semibold hover:bg-amber-400 hover:text-slate-900 transition-all duration-300">
              Meet Our Full Team
            </button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer/>
    </div>
  );
};

export default AboutPage;