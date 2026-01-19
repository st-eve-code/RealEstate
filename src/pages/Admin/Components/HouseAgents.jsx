'use client'

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Search, CheckCircle, XCircle, Eye, X, Building2, AlertCircle, MessageSquare, Filter } from 'lucide-react';
import ConfirmModal from '../../../components/ConfirmModal';
function HouseAgents({ isSidebarCollapsed }) {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'approve' or 'reject'
  const [agentToUpdate, setAgentToUpdate] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [complaintText, setComplaintText] = useState('');
  const [agentStats, setAgentStats] = useState({}); // Store listings and complaints per agent

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    filterAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterStatus, agents]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      // Fetch landlords as they are house agents
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role.role', '==', 'landlord'));
      const querySnapshot = await getDocs(q);
      
      // Build agents data with real stats
      const agentsData = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        
        try {
          // Fetch approved listings count for this landlord
          const propertiesQuery = query(
            collection(db, 'properties'),
            where('landlordId', '==', docSnap.id),
            where('status', '==', 'approved')
          );
          const propertiesSnapshot = await getDocs(propertiesQuery);
          const listingsCount = propertiesSnapshot.size;
          
          // Get complaints count from role.landlord.complaints
          const complaintsCount = data.role?.landlord?.complaints?.length || 0;
          
          return {
            id: docSnap.id,
            ...data,
            applicationStatus: data.role?.landlord?.licenseNumber ? 'verified' : 'pending',
            licenseNumber: data.role?.landlord?.licenseNumber || '',
            documents: data.role?.landlord?.documents || [],
            listingsCount: listingsCount, // Real data from properties collection
            complaints: complaintsCount, // Real data from role.landlord.complaints
            appliedAt: data.createdAt
          };
        } catch (error) {
          console.error(`Error fetching stats for agent ${docSnap.id}:`, error);
          return {
            id: docSnap.id,
            ...data,
            applicationStatus: data.role?.landlord?.licenseNumber ? 'verified' : 'pending',
            licenseNumber: data.role?.landlord?.licenseNumber || '',
            documents: data.role?.landlord?.documents || [],
            listingsCount: 0,
            complaints: data.role?.landlord?.complaints?.length || 0,
            appliedAt: data.createdAt
          };
        }
      }));
      
      setAgents(agentsData);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAgents = () => {
    let filtered = agents;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(agent => agent.applicationStatus === filterStatus);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(agent =>
        agent.displayName?.toLowerCase().includes(term) ||
        agent.fullName?.toLowerCase().includes(term) ||
        agent.email?.toLowerCase().includes(term) ||
        agent.licenseNumber?.toLowerCase().includes(term)
      );
    }

    setFilteredAgents(filtered);
  };

  /**
   * Open confirmation modal for approval
   */
  const openApproveModal = (agentId) => {
    setAgentToUpdate(agentId);
    setConfirmAction('approve');
    setShowConfirmModal(true);
  };

  /**
   * Open confirmation modal for rejection
   */
  const openRejectModal = (agentId) => {
    setAgentToUpdate(agentId);
    setConfirmAction('reject');
    setShowConfirmModal(true);
  };

  /**
   * Handle actual approve/reject after confirmation
   */
  const handleConfirmAction = async () => {
    if (!agentToUpdate || !confirmAction) return;

    try {
      const agentRef = doc(db, 'users', agentToUpdate);
      
      if (confirmAction === 'approve') {
        await updateDoc(agentRef, {
          'role.landlord.verified': true,
          updatedAt: Timestamp.now()
        });
        alert('Agent approved successfully');
      } else if (confirmAction === 'reject') {
        await updateDoc(agentRef, {
          'role.landlord.verified': false,
          updatedAt: Timestamp.now()
        });
        alert('Agent rejected');
      }
      
      await fetchAgents();
    } catch (error) {
      console.error(`Error ${confirmAction}ing agent:`, error);
      alert(`Failed to ${confirmAction} agent`);
    } finally {
      setAgentToUpdate(null);
      setConfirmAction(null);
    }
  };

  const handleSubmitComplaint = async () => {
    if (!selectedAgent || !complaintText.trim()) return;

    try {
      // In a real app, you'd save the complaint to a complaints collection
      alert('Complaint submitted successfully');
      setShowComplaintModal(false);
      setComplaintText('');
      setSelectedAgent(null);
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Failed to submit complaint');
    }
  };

  const openViewModal = (agent) => {
    setSelectedAgent(agent);
    setShowViewModal(true);
  };

  const openComplaintModal = (agent) => {
    setSelectedAgent(agent);
    setShowComplaintModal(true);
  };

  if (loading) {
    return (
      <section className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
      }`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading agents...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-gray-50 max-md:mt-16 min-h-screen w-full p-4 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
    }`}>
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">House Agents Management</h1>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
            <input
              type="text"
              placeholder="Search agents by name, email, or license number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Agents Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Email</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">License Number</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Status</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Listings</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Complaints</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500 border border-gray-200">
                    No agents found
                  </td>
                </tr>
              ) : (
                filteredAgents.map((agent) => (
                  <tr key={agent.uid} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                      {agent.fullName || agent.displayName || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">{agent.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                      {agent.licenseNumber || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm border border-gray-200">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        agent.applicationStatus === 'verified' 
                          ? 'bg-green-100 text-green-800' 
                          : agent.applicationStatus === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {agent.applicationStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                      {agent.listingsCount || 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                      {agent.complaints || 0}
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openViewModal(agent)}
                          className="p-2 text-blue-600 transition-colors rounded hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {agent.applicationStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => openApproveModal(agent.id)}
                              className="p-2 text-green-600 transition-colors rounded hover:bg-green-50"
                              title="Approve"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => openRejectModal(agent.id)}
                              className="p-2 text-red-600 transition-colors rounded hover:bg-red-50"
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openComplaintModal(agent)}
                          className="p-2 text-orange-600 transition-colors rounded hover:bg-orange-50"
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
          Showing {filteredAgents.length} of {agents.length} agents
        </div>
      </div>

      {/* View Agent Modal */}
      {showViewModal && selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Agent Details</h2>
              <button onClick={() => { setShowViewModal(false); setSelectedAgent(null); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-gray-900">{selectedAgent.fullName || selectedAgent.displayName || 'N/A'}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{selectedAgent.email}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                <p className="text-gray-900">{selectedAgent.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">License Number</label>
                <p className="text-gray-900">{selectedAgent.licenseNumber || 'N/A'}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  selectedAgent.applicationStatus === 'verified' 
                    ? 'bg-green-100 text-green-800' 
                    : selectedAgent.applicationStatus === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedAgent.applicationStatus || 'pending'}
                </span>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Listings Count</label>
                <p className="text-gray-900">{selectedAgent.listingsCount || 0}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Complaints</label>
                <p className="text-gray-900">{selectedAgent.complaints || 0}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Documents</label>
                <div className="mt-2">
                  {selectedAgent.documents && selectedAgent.documents.length > 0 ? (
                    <div className="space-y-2">
                      {selectedAgent.documents.map((doc, index) => (
                        <a key={index} href={doc} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          Document {index + 1}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No documents uploaded</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => { setShowViewModal(false); setSelectedAgent(null); }}
                className="w-full px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {showComplaintModal && selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Handle Complaint - {selectedAgent.displayName}</h2>
              <button onClick={() => { setShowComplaintModal(false); setComplaintText(''); setSelectedAgent(null); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Complaint Details</label>
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
                className="flex-1 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Submit Complaint
              </button>
              <button
                onClick={() => { setShowComplaintModal(false); setComplaintText(''); setSelectedAgent(null); }}
                className="flex-1 px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Approve/Reject Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setAgentToUpdate(null);
          setConfirmAction(null);
        }}
        onConfirm={handleConfirmAction}
        title={confirmAction === 'approve' ? 'Approve Agent' : 'Reject Agent'}
        message={
          confirmAction === 'approve'
            ? 'Are you sure you want to approve this agent? They will be able to list properties.'
            : 'Are you sure you want to reject this agent? They will not be able to list properties.'
        }
        confirmText={confirmAction === 'approve' ? 'Approve' : 'Reject'}
        cancelText="Cancel"
        type={confirmAction === 'approve' ? 'info' : 'danger'}
      />
    </section>
  );
}

export default HouseAgents;