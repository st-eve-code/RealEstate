'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, User, Clock } from 'lucide-react';
import { fetchUnitReports, fetchUnitById } from './services/unitService';

export default function UnitReports({ unitID, isSidebarCollapsed }) {
  const params = useParams();
  const unitId = unitID || params?.unitId;
  const [reports, setReports] = useState([]);
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(unitId) loadData();
  }, [unitId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [unitData, reportsData] = await Promise.all([
        fetchUnitById(unitId),
        fetchUnitReports(unitId),
      ]);
      setUnit(unitData);
      setReports(reportsData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleString();
    }
    return new Date(timestamp).toLocaleString();
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
            <p className="mt-4 text-gray-600">Loading reports...</p>
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/properties"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Properties
          </Link>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={24} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Unit Reports</h1>
            </div>
            {unit && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h2 className="font-semibold text-lg">{unit.name}</h2>
                <p className="text-sm text-gray-600">
                  Total Reports: <span className="font-semibold">{reports.length}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {reports.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>No reports found for this unit</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reports.map((report) => (
                <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <User size={16} className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Report #{report.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-gray-500">User ID: {report.uid}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={14} />
                      {formatDate(report.createdAt)}
                    </div>
                  </div>
                  <div className="ml-11">
                    <p className="text-gray-700 whitespace-pre-wrap">{report.report}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

