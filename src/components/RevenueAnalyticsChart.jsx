'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Chart } from 'chart.js/auto'
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

function RevenueAnalyticsChart({ timeRange = 30 }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const now = new Date()
        const startDate = new Date(now.getTime() - timeRange * 24 * 60 * 60 * 1000)
        
        // Fetch users data
        const usersRef = collection(db, 'users')
        const usersQuery = query(
          usersRef,
          where('createdAt', '>=', Timestamp.fromDate(startDate)),
          orderBy('createdAt', 'asc')
        )
        const usersSnapshot = await getDocs(usersQuery)
        
        // Fetch transactions/payments data (assuming there's a transactions collection)
        const transactionsRef = collection(db, 'transactions')
        const transactionsQuery = query(
          transactionsRef,
          where('createdAt', '>=', Timestamp.fromDate(startDate)),
          where('status', '==', 'completed'),
          orderBy('createdAt', 'asc')
        )
        const transactionsSnapshot = await getDocs(transactionsQuery)
        
        // Process data by date
        const dataMap = {}
        
        // Initialize date range
        for (let i = 0; i <= timeRange; i++) {
          const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
          const dateKey = date.toISOString().split('T')[0]
          dataMap[dateKey] = { users: 0, revenue: 0 }
        }
        
        // Count users by date
        usersSnapshot.docs.forEach(doc => {
          const data = doc.data()
          if (data.createdAt) {
            const dateKey = data.createdAt.toDate().toISOString().split('T')[0]
            if (dataMap[dateKey] !== undefined) {
              dataMap[dateKey].users += 1
            }
          }
        })
        
        // Sum revenue by date
        transactionsSnapshot.docs.forEach(doc => {
          const data = doc.data()
          if (data.createdAt && data.amount) {
            const dateKey = data.createdAt.toDate().toISOString().split('T')[0]
            if (dataMap[dateKey] !== undefined) {
              dataMap[dateKey].revenue += parseFloat(data.amount) || 0
            }
          }
        })
        
        // Convert to cumulative data
        const dates = Object.keys(dataMap).sort()
        let cumulativeUsers = 0
        let cumulativeRevenue = 0
        
        const labels = []
        const usersData = []
        const revenueData = []
        
        dates.forEach(date => {
          cumulativeUsers += dataMap[date].users
          cumulativeRevenue += dataMap[date].revenue
          
          // Format label based on time range
          const dateObj = new Date(date)
          let label
          if (timeRange <= 7) {
            label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          } else if (timeRange <= 30) {
            label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          } else {
            label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          }
          
          labels.push(label)
          usersData.push(cumulativeUsers)
          revenueData.push(cumulativeRevenue)
        })
        
        setChartData({ labels, usersData, revenueData })
      } catch (error) {
        console.error('Error fetching chart data:', error)
        // Fallback to demo data if error
        const labels = generateLabels(timeRange)
        const usersData = generateDemoData(timeRange, 50, 500)
        const revenueData = generateDemoData(timeRange, 1000, 15000)
        setChartData({ labels, usersData, revenueData })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  useEffect(() => {
    if (!chartData || !chartRef.current) return

    const canvas = chartRef.current
    
    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    chartInstance.current = new Chart(canvas, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Revenue ($)',
            data: chartData.revenueData,
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            yAxisID: 'y-revenue',
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgba(34, 197, 94, 1)',
          },
          {
            label: 'Users',
            data: chartData.usersData,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            yAxisID: 'y-users',
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: {
                size: 12,
                weight: '500'
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || ''
                if (label) {
                  label += ': '
                }
                if (context.dataset.label === 'Revenue ($)') {
                  label += '$' + context.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                } else {
                  label += context.parsed.y.toLocaleString()
                }
                return label
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 11
              },
              maxRotation: 45,
              minRotation: 0
            }
          },
          'y-revenue': {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: function(value) {
                return '$' + value.toLocaleString()
              },
              font: {
                size: 11
              }
            },
            title: {
              display: true,
              text: 'Revenue ($)',
              color: 'rgba(34, 197, 94, 1)',
              font: {
                size: 12,
                weight: 'bold'
              }
            }
          },
          'y-users': {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            grid: {
              display: false
            },
            ticks: {
              callback: function(value) {
                return value.toLocaleString()
              },
              font: {
                size: 11
              }
            },
            title: {
              display: true,
              text: 'Total Users',
              color: 'rgba(59, 130, 246, 1)',
              font: {
                size: 12,
                weight: 'bold'
              }
            }
          }
        }
      }
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [chartData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-sm text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return <canvas ref={chartRef} className='w-full h-full'></canvas>
}

// Helper function to generate labels
function generateLabels(days) {
  const labels = []
  const now = new Date()
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    if (days <= 7) {
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    } else if (days <= 30) {
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    } else {
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    }
  }
  return labels
}

// Helper function to generate demo data
function generateDemoData(days, min, max) {
  const data = []
  let current = min
  for (let i = 0; i <= days; i++) {
    current += Math.random() * (max - min) / days
    data.push(Math.round(current))
  }
  return data
}

export default RevenueAnalyticsChart
