'use client'

import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  Search, 
  Eye, 
  X, 
  MessageSquare, 
  Filter, 
  Users,
  Crown,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  UserCheck,
  Award
} from 'lucide-react';
import { useMessaging } from '@/components/Messaging';
import { fetchPlans } from '../../lib/services/planService';
import { Plan } from '../../lib/types';

interface MembersManagementProps {
  isSidebarCollapsed?: boolean;
}

export default function MembersManagement({ isSidebarCollapsed }: MembersManagementProps) {
  const [members, setMembers] = useState<any[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<any[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAssignPlanModal, setShowAssignPlanModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const { openConversationWithUser } = useMessaging();

  useEffect(() => {
    fetchMembers();
    loadPlans();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [searchTerm, filterLevel, filterStatus, members]);

  const loadPlans = async () => {
    try {
      const plansData = await fetchPlans();
      setPlans(plansData);
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const membersData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          uid: doc.id,
          ...data,
          membershipLevel: data.subscription ? 'premium' : 'free',
          subscriptionStatus: data.subscription?.state || 'expired',
          engagementScore: Math.floor(Math.random() * 40) + 60,
          complaints: Math.floor(Math.random() * 3),
          lastActive: data.lastLogin
        };
      });
      
      setMembers(membersData);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    if (filterLevel !== 'all') {
      filtered = filtered.filter(member => member.membershipLevel === filterLevel);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(member => member.subscriptionStatus === filterStatus);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(member =>
        member.displayName?.toLowerCase().includes(term) ||
        member.fullName?.toLowerCase().includes(term) ||
        member.email?.toLowerCase().includes(term)
      );
    }

    setFilteredMembers(filtered);
  };

  const handleUpdateMembershipLevel = async (memberId: string, newLevel: string) => {
    try {
      const memberRef = doc(db, 'users', memberId);
      await updateDoc(memberRef, {
        membershipLevel: newLevel,
        updatedAt: Timestamp.now()
      });
      await fetchMembers();
      alert('Membership level updated successfully');
    } catch (error) {
      console.error('Error updating membership level:', error);
      alert('Failed to update membership level');
    }
  };

  const openViewModal = (member: any) => {
    setSelectedMember(member);
    setShowViewModal(true);
  };

  const openAssignPlanModal = (member: any) => {
    setSelectedMember(member);
    setShowAssignPlanModal(true);
  };

  const handleAssignPlan = async () => {
    if (!selectedMember || !selectedPlanId) return;

    try {
      const plan = plans.find(p => p.id === selectedPlanId);
      if (!plan) return;

      // Create a mock transaction/subscription
      const now = new Date();
      const expiresAt = new Date(now.getTime() + plan.constraints.duration * 24 * 60 * 60 * 1000);

      const memberRef = doc(db, 'users', selectedMember.uid);
      await updateDoc(memberRef, {
        subscription: {
          id: `sub_${Date.now()}`,
          user: {
            id: selectedMember.uid,
            name: selectedMember.displayName || selectedMember.email
          },
          subscription: {
            id: plan.id,
            name: plan.name,
            amount: plan.price,
          },
          paid: plan.price,
          createdAt: Timestamp.now(),
          expiresAt: Timestamp.fromDate(expiresAt),
          state: 'active'
        },
        updatedAt: Timestamp.now()
      });

      alert('Plan assigned successfully');
      setShowAssignPlanModal(false);
      setSelectedMember(null);
      setSelectedPlanId('');
      fetchMembers();
    } catch (error) {
      console.error('Error assigning plan:', error);
      alert('Failed to assign plan');
    }
  };

  const getMembershipBadge = (level: string) => {
    const badges: any = {
      free: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300', icon: Users },
      premium: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', icon: Crown },
      gold: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', icon: Award }
    };
    return badges[level] || badges.free;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-xl font-bold text-gray-900">{members.length}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Subscriptions</p>
              <p className="text-xl font-bold text-gray-900">
                {members.filter(m => m.subscriptionStatus === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Crown className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Premium Members</p>
              <p className="text-xl font-bold text-gray-900">
                {members.filter(m => m.membershipLevel === 'premium' || m.membershipLevel === 'gold').length}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Engagement</p>
              <p className="text-xl font-bold text-gray-900">
                {Math.round(members.reduce((sum, m) => sum + (m.engagementScore || 0), 0) / members.length || 0)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
                <option value="gold">Gold</option>
              </select>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-xs font-semibold text-left text-gray-700 uppercase border-b">Member</th>
                <th className="px-4 py-3 text-xs font-semibold text-left text-gray-700 uppercase border-b">Contact</th>
                <th className="px-4 py-3 text-xs font-semibold text-left text-gray-700 uppercase border-b">Membership</th>
                <th className="px-4 py-3 text-xs font-semibold text-left text-gray-700 uppercase border-b">Subscription</th>
                <th className="px-4 py-3 text-xs font-semibold text-left text-gray-700 uppercase border-b">Engagement</th>
                <th className="px-4 py-3 text-xs font-semibold text-left text-gray-700 uppercase border-b">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No members found
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const badge = getMembershipBadge(member.membershipLevel || 'free');
                  const BadgeIcon = badge.icon;
                  
                  return (
                    <tr key={member.uid} className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 font-semibold text-white bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                            {(member.fullName || member.displayName || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {member.fullName || member.displayName || 'N/A'}
                            </p>
                            <p className="text-xs text-gray-500">ID: {member.uid.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} />
                            <span className="truncate max-w-[200px]">{member.email}</span>
                          </div>
                          {member.phoneNumber && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone size={14} />
                              <span>{member.phoneNumber}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${badge.bg} ${badge.text} ${badge.border}`}>
                          <BadgeIcon size={14} />
                          {(member.membershipLevel || 'free').charAt(0).toUpperCase() + (member.membershipLevel || 'free').slice(1)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          member.subscriptionStatus === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : member.subscriptionStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {member.subscriptionStatus || 'expired'}
                        </span>
                        {member.subscription?.expiresAt && (
                          <p className="mt-1 text-xs text-gray-500">
                            Expires: {new Date(member.subscription.expiresAt.toDate()).toLocaleDateString()}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                              style={{ width: `${member.engagementScore || 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{member.engagementScore || 0}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openViewModal(member)}
                            className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => openAssignPlanModal(member)}
                            className="p-2 text-green-600 transition-colors rounded-lg hover:bg-green-50"
                            title="Assign Plan"
                          >
                            <Award size={16} />
                          </button>
                          <button
                            onClick={() => { if (member.uid) openConversationWithUser(member.uid); }}
                            className="p-2 text-orange-600 transition-colors rounded-lg hover:bg-orange-50"
                            title="Message"
                          >
                            <MessageSquare size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Showing {filteredMembers.length} of {members.length} members
          </p>
        </div>
      </div>

      {/* View Member Modal */}
      {showViewModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Member Details</h2>
              <button 
                onClick={() => { setShowViewModal(false); setSelectedMember(null); }} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                <div className="flex items-center justify-center w-20 h-20 text-2xl font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
                  {(selectedMember.fullName || selectedMember.displayName || 'U')[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedMember.fullName || selectedMember.displayName || 'N/A'}
                  </h3>
                  <p className="text-sm text-gray-600">{selectedMember.email}</p>
                  <div className="flex gap-2 mt-2">
                    {(() => {
                      const badge = getMembershipBadge(selectedMember.membershipLevel || 'free');
                      const BadgeIcon = badge.icon;
                      return (
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${badge.bg} ${badge.text} ${badge.border}`}>
                          <BadgeIcon size={14} />
                          {(selectedMember.membershipLevel || 'free').charAt(0).toUpperCase() + (selectedMember.membershipLevel || 'free').slice(1)}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block mb-1 text-xs font-semibold text-gray-500 uppercase">Phone Number</label>
                  <p className="text-gray-900">{selectedMember.phoneNumber || 'Not provided'}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block mb-1 text-xs font-semibold text-gray-500 uppercase">User ID</label>
                  <p className="text-sm text-gray-900 break-all">{selectedMember.uid}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block mb-1 text-xs font-semibold text-gray-500 uppercase">Subscription Status</label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    selectedMember.subscriptionStatus === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedMember.subscriptionStatus || 'expired'}
                  </span>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block mb-1 text-xs font-semibold text-gray-500 uppercase">Engagement Score</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                        style={{ width: `${selectedMember.engagementScore || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{selectedMember.engagementScore || 0}%</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block mb-1 text-xs font-semibold text-gray-500 uppercase">Role</label>
                  <p className="text-gray-900 capitalize">{selectedMember.role?.role || 'user'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block mb-1 text-xs font-semibold text-gray-500 uppercase">Points</label>
                  <p className="text-gray-900">{selectedMember.points || 0}</p>
                </div>
              </div>

              {/* Subscription Details */}
              {selectedMember.subscription && (
                <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                  <h4 className="mb-3 font-semibold text-gray-900">Subscription Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Plan:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {selectedMember.subscription.subscription?.name || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {selectedMember.subscription.paid || 0} XAF
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Started:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {selectedMember.subscription.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Expires:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {selectedMember.subscription.expiresAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block mb-1 text-xs font-semibold text-gray-500 uppercase">Last Active</label>
                <p className="text-gray-900">
                  {selectedMember.lastActive?.toDate ? new Date(selectedMember.lastActive.toDate()).toLocaleString() : 'Never'}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => { setShowViewModal(false); setSelectedMember(null); }}
                className="w-full px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Plan Modal */}
      {showAssignPlanModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Assign Plan</h2>
              <button
                onClick={() => {
                  setShowAssignPlanModal(false);
                  setSelectedMember(null);
                  setSelectedPlanId('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Assign a subscription plan to <span className="font-semibold">{selectedMember.displayName || selectedMember.email}</span>
              </p>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Select Plan
              </label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a plan...</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} - {plan.price} XAF ({plan.constraints.duration} days)
                  </option>
                ))}
              </select>
            </div>

            {selectedPlanId && (() => {
              const plan = plans.find(p => p.id === selectedPlanId);
              return plan ? (
                <div className="p-3 mb-4 border border-blue-200 rounded-lg bg-blue-50">
                  <h4 className="mb-2 font-semibold text-gray-900">{plan.name}</h4>
                  <p className="mb-2 text-2xl font-bold text-blue-600">{plan.price} XAF</p>
                  <p className="mb-2 text-sm text-gray-600">Duration: {plan.constraints.duration} days</p>
                  <p className="text-sm text-gray-600">Points: {plan.points}</p>
                </div>
              ) : null;
            })()}

            <div className="flex gap-3">
              <button
                onClick={handleAssignPlan}
                disabled={!selectedPlanId}
                className="flex-1 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Assign Plan
              </button>
              <button
                onClick={() => {
                  setShowAssignPlanModal(false);
                  setSelectedMember(null);
                  setSelectedPlanId('');
                }}
                className="flex-1 px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
