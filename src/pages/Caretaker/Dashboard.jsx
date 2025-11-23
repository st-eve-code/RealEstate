import React from 'react'
import Sidebar from '@/components/Caretaker_Dashboard/components/Sidebar'
import CaretakerDashboard from '@/components/Caretaker_Dashboard/Dashboard'
import MainContent from '@/components/MainContent'
import { Route, Routes } from 'react-router-dom'
import PropertyPage from './PropertyPage'

export default function Dashboard(){
  return (
    <div className="flex">
      <Sidebar/>
      <div>
        <MainContent>
          <Routes>
            <Route path="/" element={<CaretakerDashboard />} />
            <Route path="properties" element={<PropertyPage />} />
          </Routes>
        </MainContent>
      </div>
    </div>
  )
}