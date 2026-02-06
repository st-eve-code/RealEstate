'use client'

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Search, Bell, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Topbar() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/properties?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-4">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-100 pl-12 pr-4 py-3 text-sm bg-gray-50 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
            placeholder="Search properties, tenants, or ID..."
          />
        </form>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <Bell size={22} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-4 border-l-2 border-gray-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || <User size={20} />}
          </div>
          <div className="text-sm">
            <div className="font-semibold text-gray-900">{user?.displayName || 'User'}</div>
            <div className="text-xs text-gray-500">Property Owner</div>
          </div>
        </div>
      </div>
    </div>
  );
}