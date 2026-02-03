'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, AlertCircle, CheckCircle, ArrowRight, User } from 'lucide-react'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth-context'
import type { Transaction, Plan, Subscription } from '@/lib/types'
import { unde_find } from '@/lib/utils/filter'

function PaymentPageContent() {
  const router = useRouter()
  const params = useParams()
  const planId = params.id as string
  const { user } = useAuth()
  
  // Plan details from Firestore
  const [plan, setPlan] = useState<any>(null)
  const [loadingPlan, setLoadingPlan] = useState(true)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false)
  
  const [userName, setUserName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [selectedPaymentMethod, setPaymentMethod] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | null>(null)

  // Fetch plan from Firestore and check for active subscription
  useEffect(() => {
    const fetchPlanAndCheckSubscription = async () => {
      try {
        setLoadingPlan(true)
        
        // Fetch plan details
        const planRef = doc(db, 'plans', planId)
        const planSnap = await getDoc(planRef)
        
        if (planSnap.exists()) {
          const planData = planSnap.data()
          setPlan({
            id: planSnap.id,
            name: planData.name,
            price: planData.price,
            views: planData.constraints?.viewLimits || 999
          })
        } else {
          router.push('/dashboard/subscription')
          return
        }

        // Check if user has an active subscription
        if (user) {
          const userRef = doc(db, 'users', user.uid)
          const userSnap = await getDoc(userRef)
          
          if (userSnap.exists()) {
            const userData = userSnap.data()
            // const currentSubscription = userData.transaction?.subscription
            
            // Check if subscription exists and hasn't expired
            if (userData.transaction && userData.transaction.expiresAt) {
              const expiryDate = (userData.transaction.expiresAt as Timestamp).toDate()
              const now = Timestamp.now().toDate(); // server date as users can change device date
              
              if (expiryDate > now) {
                setHasActiveSubscription(true)
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching plan:', error)
        router.push('/dashboard/subscription')
      } finally {
        setLoadingPlan(false)
      }
    }

    if (planId && user) {
      fetchPlanAndCheckSubscription()
    }
  }, [planId, user, router])

  // Generate transaction ID on component mount
  useEffect(() => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 900 + 100)
    const transId = timestamp.toString().slice(0, 5) + random + '1002105'
    setTransactionId(transId)
  }, [])

  const handlePaymentMethodSelect = (method: string) => {
    setPaymentMethod(method)
    setErrors(prev => ({ ...prev, paymentMethod: '' }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!userName.trim()) {
      newErrors.userName = 'Username is required'
    } else if (userName.trim().length < 3) {
      newErrors.userName = 'Username must be at least 3 characters'
    }
    
    if (!userEmail.trim()) {
      newErrors.userEmail = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      newErrors.userEmail = 'Please enter a valid email address'
    }
    
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^[6-9]\d{8}$/.test(phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 9-digit phone number starting with 6, 7, 8, or 9'
    }
    
    if (!selectedPaymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBackToPlans = () => {
    router.push('/dashboard/subscription')
  }

  const handleSubmitOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // If user has active subscription, show overwrite warning first
    if (hasActiveSubscription) {
      setShowOverwriteWarning(true)
    } else {
      setShowConfirmModal(true)
    }
  }

  const handleProceedWithOverwrite = () => {
    setShowOverwriteWarning(false)
    setShowConfirmModal(true)
  }

  const handleConfirmPayment = async () => {
    setShowConfirmModal(false)
    setIsSubmitting(true)
    
    try {
      // Request payment from MTN MoMo
      const response = await fetch('/api/payment/mtn/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          amount: price,
          currency: 'XAF',
          externalId: transactionId,
          payerMessage: `Payment for ${planName}`,
          payeeNote: 'Thank you for your subscription',
        }),
      })

      const result = await response.json()

      if (result.success && result.referenceId) {
        // Payment request sent, now poll for status
        pollPaymentStatus(result.referenceId)
      } else {
        // Payment request failed
        setIsSubmitting(false)
        setPaymentStatus('failed')
        // Save failed transaction
        await saveTransaction('failed', transactionId, result.message || 'Payment request failed')
        alert(result.message || 'Payment request failed. Please try again.')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setIsSubmitting(false);
      setPaymentStatus('failed')
      // Save failed transaction due to network error
      await saveTransaction('failed', transactionId, 'Network error during payment request')
      alert('An error occurred. Please check your internet connection and try again.')
    }
  }

  const saveTransaction = async (status: 'paid' | 'failed', mtnReferenceId: string, failureReason?: string) => {
    try {
      if (!user) {
        console.error('User not authenticated')
        return
      }

      // Calculate expiry date based on plan duration
      const now = Timestamp.now()
      const expiresAt = Timestamp.fromMillis(
        now.toMillis() + (plan?.duration || 1 * 24 * 60 * 60 * 1000) // Default 30 days
      )

      // Create subscription object
      const subscription: Subscription = unde_find({
        amount: price,
        plan: plan as Plan,
        viewed: 0, // Initialize view count to 0
        listed: 0, // Initialize view count to 0
        liked: 0, // Initialize view count to 0
        saved: 0, // Initialize view count to 0
        reported: 0, // Initialize view count to 0
        reviewed: 0, // Initialize view count to 0
        createdAt: now,
        expiresAt: expiresAt,
      })

      // Create payment object (MTN MoMo)
      const payment = unde_find({
        id: transactionId,
        user: {
          name: userName || user.displayName || 'Unknown',
          email: userEmail || user.email || 'unknown@email.com',
        },
        operator: selectedPaymentMethod === 'MTN Mobile Money' ? 'MTN' : 'Orange' as 'MTN' | 'Orange',
        transactionId: mtnReferenceId,
        phoneNumber: phoneNumber,
        createdAt: now,
        paymentType: 'momo' as const,
      })

      // Create transaction document
      const transaction: Transaction = unde_find({
        id: transactionId,
        uid: user.uid,
        userName: userName || user.displayName || 'Unknown',
        subscription: subscription,
        type: 'subscription',
        payment: payment,
        paid: status === 'paid' ? price : 0,
        createdAt: now,
        expiresAt: expiresAt,
        status: status,
        reason: failureReason,
      })

      // Save to Firestore
      const transactionRef = doc(db, `users/${user.uid}/Transactions`, transactionId)
      await setDoc(transactionRef, transaction)

      console.log(`Transaction ${transactionId} saved with status: ${status}`)

      // If successful, also update user's subscription
      if (status === 'paid') {
        const userRef = doc(db, 'users', user.uid)
        await setDoc(userRef, unde_find({
          transaction: transaction,
          currentSubscription: subscription,
          lastTransactionId: transactionId,
          updatedAt: now,
        }), { merge: true })

        console.log(`User ${user.uid} subscription updated`)
      }
    } catch (error) {
      console.error('Error saving transaction:', error)
      // Don't throw error - we still want to show success/failure to user
    }
  }

  const pollPaymentStatus = async (referenceId: string) => {
    let attempts = 0
    const maxAttempts = 20 // Poll for up to 100 seconds (20 * 5s)

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/payment/mtn/status/${referenceId}`)
        const result = await response.json()

        if (result.status === 'SUCCESSFUL') {
          setIsSubmitting(false)
          setPaymentStatus('success')
          // Save successful transaction to Firestore
          await saveTransaction('paid', referenceId)
        } else if (result.status === 'FAILED') {
          setIsSubmitting(false)
          setPaymentStatus('failed')
          // Save failed transaction to Firestore
          await saveTransaction('failed', referenceId, result.reason)
        } else if (result.status === 'PENDING') {
          attempts++
          if (attempts < maxAttempts) {
            // Continue polling
            setTimeout(checkStatus, 5000) // Check every 5 seconds
          } else {
            // Timeout
            setIsSubmitting(false)
            setPaymentStatus('failed')
            // Save failed transaction due to timeout
            await saveTransaction('failed', referenceId, 'Payment request timed out')
            alert('Payment request timed out. Please check your phone and try again.')
          }
        }
      } catch (error) {
        console.error('Status check error:', error)
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000)
        } else {
          setIsSubmitting(false)
          setPaymentStatus('failed')
          // Save failed transaction due to network error during status check
          await saveTransaction('failed', referenceId, 'Status check failed after multiple attempts')
        }
      }
    }

    checkStatus()
  }

  const handleRetryPayment = () => {
    setPaymentStatus(null)
    setErrors({})
  }

  const handleStartOver = () => {
    router.push('/dashboard/subscription')
  }

  const handleAutoFillUserInfo = () => {
    if (user) {
      setUserName(user.displayName || user.email?.split('@')[0] || '')
      setUserEmail(user.email || '')
      // Clear errors when auto-filling
      setErrors(prev => ({ 
        ...prev, 
        userName: '', 
        userEmail: '' 
      }))
    }
  }

  if (loadingPlan) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plan details...</p>
        </div>
      </div>
    )
  }

  if (!plan) {
    return null
  }

  const { name: planName, price, views } = plan

  return (
    <section className="py-6 sm:py-8 min-h-screen bg-gray-50">
      {/* Success Modal */}
      {paymentStatus === 'success' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8 text-center">
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
                  <span className="font-semibold text-green-600">{price} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Views:</span>
                  <span className="font-semibold">{views}</span>
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
                Back to Subscriptions
              </button>
              
              <p className="text-sm text-gray-500">
                A confirmation email has been sent to {userEmail}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Failed Modal */}
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

      {/* Overwrite Warning Modal */}
      {showOverwriteWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ⚠️ Active Subscription Detected
              </h3>
              <p className="text-gray-600 text-sm">
                You already have an active subscription
              </p>
            </div>

            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-5 mb-6">
              <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                <AlertCircle size={18} />
                Important Notice
              </h4>
              <ul className="space-y-2 text-sm text-orange-800">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5 font-bold">•</span>
                  <span><strong>Your current subscription will be replaced</strong> with the new plan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5 font-bold">•</span>
                  <span><strong>This action is irreversible</strong> and cannot be undone</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5 font-bold">•</span>
                  <span><strong>No refund</strong> will be issued for the remaining time on your current subscription</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-0.5 font-bold">•</span>
                  <span>The new subscription will start immediately upon successful payment</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
              <p className="text-gray-700 mb-2">
                <strong>New Plan:</strong> {planName} - {price} FCFA
              </p>
              <p className="text-gray-600 text-xs">
                By proceeding, you acknowledge that you have read and understand this warning, and agree to the terms outlined in our <a href="/terms" className="text-blue-600 underline">Terms of Use</a>.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowOverwriteWarning(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-all">
                Cancel
              </button>
              <button
                onClick={handleProceedWithOverwrite}
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 px-4 rounded-lg transition-all">
                I Understand, Proceed
              </button>
            </div>
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
                <span className="font-semibold text-green-600">{price} FCFA</span>
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
                {selectedPaymentMethod === 'MTN Mobile Money' 
                  ? `A payment request will be sent to ${phoneNumber}. Please check your phone and enter your MTN Mobile Money PIN to confirm the transaction.`
                  : selectedPaymentMethod === 'Orange Mobile Money'
                  ? `A payment request will be sent to ${phoneNumber}. Please check your phone and enter your Orange Money PIN to confirm the transaction.`
                  : `A payment request will be sent to your ${selectedPaymentMethod} account. Please confirm the transaction on your phone to complete the payment.`
                }
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

      {/* Payment Form */}
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
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      User Name *
                    </label>
                    {user && (
                      <button
                        type="button"
                        onClick={handleAutoFillUserInfo}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        <User size={14} />
                        Use My Info
                      </button>
                    )}
                  </div>
                  <input 
                    type="text" 
                    id="username" 
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value)
                      setErrors(prev => ({ ...prev, userName: '' }))
                    }}
                    placeholder='Enter user id' 
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
                      setUserEmail(e.target.value)
                      setErrors(prev => ({ ...prev, userEmail: '' }))
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
                      const value = e.target.value.replace(/\D/g, '')
                      if (value.length <= 9) {
                        setPhoneNumber(value)
                        setErrors(prev => ({ ...prev, phoneNumber: '' }))
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

            {/* Security Assurance */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
                <h3 className="text-base font-bold text-gray-900">Secure Payment Guaranteed</h3>
              </div>
              <p className="text-sm text-gray-600">
                Your payment information is encrypted and secure. We never store your payment details.
              </p>
            </div>
          </div>

          {/* Order Summary */}
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
                <span className='font-semibold text-gray-800'>{price} FCFA</span>
              </div>

              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-600'>Payment Method:</span>
                <span className='font-semibold text-gray-800 text-xs'>{selectedPaymentMethod || 'Not selected'}</span>
              </div>

              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-600'>Property Views:</span>
                <span className='font-semibold text-gray-800'>{views}</span>
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
                <span className='font-bold text-xl text-green-600'>{price} FCFA</span>
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
    </section>
  )
}

export default function PaymentPage() {
  return <PaymentPageContent />
}
