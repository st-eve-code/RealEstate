'use client'

import React from 'react';
import MembersWithPlans from './MembersWithPlans';

function Members({ isSidebarCollapsed }) {
  return <MembersWithPlans isSidebarCollapsed={isSidebarCollapsed} />;
}

export default Members;
