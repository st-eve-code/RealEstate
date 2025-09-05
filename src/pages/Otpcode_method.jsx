import React, { useState } from 'react';
import '../App.css';
import { Mail, MessageCircleIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function Otpcode_method() {
  const [step, setStep] = useState('options');
  const [selectedMethod, setSelectedMethod] = useState('');

  const handleProceed = () => {
    if (!selectedMethod) {
      alert('Please select a method');
      return;
    }
    console.log("Selected method:", selectedMethod);
    setStep('next');
  };

  if (step === 'options') {
    return (
      <section>
        <div className='mx-auto p-2'>
          <div className='mt-[5rem] p-5 bg-white shadow-lg rounded-xl shadow-gray-200 max-w-[28rem] mx-auto'>
            <h1 className='font-Nunito font-bold text-lg text-gray-800 text-center mx-auto'>Select a method of verification</h1>
            <p className='font-Nunito font-medium text-md text-center mx-auto text-gray-600'>Choose a method to receive the verification code</p>

            {/* SMS Option */}
            <div className='flex items-center justify-between p-4'>
              <div className='flex items-center'>
                <MessageCircleIcon size={20} className='size-6 text-gray-500' />
                <div className='ml-4'>
                  <h1 className='font-Nunito font-semibold text-md text-gray-800'>SMS</h1>
                  <p className='font-Nunito font-medium text-md text-gray-500'>Send code by SMS</p>
                </div>
              </div>
              <input
                type="radio"
                name="verification-method"
                value="sms"
                checked={selectedMethod === 'sms'}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className='size-5 bg-white'
              />
            </div>

            {/* Email Option */}
            <div className='flex items-center justify-between p-4'>
              <div className='flex items-center'>
                <Mail size={20} className='size-6 text-gray-500' />
                <div className='ml-4'>
                  <h1 className='font-Nunito font-semibold text-md text-gray-800'>Email</h1>
                  <p className='font-Nunito font-medium text-md text-gray-500'>Send code by email</p>
                </div>
              </div>
              <input
                type="radio"
                name="verification-method"
                value="email"
                checked={selectedMethod === 'email'}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className='size-5 bg-white'
              />
            </div>

            {/* Proceed Button */}
            <button
              type="button"
              onClick={handleProceed}
              className='font-Nunito font-medium text-white text-md bg-blue-600 rounded-lg p-3 w-full mt-8'
            >
              Proceed
            </button>

            {/* Back Link */}
            <Link to="/login">
              <p className='font-Nunito font-medium text-md text-blue-600 text-center mx-auto pt-8 flex items-center justify-center gap-3'>
                <ArrowLeft size={20} />Go back
              </p>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // If a method is selected and user proceeds
  if (step === 'next') {
    return (
      <div className='text-center mt-10'>
        <h1 className='text-xl font-bold'>Selected Method: {selectedMethod}</h1>
        <p>Continue with verification via {selectedMethod === 'sms' ? 'SMS' : 'Email'}</p>
      </div>
    );
  }

  return null;
}

export default Otpcode_method;
