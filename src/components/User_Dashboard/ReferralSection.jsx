'use client'

import React, { useState } from 'react';
import { 
  Users, Copy, Check, Gift, TrendingUp, UserPlus, 
  Calendar, Mail, Phone, Share2, ExternalLink,
  Award, Star, Crown, ChevronRight
} from 'lucide-react';
import { useReferrals } from '../../Hooks/useReferrals';
import { useAuth } from '../../lib/auth-context';

export default function ReferralSection() {
  const { user } = useAuth();
  const {
    referralCode,
    referralLink,
    referredUsers,
    referralCount,
    qualifiedReferrals,
    referredBy,
    loading,
    error,
    needsSetup,
    setupReferral,
    refreshReferrals
  } = useReferrals(user?.uid);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join RentSpot',
          text: `Use my referral code ${referralCode} to join RentSpot and get exclusive benefits!`,
          url: referralLink,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading referral data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-700">Error: {error}</p>
        <button 
          onClick={refreshReferrals}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Setup screen for users without referral data
  if (needsSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-indigo-100">
            {/* Icon and Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Welcome to the Referral Program!
              </h2>
              <p className="text-gray-600 text-lg">
                Set up your referral system to start earning rewards by inviting friends
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-xl">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Get Your Unique Code</h3>
                  <p className="text-sm text-gray-600">Receive a personalized referral code and link to share</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Invite Friends</h3>
                  <p className="text-sm text-gray-600">Share your code with friends and track who joins</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Earn Rewards</h3>
                  <p className="text-sm text-gray-600">Get 100 points for every friend who subscribes to a plan</p>
                </div>
              </div>
            </div>

            {/* Setup Button */}
            <div className="text-center">
              <button
                onClick={setupReferral}
                disabled={loading}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Setting up your referral system...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Activate My Referral Program
                  </span>
                )}
              </button>
              <p className="text-sm text-gray-500 mt-4">
                This will generate your unique referral code instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Referral Program</h2>
            <p className="text-indigo-100">Invite friends and earn rewards together!</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-indigo-200" />
              <span className="text-2xl font-bold">{referralCount}</span>
            </div>
            <p className="text-sm text-indigo-100">Total Referrals</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-5 h-5 text-green-300" />
              <span className="text-2xl font-bold">{qualifiedReferrals}</span>
            </div>
            <p className="text-sm text-indigo-100">Active Subscribers</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="text-2xl font-bold">{qualifiedReferrals * 100}</span>
            </div>
            <p className="text-sm text-indigo-100">Rewards Points</p>
          </div>
        </div>
      </div>

      {/* Referral Code & Link */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-indigo-600" />
          Your Referral Details
        </h3>

        <div className="space-y-4">
          {/* Referral Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Referral Code</label>
            <div className="flex gap-3">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-lg font-semibold text-gray-900">
                {referralCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                {copiedCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copiedCode ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Referral Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Referral Link</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleCopyLink}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                {copiedLink ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copiedLink ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleShare}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Referred By Section */}
      {referredBy && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border border-green-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-green-600" />
            You Were Referred By
          </h3>
          <div className="bg-white rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-lg">{referredBy.name}</p>
              <p className="text-sm text-gray-600">Referral Code: <span className="font-mono font-semibold">{referredBy.code}</span></p>
            </div>
            <Crown className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      )}

      {/* Referred Users List */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Your Referrals ({referralCount})
          </h3>
          <button
            onClick={refreshReferrals}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            Refresh
            <TrendingUp className="w-4 h-4" />
          </button>
        </div>

        {referredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-2">No referrals yet</p>
            <p className="text-sm text-gray-500">Share your referral link to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {referredUsers.map((referredUser) => (
              <div
                key={referredUser.uid}
                className={`p-4 rounded-xl border-2 transition-all ${
                  referredUser.hasSubscription
                    ? 'bg-green-50 border-green-200 hover:shadow-md'
                    : 'bg-gray-50 border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        referredUser.hasSubscription ? 'bg-green-100' : 'bg-gray-200'
                      }`}>
                        <span className="text-lg font-semibold">
                          {referredUser.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{referredUser.displayName}</p>
                        {referredUser.email && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {referredUser.email}
                          </p>
                        )}
                      </div>
                      {referredUser.hasSubscription && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <Award className="w-3 h-3" />
                          Subscribed
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined: {formatDate(referredUser.joinedAt)}
                      </div>
                      {referredUser.hasSubscription && referredUser.subscriptionDate && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          Subscribed: {formatDate(referredUser.subscriptionDate)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border border-blue-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          How Referrals Work
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
              1
            </div>
            <div>
              <p className="font-medium text-gray-900">Share Your Link</p>
              <p className="text-sm text-gray-600">Send your unique referral link or code to friends</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
              2
            </div>
            <div>
              <p className="font-medium text-gray-900">They Sign Up</p>
              <p className="text-sm text-gray-600">Your friend creates an account using your referral code</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
              3
            </div>
            <div>
              <p className="font-medium text-gray-900">Earn Rewards</p>
              <p className="text-sm text-gray-600">Get 100 points when they subscribe to any plan!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
