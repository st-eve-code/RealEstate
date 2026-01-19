import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Custom hook to fetch caretaker dashboard statistics
 * @param {string} userId - The caretaker's user ID
 * @returns {Object} Statistics and loading state
 */
export function useCaretakerStats(userId) {
  const [stats, setStats] = useState({
    totalProperties: 0,
    occupiedUnits: 0,
    vacantUnits: 0,
    totalUnits: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalViews: 0,
    activeListings: 0,
    pendingRequests: 0,
    occupancyRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch properties owned by this caretaker
        const propertiesRef = collection(db, 'properties');
        const propertiesQuery = query(propertiesRef, where('ownerId', '==', userId));
        const propertiesSnapshot = await getDocs(propertiesQuery);
        
        const properties = propertiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Calculate stats from properties
        let totalUnits = 0;
        let occupiedUnits = 0;
        let vacantUnits = 0;
        let totalViews = 0;
        let totalRevenue = 0;
        let activeListings = 0;

        properties.forEach(property => {
          // Count units
          const units = property.units || [];
          totalUnits += units.length;
          
          units.forEach(unit => {
            if (unit.status === 'occupied') {
              occupiedUnits++;
              totalRevenue += unit.rent || 0;
            } else if (unit.status === 'vacant') {
              vacantUnits++;
            }
          });

          // Count views
          totalViews += property.views || 0;

          // Count active listings
          if (property.status === 'active' || property.isActive) {
            activeListings++;
          }
        });

        // Calculate occupancy rate
        const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;

        // Fetch pending requests (maintenance, tenant applications, etc.)
        const requestsRef = collection(db, 'requests');
        const requestsQuery = query(
          requestsRef, 
          where('propertyOwnerId', '==', userId),
          where('status', '==', 'pending')
        );
        const requestsCount = await getCountFromServer(requestsQuery);

        setStats({
          totalProperties: properties.length,
          occupiedUnits,
          vacantUnits,
          totalUnits,
          totalRevenue,
          monthlyRevenue: totalRevenue, // Same as total for now
          totalViews,
          activeListings,
          pendingRequests: requestsCount.data().count,
          occupancyRate: Math.round(occupancyRate),
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching caretaker stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  return { stats, loading, error };
}

/**
 * Custom hook to fetch caretaker's properties
 * @param {string} userId - The caretaker's user ID
 * @returns {Object} Properties array and loading state
 */
export function useCaretakerProperties(userId) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProperties = async () => {
      try {
        setLoading(true);
        const propertiesRef = collection(db, 'properties');
        const propertiesQuery = query(propertiesRef, where('ownerId', '==', userId));
        const snapshot = await getDocs(propertiesQuery);
        
        const propertiesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setProperties(propertiesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [userId]);

  return { properties, loading, error };
}

/**
 * Custom hook to fetch recent activities for caretaker
 * @param {string} userId - The caretaker's user ID
 * @param {number} limit - Number of activities to fetch
 * @returns {Object} Activities array and loading state
 */
export function useCaretakerActivities(userId, limit = 5) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchActivities = async () => {
      try {
        setLoading(true);
        
        // Fetch activities from activity log collection
        const activitiesRef = collection(db, 'activityLogs');
        const activitiesQuery = query(
          activitiesRef,
          where('userId', '==', userId),
          // orderBy('timestamp', 'desc'),
          // limit(limit)
        );
        
        const snapshot = await getDocs(activitiesQuery);
        const activitiesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setActivities(activitiesData.slice(0, limit));
        setError(null);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userId, limit]);

  return { activities, loading, error };
}
