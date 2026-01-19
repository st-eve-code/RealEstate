'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Chart } from 'chart.js/auto'
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

function NewGrowthChart({ viewMode = 'daily', timeRange = 30 }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const now = new Date()
        let startDate
        
        // Determine start date based on view mode
        if (viewMode === 'daily') {
          startDate = new Date(now.getTime() - timeRange * 24 * 60 * 60 * 1000)
        } else if (viewMode === 'monthly') {
          startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1) // Last 12 months
        } else if (viewMode === 'yearly') {
          startDate = new Date(now.getFullYear() - 9, 0, 1) // Last 10 years
        }
        
        // Fetch users data
        const usersRef = collection(db, 'users')
        const usersQuery = query(
          usersRef,
          where('createdAt', '>=', Timestamp.fromDate(startDate)),
          orderBy('createdAt', 'asc')
        )
        const usersSnapshot = await getDocs(usersQuery)
        
        // Fetch transactions/payments data
        const transactionsRef = collection(db, 'transactions')
        const transactionsQuery = query(
          transactionsRef,
          where('createdAt', '>=', Timestamp.fromDate(startDate)),
          where('status', '==', 'completed'),
          orderBy('createdAt', 'asc')
        )
        const transactionsSnapshot = await getDocs(transactionsQuery)
        
        // Process data based on view mode
        let dataMap = {}
        let labels = []
        
        if (viewMode === 'daily') {
          // Group by day
          for (let i = 0; i <= timeRange; i++) {
            const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
            const dateKey = date.toISOString().split('T')[0]
            dataMap[dateKey] = { users: 0, revenue: 0 }
          }
          
          usersSnapshot.docs.forEach(doc => {
            const data = doc.data()
            if (data.createdAt) {
              const dateKey = data.createdAt.toDate().toISOString().split('T')[0]
              if (dataMap[dateKey] !== undefined) {
                dataMap[dateKey].users += 1
              }
            }
          })
          
          transactionsSnapshot.docs.forEach(doc => {
            const data = doc.data()
            if (data.createdAt && data.amount) {
              const dateKey = data.createdAt.toDate().toISOString().split('T')[0]
              if (dataMap[dateKey] !== undefined) {
                dataMap[dateKey].revenue += parseFloat(data.amount) || 0
              }
            }
          })
          
          const dates = Object.keys(dataMap).sort()
          dates.forEach(date => {
            const dateObj = new Date(date)
            labels.push(dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
          })
          
        } else if (viewMode === 'monthly') {
          // Group by month - last 12 months
          for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            dataMap[monthKey] = { users: 0, revenue: 0 }
            labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))
          }
          
          usersSnapshot.docs.forEach(doc => {
            const data = doc.data()
            if (data.createdAt) {
              const date = data.createdAt.toDate()
              const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
              if (dataMap[monthKey] !== undefined) {
                dataMap[monthKey].users += 1
              }
            }
          })
          
          transactionsSnapshot.docs.forEach(doc => {
            const data = doc.data()
            if (data.createdAt && data.amount) {
              const date = data.createdAt.toDate()
              const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
              if (dataMap[monthKey] !== undefined) {
                dataMap[monthKey].revenue += parseFloat(data.amount) || 0
              }
            }
          })
          
        } else if (viewMode === 'yearly') {
          // Group by year - last 10 years
          for (let i = 9; i >= 0; i--) {
            const year = now.getFullYear() - i
            dataMap[year] = { users: 0, revenue: 0 }
            labels.push(year.toString())
          }
          
          usersSnapshot.docs.forEach(doc => {
            const data = doc.data()
            if (data.createdAt) {
              const year = data.createdAt.toDate().getFullYear()
              if (dataMap[year] !== undefined) {
                dataMap[year].users += 1
              }
            }
          })
          
          transactionsSnapshot.docs.forEach(doc => {
            const data = doc.data()
            if (data.createdAt && data.amount) {
              const year = data.createdAt.toDate().getFullYear()
              if (dataMap[year] !== undefined) {
                dataMap[year].revenue += parseFloat(data.amount) || 0
              }
            }
          })
        }
        
        // Extract data arrays (NON-CUMULATIVE - just the new growth per period)
        const sortedKeys = Object.keys(dataMap).sort()
        const usersData = sortedKeys.map(key => dataMap[key].users)
        const revenueData = sortedKeys.map(key => dataMap[key].revenue)
        
        setChartData({ labels, usersData, revenueData })
      } catch (error) {
        console.error('Error fetching chart data:', error)
        // Fallback to demo data
        const labels = generateLabels(viewMode, timeRange)
        const usersData = generateDemoGrowthData(labels.length, 5, 50)
        const revenueData = generateDemoGrowthData(labels.length, 500, 5000)
        setChartData({ labels, usersData, revenueData })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [viewMode, timeRange])

  useEffect(() => {
    if (!chartData || !chartRef.current) return

    const canvas = chartRef.current
    
    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    chartInstance.current = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'New Revenue ($)',
            data: chartData.revenueData,
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 2,
            yAxisID: 'y-revenue',
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'New Users',
            data: chartData.usersData,
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            yAxisID: 'y-users',
            borderRadius: 6,
            borderSkipped: false,
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
                if (context.dataset.label === 'New Revenue ($)') {
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
              text: 'New Revenue ($)',
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
              text: 'New Users',
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
          <p className="mt-2 text-sm text-gray-600">Loading growth data...</p>
        </div>
      </div>
    )
  }

  return <canvas ref={chartRef} className='w-full h-full'></canvas>
}

// Helper function to generate labels based on view mode
function generateLabels(viewMode, timeRange) {
  const labels = []
  const now = new Date()
  
  if (viewMode === 'daily') {
    for (let i = timeRange; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    }
  } else if (viewMode === 'monthly') {
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }))
    }
  } else if (viewMode === 'yearly') {
    for (let i = 9; i >= 0; i--) {
      const year = now.getFullYear() - i
      labels.push(year.toString())
    }
  }
  
  return labels
}

// Helper function to generate random growth data (non-cumulative)
function generateDemoGrowthData(periods, min, max) {
  const data = []
  for (let i = 0; i < periods; i++) {
    const value = Math.floor(Math.random() * (max - min) + min)
    data.push(value)
  }
  return data
}

export default NewGrowthChart
