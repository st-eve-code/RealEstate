import React from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import OverviewHeader from '../components/OverviewHeader'
import LineChart from '../components/LineChart'
import StatsCard from '../components/StatsCard'
import PieChart from '../components/PieChart'
import PromoBanner from '../components/PromoBanner'
import AvailabilityChart from '../components/AvailabilityChart'
import RecentActivities from '../components/RecentActivities'
import PropertyPreview from '../components/PropertyPreview'

export default function Dashboard(){
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <Topbar />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: main content spanning 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            <OverviewHeader />
            <div className="card">
              <LineChart />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard title="Number of Properties" value="1" icon="home" />
              <StatsCard title="Number of views" value="250" icon="eye" />
              <div className="card flex flex-col justify-center">
                <PieChart />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <PromoBanner />
              </div>
              <div>
                <div className="card">
                  <h4 className="text-lg font-semibold mb-3">Availability Status</h4>
                  <AvailabilityChart />
                </div>
              </div>
            </div>

          </div>

          {/* Right: small column */}
          <aside className="space-y-6">
            <RecentActivities />
            <PropertyPreview />
          </aside>
        </div>
      </main>
    </div>
  )
}