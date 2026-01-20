/**
 * Settings Management Service
 * Handles CRUD operations for system settings in Firestore
 */

import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  GeneralSettings,
  PaymentSettings,
  NotificationSettings,
  SecuritySettings,
  PlatformSettings
} from '../types';

export type {
  GeneralSettings,
  PaymentSettings,
  NotificationSettings,
  SecuritySettings,
  PlatformSettings
};

export interface EmailSettings {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  enableEmailNotifications: boolean;
  welcomeEmailEnabled: boolean;
  subscriptionEmailEnabled: boolean;
  propertyAlertEnabled: boolean;
}

export interface StorageSettings {
  maxFileSize: number; // in MB
  allowedFileTypes: string[];
  storageProvider: 'firebase' | 'aws' | 'cloudinary';
  enableCDN: boolean;
  cdnUrl?: string;
  enableCompression: boolean;
  compressionQuality: number; // 1-100
  autoDeleteOldFiles: boolean;
  retentionDays: number;
}

export interface ApiSettings {
  enableApi: boolean;
  apiKey: string;
  rateLimit: number; // requests per minute
  enableCors: boolean;
  allowedOrigins: string[];
  enableApiLogging: boolean;
  enableCaching: boolean;
  cacheTTL: number; // in seconds
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: string;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  customCSS?: string;
}

export interface SystemSettings {
  general: GeneralSettings;
  email: EmailSettings;
  payment: PaymentSettings;
  notification: NotificationSettings;
  security: SecuritySettings;
  storage: StorageSettings;
  api: ApiSettings;
  theme: ThemeSettings;
  updatedAt?: Timestamp;
  updatedBy?: {
    uid: string;
    name: string;
  };
}

// Default settings
export const defaultSettings: SystemSettings = {
  general: {
    siteName: 'PropertyHub',
    siteDescription: 'Find your perfect property',
    siteUrl: 'https://propertyhub.com',
    contactEmail: 'contact@propertyhub.com',
    supportEmail: 'support@propertyhub.com',
    companyName: 'PropertyHub Inc.',
    companyAddress: '123 Main Street, City, Country',
    companyPhone: '+237 XXX XXX XXX',
    currency: 'XAF',
    timezone: 'Africa/Douala',
    language: 'en',
    maintenanceMode: false,
    allowRegistration: true,
  },
  email: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    fromEmail: 'noreply@propertyhub.com',
    fromName: 'PropertyHub',
    enableEmailNotifications: true,
    welcomeEmailEnabled: true,
    subscriptionEmailEnabled: true,
    propertyAlertEnabled: true,
  },
  payment: {
    currency: 'XAF',
    paymentMethods: {
      momo: true,
      orangeMoney: true,
      paypal: false,
      stripe: false,
    },
    commissionRate: 10,
    taxRate: 0,
    enableAutoRefund: false,
  },
  notification: {
    enablePushNotifications: true,
    enableEmailNotifications: true,
    enableSmsNotifications: false,
    notifyOnNewProperty: true,
    notifyOnNewUser: true,
    notifyOnSubscription: true,
    notifyOnTransaction: true,
    notifyOnReport: true,
    dailyReportEmail: 'admin@propertyhub.com',
  },
  security: {
    enableTwoFactor: false,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    enableCaptcha: false,
    ipWhitelist: [],
    enableAuditLog: true,
  },
  storage: {
    maxFileSize: 10,
    allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    storageProvider: 'firebase',
    enableCDN: false,
    enableCompression: true,
    compressionQuality: 80,
    autoDeleteOldFiles: false,
    retentionDays: 365,
  },
  api: {
    enableApi: true,
    apiKey: '',
    rateLimit: 100,
    enableCors: true,
    allowedOrigins: ['*'],
    enableApiLogging: true,
    enableCaching: true,
    cacheTTL: 300,
  },
  theme: {
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    accentColor: '#F59E0B',
    theme: 'light',
    fontSize: 'medium',
    fontFamily: 'Inter, system-ui, sans-serif',
    borderRadius: 'medium',
  },
};

/**
 * Fetch system settings from Firestore
 */
export async function fetchSettings(): Promise<SystemSettings> {
  try {
    const settingsRef = doc(db, 'system', 'settings');
    const settingsDoc = await getDoc(settingsRef);
    
    if (!settingsDoc.exists()) {
      // Initialize with default settings if not exists
      await setDoc(settingsRef, {
        ...defaultSettings,
        updatedAt: Timestamp.now(),
      });
      return defaultSettings;
    }
    
    return settingsDoc.data() as SystemSettings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return defaultSettings;
  }
}

/**
 * Update system settings
 */
export async function updateSettings(
  section: keyof Omit<SystemSettings, 'updatedAt' | 'updatedBy'>,
  data: Partial<any>,
  userId?: string,
  userName?: string
): Promise<void> {
  try {
    const settingsRef = doc(db, 'system', 'settings');
    
    // Check if document exists, if not create it with defaults
    const settingsDoc = await getDoc(settingsRef);
    if (!settingsDoc.exists()) {
      await setDoc(settingsRef, {
        ...defaultSettings,
        updatedAt: Timestamp.now(),
      });
    }
    
    const updateData: any = {
      [`${section}`]: data,
      updatedAt: Timestamp.now(),
    };
    
    if (userId && userName) {
      updateData.updatedBy = {
        uid: userId,
        name: userName,
      };
    }
    
    await updateDoc(settingsRef, updateData);
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}

/**
 * Reset settings to default
 */
export async function resetSettings(
  section?: keyof Omit<SystemSettings, 'updatedAt' | 'updatedBy'>
): Promise<void> {
  try {
    const settingsRef = doc(db, 'system', 'settings');
    
    if (section) {
      await updateDoc(settingsRef, {
        [section]: defaultSettings[section],
        updatedAt: Timestamp.now(),
      });
    } else {
      await setDoc(settingsRef, {
        ...defaultSettings,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error resetting settings:', error);
    throw error;
  }
}

/**
 * Get a specific setting section
 */
export async function getSettingSection<K extends keyof SystemSettings>(
  section: K
): Promise<SystemSettings[K]> {
  try {
    const settings = await fetchSettings();
    return settings[section];
  } catch (error) {
    console.error('Error fetching setting section:', error);
    return defaultSettings[section];
  }
}

/**
 * Generate a new API key
 */
export function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let apiKey = 'pk_';
  for (let i = 0; i < 32; i++) {
    apiKey += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return apiKey;
}

/**
 * Validate email configuration
 */
export function validateEmailSettings(settings: EmailSettings): boolean {
  if (!settings.smtpHost || !settings.smtpPort) return false;
  if (!settings.fromEmail || !settings.fromName) return false;
  return true;
}

/**
 * Test email connection
 */
export async function testEmailConnection(settings: EmailSettings): Promise<boolean> {
  // In a real implementation, this would send a test email
  // For now, just validate the settings
  return validateEmailSettings(settings);
}
