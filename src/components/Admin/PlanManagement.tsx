'use client'

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Check,
  DollarSign,
  Calendar,
  Award,
  TrendingUp,
  Users
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { 
  fetchPlans, 
  createPlan, 
  updatePlan, 
  deletePlan,
  getPlanStats,
  PlanFormData 
} from '@/lib/services/planService';
import { Plan } from '@/lib/types';

interface PlanManagementProps {
  isSidebarCollapsed?: boolean;
}

export default function PlanManagement({ isSidebarCollapsed }: PlanManagementProps) {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [stats, setStats] = useState({
    totalPlans: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    totalMembers: 0,
  });

  // Form state
  const [formData, setFormData] = useState<PlanFormData>({
    name: '',
    price: 0,
    duration: 30,
    features: [],
    points: 0,
    description: '',
    accType: 'tenant',
    popular: false,
  });
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    loadPlans();
    loadStats();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await fetchPlans();
      setPlans(data);
    } catch (error) {
      console.error('Error loading plans:', error);
      alert('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getPlanStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleOpenModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        price: plan.price,
        duration: plan.duration,
        features: plan.features,
        points: plan.points,
        description: '',
        accType: 'tenant',
        popular: false,
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        price: 0,
        duration: 30,
        features: [],
        points: 0,
        description: '',
        accType: 'tenant',
        popular: false,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFeatureInput('');
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()],
      });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('You must be logged in');
      return;
    }

    try {
      if (editingPlan) {
        await updatePlan(editingPlan.id as any, formData);
        alert('Plan updated successfully');
      } else {
        await createPlan(formData, user.uid, user.displayName || user.email);
        alert('Plan created successfully');
      }
      
      handleCloseModal();
      loadPlans();
      loadStats();
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Failed to save plan');
    }
  };

  const handleDeleteClick = (plan: Plan) => {
    setPlanToDelete(plan);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;

    try {
      await deletePlan(planToDelete.id as any);
      alert('Plan deleted successfully');
      setShowDeleteConfirm(false);
      setPlanToDelete(null);
      loadPlans();
      loadStats();
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Plans</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPlans}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Award className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalRevenue.toLocaleString()} XAF
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <DollarSign className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Plans Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Subscription Plans</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Create Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="relative p-6 transition-shadow bg-white border border-gray-200 rounded-lg hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(plan)}
                  className="p-2 text-blue-600 transition-colors rounded hover:bg-blue-50"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteClick(plan)}
                  className="p-2 text-red-600 transition-colors rounded hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
              <span className="text-gray-600"> XAF</span>
            </div>

            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
              <Calendar size={16} />
              <span>{plan.duration} days</span>
            </div>

            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
              <Award size={16} />
              <span>{plan.points} points</span>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="mb-2 text-sm font-semibold text-gray-700">Features:</p>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check size={16} className="flex-shrink-0 mt-0.5 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              Created: {plan.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
            </div>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="py-12 text-center">
          <Award size={48} className="mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No plans created yet</p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 text-blue-600 hover:underline"
          >
            Create your first plan
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingPlan ? 'Edit Plan' : 'Create New Plan'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Plan Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Price (XAF) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Duration (days) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Points *
                </label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Account Type
                </label>
                <select
                  value={formData.accType}
                  onChange={(e) => setFormData({ ...formData, accType: e.target.value as 'tenant' | 'landlord' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="tenant">Tenant</option>
                  <option value="landlord">Landlord</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Features
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    placeholder="Enter a feature and press Enter"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-700">{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && planToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Confirm Delete</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete the plan "{planToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setPlanToDelete(null);
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
