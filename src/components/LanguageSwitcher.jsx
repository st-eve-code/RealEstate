'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/i18n';

/**
 * Language Switcher Component
 * Displays a dropdown to switch between available languages
 */
const LanguageSwitcher = ({ variant = 'default' }) => {
  const { language, changeLanguage, availableLanguages, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Language metadata
  const languageData = {
    en: { name: 'English', flag: '🇬🇧', nativeName: 'English' },
    fr: { name: 'French', flag: '🇫🇷', nativeName: 'Français' },
    es: { name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLang) => {
    changeLanguage(newLang);
    setIsOpen(false);
  };

  const currentLanguage = languageData[language] || languageData.en;

  // Compact variant for mobile/navbar
  if (variant === 'compact') {
    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span className="text-xl">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {availableLanguages.map((lang) => {
                const langData = languageData[lang] || { name: lang, flag: '🌐', nativeName: lang };
                return (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`${
                      language === lang
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    } group flex items-center gap-3 px-4 py-2 text-sm w-full text-left transition-colors`}
                    role="menuitem"
                  >
                    <span className="text-xl">{langData.flag}</span>
                    <span className="flex-1">{langData.nativeName}</span>
                    {language === lang && (
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default variant with full styling
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-between w-full gap-3 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentLanguage.flag}</span>
            <div className="text-left">
              <div className="font-semibold">{currentLanguage.nativeName}</div>
              <div className="text-xs text-gray-500">{currentLanguage.name}</div>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-2" role="menu" aria-orientation="vertical">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {t('common.selectLanguage')}
            </div>
            {availableLanguages.map((lang) => {
              const langData = languageData[lang] || { name: lang, flag: '🌐', nativeName: lang };
              return (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`${
                    language === lang
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 border-transparent'
                  } group flex items-center gap-3 px-3 py-3 text-sm w-full text-left rounded-md transition-all border mb-1`}
                  role="menuitem"
                >
                  <span className="text-2xl">{langData.flag}</span>
                  <div className="flex-1">
                    <div className="font-semibold">{langData.nativeName}</div>
                    <div className="text-xs text-gray-500">{langData.name}</div>
                  </div>
                  {language === lang && (
                    <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
