import { call, mail, locationOutline } from 'ionicons/icons';

/**
 * Footer Links Configuration
 */

// Company Links
export const FOOTER_COMPANY_LINKS = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/contact', name: 'Contact Us' },
  { path: '/blog', name: 'Blog' },
  { path: '/plans', name: 'Subscription' }
];

// Legal Links
export const FOOTER_LEGAL_LINKS = [
  { path: '/policy', name: 'Cookie Policy' },
  { path: '/terms', name: 'Terms & Conditions' },
  { path: '/user-policy', name: 'User Policy' }
];

// Location Links
export const FOOTER_LOCATIONS = [
  { path: '/location/muea', name: 'Muea' },
  { path: '/location/bomaka', name: 'Bomaka' },
  { path: '/location/malingo', name: 'Malingo' },
  { path: '/location/mayor-street', name: 'Mayor-Street' },
  { path: '/location/molyko', name: 'Molyko' },
  { path: '/location/checkpoint', name: 'CheckPoint' },
  { path: '/location/biaka', name: 'Biaka' },
  { path: '/location/all', name: 'More' }
];

// Contact Information
export const FOOTER_CONTACT = [
  { Icons: call, name: '+237681987524' },
  { Icons: call, name: '+237651820548' },
  { Icons: mail, name: 'rentspot@gmail.com' }
];

// Social Media Links
export const FOOTER_SOCIAL = {
  facebook: 'https://facebook.com/yourcompany',
  instagram: 'https://instagram.com/yourcompany',
  twitter: 'https://twitter.com/yourcompany',
  linkedin: 'https://linkedin.com/company/yourcompany'
};
