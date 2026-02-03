import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { LastViewedUnit } from '@/lib/types';

interface UseLastViewedUnitsResult {
  units: LastViewedUnit[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch last viewed units for a user from Firestore
 * @param userId - The user's UID
 * @param realtime - Whether to use real-time listeners (default: true)
 * @returns Object containing units array, loading state, error, and refetch function
 */
export function useLastViewedUnits(
  userId: string | undefined,
  realtime: boolean = true
): UseLastViewedUnitsResult {
  const [units, setUnits] = useState<LastViewedUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (!userId) {
      setUnits([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Reference to the LastViewedUnits subcollection
      const unitsRef = collection(db, 'users', userId, 'LastViewedUnits');
      
      // Query to get units ordered by viewedAt (most recent first)
      const q = query(
        unitsRef,
        orderBy('viewedAt', 'desc')
      );

      if (realtime) {
        // Real-time listener
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const unitsData: LastViewedUnit[] = [];
            snapshot.forEach((doc) => {
              unitsData.push({
                id: doc.id,
                ...doc.data()
              } as LastViewedUnit);
            });
            setUnits(unitsData);
            setLoading(false);
            setError(null);
          },
          (err) => {
            console.error('Error fetching last viewed units:', err);
            setError(err.message || 'Failed to fetch viewed units');
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } else {
        // One-time fetch
        getDocs(q)
          .then((snapshot) => {
            const unitsData: LastViewedUnit[] = [];
            snapshot.forEach((doc) => {
              unitsData.push({
                id: doc.id,
                ...doc.data()
              } as LastViewedUnit);
            });
            setUnits(unitsData);
            setLoading(false);
            setError(null);
          })
          .catch((err) => {
            console.error('Error fetching last viewed units:', err);
            setError(err.message || 'Failed to fetch viewed units');
            setLoading(false);
          });
      }
    } catch (err: any) {
      console.error('Error setting up query:', err);
      setError(err.message || 'Failed to setup query');
      setLoading(false);
    }
  }, [userId, realtime, refetchTrigger]);

  return { units, loading, error, refetch };
}
