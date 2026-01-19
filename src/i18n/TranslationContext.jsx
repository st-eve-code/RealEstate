'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from './locales/en';
import { fr } from './locales/fr';
import { es } from './locales/es';

const translations = {
  en,
  fr,
  es,
};

const TranslationContext = createContext();

/**
 * Get browser language
 * @returns {string} Language code (en, fr, etc.)
 */
const getBrowserLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language || navigator.userLanguage;
  const langCode = browserLang.split('-')[0]; // 'en-US' -> 'en'
  
  // Return language if supported, otherwise default to English
  return translations[langCode] ? langCode : 'en';
};

/**
 * Get stored language from localStorage
 */
const getStoredLanguage = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('preferred-language');
};

/**
 * Store language preference in localStorage
 */
const storeLanguage = (lang) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('preferred-language', lang);
};

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [mounted, setMounted] = useState(false);

  // Initialize language on mount
  useEffect(() => {
    const storedLang = getStoredLanguage();
    const browserLang = getBrowserLanguage();
    const initialLang = storedLang || browserLang;
    
    setLanguage(initialLang);
    setMounted(true);
  }, []);

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLanguage(newLang);
      storeLanguage(newLang);
    } else {
      console.warn(`Language "${newLang}" not supported. Falling back to English.`);
    }
  };

  /**
   * Get nested translation using dot notation
   * @param {string} key - Translation key (e.g., 'nav.home', 'auth.welcomeBack')
   * @param {object} params - Optional parameters for interpolation
   * @returns {string} Translated text
   */
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object') {
            value = value[fallbackKey];
          } else {
            return key; // Return key if not found in fallback
          }
        }
        break;
      }
    }

    // Handle interpolation (e.g., "Hello {name}" with params { name: 'John' })
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }

    return value || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    availableLanguages: Object.keys(translations),
    mounted,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

/**
 * Hook to use translations in components
 * @returns {{ language: string, changeLanguage: function, t: function, availableLanguages: string[], mounted: boolean }}
 */
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
