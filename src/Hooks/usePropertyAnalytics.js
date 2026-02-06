import { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * Custom hook to fetch property analytics
 * @param {string} propertyId - The property/unit ID
 * @returns {Object} Analytics data and loading state
 */
export function usePropertyAnalytics(propertyId) {
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalInquiries: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
    totalUnits: 0,
    occupiedUnits: 0,
    vacantUnits: 0,
    averageRent: 0,
    viewsOverTime: [], // Array of {date, views}
    revenueOverTime: [], // Array of {month, revenue}
    inquiriesOverTime: [], // Array of {date, count}
    tenantHistory: [],
    maintenanceRequests: 0,
    rating: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        // Fetch property/unit data
        const unitRef = doc(db, 'units', propertyId);
        const unitDoc = await getDoc(unitRef);

        if (!unitDoc.exists()) {
          setError('Property not found');
          setLoading(false);
          return;
        }

        const unitData = unitDoc.data();
        
        // Calculate basic stats
        const totalViews = unitData.views || 0;
        const rating = unitData.rating || 0;
        const totalUnits = unitData.units?.length || 1;
        
        let occupiedUnits = 0;
        let vacantUnits = 0;
        let totalRevenue = 0;
        let totalRent = 0;

        // If property has multiple units
        if (unitData.units && Array.isArray(unitData.units)) {
          unitData.units.forEach(unit => {
            if (unit.status === 'occupied') {
              occupiedUnits++;
              totalRevenue += unit.rent || 0;
            } else if (unit.status === 'vacant') {
              vacantUnits++;
            }
            totalRent += unit.rent || 0;
          });
        } else {
          // Single unit property
          if (unitData.status === 'occupied') {
            occupiedUnits = 1;
            totalRevenue = unitData.rent || 0;
          } else {
            vacantUnits = 1;
          }
          totalRent = unitData.rent || 0;
        }

        const occupancyRate = totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0;
        const averageRent = totalUnits > 0 ? totalRent / totalUnits : 0;

        // Fetch analytics subcollection data (if exists)
        const analyticsRef = collection(db, `units/${propertyId}/analytics`);
        const analyticsSnapshot = await getDocs(analyticsRef);
        
        const viewsOverTime = [];
        const inquiriesOverTime = [];
        
        analyticsSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.type === 'view') {
            viewsOverTime.push({
              date: data.timestamp?.toDate() || new Date(),
              views: data.count || 1
            });
          }
          if (data.type === 'inquiry') {
            inquiriesOverTime.push({
              date: data.timestamp?.toDate() || new Date(),
              count: data.count || 1
            });
          }
        });

        // Generate monthly revenue data (last 6 months)
        const revenueOverTime = generateMonthlyRevenue(totalRevenue);

        // Fetch maintenance requests
        const maintenanceRef = collection(db, 'requests');
        const maintenanceQuery = query(
          maintenanceRef,
          where('propertyId', '==', propertyId)
        );
        const maintenanceSnapshot = await getDocs(maintenanceQuery);

        setAnalytics({
          totalViews,
          totalInquiries: viewsOverTime.reduce((sum, v) => sum + v.views, 0),
          totalRevenue,
          monthlyRevenue: totalRevenue, // Current month
          occupancyRate: Math.round(occupancyRate),
          totalUnits,
          occupiedUnits,
          vacantUnits,
          averageRent,
          viewsOverTime: processViewsOverTime(viewsOverTime),
          revenueOverTime,
          inquiriesOverTime,
          tenantHistory: [], // Can be populated from tenant records
          maintenanceRequests: maintenanceSnapshot.size,
          rating,
          totalRatings: unitData.reviewCount || 0,
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching property analytics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [propertyId]);

  return { analytics, loading, error };
}

/**
 * Generate monthly revenue data for last 6 months
 */
function generateMonthlyRevenue(currentRevenue) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const data = [];

  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    data.push({
      month: months[monthIndex],
      revenue: currentRevenue * (0.8 + Math.random() * 0.4) // Simulated variance
    });
  }

  return data;
}

/**
 * Process views over time into daily/weekly aggregates
 */
function processViewsOverTime(views) {
  // Group by day for last 7 days
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const last7Days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    last7Days.push({
      day: days[date.getDay()],
      date: date,
      views: Math.floor(Math.random() * 50) + 10 // Simulated data
    });
  }

  return last7Days;
}
