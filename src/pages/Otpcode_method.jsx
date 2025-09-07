import React, { useState } from 'react';
import '../App.css';
import logo from '../assets/logo.svg';
import { Mail, MessageCircleIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Constants
const VERIFICATION_METHODS = {
  SMS: 'sms',
  EMAIL: 'email'
};

const STEPS = {
  METHOD_SELECTION: 'method-selection',
  CONTACT_INPUT: 'contact-input',
  OTP_CONFIRMATION: 'otp-confirmation'
};

// Validation utilities
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\d{9}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
};

// Method Selection Component
const MethodSelection = ({ selectedMethod, onMethodSelect, onProceed, error }) => (
  <div className='mt-10 min-h-2.5 lg:mt-[5rem] xl:mt-[20rem] p-5 py-10 bg-white shadow-lg rounded-xl shadow-gray-200/40 max-w-[28rem] mx-auto'>
    <h1 className='font-Nunito font-bold text-lg text-gray-800 text-center mx-auto'>
      Select a method of verification
    </h1>
    <p className='font-Nunito font-medium text-md text-center mx-auto text-gray-600'>
      Choose a method to receive the verification code
    </p>

    {error && (
      <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
        <p className='font-Nunito text-sm text-red-600 text-center'>{error}</p>
      </div>
    )}

    {/* SMS Option */}
    <MethodOption
      icon={<MessageCircleIcon size={20} className='size-6 text-gray-500' />}
      title="SMS"
      description="Send code by SMS"
      value={VERIFICATION_METHODS.SMS}
      selectedMethod={selectedMethod}
      onMethodSelect={onMethodSelect}
    />

    {/* Email Option */}
    <MethodOption
      icon={<Mail size={20} className='size-6 text-gray-500' />}
      title="Email"
      description="Send code by email"
      value={VERIFICATION_METHODS.EMAIL}
      selectedMethod={selectedMethod}
      onMethodSelect={onMethodSelect}
    />

    <button
      type="button"
      onClick={onProceed}
      className='font-Nunito font-medium text-white text-md bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg p-3 w-full mt-8'
    >
      Proceed
    </button>

    <BackLink />
  </div>
);

// Method Option Component
const MethodOption = ({ icon, title, description, value, selectedMethod, onMethodSelect }) => (
  <div className='flex items-center justify-between p-4'>
    <div className='flex items-center'>
      {icon}
      <div className='ml-4'>
        <h1 className='font-Nunito font-semibold text-md text-gray-800'>{title}</h1>
        <p className='font-Nunito font-medium text-md text-gray-500'>{description}</p>
      </div>
    </div>
    <input
      type="radio"
      name="verification-method"
      value={value}
      checked={selectedMethod === value}
      onChange={(e) => onMethodSelect(e.target.value)}
      className='size-5 bg-white'
      aria-label={`Select ${title} verification method`}
    />
  </div>
);

