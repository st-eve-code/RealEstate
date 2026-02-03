import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ReferralInfo, ReferralData } from '../lib/types';
import { removeUndefined } from '../lib/utils/removeUndefined';

interface UseReferralsReturn {
  referralCode: string;
  referralLink: string;
  referredUsers: ReferralInfo[];
  referralCount: number;
  qualifiedReferrals: number;
  referredBy: {
    name: string;
    code: string;
  } | null;
  loading: boolean;
  error: string | null;
  needsSetup: boolean;
  setupReferral: () => Promise<void>;
  refreshReferrals: () => Promise<void>;
}

export function useReferrals(uid: string | undefined): UseReferralsReturn {
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralLink, setReferralLink] = useState<string>('');
  const [referredUsers, setReferredUsers] = useState<ReferralInfo[]>([]);
  const [referralCount, setReferralCount] = useState<number>(0);
  const [qualifiedReferrals, setQualifiedReferrals] = useState<number>(0);
  const [referredBy, setReferredBy] = useState<{ name: string; code: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [needsSetup, setNeedsSetup] = useState<boolean>(false);

  const generateReferralCode = (userId: string, displayName: string): string => {
    // Generate a unique referral code based on user ID and name
    const namePart = displayName.replace(/\s/g, '').substring(0, 4).toUpperCase();
    const idPart = userId.substring(0, 6).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${namePart}${idPart}${randomPart}`;
  };

  const fetchReferrals = async () => {
    if (!uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get user document
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError('User not found');
        setLoading(false);
        return;
      }

      const userData = userSnap.data();
      let referralData: ReferralData | undefined = userData.referralData;

      // If no referral data exists, show setup screen
      if (!referralData || !referralData.referralCode) {
        // But first check if user has referredBy data in referralData
        if (referralData?.referredBy) {
          // User was referred but doesn't have their own referral code yet
          // We'll show setup but preserve referredBy data
          setReferredBy({
            name: referralData.referredByName || 'Unknown User',
            code: referralData.referredByCode || 'N/A',
          });
        }
        setNeedsSetup(true);
        setLoading(false);
        return;
      }

      setNeedsSetup(false);

      setReferralCode(referralData.referralCode);
      
      // Generate referral link (update with your actual domain)
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://realestate-d0818.web.app';
      setReferralLink(`${baseUrl}/signup?ref=${referralData.referralCode}`);

      setReferralCount(referralData.referralCount || 0);
      setQualifiedReferrals(referralData.qualifiedReferrals || 0);

      // Get referrer info if exists
      if (referralData.referredBy && referralData.referredByName && referralData.referredByCode) {
        setReferredBy({
          name: referralData.referredByName,
          code: referralData.referredByCode,
        });
      }

      // Fetch referred users from subcollection
      try {
        const referralsRef = collection(db, 'users', uid, 'referrals');
        const referralsSnap = await getDocs(referralsRef);
        
        const referredUsersDetails: ReferralInfo[] = [];

        for (const refDoc of referralsSnap.docs) {
          const refData = refDoc.data();
          referredUsersDetails.push({
            uid: refDoc.id,
            displayName: refData.displayName || 'Anonymous',
            email: refData.email,
            hasSubscription: refData.hasSubscription || false,
            joinedAt: refData.joinedAt,
            subscriptionDate: refData.subscriptionDate,
          });
        }

        setReferredUsers(referredUsersDetails);
      } catch (err) {
        console.error('Error fetching referrals:', err);
        setReferredUsers([]);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching referrals:', err);
      setError('Failed to load referral data');
      setLoading(false);
    }
  };

  const setupReferral = async () => {
    if (!uid) return;

    try {
      setLoading(true);
      setError(null);

      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError('User not found');
        setLoading(false);
        return;
      }

      const userData = userSnap.data();
      const newCode = generateReferralCode(uid, userData.displayName || 'USER');
      
      // Check if referralData already exists
      const existingReferralData = userData.referralData;
      
      const referralData: ReferralData = {
        referralCode: newCode,
        referralCount: existingReferralData?.referralCount || 0,
        qualifiedReferrals: existingReferralData?.qualifiedReferrals || 0,
        referralRewards: existingReferralData?.referralRewards || 0,
        createdAt: existingReferralData?.createdAt || Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Preserve referredBy information if it exists in referralData or top-level
      if (existingReferralData?.referredBy || userData.referredBy) {
        referralData.referredBy = existingReferralData?.referredBy || userData.referredBy;
        referralData.referredByName = existingReferralData?.referredByName || userData.referredByName;
        referralData.referredByCode = existingReferralData?.referredByCode || userData.referredByCode;
      }

      // Save to Firestore - only update referralData
      await updateDoc(userRef, removeUndefined({ referralData }));

      // Refresh to load the new data
      await fetchReferrals();
    } catch (err) {
      console.error('Error setting up referral:', err);
      setError('Failed to setup referral system');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [uid]);

  return {
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
    refreshReferrals: fetchReferrals,
  };
}
