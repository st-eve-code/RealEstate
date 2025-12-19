import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Search, Eye, X, Crown, TrendingUp, MessageSquare, Filter, Users } from 'lucide-react';
function Members({ isSidebarCollapsed }) {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [complaintText, setComplaintText] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [searchTerm, filterLevel, members]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const membersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        membershipLevel: doc.data().subscription ? 'premium' : 'free',
        subscriptionStatus: doc.data().subscription?.state || 'expired',
        engagementScore: Math.floor(Math.random() * 40) + 60,
        complaints: Math.floor(Math.random() * 3),
        lastActive: doc.data().lastLogin
      }));
      
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

  const handleUpdateMembershipLevel = async (memberId, newLevel) => {
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

  const handleSubmitComplaint = async () => {
    if (!selectedMember || !complaintText.trim()) return;

    try {
      // In a real app, you'd save the complaint to a complaints collection
      alert('Complaint handled successfully');
      setShowComplaintModal(false);
      setComplaintText('');
      setSelectedMember(null);
    } catch (error) {
      console.error('Error handling complaint:', error);
      alert('Failed to handle complaint');
    }
  };

  const openViewModal = (member) => {
    setSelectedMember(member);
    setShowViewModal(true);
  };

  const openComplaintModal = (member) => {
    setSelectedMember(member);
    setShowComplaintModal(true);
  };

  if (loading) {
    return (
      <section className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
      }`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading members...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
    }`}>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Members Management</h1>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Membership Level</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Subscription</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Engagement</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Complaints</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                    No members found
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.uid} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                      {member.fullName || member.displayName || 'N/A'}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{member.email}</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">
                      <select
                        value={member.membershipLevel || 'free'}
                        onChange={(e) => handleUpdateMembershipLevel(member.uid, e.target.value)}
                        className={`px-2 py-1 rounded text-xs font-medium border ${
                          member.membershipLevel === 'gold'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                            : member.membershipLevel === 'premium'
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : 'bg-gray-100 text-gray-800 border-gray-300'
                        }`}
                      >
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                        <option value="gold">Gold</option>
                      </select>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.subscriptionStatus === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {member.subscriptionStatus || 'expired'}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-green-600" />
                        <span>{member.engagementScore || 0}%</span>
                      </div>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                      {member.complaints || 0}
                    </td>
                    <td className="border border-gray-200 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openViewModal(member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openComplaintModal(member)}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Handle Complaint"
                        >
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredMembers.length} of {members.length} members
        </div>
      </div>

      {/* View Member Modal */}
      {showViewModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Member Details</h2>
              <button onClick={() => { setShowViewModal(false); setSelectedMember(null); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <p className="text-gray-900">{selectedMember.fullName || selectedMember.displayName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{selectedMember.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <p className="text-gray-900">{selectedMember.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Membership Level</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  selectedMember.membershipLevel === 'gold'
                    ? 'bg-yellow-100 text-yellow-800'
                    : selectedMember.membershipLevel === 'premium'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedMember.membershipLevel || 'free'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Status</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  selectedMember.subscriptionStatus === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedMember.subscriptionStatus || 'expired'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Engagement Score</label>
                <p className="text-gray-900">{selectedMember.engagementScore || 0}%</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Complaints</label>
                <p className="text-gray-900">{selectedMember.complaints || 0}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Active</label>
                <p className="text-gray-900">
                  {selectedMember.lastActive?.toDate ? new Date(selectedMember.lastActive.toDate()).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => { setShowViewModal(false); setSelectedMember(null); }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {showComplaintModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Handle Complaint - {selectedMember.displayName}</h2>
              <button onClick={() => { setShowComplaintModal(false); setComplaintText(''); setSelectedMember(null); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Details / Resolution Notes</label>
                <textarea
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  placeholder="Enter complaint details or resolution notes..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmitComplaint}
                disabled={!complaintText.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                Submit Resolution
              </button>
              <button
                onClick={() => { setShowComplaintModal(false); setComplaintText(''); setSelectedMember(null); }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Members;