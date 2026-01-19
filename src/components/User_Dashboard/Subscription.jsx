'use client'

import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle, Star, ArrowLeft, AlertCircle } from 'lucide-react';

function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planName, setPlanName] = useState(null);
  const [amountChange, setAmountChange] = useState(null);
  const [stepChange, setStepChange] = useState('step1');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [propertyViews, setPropertyViews] = useState('');
  const [selectedPaymentMethod, setPaymentMethod] = useState('');
  const [redirectLinkStatement, setRedirectLink] = useState('Continue to Payment');
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'failed', or null

  const plans = [
    {
      name: "Basic",
      price: 1000,
      description: "Perfect for individuals looking for a few properties",
      features: [
        "View 4 Properties",
        "Basic Details",
        "Email Support",
        "Standard Photos",
        "Standard live maps"
      ],
      views: 4,
      popular: false
    },
    {
      name: "Starter",
      price: 3000,
      description: "Ideal for users wanting more options",
      features: [
        "View 8 Properties",
        "Enhanced Details",
        "Priority Support",
        "High-Quality Photos",
        "Premium live maps"
      ],
      views: 8,
      popular: true
    },
    {
      name: "Professional",
      price: 5000,
      description: "Best for serious property seekers",
      features: [
        "View 12 Properties",
        "Premium Details",
        "24/7 Support",
        "HD Photos & Videos",
        "Premium live maps"
      ],
      views: 12,
      popular: false
    },
    {
      name: "Enterprise",
      price: 10000,
      description: "Complete solution for extensive searches",
      features: [
        "View 16 Properties",
        "Premium Details",
        "Dedicated Manager",
        "HD Photos & Videos",
        "Premium live maps"
      ],
      views: 16,
      popular: false
    }
  ];

  // Generate transaction ID on component mount
  useEffect(() => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 900 + 100);
    const transId = timestamp.toString().slice(0, 5) + random + '1002105';
    setTransactionId(transId);
  }, []);

  // Data persistence - save to memory
  const [savedData, setSavedData] = useState({});

  useEffect(() => {
    setSavedData({
      selectedPlan,
      planName,
      amountChange,
      propertyViews,
      userName,
      userEmail,
      phoneNumber,
      selectedPaymentMethod,
      stepChange
    });
  }, [selectedPlan, planName, amountChange, propertyViews, userName, userEmail, phoneNumber, selectedPaymentMethod, stepChange]);

  const handlePlanSelect = (name, price, views) => {
    setSelectedPlan(name);
    setPlanName(name);
    setAmountChange(price);
    setPropertyViews(views);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setErrors(prev => ({ ...prev, paymentMethod: '' }));
  };

  const validateStep1 = () => {
    if (!selectedPlan) {
      alert('Please select a plan before continuing');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!userName.trim()) {
      newErrors.userName = 'Username is required';
    } else if (userName.trim().length < 3) {
      newErrors.userName = 'Username must be at least 3 characters';
    }
    
    if (!userEmail.trim()) {
      newErrors.userEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      newErrors.userEmail = 'Please enter a valid email address';
    }
    
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[6-9]\d{8}$/.test(phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 9-digit phone number starting with 6, 7, 8, or 9';
    }
    
    if (!selectedPaymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (!validateStep1()) return;
    
    setIsProcessing(true);
    setRedirectLink('Processing...');
    
    setTimeout(() => {
      setStepChange('step2');
      setIsProcessing(false);
      setRedirectLink('Continue to Payment');
    }, 1500);
  };

  const handleBackToPlans = () => {
    setStepChange('step1');
    setErrors({});
  };

  const handleSubmitOrder = (e) => {
    if (e) e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }
    
    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmPayment = () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    
    // Simulate payment processing with random success/failure
    setTimeout(() => {
      // 80% success rate for demo purposes
      const isSuccess = Math.random() > 0.2;
      
      setIsSubmitting(false);
      
      if (isSuccess) {
        setPaymentStatus('success');
        setStepChange('step3');
      } else {
        setPaymentStatus('failed');
      }
    }, 3000); // 3 second delay to simulate payment processing

    /* 
    ===================================================================
    PAYMENT GATEWAY INTEGRATION SECTION (TO BE IMPLEMENTED)
    ===================================================================
    
    This is where you would integrate with your payment provider:
    - MTN Mobile Money API
    - Orange Money API
    - Other payment gateways
    
    Example implementation structure:
    
    const handlePaymentIntegration = async () => {
      try {
        setIsSubmitting(true);
        
        const paymentData = {
          transactionId: transactionId,
          amount: amountChange,
          phoneNumber: phoneNumber,
          email: userEmail,
          paymentMethod: selectedPaymentMethod,
          planName: planName,
          propertyViews: propertyViews,
          userName: userName
        };
        
        // Call your backend API endpoint
        const response = await fetch('/api/initiate-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_TOKEN'
          },
          body: JSON.stringify(paymentData)
        });
        
        if (!response.ok) {
          throw new Error('Payment initiation failed');
        }
        
        const result = await response.json();
        
        if (result.success) {
          // Payment initiated successfully
          // For MTN/Orange, user will receive USSD prompt on their phone
          setStepChange('step3');
          
          // Optional: Poll for payment confirmation
          checkPaymentStatus(result.paymentId);
        } else {
          // Handle payment error
          setErrors({ payment: result.message || 'Payment failed' });
        }
      } catch (error) {
        console.error('Payment error:', error);
        setErrors({ 
          payment: 'Payment processing failed. Please try again or contact support.' 
        });
      } finally {
        setIsSubmitting(false);
      }
    };
    
    // Optional: Check payment status
    const checkPaymentStatus = async (paymentId) => {
      const maxAttempts = 10;
      let attempts = 0;
      
      const poll = setInterval(async () => {
        attempts++;
        
        try {
          const response = await fetch(`/api/payment-status/${paymentId}`);
          const result = await response.json();
          
          if (result.status === 'completed') {
            clearInterval(poll);
            // Payment confirmed
            console.log('Payment confirmed');
          } else if (result.status === 'failed' || attempts >= maxAttempts) {
            clearInterval(poll);
            setErrors({ payment: 'Payment confirmation timeout' });
          }
        } catch (error) {
          console.error('Status check error:', error);
        }
      }, 3000); // Check every 3 seconds
    };
    
    // Backend API endpoints you'll need to implement:
    // 
    // POST /api/initiate-payment
    // - Validates payment data
    // - Initiates MTN/Orange Money transaction
    // - Returns transaction/payment ID
    // 
    // GET /api/payment-status/:paymentId
    // - Checks current status of payment
    // - Returns: pending, completed, failed
    // 
    // POST /api/confirm-subscription
    // - Activates user subscription after successful payment
    // - Updates user's property view credits
    // - Sends confirmation email
    
    ===================================================================
    */
  };

  const handleStartOver = () => {
    setSelectedPlan(null);
    setPlanName(null);
    setAmountChange(null);
    setPropertyViews('');
    setUserName('');
    setUserEmail('');
    setPhoneNumber('');
    setPaymentMethod('');
    setStepChange('step1');
    setErrors({});
    setTransactionId('');
    setPaymentStatus(null);
    setShowConfirmModal(false);
    
    // Generate new transaction ID
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 900 + 100);
    const transId = timestamp.toString().slice(0, 5) + random + '1002105';
    setTransactionId(transId);
  };

  const handleRetryPayment = () => {
    setPaymentStatus(null);
    setErrors({});
  };

  return (
    <section className="py-6 sm:py-8 min-h-screen bg-gray-50">
      {/* Step 1: Plan Selection */}
      {stepChange === 'step1' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Choose Your Plan
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan for your property search needs. All plans include access to our platform features.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {plans.map((plan, index) => {
              const isSelected = selectedPlan === plan.name;
              const isPopular = plan.popular;

              return (
                <div
                  key={index}
                  className={`relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${
                    isPopular
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl scale-105 border-2 border-blue-500'
                      : isSelected
                      ? 'bg-white shadow-lg border-2 border-blue-500'
                      : 'bg-white shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-300'
                  }`}>
                  
                  {isPopular && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                        <Star size={12} fill="currentColor" />
                        POPULAR
                      </div>
                    </div>
                  )}

                  {isSelected && !isPopular && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                        <CheckCircle size={12} />
                        SELECTED
                      </div>
                    </div>
                  )}

                  <div
                    className={`p-6 rounded-xl m-4 mb-0 ${
                      isPopular ? 'bg-blue-800/40' : 'bg-gray-50'
                    }`}>
                    <h3
                      className={`text-lg font-semibold text-center mb-2 ${
                        isPopular ? 'text-white' : 'text-blue-600'
                      }`}>
                      {plan.name}
                    </h3>
                    <p
                      className={`text-xs text-center mb-4 ${
                        isPopular ? 'text-blue-100' : 'text-gray-600'
                      }`}>
                      {plan.description}
                    </p>
                    <div className="text-center">
                      <span
                        className={`text-3xl sm:text-4xl font-bold ${
                          isPopular ? 'text-white' : 'text-gray-900'
                        }`}>
                        {plan.price.toLocaleString()}
                      </span>
                      <span
                        className={`text-sm ml-1 ${
                          isPopular ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                        FCFA
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          <CheckCircle
                            className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                              isPopular ? 'text-blue-200' : 'text-green-500'
                            }`}
                          />
                          <span
                            className={`text-xs font-medium ${
                              isPopular ? 'text-blue-50' : 'text-gray-700'
                            }`}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => handlePlanSelect(plan.name, plan.price, plan.views)}
                      className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
                        isPopular
                          ? 'bg-white text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg'
                          : isSelected
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                          : 'bg-gray-100 text-gray-800 hover:bg-blue-600 hover:text-white'
                      }`}>
                      {isSelected ? 'Selected' : 'Get Started'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className='flex justify-center mt-16'>
            <button 
              onClick={handleContinueToPayment}
              disabled={isProcessing || !selectedPlan}
              className={`rounded-lg py-2.5 font-medium text-base text-white px-12 flex items-center gap-2 transition-all ${
                isProcessing || !selectedPlan 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-400'
              }`}>
              {isProcessing ? (
                <>
                  <div className="border-2 border-white border-t-transparent animate-spin w-4 h-4 rounded-full"></div>
                  Processing...
                </>
              ) : (
                redirectLinkStatement
              )}
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              ✓ Secure Payment • ✓ Cancel Anytime • ✓ Money-back Guarantee
            </p>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Confirm Payment
              </h3>
              <p className="text-gray-600 text-sm">
                Please review your payment details before proceeding
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-semibold text-gray-900">{planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-green-600">{amountChange} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-semibold text-gray-900">{selectedPaymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone Number:</span>
                <span className="font-semibold text-gray-900">{phoneNumber}</span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-yellow-800 text-xs text-center">
                A payment request will be sent to your {selectedPaymentMethod} account. Please confirm the transaction on your phone to complete the payment.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all">
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-all">
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Processing Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Processing Payment...
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Please check your phone and confirm the payment request
            </p>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-blue-800 text-xs">
                You will receive a prompt on {phoneNumber} to approve this transaction
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Failed Modal */}
      {paymentStatus === 'failed' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Failed
              </h3>
              <p className="text-gray-600 text-sm">
                We couldn't process your payment. This could be due to:
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Insufficient balance in your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Payment request was cancelled or timed out</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Incorrect phone number or payment method</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Network or service provider issues</span>
                </li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-red-800 text-xs text-center">
                <strong>Transaction ID:</strong> {transactionId}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStartOver}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all">
                Start Over
              </button>
              <button
                onClick={handleRetryPayment}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-all">
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Payment Information */}
      {stepChange === 'step2' && (
        <div className="max-w-7xl mx-auto sm:px-4">
          <div className="mb-6">
            <button
              onClick={handleBackToPlans}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
              <ArrowLeft size={20} />
              Back to Plans
            </button>
          </div>

          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Subscription Payment 
            </h2>
            <p className="text-sm font-normal text-gray-600 max-w-2xl mx-auto">
              Fill in the required information in each of the required areas.
            </p>
          </div>

          <div className='grid gap-6 grid-cols-1 lg:grid-cols-12'>
            <div className='bg-white p-6 rounded-lg shadow-md lg:col-span-8'>
              <h2 className="text-lg font-bold text-gray-700 mb-2">
                Select a payment method
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Select the payment method that works best in your country.
              </p>

              <div className='space-y-4 mb-8'>
                <button 
                  type="button"
                  onClick={() => handlePaymentMethodSelect('MTN Mobile Money')} 
                  className={`p-4 w-full font-semibold text-base gap-5 flex justify-between items-center rounded-lg border-2 transition-all ${
                    selectedPaymentMethod === 'MTN Mobile Money' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                  <div className='flex items-center gap-4'>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPaymentMethod === 'MTN Mobile Money' 
                        ? 'border-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedPaymentMethod === 'MTN Mobile Money' && (
                        <div className='w-3 h-3 rounded-full bg-blue-500'></div>
                      )}
                    </div>
                    <h2 className="text-base font-bold text-gray-700">MTN Mobile Money</h2>
                  </div>
                  <div className="bg-yellow-400 px-4 py-2 rounded text-sm font-bold">MTN</div>
                </button>

                <button 
                  type="button"
                  onClick={() => handlePaymentMethodSelect('Orange Mobile Money')} 
                  className={`p-4 w-full font-semibold text-base gap-5 flex justify-between items-center rounded-lg border-2 transition-all ${
                    selectedPaymentMethod === 'Orange Mobile Money' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                  <div className='flex items-center gap-4'>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPaymentMethod === 'Orange Mobile Money' 
                        ? 'border-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedPaymentMethod === 'Orange Mobile Money' && (
                        <div className='w-3 h-3 rounded-full bg-blue-500'></div>
                      )}
                    </div>
                    <h2 className="text-base font-bold text-gray-700">Orange Mobile Money</h2>
                  </div>
                  <div className="bg-orange-500 px-4 py-2 rounded text-sm font-bold text-white">Orange</div>
                </button>
              </div>

              {errors.paymentMethod && (
                <div className="flex items-center gap-2 text-red-600 text-sm mb-4 bg-red-50 p-3 rounded">
                  <AlertCircle size={16} />
                  {errors.paymentMethod}
                </div>
              )}

              <div>
                <h2 className="text-lg font-bold text-gray-700 mb-2">
                  User information
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Fill in your contact details for the subscription.
                </p>
                
                <div className='space-y-5'>
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                    </label>
                    <input 
                      type="text" 
                      id="username" 
                      value={userName}
                      onChange={(e) => {
                        setUserName(e.target.value);
                        setErrors(prev => ({ ...prev, userName: '' }));
                      }}
                      placeholder='Enter username' 
                      className={`w-full py-3 px-4 rounded-lg border ${
                        errors.userName ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.userName && (
                      <p className="text-red-600 text-sm mt-1">{errors.userName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      value={userEmail}
                      onChange={(e) => {
                        setUserEmail(e.target.value);
                        setErrors(prev => ({ ...prev, userEmail: '' }));
                      }}
                      placeholder='Enter your email' 
                      className={`w-full py-3 px-4 rounded-lg border ${
                        errors.userEmail ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.userEmail && (
                      <p className="text-red-600 text-sm mt-1">{errors.userEmail}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input 
                      type="tel" 
                      id="phone" 
                      value={phoneNumber}
                      maxLength={9}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                        if (value.length <= 9) {
                          setPhoneNumber(value);
                          setErrors(prev => ({ ...prev, phoneNumber: '' }));
                        }
                      }}
                      placeholder='Enter 9-digit phone number' 
                      className={`w-full py-3 px-4 rounded-lg border ${
                        errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-600 text-sm mt-1">{errors.phoneNumber}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Format: 6XXXXXXXX or 7XXXXXXXX (9 digits)</p>
                  </div>
                </div>
              </div>
              {/* Security Assurance Section */}
              <div className="mt-8 bg-white border rounded-2xl p-2 lg:p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">Your Data is Protected</h3>
                      <p className="text-xs text-gray-600">Enterprise-grade security</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 bg-green-100 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-green-700">SECURE</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white rounded-xl p-4 border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="text-xs font-bold text-gray-900 text-center">256-bit SSL</p>
                    <p className="text-xs text-gray-500 text-center">Encryption</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <p className="text-xs font-bold text-gray-900 text-center">PCI DSS</p>
                    <p className="text-xs text-gray-500 text-center">Compliant</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <p className="text-xs font-bold text-gray-900 text-center">Data</p>
                    <p className="text-xs text-gray-500 text-center">Privacy</p>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2 mx-auto">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-xs font-bold text-gray-900 text-center">Secure</p>
                    <p className="text-xs text-gray-500 text-center">Storage</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-blue-100">
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                      <span>Verified Secure</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                      <span>GDPR Compliant</span>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span>Bank-level Protection</span>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-lg shadow-md lg:col-span-4 h-fit lg:sticky lg:top-4'>
              <div className='bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-t-lg'>
                <h1 className='font-medium text-base text-white mb-3'>Order Summary</h1>
                <div className='flex justify-between text-white'>
                  <p className='text-sm'>Selected Plan</p>
                  <p className='font-semibold'>{planName}</p>
                </div>
              </div>

              <div className='p-4 space-y-3'>
                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>Transaction ID:</span>
                  <span className='font-semibold text-gray-800 text-xs'>{transactionId}</span>
                </div>

                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>Plan Cost:</span>
                  <span className='font-semibold text-gray-800'>{amountChange} FCFA</span>
                </div>

                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>Payment Method:</span>
                  <span className='font-semibold text-gray-800 text-xs'>{selectedPaymentMethod || 'Not selected'}</span>
                </div>

                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>Property Views:</span>
                  <span className='font-semibold text-gray-800'>{propertyViews}</span>
                </div>

                <hr className='my-4'/>

                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>Username:</span>
                  <span className='font-semibold text-gray-800'>{userName || '-'}</span>
                </div>

                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>Phone:</span>
                  <span className='font-semibold text-gray-800 text-xs'>{phoneNumber || '-'}</span>
                </div>

                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>Email:</span>
                  <span className='font-semibold text-gray-800 text-xs truncate ml-2'>{userEmail || '-'}</span>
                </div>

                <hr className='my-4'/>

                <div className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600'>Processing Fee:</span>
                  <span className='font-semibold text-gray-800'>0.0 FCFA</span>
                </div>

                <div className='flex justify-between items-center'>
                  <span className='text-gray-900 font-semibold'>Total Cost:</span>
                  <span className='font-bold text-xl text-green-600'>{amountChange} FCFA</span>
                </div>

                <button 
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center gap-2 rounded-lg p-3 mt-4 font-medium text-base text-white transition-all ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-500'
                  }`}>
                  {isSubmitting ? (
                    <>
                      <div className="border-2 border-white border-t-transparent animate-spin w-4 h-4 rounded-full"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Order
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    ✓ Secure Payment • ✓ Cancel Anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Success Confirmation */}
      {stepChange === 'step3' && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Subscription Successful!
            </h2>
            
            <p className="text-gray-600 mb-8">
              Thank you for subscribing to our {planName} plan. Your payment has been processed successfully.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-semibold">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-semibold">{planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-semibold text-green-600">{amountChange} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Views:</span>
                  <span className="font-semibold">{propertyViews}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold">{selectedPaymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold">{userEmail}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleStartOver}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-all">
                Start New Subscription
              </button>
              
              <p className="text-sm text-gray-500">
                A confirmation email has been sent to {userEmail}
              </p>
            </div>
          </div>
        </div>
      )}
      
    </section>
  );
}

export default Subscription;