// Contact Info Form Component
const ContactInfoForm = ({ method, onSubmit, onGoBack, isLoading, error }) => {
  const [contactValue, setContactValue] = useState('');
  const [validationError, setValidationError] = useState('');

  const isEmail = method === VERIFICATION_METHODS.EMAIL;
  
  const config = {
    [VERIFICATION_METHODS.EMAIL]: {
      label: 'Email',
      type: 'email',
      placeholder: 'your@gmail.com',
      maxLength: 50,
      validator: validateEmail,
      errorMessage: 'Please enter a valid email address'
    },
    [VERIFICATION_METHODS.SMS]: {
      label: 'Phone Number',
      type: 'tel',
      placeholder: '+237-68********4',
      maxLength: 9,
      validator: validatePhone,
      errorMessage: 'Please enter a valid 9-digit phone number'
    }
  };

  const currentConfig = config[method];

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!contactValue.trim()) {
      setValidationError(`${currentConfig.label} is required`);
      return;
    }

    if (!currentConfig.validator(contactValue)) {
      setValidationError(currentConfig.errorMessage);
      return;
    }

    onSubmit(contactValue);
  };

  const handleInputChange = (e) => {
    setContactValue(e.target.value);
    if (validationError) {
      setValidationError('');
    }
  };

  return (
    <div className='max-w-[28rem] shadow-lg shadow-gray-200/40 mx-auto mt-10 py-10 px-4  lg:mt-[10rem] xl:mt-[20rem] bg-white rounded-xl'>
      <img src={logo} alt="logo" className='w-[11rem] py-2 mx-auto' />
      <p className='font-Nunito font-medium text-md pt-2 text-gray-600 text-center'>
        Enter the {isEmail ? 'email' : 'phone number'} associated with your account
      </p>
      
      <form onSubmit={handleSubmit} className='max-w-[25rem] mx-auto py-4'>
        <label htmlFor="contact-input" className='font-Nunito font-semibold text-gray-800 text-md'>
          {currentConfig.label}
        </label>
        <br />
        
        <input
          type={currentConfig.type}
          name="contact-input"
          id="contact-input"
          value={contactValue}
          onChange={handleInputChange}
          maxLength={currentConfig.maxLength}
          placeholder={currentConfig.placeholder}
          autoComplete={isEmail ? 'email' : 'tel'}
          disabled={isLoading}
          className={`mb-1 text-gray-700 mt-2 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border ${
            validationError || error ? 'border-red-300' : 'border-gray-300'
          } disabled:bg-gray-50 disabled:cursor-not-allowed`}
          aria-describedby={validationError || error ? 'contact-error' : undefined}
        />
        
        {(validationError || error) && (
          <p id="contact-error" className='font-Nunito text-sm text-red-600 mt-1'>
            {validationError || error}
          </p>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className='font-Nunito font-medium text-lg h-12 rounded-md mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white transition-colors'
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
        
        {/* back button to go back to method selection */}
        <button
          type="button"
          onClick={onGoBack}
          className='font-Nunito font-medium text-md text-blue-600 hover:text-blue-700 transition-colors text-center mx-auto pt-8 flex items-center justify-center gap-3 w-full bg-transparent border-none cursor-pointer'
        >
          <ArrowLeft size={20} />Go back to method selection
        </button>
      </form>
    </div>
  );
};

// OTP Confirmation Component
const OtpConfirmation = ({ method, contactInfo, onGoBack, onResend, onProceed, isLoading, isVerifying }) => {
  const [otpValues, setOtpValues] = useState(['', '', '', '', '']);
  const [error, setError] = useState('');
  
  const isEmail = method === VERIFICATION_METHODS.EMAIL;

  const handleInputChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      setError('');

      // Auto-focus next input
      if (value && index < 4) {
        const nextInput = document.getElementById(`key${index + 2}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`key${index}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = () => {
    const otpCode = otpValues.join('');
    if (otpCode.length !== 5) {
      setError('Please enter all 5 digits');
      return;
    }
    onProceed(otpCode);
  };

  return (
    <div className='mt-[5rem] m-5 p-5 py-10 xl:mt-[20rem] bg-white shadow-lg rounded-xl shadow-gray-200/40 max-w-[28rem] mx-auto'>
      <h1 className='font-Nunito font-bold text-lg text-gray-800 text-center mx-auto'>
        Verify OTP Code
      </h1>
      <p className='font-Nunito font-medium text-md text-center mx-auto text-gray-600'>
        Enter the OTP verification code sent to you through {isEmail ? 'email' : 'SMS'}
      </p>
      <p className='font-Nunito font-medium text-sm text-center mx-auto text-gray-500 mt-2'>
        Code sent to: {contactInfo}
      </p>

      {error && (
        <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
          <p className='font-Nunito text-sm text-red-600 text-center'>{error}</p>
        </div>
      )}

      <div className='flex flex-wrap justify-evenly items-center mt-4'>
        {[1, 2, 3, 4, 5].map((num, index) => (
          <input
            key={num}
            type="text"
            name={`key${num}`}
            id={`key${num}`}
            value={otpValues[index]}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            placeholder='*'
            maxLength="1"
            disabled={isVerifying}
            className={`bg-white shadow-md shadow-gray-200 max-w-[3rem] rounded-lg h-10 font-medium font-Nunito text-md text-gray-600 text-center outline-blue-400 border border-gray-300 ${
              isVerifying ? 'bg-gray-50 cursor-not-allowed' : ''
            }`}
          />
        ))}
      </div>

      <button 
        type="button" 
        onClick={onResend}
        disabled={isLoading || isVerifying}
        className='font-Nunito font-medium text-sm text-blue-600 hover:text-blue-700 disabled:text-blue-400 transition-colors text-center mx-auto pt-8 bg-transparent border-none cursor-pointer w-full'
      >
        {isLoading ? 'Resending...' : "Didn't receive the code? Resend"}
      </button>

      <button 
        type="button" 
        onClick={handleSubmit}
        disabled={isVerifying}
        className='font-Nunito font-medium text-white text-md bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors rounded-lg p-3 w-full mt-4'
      >
        {isVerifying ? 'Processing...' : 'Proceed'}
      </button>

      <button
        type="button"
        onClick={onGoBack}
        disabled={isVerifying}
        className='font-Nunito font-medium text-md text-blue-600 hover:text-blue-700 disabled:text-blue-400 transition-colors text-center mx-auto pt-4 flex items-center justify-center gap-3 w-full bg-transparent border-none cursor-pointer'
      >
        <ArrowLeft size={20} />Go back
      </button>
    </div>
  );
};

// Back Link Component
const BackLink = () => (
  <Link to="/login">
    <p className='font-Nunito font-medium text-md text-blue-600 hover:text-blue-700 transition-colors text-center mx-auto pt-8 flex items-center justify-center gap-3'>
      <ArrowLeft size={20} />Go back
    </p>
  </Link>
);

// Main Component
function OtpVerificationMethod() {
  const [currentStep, setCurrentStep] = useState(STEPS.METHOD_SELECTION);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setError('');
  };

  const handleProceed = () => {
    if (!selectedMethod) {
      setError('Please select a verification method');
      return;
    }
    
    console.log("Selected method:", selectedMethod);
    setCurrentStep(STEPS.CONTACT_INPUT);
  };

  const handleContactSubmit = async (contactValue) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Store contact info for OTP screen
      setContactInfo(contactValue);
      
      // Simulate API call
      console.log(`Sending verification code via ${selectedMethod} to:`, contactValue);
      
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Moving to OTP confirmation step');
      
      // On success, move to OTP confirmation step
      setCurrentStep(STEPS.OTP_CONFIRMATION);
      
    } catch (err) {
      console.error('Error sending verification code:', err);
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToMethodSelection = () => {
    console.log('Going back to method selection');
    setCurrentStep(STEPS.METHOD_SELECTION);
    setError('');
  };

  const handleBackToContactInput = () => {
    console.log('Going back to contact input');
    setCurrentStep(STEPS.CONTACT_INPUT);
    setError('');
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      console.log(`Resending verification code via ${selectedMethod} to:`, contactInfo);
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('OTP resent successfully');
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (otpCode) => {
    setIsVerifying(true);
    setError('');
    
    try {
      console.log('OTP Code entered:', otpCode);
      console.log('Verifying OTP...');
      
      // Simulate OTP verification API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demonstration purposes, let's simulate both success and failure scenarios
      // You can replace this with actual API validation logic
      const isValidOtp = otpCode === '12345'; // Example: only '12345' is valid
      
      if (isValidOtp) {
        console.log('OTP verification successful');
        // Handle successful verification
        // Example: navigate to dashboard or show success message
        // navigate('/dashboard');
        alert('OTP verification successful! Redirecting...');
      } else {
        console.log('OTP verification failed');
        setError('Invalid OTP code. Please try again.');
      }
      
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section>
      <div className='mx-auto p-2'>
        {currentStep === STEPS.METHOD_SELECTION && (
          <MethodSelection
            selectedMethod={selectedMethod}
            onMethodSelect={handleMethodSelect}
            onProceed={handleProceed}
            error={error}
          />
        )}
        
        {currentStep === STEPS.CONTACT_INPUT && (
          <ContactInfoForm
            method={selectedMethod}
            onSubmit={handleContactSubmit}
            onGoBack={handleBackToMethodSelection}
            isLoading={isLoading}
            error={error}
          />
        )}

        {currentStep === STEPS.OTP_CONFIRMATION && (
          <OtpConfirmation
            method={selectedMethod}
            contactInfo={contactInfo}
            onGoBack={handleBackToContactInput}
            onResend={handleResendOtp}
            onProceed={handleOtpSubmit}
            isLoading={isLoading}
            isVerifying={isVerifying}
          />
        )}
        {currentStep === STEPS.RESET_PASSWORD && (
          <ResetPassword
            onGoBack={handleBackToOtpConfirmation}
            onPasswordReset={handlePasswordReset}
            isLoading={isPasswordResetting}
          />
        )}
      </div>
    </section>
  );
}

export default OtpVerificationMethod;