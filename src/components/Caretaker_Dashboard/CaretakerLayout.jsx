'use client'

import React, { useState } from 'react';
import Sidebar from '@/components/Caretaker_Dashboard/components/Sidebar';
import MainContent from '@/components/MainContent';

/**
 * CaretakerLayout Component
 * 
 * Shared layout component for all caretaker dashboard routes.
 * Handles the sidebar toggle functionality and wraps all child routes.
 * 
 * This ensures the sidebar is managed in one place and all routes
 * automatically get the sidebar and main content structure.
 */
function CaretakerLayout({ children }) {
  // State for mobile sidebar toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex relative min-h-screen">
      {/* Sidebar - Handled once for all routes */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      {/* Main Content Area - Contains all route content */}
      <div className="flex-1 w-full md:w-auto pt-16 md:pt-0">
        <MainContent>
          {/* Render nested content from Next.js layout */}
          {children}
        </MainContent>
      </div>
    </div>
  );
}

export default CaretakerLayout;

