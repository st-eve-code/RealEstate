import React from 'react'
import { Routes, Route } from 'react-router-dom'
import CaretakerLayout from '@/components/Caretaker_Dashboard/CaretakerLayout'
import CaretakerDashboard from '@/components/Caretaker_Dashboard/Dashboard'
import PropertyPage from './PropertyPage'
import ListProperty from './ListProperty'

/**
 * Caretaker Dashboard Routes
 * 
 * This component defines all routes for the caretaker section.
 * The CaretakerLayout component wraps all routes and provides
 * the sidebar and main content structure.
 */
export default function Dashboard(){
  return (
    <Routes>
      {/* Layout route that wraps all caretaker routes */}
      <Route element={<CaretakerLayout />}>
        <Route index element={<CaretakerDashboard />} />
        <Route path="properties" element={<PropertyPage />} />
        <Route path="list-property" element={<ListProperty />} />
      </Route>
    </Routes>
  )
}