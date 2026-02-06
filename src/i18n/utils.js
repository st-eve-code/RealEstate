/**
 * Translation Utility Functions
 */

/**
 * Format date according to current locale
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - Locale code (en, fr, es)
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'en', options = {}) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  try {
    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateObj.toLocaleDateString();
  }
};

/**
 * Format currency according to current locale
 * @param {number} amount - Amount to format
 * @param {string} locale - Locale code (en, fr, es)
 * @param {string} currency - Currency code (USD, EUR, etc.)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, locale = 'en', currency = 'USD') => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency} ${amount}`;
  }
};

/**
 * Format number according to current locale
 * @param {number} number - Number to format
 * @param {string} locale - Locale code (en, fr, es)
 * @param {object} options - Intl.NumberFormat options
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, locale = 'en', options = {}) => {
  try {
    return new Intl.NumberFormat(locale, options).format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return number.toString();
  }
};

/**
 * Pluralize text based on count
 * @param {number} count - Count for pluralization
 * @param {object} forms - Object with singular and plural forms
 * @param {string} locale - Locale code
 * @returns {string} Appropriate plural form
 * 
 * @example
 * pluralize(1, { one: '{count} item', other: '{count} items' }, 'en')
 * // Returns: "1 item"
 */
export const pluralize = (count, forms, locale = 'en') => {
  const pluralRules = new Intl.PluralRules(locale);
  const rule = pluralRules.select(count);
  
  const text = forms[rule] || forms.other || forms.one || '';
  return text.replace('{count}', count);
};

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {Date|string|number} date - Date to compare
 * @param {string} locale - Locale code
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date, locale = 'en') => {
  const dateObj = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / secondsInUnit);
    
    if (interval >= 1) {
      try {
        const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
        return rtf.format(-interval, unit);
      } catch (error) {
        console.error('Error formatting relative time:', error);
        return dateObj.toLocaleDateString();
      }
    }
  }

  return 'just now';
};

/**
 * Get language direction (LTR or RTL)
 * @param {string} locale - Locale code
 * @returns {string} 'ltr' or 'rtl'
 */
export const getLanguageDirection = (locale) => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(locale) ? 'rtl' : 'ltr';
};

/**
 * Interpolate variables into translation string
 * @param {string} text - Text with placeholders
 * @param {object} params - Object with values to interpolate
 * @returns {string} Interpolated text
 * 
 * @example
 * interpolate('Hello {name}, you have {count} messages', { name: 'John', count: 5 })
 * // Returns: "Hello John, you have 5 messages"
 */
export const interpolate = (text, params = {}) => {
  if (!text || typeof text !== 'string') return text;
  
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? params[key] : match;
  });
};

/**
 * Get locale-specific settings
 * @param {string} locale - Locale code
 * @returns {object} Locale settings
 */
export const getLocaleSettings = (locale) => {
  const settings = {
    en: {
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      firstDayOfWeek: 0, // Sunday
      currency: 'USD',
      direction: 'ltr',
    },
    fr: {
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      firstDayOfWeek: 1, // Monday
      currency: 'EUR',
      direction: 'ltr',
    },
    es: {
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      firstDayOfWeek: 1, // Monday
      currency: 'EUR',
      direction: 'ltr',
    },
  };

  return settings[locale] || settings.en;
};

/**
 * Validate if a locale is supported
 * @param {string} locale - Locale code
 * @param {array} supportedLocales - Array of supported locale codes
 * @returns {boolean} Whether locale is supported
 */
export const isLocaleSupported = (locale, supportedLocales = ['en', 'fr', 'es']) => {
  return supportedLocales.includes(locale);
};

/**
 * Get browser's preferred languages
 * @returns {array} Array of preferred language codes
 */
export const getBrowserLanguages = () => {
  if (typeof window === 'undefined') return ['en'];
  
  const languages = navigator.languages || [navigator.language || navigator.userLanguage];
  return languages.map(lang => lang.split('-')[0]);
};

/**
 * Find best matching locale from available ones
 * @param {array} availableLocales - Array of available locale codes
 * @returns {string} Best matching locale code
 */
export const getBestMatchingLocale = (availableLocales = ['en', 'fr', 'es']) => {
  const browserLanguages = getBrowserLanguages();
  
  for (const browserLang of browserLanguages) {
    if (availableLocales.includes(browserLang)) {
      return browserLang;
    }
  }
  
  return availableLocales[0] || 'en';
};
