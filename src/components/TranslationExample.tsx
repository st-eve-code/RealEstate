'use client'

import React from 'react';
import { useTranslation, useFormatDate, useFormatCurrency, useRelativeTime } from '@/i18n';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * Example Component Demonstrating Translation Usage
 * Copy and adapt this pattern for your own components
 */
export default function TranslationExample() {
  const { t, language } = useTranslation();
  const formatDate = useFormatDate();
  const formatCurrency = useFormatCurrency();
  const getRelativeTime = useRelativeTime();

  // Example data
  const property = {
    name: 'Modern Studio Apartment',
    price: 1200,
    bedrooms: 1,
    bathrooms: 1,
    available: true,
    listedDate: new Date(Date.now() - 86400000 * 3), // 3 days ago
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Language Switcher */}
      <div className="flex justify-end mb-8">
        <LanguageSwitcher variant="compact" />
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {t('hero.title')}
        </h1>
        <p className="text-lg">
          {t('hero.subtitle')}
        </p>
      </div>

      {/* Property Card Example */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">{property.name}</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-gray-600">{t('properties.price')}:</span>
            <span className="ml-2 font-semibold">
              {formatCurrency(property.price, 'USD')} {t('properties.perMonth')}
            </span>
          </div>
          
          <div>
            <span className="text-gray-600">{t('properties.bedrooms')}:</span>
            <span className="ml-2 font-semibold">{property.bedrooms}</span>
          </div>
          
          <div>
            <span className="text-gray-600">{t('properties.bathrooms')}:</span>
            <span className="ml-2 font-semibold">{property.bathrooms}</span>
          </div>
          
          <div>
            <span className="text-gray-600">Status:</span>
            <span className={`ml-2 font-semibold ${property.available ? 'text-green-600' : 'text-red-600'}`}>
              {property.available ? t('properties.available') : t('properties.unavailable')}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Listed {getRelativeTime(property.listedDate)}
        </p>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {t('properties.viewDetails')}
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            {t('properties.contactOwner')}
          </button>
        </div>
      </div>

      {/* Form Example */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">{t('contact.title')}</h3>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('contact.name')}
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder={t('contact.name')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('contact.email')}
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder={t('contact.email')}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('contact.message')}
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={4}
              placeholder={t('contact.message')}
            />
          </div>
          
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t('contact.sendMessage')}
          </button>
        </form>
      </div>

      {/* Dashboard Stats Example */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-gray-600 text-sm">{t('dashboard.totalProperties')}</h4>
          <p className="text-3xl font-bold text-blue-600">24</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-gray-600 text-sm">{t('dashboard.activeListings')}</h4>
          <p className="text-3xl font-bold text-green-600">18</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-gray-600 text-sm">{t('dashboard.pendingRequests')}</h4>
          <p className="text-3xl font-bold text-orange-600">6</p>
        </div>
      </div>

      {/* Messages Example */}
      <div className="space-y-3 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">✅ {t('success.saved')}</p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">ℹ️ {t('common.loading')}</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">❌ {t('errors.required')}</p>
        </div>
      </div>

      {/* Current Language Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-2">Current Language Information</h4>
        <p className="text-sm text-gray-600">
          Language Code: <span className="font-mono font-semibold">{language}</span>
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Today's Date: <span className="font-semibold">{formatDate(new Date())}</span>
        </p>
      </div>
    </div>
  );
}
