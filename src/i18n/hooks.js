/**
 * Custom Translation Hooks
 */

import { useTranslation } from './TranslationContext';
import { formatDate, formatCurrency, formatNumber, getRelativeTime } from './utils';

/**
 * Hook for formatting dates with current locale
 */
export const useFormatDate = () => {
  const { language } = useTranslation();
  
  return (date, options = {}) => formatDate(date, language, options);
};

/**
 * Hook for formatting currency with current locale
 */
export const useFormatCurrency = () => {
  const { language } = useTranslation();
  
  return (amount, currency = 'USD') => formatCurrency(amount, language, currency);
};

/**
 * Hook for formatting numbers with current locale
 */
export const useFormatNumber = () => {
  const { language } = useTranslation();
  
  return (number, options = {}) => formatNumber(number, language, options);
};

/**
 * Hook for relative time formatting with current locale
 */
export const useRelativeTime = () => {
  const { language } = useTranslation();
  
  return (date) => getRelativeTime(date, language);
};

/**
 * Hook for pluralization based on count
 */
export const usePluralize = () => {
  const { language } = useTranslation();
  
  return (count, forms) => {
    const pluralRules = new Intl.PluralRules(language);
    const rule = pluralRules.select(count);
    
    const text = forms[rule] || forms.other || forms.one || '';
    return text.replace('{count}', count);
  };
};
