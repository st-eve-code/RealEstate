'use client'

import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export function useAdminStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeListings: 0,
    occupancyRate: 0,
    newUsersThisMonth: 0,
    propertiesAddedThisMonth: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const now = new Date()
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

        // Fetch total users
        const usersSnapshot = await getDocs(collection(db, 'users'))
        const totalUsers = usersSnapshot.size

        // Fetch new users this month
        const newUsersQuery = query(
          collection(db, 'users'),
          where('createdAt', '>=', Timestamp.fromDate(firstDayOfMonth))
        )
        const newUsersSnapshot = await getDocs(newUsersQuery)
        const newUsersThisMonth = newUsersSnapshot.size

        // Fetch new users last month for growth calculation
        const lastMonthUsersQuery = query(
          collection(db, 'users'),
          where('createdAt', '>=', Timestamp.fromDate(firstDayOfLastMonth)),
          where('createdAt', '<', Timestamp.fromDate(firstDayOfMonth))
        )
        const lastMonthUsersSnapshot = await getDocs(lastMonthUsersQuery)
        const newUsersLastMonth = lastMonthUsersSnapshot.size

        // Calculate monthly growth
        const monthlyGrowth = newUsersLastMonth > 0 
          ? ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth * 100).toFixed(1)
          : 0

        // Fetch total properties
        const propertiesSnapshot = await getDocs(collection(db, 'properties'))
        const totalProperties = propertiesSnapshot.size

        // Fetch active listings (assuming there's a status field)
        const activeListingsQuery = query(
          collection(db, 'properties'),
          where('status', '==', 'active')
        )
        const activeListingsSnapshot = await getDocs(activeListingsQuery)
        const activeListings = activeListingsSnapshot.size

        // Fetch properties added this month
        const newPropertiesQuery = query(
          collection(db, 'properties'),
          where('createdAt', '>=', Timestamp.fromDate(firstDayOfMonth))
        )
        const newPropertiesSnapshot = await getDocs(newPropertiesQuery)
        const propertiesAddedThisMonth = newPropertiesSnapshot.size

        // Fetch total revenue from transactions
        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('status', '==', 'completed'),
          where('createdAt', '>=', Timestamp.fromDate(firstDayOfMonth))
        )
        const transactionsSnapshot = await getDocs(transactionsQuery)
        let totalRevenue = 0
        transactionsSnapshot.docs.forEach(doc => {
          const data = doc.data()
          if (data.amount) {
            totalRevenue += parseFloat(data.amount) || 0
          }
        })

        // Calculate occupancy rate (active listings / total properties * 100)
        const occupancyRate = totalProperties > 0 
          ? ((activeListings / totalProperties) * 100).toFixed(0)
          : 0

        setStats({
          totalUsers,
          totalProperties,
          totalRevenue: Math.round(totalRevenue),
          monthlyGrowth: parseFloat(monthlyGrowth),
          activeListings,
          occupancyRate: parseInt(occupancyRate),
          newUsersThisMonth,
          propertiesAddedThisMonth
        })
      } catch (error) {
        console.error('Error fetching admin stats:', error)
        // Keep default values on error
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading }
}

export function useActivityLogs(filterType = 'all', pageSize = 10) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true)
      try {
        // Build query based on filter
        let activitiesQuery
        
        if (filterType === 'all') {
          activitiesQuery = query(
            collection(db, 'Activity'),
            orderBy('createdAt', 'desc'),
            limit(pageSize)
          )
        } else {
          // Map filter types to featured.type values
          const typeMap = {
            'user': 'user.creation',
            'property': 'property.update',
            'payment': 'payment',
            'support': 'support'
          }
          
          activitiesQuery = query(
            collection(db, 'Activity'),
            where('featured.type', '==', typeMap[filterType] || filterType),
            orderBy('createdAt', 'desc'),
            limit(pageSize)
          )
        }

        const activitiesSnapshot = await getDocs(activitiesQuery)
        
        // Transform Activity collection data to display format
        const activityLogs = activitiesSnapshot.docs.map(doc => {
          const data = doc.data()
          const timeDiff = getTimeAgo(data.createdAt?.toDate())
          
          // Determine activity type from featured.type
          let type = 'user'
          if (data.featured?.type) {
            if (data.featured.type.includes('user')) type = 'user'
            else if (data.featured.type.includes('property')) type = 'property'
            else if (data.featured.type.includes('payment')) type = 'payment'
            else if (data.featured.type.includes('support')) type = 'support'
          }
          
          return {
            id: doc.id,
            action: data.title || 'Activity',
            details: data.context || '',
            user: data.user?.name || 'Unknown User',
            time: timeDiff,
            type: type,
            value: data.featured?.primary || '',
            status: data.featured?.badge || 'active',
            color: data.color || '#3b82f6',
            timestamp: data.createdAt?.toDate() || new Date()
          }
        })

        setActivities(activityLogs)
        setTotalCount(activitiesSnapshot.size)
      } catch (error) {
        console.error('Error fetching activity logs:', error)
        setActivities([])
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [filterType, pageSize])

  return { activities, loading, totalCount }
}

// Helper function to calculate time ago
function getTimeAgo(date) {
  if (!date) return 'Recently'
  
  const now = new Date()
  const diffMs = now - date
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'Just now'
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`
  if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
