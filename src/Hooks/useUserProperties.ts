import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Unit } from '../lib/types';

interface UseUserPropertiesReturn {
  likedProperties: Unit[];
  savedProperties: Unit[];
  allProperties: Unit[];
  loading: boolean;
  error: string | null;
  refreshProperties: () => Promise<void>;
}

export function useUserProperties(uid: string | undefined): UseUserPropertiesReturn {
  const [likedProperties, setLikedProperties] = useState<Unit[]>([]);
  const [savedProperties, setSavedProperties] = useState<Unit[]>([]);
  const [allProperties, setAllProperties] = useState<Unit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    if (!uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get user document to retrieve liked and saved arrays
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setError('User not found');
        setLoading(false);
        return;
      }

      const userData = userSnap.data();
      const likedIds = userData.liked || [];
      const savedIds = userData.saved || [];

      // Fetch all approved properties for browsing
      const unitsRef = collection(db, 'units');
      const allPropsQuery = query(
        unitsRef,
        where('status', '==', 'approved'),
        where('available', '==', true),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const allPropsSnap = await getDocs(allPropsQuery);
      const allProps = allPropsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Unit));
      setAllProperties(allProps);

      // Filter liked properties
      const liked = allProps.filter(prop => likedIds.includes(prop.id));
      setLikedProperties(liked);

      // If liked properties don't cover all liked IDs, fetch remaining
      if (liked.length < likedIds.length) {
        const missingLikedIds = likedIds.filter((id: string) => !liked.some(p => p.id === id));
        for (const id of missingLikedIds) {
          const unitRef = doc(db, 'units', id);
          const unitSnap = await getDoc(unitRef);
          if (unitSnap.exists()) {
            liked.push({ id: unitSnap.id, ...unitSnap.data() } as Unit);
          }
        }
        setLikedProperties(liked);
      }

      // Filter saved properties
      const saved = allProps.filter(prop => savedIds.includes(prop.id));
      setSavedProperties(saved);

      // If saved properties don't cover all saved IDs, fetch remaining
      if (saved.length < savedIds.length) {
        const missingSavedIds = savedIds.filter((id: string) => !saved.some(p => p.id === id));
        for (const id of missingSavedIds) {
          const unitRef = doc(db, 'units', id);
          const unitSnap = await getDoc(unitRef);
          if (unitSnap.exists()) {
            saved.push({ id: unitSnap.id, ...unitSnap.data() } as Unit);
          }
        }
        setSavedProperties(saved);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [uid]);

  return {
    likedProperties,
    savedProperties,
    allProperties,
    loading,
    error,
    refreshProperties: fetchProperties,
  };
}
