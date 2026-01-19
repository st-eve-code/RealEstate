'use client'

import React from 'react';
import { useTranslation, useFormatDate, useFormatCurrency, useRelativeTime } from '@/i18n';
import LanguageSwitcher from '@/components/LanguageSwitcher';

/**
 * Translation System Demo Page
 * Demonstrates all features of the translation system
 */
export default function TranslationDemoPage() {
  const { t, language } = useTranslation();
  const formatDate = useFormatDate();
  const formatCurrency = useFormatCurrency();
  const getRelativeTime = useRelativeTime();

  const sampleDate = new Date('2024-12-15');
  const recentDate = new Date(Date.now() - 3600000 * 2); // 2 hours ago

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌍 {t('common.selectLanguage')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete Translation System Demo
          </p>
          <div className="flex justify-center">
            <LanguageSwitcher variant="default" />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Current Language: <span className="font-semibold">{language.toUpperCase()}</span>
          </p>
        </div>

        {/* Demo Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Navigation Translations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📱 {t('nav.home')} - Navigation
            </h2>
            <div className="space-y-2">
              <TranslationItem label="Home" value={t('nav.home')} />
              <TranslationItem label="About" value={t('nav.about')} />
              <TranslationItem label="Blog" value={t('nav.blog')} />
              <TranslationItem label="Contact" value={t('nav.contact')} />
              <TranslationItem label="Properties" value={t('nav.properties')} />
              <TranslationItem label="Login" value={t('nav.login')} />
              <TranslationItem label="Sign Up" value={t('nav.signup')} />
            </div>
          </div>

          {/* Auth Translations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🔐 {t('auth.welcomeBack')} - Authentication
            </h2>
            <div className="space-y-2">
              <TranslationItem label="Welcome Back" value={t('auth.welcomeBack')} />
              <TranslationItem label="Email" value={t('auth.email')} />
              <TranslationItem label="Password" value={t('auth.password')} />
              <TranslationItem label="Login Button" value={t('auth.loginButton')} />
              <TranslationItem label="Forgot Password?" value={t('auth.forgotPassword')} />
              <TranslationItem label="Don't have account?" value={t('auth.dontHaveAccount')} />
            </div>
          </div>

          {/* Dashboard Translations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📊 {t('dashboard.overview')} - Dashboard
            </h2>
            <div className="space-y-2">
              <TranslationItem label="Welcome" value={t('dashboard.welcome')} />
              <TranslationItem label="Overview" value={t('dashboard.overview')} />
              <TranslationItem label="Properties" value={t('dashboard.properties')} />
              <TranslationItem label="Messages" value={t('dashboard.messages')} />
              <TranslationItem label="Settings" value={t('dashboard.settings')} />
              <TranslationItem label="Total Properties" value={t('dashboard.totalProperties')} />
            </div>
          </div>

          {/* Properties Translations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🏠 {t('properties.title')} - Properties
            </h2>
            <div className="space-y-2">
              <TranslationItem label="View Details" value={t('properties.viewDetails')} />
              <TranslationItem label="Bedrooms" value={t('properties.bedrooms')} />
              <TranslationItem label="Bathrooms" value={t('properties.bathrooms')} />
              <TranslationItem label="Price" value={t('properties.price')} />
              <TranslationItem label="Available" value={t('properties.available')} />
              <TranslationItem label="Contact Owner" value={t('properties.contactOwner')} />
            </div>
          </div>

          {/* Common Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              ⚙️ {t('common.loading')} - Common Actions
            </h2>
            <div className="space-y-2">
              <TranslationItem label="Save" value={t('common.save')} />
              <TranslationItem label="Cancel" value={t('common.cancel')} />
              <TranslationItem label="Delete" value={t('common.delete')} />
              <TranslationItem label="Edit" value={t('common.edit')} />
              <TranslationItem label="Search" value={t('common.search')} />
              <TranslationItem label="Submit" value={t('common.submit')} />
            </div>
          </div>

          {/* Error & Success Messages */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              💬 Messages
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-800">❌ {t('errors.required')}</p>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-800">❌ {t('errors.invalidEmail')}</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">✅ {t('success.saved')}</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">✅ {t('success.updated')}</p>
              </div>
            </div>
          </div>

          {/* Date Formatting */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📅 Date Formatting
            </h2>
            <div className="space-y-2">
              <TranslationItem label="Sample Date" value={formatDate(sampleDate)} />
              <TranslationItem 
                label="Short Format" 
                value={formatDate(sampleDate, { dateStyle: 'short' })} 
              />
              <TranslationItem 
                label="Long Format" 
                value={formatDate(sampleDate, { dateStyle: 'full' })} 
              />
              <TranslationItem 
                label="Relative Time" 
                value={getRelativeTime(recentDate)} 
              />
            </div>
          </div>

          {/* Currency Formatting */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              💰 Currency Formatting
            </h2>
            <div className="space-y-2">
              <TranslationItem label="USD" value={formatCurrency(1234.56, 'USD')} />
              <TranslationItem label="EUR" value={formatCurrency(1234.56, 'EUR')} />
              <TranslationItem label="GBP" value={formatCurrency(1234.56, 'GBP')} />
              <TranslationItem label="Large Amount" value={formatCurrency(1234567.89, 'USD')} />
            </div>
          </div>

          {/* Interpolation Demo */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              🔧 Advanced Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Nested Keys</h3>
                <code className="block p-3 bg-gray-100 rounded text-sm">
                  t('values.locateProperties.title')
                </code>
                <p className="mt-2 text-gray-600">{t('values.locateProperties.title')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Fallback to English</h3>
                <code className="block p-3 bg-gray-100 rounded text-sm">
                  t('nonexistent.key')
                </code>
                <p className="mt-2 text-gray-600">{t('nonexistent.key')}</p>
              </div>
            </div>
          </div>

          {/* Hero Section Example */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 lg:col-span-2 text-white">
            <h2 className="text-3xl font-bold mb-4">
              {t('hero.title')}
            </h2>
            <p className="text-lg mb-6">
              {t('hero.subtitle')}
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition">
                {t('common.getStarted')}
              </button>
              <button className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition">
                {t('common.getMoreInfo')}
              </button>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">
            📚 How to Use in Your Components
          </h3>
          <div className="space-y-4">
            <CodeBlock
              title="1. Import the hook"
              code={`import { useTranslation } from '@/i18n';`}
            />
            <CodeBlock
              title="2. Use in your component"
              code={`const { t, language, changeLanguage } = useTranslation();\n\nreturn (\n  <h1>{t('nav.home')}</h1>\n);`}
            />
            <CodeBlock
              title="3. Add Language Switcher"
              code={`import LanguageSwitcher from '@/components/LanguageSwitcher';\n\n<LanguageSwitcher variant="compact" />`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
const TranslationItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <span className="text-sm text-gray-500">{label}:</span>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
);

const CodeBlock = ({ title, code }: { title: string; code: string }) => (
  <div>
    <p className="text-sm font-semibold text-blue-800 mb-2">{title}</p>
    <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
      <code>{code}</code>
    </pre>
  </div>
);
