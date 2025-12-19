import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, where } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Search, Plus, Edit, Trash2, X, Save, Building2, ToggleRight, ToggleLeft, User as UserIcon } from 'lucide-react';

function Property({ isSidebarCollapsed }) {
  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [landlords, setLandlords] = useState([]);
  const [showOnlyVerifiedLandlords, setShowOnlyVerifiedLandlords] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    period: '',
    currency: 'USD',
    location: '',
    totalnumber: '',
    landlordId: '',
    available: true,
    state: 1,
    type: 'apartment',
    buildingId: '',
    buildingName: '',
    rooms: '',
    features: '',
    tags: ''
  });

  useEffect(() => {
    fetchUnits();
    fetchLandlords();
  }, []);

  useEffect(() => {
    filterUnits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, units]);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const unitsRef = collection(db, 'units');
      const snapshot = await getDocs(unitsRef);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUnits(data);
    } catch (error) {
      console.error('Error fetching units:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLandlords = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role.role', '==', 'landlord'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLandlords(data);
    } catch (error) {
      console.error('Error fetching landlords:', error);
    }
  };

  const filterUnits = () => {
    if (!searchTerm) {
      setFilteredUnits(units);
      return;
    }
    const term = searchTerm.toLowerCase();
    setFilteredUnits(
      units.filter(
        (unit) =>
          unit.name?.toLowerCase().includes(term) ||
          unit.location?.toLowerCase().includes(term) ||
          unit.landlordId?.toLowerCase().includes(term) ||
          unit.type?.toLowerCase().includes(term)
      )
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      period: '',
      currency: 'USD',
      location: '',
      totalnumber: '',
      landlordId: '',
      available: true,
      state: 1,
      type: 'apartment',
      buildingId: '',
      buildingName: '',
      rooms: '',
      features: '',
      tags: ''
    });
    setSelectedUnit(null);
  };

  const handleAddUnit = async (e) => {
    e.preventDefault();
    try {
      const rooms = formData.rooms
        ? formData.rooms.split(',').map((r) => r.trim()).filter(Boolean)
        : [];
      const features = formData.features
        ? formData.features.split(',').map((f) => f.trim()).filter(Boolean)
        : [];
      const tags = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      await addDoc(collection(db, 'units'), {
        name: formData.name,
        description: formData.description || '',
        price: Number(formData.price) || 0,
        period: formData.period || '',
        currency: formData.currency || 'USD',
        location: formData.location || '',
        totalnumber: Number(formData.totalnumber) || 0,
        available: formData.state === 1,
        state: Number(formData.state) || 1,
        type: formData.type || 'apartment',
        building: {
          id: formData.buildingId || '',
          name: formData.buildingName || ''
        },
        rooms,
        rating: {
          value: 0,
          total: 0,
          reviews: 0
        },
        features,
        tags,
        views: 0,
        imageUrl: [],
        landlordId: formData.landlordId || '',
        createdAt: Timestamp.now()
      });
      await fetchUnits();
      setShowAddModal(false);
      resetForm();
      alert('Unit added successfully');
    } catch (error) {
      console.error('Error adding unit:', error);
      alert('Failed to add unit');
    }
  };

  const handleUpdateUnit = async (e) => {
    e.preventDefault();
    if (!selectedUnit) return;
    try {
      const unitRef = doc(db, 'units', selectedUnit.id);

      const rooms = formData.rooms
        ? formData.rooms.split(',').map((r) => r.trim()).filter(Boolean)
        : [];
      const features = formData.features
        ? formData.features.split(',').map((f) => f.trim()).filter(Boolean)
        : [];
      const tags = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      await updateDoc(unitRef, {
        name: formData.name,
        description: formData.description || '',
        price: Number(formData.price) || 0,
        period: formData.period || '',
        currency: formData.currency || 'USD',
        location: formData.location || '',
        totalnumber: Number(formData.totalnumber) || 0,
        available: formData.state === 1,
        state: Number(formData.state) || 1,
        type: formData.type || 'apartment',
        building: {
          id: formData.buildingId || '',
          name: formData.buildingName || ''
        },
        rooms,
        features,
        tags,
        landlordId: formData.landlordId || '',
        updatedAt: Timestamp.now()
      });
      await fetchUnits();
      setShowEditModal(false);
      resetForm();
      alert('Unit updated successfully');
    } catch (error) {
      console.error('Error updating unit:', error);
      alert('Failed to update unit');
    }
  };

  const handleDeleteUnit = async (unitId) => {
    if (!confirm('Are you sure you want to delete this unit?')) return;
    try {
      await deleteDoc(doc(db, 'units', unitId));
      await fetchUnits();
      alert('Unit deleted successfully');
    } catch (error) {
      console.error('Error deleting unit:', error);
      alert('Failed to delete unit');
    }
  };

  const handleToggleAvailability = async (unit) => {
    try {
      const unitRef = doc(db, 'units', unit.id);
      let nextState = 1;
      if (unit.state === 1) {
        nextState = 0;
      } else if (unit.state === 0) {
        nextState = -1;
      } else {
        nextState = 1;
      }
      await updateDoc(unitRef, {
        state: nextState,
        available: nextState === 1,
        updatedAt: Timestamp.now()
      });
      await fetchUnits();
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Failed to update availability');
    }
  };

  const openEditModal = (unit) => {
    setSelectedUnit(unit);
    setFormData({
      name: unit.name || '',
      description: unit.description || '',
      price: unit.price || '',
      period: unit.period || '',
      currency: unit.currency || 'USD',
      location: unit.location || '',
      totalnumber: unit.totalnumber != null ? String(unit.totalnumber) : '',
      landlordId: unit.landlordId || '',
      available: unit.available ?? true,
      state: unit.state != null ? unit.state : 1,
      type: unit.type || 'apartment',
      buildingId: unit.building?.id || '',
      buildingName: unit.building?.name || '',
      rooms: Array.isArray(unit.rooms) ? unit.rooms.join(', ') : '',
      features: Array.isArray(unit.features) ? unit.features.join(', ') : '',
      tags: Array.isArray(unit.tags) ? unit.tags.join(', ') : ''
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <section
        className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
        }`}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading units...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
      }`}
    >
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Property Management</h1>
            <p className="text-sm text-gray-600">View, edit, assign landlords, and manage unit availability.</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Add Unit
          </button>
        </div>

        {/* Search */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, location, landlord, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="only-verified-landlords-toggle"
              type="checkbox"
              className="rounded"
              checked={showOnlyVerifiedLandlords}
              onChange={(e) => setShowOnlyVerifiedLandlords(e.target.checked)}
            />
            <label htmlFor="only-verified-landlords-toggle" className="text-sm text-gray-700">
              Show only verified landlords in dropdown
            </label>
          </div>
        </div>

        {/* Units Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Landlord</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="border border-gray-200 px-4 py-8 text-center text-gray-500">
                    No units found
                  </td>
                </tr>
              ) : (
                filteredUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-800 font-medium">{unit.name || 'N/A'}</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{unit.location || 'N/A'}</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{unit.type || 'N/A'}</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">
                      {unit.currency || 'USD'} {unit.price ?? '0'}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700 flex items-center gap-2">
                      <UserIcon size={14} />
                      {unit.landlordId || 'Unassigned'}
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">
                      <button
                        onClick={() => handleToggleAvailability(unit)}
                        className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold border ${
                          unit.state === 1
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : unit.state === 0
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            : 'bg-red-100 text-red-700 border-red-200'
                        }`}
                        title="Cycle state (available → occupied → under review)"
                      >
                        {unit.state === 1 && <ToggleRight size={14} />}
                        {unit.state === 0 && <Building2 size={14} />}
                        {unit.state === -1 && <ToggleLeft size={14} />}
                        {unit.state === 1 && 'Available'}
                        {unit.state === 0 && 'Occupied'}
                        {unit.state === -1 && 'Under review'}
                      </button>
                    </td>
                    <td className="border border-gray-200 px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(unit)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUnit(unit.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
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
      </div>

      {/* Add Unit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Unit</h2>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600" title="Close">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleAddUnit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Cozy Apartment"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <input
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="USD"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City, Area"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="studio">Studio</option>
                    <option value="hostel">Hostel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Landlord</label>
                  <select
                    value={formData.landlordId}
                    onChange={(e) => setFormData({ ...formData, landlordId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {landlords
                      .filter((landlord) => {
                        const verified =
                          landlord.role &&
                          landlord.role.landlord &&
                          landlord.role.landlord.verified;
                        return showOnlyVerifiedLandlords ? verified : true;
                      })
                      .map((landlord) => (
                        <option key={landlord.uid || landlord.id} value={landlord.uid || landlord.id}>
                          {(landlord.fullName || landlord.displayName || landlord.email || 'Unnamed') +
                            (landlord.role &&
                            landlord.role.landlord &&
                            landlord.role.landlord.licenseNumber
                              ? ' (verified)'
                              : ' (unverified)')}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Short description of the unit"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing Period</label>
                  <input
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., monthly"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Units</label>
                  <input
                    type="number"
                    value={formData.totalnumber}
                    onChange={(e) => setFormData({ ...formData, totalnumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Building ID</label>
                  <input
                    value={formData.buildingId}
                    onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Building ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Building Name</label>
                  <input
                    value={formData.buildingName}
                    onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Building name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rooms (comma separated)</label>
                  <input
                    value={formData.rooms}
                    onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., bedroom, kitchen, toilet"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
                  <input
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., wifi, water"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                  <input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., apartment, city-center"
                  />
                </div>
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="rounded"
                  id="available"
                />
                <label htmlFor="available" className="text-sm text-gray-700">Available</label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Save size={16} className="inline mr-1" />
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Unit Modal */}
      {showEditModal && selectedUnit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Unit</h2>
              <button onClick={() => { setShowEditModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600" title="Close">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleUpdateUnit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    required
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <input
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="studio">Studio</option>
                    <option value="hostel">Hostel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Landlord ID</label>
                  <input
                    value={formData.landlordId}
                    onChange={(e) => setFormData({ ...formData, landlordId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="rounded"
                  id="available-edit"
                />
                <label htmlFor="available-edit" className="text-sm text-gray-700">Available</label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Save size={16} className="inline mr-1" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); resetForm(); }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Property;

