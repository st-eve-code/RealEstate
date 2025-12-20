import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedCaretakerRoute from '@/components/Caretaker_Dashboard/ProtectedCaretakerRoute'
import CaretakerLayout from '@/components/Caretaker_Dashboard/CaretakerLayout'
import CaretakerDashboard from '@/components/Caretaker_Dashboard/Dashboard'
import PropertyPage from './PropertyPage'
import PropertyDetails from './PropertyDetails'
import ListProperty from './ListProperty'
import EditProperty from './EditProperty'

/**
 * Caretaker Dashboard Routes
 * 
 * This component defines all routes for the caretaker section.
 * All routes are protected and only accessible to landlord users.
 * The CaretakerLayout component wraps all routes and provides
 * the sidebar and main content structure.
 */
export default function Dashboard(){
  return (
    <ProtectedCaretakerRoute>
      <Routes>
        <Route element={<CaretakerLayout />}>
          <Route index element={<CaretakerDashboard />} />
          <Route path="properties" element={<PropertyPage />} />
          <Route path="properties/:id" element={<PropertyDetails />} />
          <Route path="list-property" element={<ListProperty />} />
          <Route path="edit-property/:id" element={<EditProperty />} />
        </Route>
      </Routes>
    </ProtectedCaretakerRoute>
  )
}