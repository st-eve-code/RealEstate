'use client'

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Search, Plus, Edit, Trash2, Eye, X, Save, UserPlus, Filter } from 'lucide-react';
import ConfirmModal from '../../../components/ConfirmModal';

function Clients({ isSidebarCollapsed }) {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all'); /*'all' | 'user' | 'landlord' */
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [clientToDeactivate, setClientToDeactivate] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null); /* User | null */
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: 'user'/*  as 'user' | 'landlord' */
  });

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterRole, clients]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role.role', 'in', ['user', 'landlord']));
      const querySnapshot = await getDocs(q);
      const clientsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) /* as User[] */;
      setClients(clientsData);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = clients;

    // Filter by role
    if (filterRole !== 'all') {
      filtered = filtered.filter(client => client.role.role === filterRole);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(client =>
        client.displayName?.toLowerCase().includes(term) ||
        client.fullName?.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term) ||
        client.phoneNumber?.toLowerCase().includes(term)
      );
    }

    setFilteredClients(filtered);
  };

  /**
   * 
   * @param {React.FormEvent} e 
   */
  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you'd create a new user account here
      // For now, we'll just show a success message
      alert('Client creation would be implemented with user registration system');
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding client:', error);
      alert('Failed to add client');
    }
  };

  /**
   * 
   * @param {React.FormEvent} e 
   * @returns 
   */
  const handleEditClient = async (e) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      const clientRef = doc(db, 'users', selectedClient.uid);
      await updateDoc(clientRef, {
        fullName: formData.fullName,
        displayName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        updatedAt: Timestamp.now()
      });
      await fetchClients();
      setShowEditModal(false);
      setSelectedClient(null);
      resetForm();
      alert('Client updated successfully');
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Failed to update client');
    }
  };

  /**
   * Open confirmation modal for deactivation
   * @param {string} clientId 
   */
  const openDeactivateModal = (clientId) => {
    setClientToDeactivate(clientId);
    setShowConfirmModal(true);
  };

  /**
   * Handle actual deactivation after confirmation
   */
  const handleDeactivateClient = async () => {
    if (!clientToDeactivate) return;

    try {
      const clientRef = doc(db, 'users', clientToDeactivate);
      await updateDoc(clientRef, {
        status: 'deactivated',
        deactivatedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      await fetchClients();
      alert('Client deactivated successfully');
    } catch (error) {
      console.error('Error deactivating client:', error);
      alert('Failed to deactivate client');
    } finally {
      setClientToDeactivate(null);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      role: 'user'
    });
  };

  /**
   * 
   * @param {User} client 
   */
  const openEditModal = (client) => {
    setSelectedClient(client);
    setFormData({
      fullName: client.fullName || client.displayName || '',
      email: client.email || '',
      phoneNumber: client.phoneNumber || '',
      role: client.role.role /* as 'user' | 'landlord' */
    });
    setShowEditModal(true);
  };

  /**
   * 
   * @param {User} client 
   */
  const openViewModal = (client) => {
    setSelectedClient(client);
    setShowViewModal(true);
  };

  if (loading) {
    return (
      <section className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
      }`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading clients...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-gray-50 min-h-screen max-md:mt-14 w-full p-4 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
    }`}>
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Clients Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-2 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <UserPlus size={20} />
            Add New Client
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
            <input
              type="text"
              placeholder="Search clients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value /* as 'all' | 'user' | 'landlord' */)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="landlord">Landlords</option>
            </select>
          </div>
        </div>

        {/* Clients Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Email</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Phone</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Role</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Properties</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 border border-gray-200">
                    No clients found
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.uid} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                      {client.fullName || client.displayName || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">{client.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                      {client.phoneNumber || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-sm border border-gray-200">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        client.role.role === 'landlord' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {client.role.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                      {client.numberOfProperties || 0}
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openViewModal(client)}
                          className="p-2 text-blue-600 transition-colors rounded hover:bg-blue-50"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(client)}
                          className="p-2 text-green-600 transition-colors rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => openDeactivateModal(client.uid)}
                          className="p-2 text-red-600 transition-colors rounded hover:bg-red-50"
                          title="Deactivate"
                        >
                          <Trash2 size={16} />
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
          Showing {filteredClients.length} of {clients.length} clients
        </div>
      </div>

      {/* Add Client Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Add New Client</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddClient}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value /* as 'user' | 'landlord' */ })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="landlord">Landlord</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Add Client
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {showEditModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Edit Client</h2>
              <button onClick={() => { setShowEditModal(false); setSelectedClient(null); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditClient}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2 text-gray-500 bg-gray-100 border border-gray-300 rounded-lg"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Save size={16} className="inline mr-2" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setSelectedClient(null); resetForm(); }}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Client Modal */}
      {showViewModal && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Client Details</h2>
              <button onClick={() => { setShowViewModal(false); setSelectedClient(null); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-gray-900">{selectedClient.fullName || selectedClient.displayName || 'N/A'}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{selectedClient.email}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                <p className="text-gray-900">{selectedClient.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Role</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  selectedClient.role.role === 'landlord' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedClient.role.role}
                </span>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Number of Properties</label>
                <p className="text-gray-900">{selectedClient.numberOfProperties || 0}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Created At</label>
                <p className="text-gray-900">
                  {selectedClient.createdAt?.toDate ? new Date(selectedClient.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => { setShowViewModal(false); setSelectedClient(null); }}
                className="w-full px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Deactivation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setClientToDeactivate(null);
        }}
        onConfirm={handleDeactivateClient}
        title="Deactivate Client"
        message="Are you sure you want to deactivate this client? They will no longer be able to access their account."
        confirmText="Deactivate"
        cancelText="Cancel"
        type="danger"
      />
    </section>
  );
}

export default Clients;