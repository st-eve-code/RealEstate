'use client'

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useCaretakerStats, useCaretakerProperties } from '@/Hooks/useCaretakerStats';
import Topbar from "./components/Topbar";
import OverviewHeader from "./components/OverviewHeader";
import StatsCard from "./components/StatsCard";
import RevenueChart from "./components/RevenueChart";
import OccupancyChart from "./components/OccupancyChart";
import PropertyPreview from "./components/PropertyPreview";
import RecentActivities from "./components/RecentActivities";
import QuickActions from "./components/QuickActions";
import { Home, Eye, DollarSign, Users, TrendingUp, AlertCircle } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const { stats, loading: statsLoading } = useCaretakerStats(user?.uid);
    const { properties, loading: propertiesLoading } = useCaretakerProperties(user?.uid);

    if (statsLoading) {
        return (
            <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
                <div className="flex items-center justify-center h-96">
                    <div className="text-gray-600">Loading dashboard...</div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen">
            <Topbar />
            
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left: main content spanning 3 columns */}
                <div className="lg:col-span-3 space-y-6">
                    <OverviewHeader stats={stats} />

                    {/* Stats Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard
                            title="Total Properties"
                            value={stats.totalProperties}
                            icon={Home}
                            color="blue"
                            trend="+12%"
                        />
                        <StatsCard
                            title="Total Views"
                            value={stats.totalViews}
                            icon={Eye}
                            color="green"
                            trend="+23%"
                        />
                        <StatsCard
                            title="Monthly Revenue"
                            value={`${stats.monthlyRevenue.toLocaleString()} XAF`}
                            icon={DollarSign}
                            color="purple"
                            trend="+8%"
                        />
                        <StatsCard
                            title="Occupancy Rate"
                            value={`${stats.occupancyRate}%`}
                            icon={TrendingUp}
                            color="orange"
                            trend="+5%"
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Analytics</h3>
                            <RevenueChart />
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Occupancy Overview</h3>
                            <OccupancyChart 
                                occupied={stats.occupiedUnits}
                                vacant={stats.vacantUnits}
                                total={stats.totalUnits}
                            />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <QuickActions />
                </div>

                {/* Right: sidebar */}
                <aside className="space-y-6">
                    <RecentActivities userId={user?.uid} />
                    <PropertyPreview properties={properties} loading={propertiesLoading} />
                </aside>
            </div>
        </main>
    );
}