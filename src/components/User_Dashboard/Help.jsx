'use client'

import React from 'react';
import { MessageCircle, Mail, Phone, HelpCircle, ArrowRight, Sparkles, Headphones, Clock, CheckCircle } from 'lucide-react';

function HelpSection() {
  const handleRedirect = () => {
    // In your actual app, use: router.push('/contact') or window.location.href = '/contact'
    console.log('Redirecting to /contact');
    alert('Redirecting to /contact page...');
  };

  const quickHelp = [
    {
      icon: HelpCircle,
      title: "FAQs",
      description: "Quick answers to common questions",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with support",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      color: "from-orange-500 to-red-500"
    }
  ];

  const features = [
    "24/7 Customer Support",
    "Average 2-minute response time",
    "Expert assistance available",
    "Multilingual support team"
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
            <Sparkles size={16} />
            <span>We're Here to Help</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-6">
            Need Assistance?
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Our dedicated support team is ready to help you with any questions or concerns. 
            Get the help you need, when you need it.
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {quickHelp.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main CTA Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-3xl shadow-2xl p-1 mb-16">
          <div className="bg-white rounded-[22px] p-8 sm:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              
              {/* Left Content */}
              <div>
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                  <Headphones size={16} />
                  <span>Premium Support</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Ready to Get Started?
                </h2>
                
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Contact our support team and experience exceptional service. 
                  We're committed to providing you with fast, friendly, and effective solutions.
                </p>

                <div className="space-y-3 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={14} className="text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleRedirect}
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <span>Contact Support Now</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Right Content - Decorative */}
              <div className="hidden lg:block relative">
                <div className="relative">
                  {/* Floating Cards Animation */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl opacity-20 blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl opacity-20 blur-3xl animate-pulse delay-1000"></div>
                  
                  {/* Feature Cards */}
                  <div className="relative space-y-4">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock size={24} className="text-white" />
                        <span className="text-white font-bold">Fast Response</span>
                      </div>
                      <p className="text-purple-100 text-sm">Get answers within minutes, not hours</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-6 rounded-2xl shadow-xl transform -rotate-3 hover:rotate-0 transition-transform">
                      <div className="flex items-center gap-3 mb-2">
                        <MessageCircle size={24} className="text-white" />
                        <span className="text-white font-bold">Always Available</span>
                      </div>
                      <p className="text-blue-100 text-sm">Round-the-clock support when you need it</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-6 rounded-2xl shadow-xl transform rotate-2 hover:rotate-0 transition-transform">
                      <div className="flex items-center gap-3 mb-2">
                        <Headphones size={24} className="text-white" />
                        <span className="text-white font-bold">Expert Team</span>
                      </div>
                      <p className="text-green-100 text-sm">Trained professionals ready to assist</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
              <Mail size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 text-sm mb-3">Drop us an email anytime</p>
            <p className="text-purple-600 font-semibold">support@yourcompany.com</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-blue-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
              <Phone size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 text-sm mb-3">Speak with our team directly</p>
            <p className="text-blue-600 font-semibold">+237 XXX XXX XXX</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border border-green-100 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <Clock size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Working Hours</h3>
            <p className="text-gray-600 text-sm mb-3">We're available 24/7</p>
            <p className="text-green-600 font-semibold">Monday - Sunday, All Day</p>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            ✓ Trusted by 10,000+ customers • ✓ 98% satisfaction rate • ✓ Average 4.9/5 rating
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
}

export default HelpSection;