import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { X, Lock, Crown, TrendingUp, Eye, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { hasReachedViewLimit } from '@/lib/services/viewTrackingService';

interface ViewLimitModalProps {
  show: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

export function ViewLimitModal({ show, onClose, onUpgrade }: ViewLimitModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [limitInfo, setLimitInfo] = useState({ current: 0, limit: 0, reached: false });
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    if (show && user) {
      // No Firestore call needed - user data already in memory!
      const info = hasReachedViewLimit(user);
      setLimitInfo(info);
      
      // Check if user has any subscription (to show "Upgrade" vs "Subscribe")
      setHasSubscription(!!user.transaction);
    }
  }, [show, user]);

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      router.push('/dashboard/subscription');
    }
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Lock size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">View Limit Reached</h2>
              <p className="text-orange-100 text-sm mt-1">
                {hasSubscription 
                  ? "You've reached your plan's viewing limit"
                  : "You've reached your free viewing limit"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Current Usage */}
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Eye size={20} className="text-orange-600" />
                <span className="font-semibold text-orange-900">Current Usage</span>
              </div>
              <span className="text-2xl font-bold text-orange-600">
                {limitInfo.current}/{limitInfo.limit === Infinity ? '∞' : limitInfo.limit}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-orange-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${limitInfo.limit === Infinity ? 0 : Math.min((limitInfo.current / limitInfo.limit) * 100, 100)}%`
                }}
              />
            </div>
            
            <p className="text-xs text-orange-700 mt-2">
              You've viewed {limitInfo.current} properties this period
            </p>
          </div>

          {/* What You're Missing */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <AlertCircle size={18} className="text-red-500" />
              You're Missing Out On:
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-red-500 mt-1">❌</span>
                <span>Viewing more amazing properties that match your needs</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-red-500 mt-1">❌</span>
                <span>Access to exclusive listings and premium features</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-red-500 mt-1">❌</span>
                <span>Finding your perfect home faster</span>
              </li>
            </ul>
          </div>

          {/* Upgrade/Subscribe Benefits */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-200">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
              <Crown size={20} className="text-yellow-500" />
              {hasSubscription ? 'Upgrade to Higher Plan' : 'Subscribe to Premium'}
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Unlimited views</strong> - Browse as many properties as you want</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Priority support</strong> - Get help when you need it</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Save favorites</strong> - Keep track of properties you love</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Advanced filters</strong> - Find exactly what you're looking for</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <TrendingUp size={20} />
              {hasSubscription ? 'Upgrade Now' : 'Subscribe Now'}
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all"
            >
              Maybe Later
            </button>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-center text-gray-500">
            Your current plan allows {limitInfo.limit === Infinity ? 'unlimited' : limitInfo.limit} property views per period.
            {limitInfo.limit !== Infinity && ' Upgrade to view more!'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ViewLimitModal;
