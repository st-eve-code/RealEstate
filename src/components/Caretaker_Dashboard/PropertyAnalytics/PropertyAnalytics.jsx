'use client'

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  Users, 
  MessageSquare,
  Home,
  Calendar,
  Star,
  Wrench,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { usePropertyAnalytics } from '@/Hooks/usePropertyAnalytics';
import ViewsChart from './ViewsChart';
import RevenueChart from './RevenueChart';
import OccupancyDonut from './OccupancyDonut';

export default function PropertyAnalytics() {
  const { id } = useParams();
  const router = useRouter();
  const { analytics, loading, error } = usePropertyAnalytics(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading analytics: {error}</p>
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Views',
      value: analytics.totalViews.toLocaleString(),
      icon: Eye,
      color: 'blue',
      trend: '+12%',
      description: 'Property page views'
    },
    {
      title: 'Total Revenue',
      value: `${analytics.totalRevenue.toLocaleString()} XAF`,
      icon: DollarSign,
      color: 'green',
      trend: '+8%',
      description: 'All-time income'
    },
    {
      title: 'Occupancy Rate',
      value: `${analytics.occupancyRate}%`,
      icon: TrendingUp,
      color: 'purple',
      trend: '+5%',
      description: `${analytics.occupiedUnits}/${analytics.totalUnits} units occupied`
    },
    {
      title: 'Inquiries',
      value: analytics.totalInquiries.toLocaleString(),
      icon: MessageSquare,
      color: 'orange',
      trend: '+15%',
      description: 'Customer inquiries'
    },
    {
      title: 'Average Rent',
      value: `${Math.round(analytics.averageRent).toLocaleString()} XAF`,
      icon: Home,
      color: 'indigo',
      description: 'Per unit'
    },
    {
      title: 'Maintenance',
      value: analytics.maintenanceRequests,
      icon: Wrench,
      color: 'red',
      description: 'Pending requests'
    },
    {
      title: 'Rating',
      value: Number(analytics.rating || 0).toFixed(1),
      icon: Star,
      color: 'yellow',
      description: `${analytics.totalRatings || 0} reviews`
    },
    {
      title: 'Monthly Income',
      value: `${analytics.monthlyRevenue.toLocaleString()} XAF`,
      icon: Calendar,
      color: 'teal',
      trend: '+8%',
      description: 'This month'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 mb-4 text-gray-700 bg-white rounded-xl shadow-md hover:bg-gray-50 hover:shadow-lg transition-all duration-200 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
              <div className="relative p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <BarChart3 size={32} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Property Analytics
              </h1>
              <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              orange: 'bg-orange-100 text-orange-600',
              indigo: 'bg-indigo-100 text-indigo-600',
              red: 'bg-red-100 text-red-600',
              yellow: 'bg-yellow-100 text-yellow-600',
              teal: 'bg-teal-100 text-teal-600',
            };

            return (
              <div
                key={stat.title}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`${colorClasses[stat.color]} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                {stat.trend && (
                  <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                    <TrendingUp size={14} />
                    <span>{stat.trend}</span>
                  </div>
                )}
                {stat.description && !stat.trend && (
                  <p className="text-xs text-gray-500">{stat.description}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Views Over Time */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Views Over Time</h3>
                <p className="text-sm text-gray-600">Last 7 days</p>
              </div>
              <Eye className="text-blue-600" size={24} />
            </div>
            <ViewsChart data={analytics.viewsOverTime} />
          </div>

          {/* Occupancy Donut */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Occupancy</h3>
                <p className="text-sm text-gray-600">Current status</p>
              </div>
              <PieChartIcon className="text-purple-600" size={24} />
            </div>
            <OccupancyDonut
              occupied={analytics.occupiedUnits}
              vacant={analytics.vacantUnits}
              rate={analytics.occupancyRate}
            />
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Revenue Trends</h3>
              <p className="text-sm text-gray-600">Last 6 months</p>
            </div>
            <DollarSign className="text-green-600" size={24} />
          </div>
          <RevenueChart data={analytics.revenueOverTime} />
        </div>

        {/* Additional Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Total Units</span>
                <span className="font-bold text-gray-900">{analytics.totalUnits}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Occupied Units</span>
                <span className="font-bold text-green-600">{analytics.occupiedUnits}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Vacant Units</span>
                <span className="font-bold text-orange-600">{analytics.vacantUnits}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600">Average Rent</span>
                <span className="font-bold text-gray-900">{Math.round(analytics.averageRent).toLocaleString()} XAF</span>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Engagement Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Total Views</span>
                <span className="font-bold text-blue-600">{analytics.totalViews}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Inquiries</span>
                <span className="font-bold text-purple-600">{analytics.totalInquiries}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <span className="text-gray-600">Avg. Rating</span>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-gray-900">{Number(analytics.rating || 0).toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({analytics.totalRatings || 0})</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600">Maintenance Requests</span>
                <span className="font-bold text-red-600">{analytics.maintenanceRequests}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
