'use client'

import React from 'react';
import EnhancedSettings from '@/components/Admin/Settings/EnhancedSettings';

function Settings({ isSidebarCollapsed }) {
  return <EnhancedSettings isSidebarCollapsed={isSidebarCollapsed} />;
}

export default Settings;
