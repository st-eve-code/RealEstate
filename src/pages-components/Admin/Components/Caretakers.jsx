'use client'

import React, { useState, useEffect } from 'react';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Search, Plus, Edit, Trash2, Eye, X, Save, UserPlus, Filter, Building2, TrendingUp } from 'lucide-react';
function Caretakers({ isSidebarCollapsed }) {
  const [caretakers, setCaretakers] = useState([]);
  const [filteredCaretakers, setFilteredCaretakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCaretaker, setSelectedCaretaker] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });
  const [availableProperties, setAvailableProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');

  useEffect(() => {
    fetchCaretakers();
    fetchProperties();
  }, []);

  useEffect(() => {
    filterCaretakers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, caretakers]);

  const fetchCaretakers = async () => {
    try {
      setLoading(true);
      // In a real app, you'd have a caretakers collection or a role field
      // For now, we'll fetch users and treat some as caretakers
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const allUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter or mark caretakers (in real app, you'd have a caretaker role)
      // For demo, we'll use a subset of users
      const caretakersData = allUsers.slice(0, 10).map(user => ({
        ...user,
        assignedProperties: [],
        performanceScore: Math.floor(Math.random() * 30) + 70, // Mock score
        totalPropertiesManaged: Math.floor(Math.random() * 5)
      }));
      
      setCaretakers(caretakersData);
    } catch (error) {
      console.error('Error fetching caretakers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      const unitsRef = collection(db, 'units');
      const querySnapshot = await getDocs(unitsRef);
      const properties = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAvailableProperties(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const filterCaretakers = () => {
    let filtered = caretakers;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(caretaker =>
        caretaker.displayName?.toLowerCase().includes(term) ||
        caretaker.fullName?.toLowerCase().includes(term) ||
        caretaker.email?.toLowerCase().includes(term) ||
        caretaker.phoneNumber?.toLowerCase().includes(term)
      );
    }

    setFilteredCaretakers(filtered);
  };

  const handleRegisterCaretaker = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you'd create a new caretaker account
      alert('Caretaker registration would be implemented with user registration system');
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error registering caretaker:', error);
      alert('Failed to register caretaker');
    }
  };

  const handleAssignProperty = async () => {
    if (!selectedCaretaker || !selectedProperty) return;

    try {
      // In a real app, you'd update the caretaker's assigned properties
      alert(`Property assigned to ${selectedCaretaker.displayName}`);
      setShowAssignModal(false);
      setSelectedProperty('');
      await fetchCaretakers();
    } catch (error) {
      console.error('Error assigning property:', error);
      alert('Failed to assign property');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: ''
    });
  };

  const openAssignModal = (caretaker) => {
    setSelectedCaretaker(caretaker);
    setShowAssignModal(true);
  };

  const openViewModal = (caretaker) => {
    setSelectedCaretaker(caretaker);
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
            <p className="mt-4 text-gray-600">Loading caretakers...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-gray-50 min-h-screen w-full p-4 max-md:mt-14 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
    }`}>
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Caretakers Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <UserPlus size={20} />
            Register New Caretaker
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
            <input
              type="text"
              placeholder="Search caretakers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Caretakers Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCaretakers.length === 0 ? (
            <div className="py-8 text-center text-gray-500 col-span-full">
              No caretakers found
            </div>
          ) : (
            filteredCaretakers.map((caretaker) => (
              <div key={caretaker.uid} className="p-4 transition-shadow border border-gray-200 rounded-lg bg-gray-50 hover:shadow-md">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{caretaker.fullName || caretaker.displayName}</h3>
                    <p className="text-sm text-gray-600">{caretaker.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openViewModal(caretaker)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Performance Score:</span>
                    <span className="font-medium text-gray-800">{caretaker.performanceScore || 0}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Properties Managed:</span>
                    <span className="font-medium text-gray-800">{caretaker.totalPropertiesManaged || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium text-gray-800">{caretaker.phoneNumber || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openAssignModal(caretaker)}
                    className="flex items-center justify-center flex-1 gap-2 px-3 py-2 text-sm text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    <Building2 size={16} />
                    Assign Property
                  </button>
                  <button
                    onClick={() => openViewModal(caretaker)}
                    className="flex-1 px-3 py-2 text-sm text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    <TrendingUp size={16} className="inline mr-1" />
                    Track Performance
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredCaretakers.length} of {caretakers.length} caretakers
        </div>
      </div>

      {/* Register Caretaker Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Register New Caretaker</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleRegisterCaretaker}>
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
                    required
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
                  Register Caretaker
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

      {/* Assign Property Modal */}
      {showAssignModal && selectedCaretaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Assign Property to {selectedCaretaker.displayName}</h2>
              <button onClick={() => { setShowAssignModal(false); setSelectedProperty(''); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Select Property</label>
                <select
                  value={selectedProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a property...</option>
                  {availableProperties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name || property.building?.name || `Property ${property.id}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAssignProperty}
                disabled={!selectedProperty}
                className="flex-1 px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Assign Property
              </button>
              <button
                onClick={() => { setShowAssignModal(false); setSelectedProperty(''); }}
                className="flex-1 px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Caretaker Modal */}
      {showViewModal && selectedCaretaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Caretaker Details</h2>
              <button onClick={() => { setShowViewModal(false); setSelectedCaretaker(null); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                <p className="text-gray-900">{selectedCaretaker.fullName || selectedCaretaker.displayName || 'N/A'}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{selectedCaretaker.email}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Phone Number</label>
                <p className="text-gray-900">{selectedCaretaker.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Performance Score</label>
                <p className="text-gray-900">{selectedCaretaker.performanceScore || 0}%</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Properties Managed</label>
                <p className="text-gray-900">{selectedCaretaker.totalPropertiesManaged || 0}</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => { setShowViewModal(false); setSelectedCaretaker(null); }}
                className="w-full px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Caretakers;