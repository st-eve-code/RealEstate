import React, { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const closeAllDropdowns = () => {
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setOpenDropdown(null);
  };

  const languages = [
    { code: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'FR', name: 'Français', flag: '🇫🇷' },
   
  ];

  const centerNavigationItems = [
    
    {
      name: 'Resources',
      dropdown: [
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Blog', href: '/blog' }
      ]
    },
    {
      name: 'Rent',
      dropdown: [
        { name: 'Apartment', href: '/rent/apartment' },
        { name: 'Hostel', href: '/rent/hostel' },
        { name: 'Studio', href: '/rent/studio' }
      ]
    },
    {
      name: 'Services',
      dropdown: [
        { name: 'Property Cleaning', href: '/services/cleaning' },
        { name: 'Load Carrier', href: '/services/carrier' },
        { name: 'Help', href: '/services/help' }
      ]
    }
  ];

  const rightNavigationItems = [
    {
      name: 'Account',
      dropdown: [
        { name: 'Login', href: '/login' },
        { name: 'Signup', href: '/signup' }
      ]
    }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left - Logo and Home */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <a href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Logo
              </a>
            </div>
            
          </div>

          {/* Center - Main Navigation (Resources, Rent, Services) */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Home Link - Desktop Only */}
            <div className="hidden md:block">
              <a
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
              >
                Home
              </a>
            </div>
            {centerNavigationItems.map((item) => (
              <div key={item.name} className="relative">
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {item.name}
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                      openDropdown === item.name ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {openDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu">
                      {item.dropdown.map((dropdownItem) => (
                        <a
                          key={dropdownItem.name}
                          href={dropdownItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          role="menuitem"
                          onClick={closeAllDropdowns}
                        >
                          {dropdownItem.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('language')}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="mr-1">
                  {languages.find(lang => lang.code === selectedLanguage)?.flag}
                </span>
                {selectedLanguage}
                <svg
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    openDropdown === 'language' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Language Dropdown Menu */}
              {openDropdown === 'language' && (
                <div className="absolute top-full right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto z-50">
                  <div className="py-1" role="menu">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={`w-full text-left flex items-center px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                          selectedLanguage === language.code 
                            ? 'bg-blue-50 text-blue-600 font-medium' 
                            : 'text-gray-700'
                        }`}
                        role="menuitem"
                      >
                        <span className="mr-3">{language.flag}</span>
                        <div>
                          <div className="font-medium">{language.code}</div>
                          <div className="text-xs text-gray-500">{language.name}</div>
                        </div>
                        {selectedLanguage === language.code && (
                          <svg className="ml-auto h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Right - Account and Language */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Account Dropdown */}
              {rightNavigationItems.map((item) => (
                <div key={item.name} className="relative">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {item.name}
                    <svg
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                        openDropdown === item.name ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Account Dropdown Menu */}
                  {openDropdown === item.name && (
                    <div className="absolute top-full right-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1" role="menu">
                        {item.dropdown.map((dropdownItem) => (
                          <a
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            role="menuitem"
                            onClick={closeAllDropdowns}
                          >
                            {dropdownItem.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t">
            {/* Home Link - Mobile */}
            <a
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-white transition-colors"
              onClick={closeAllDropdowns}
            >
              Home
            </a>

            {/* Center Navigation Items - Mobile */}
            {centerNavigationItems.map((item) => (
              <div key={item.name}>
                <button
                  onClick={() => toggleDropdown(`mobile-${item.name}`)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {item.name}
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openDropdown === `mobile-${item.name}` ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Mobile Dropdown */}
                {openDropdown === `mobile-${item.name}` && (
                  <div className="pl-6 space-y-1">
                    {item.dropdown.map((dropdownItem) => (
                      <a
                        key={dropdownItem.name}
                        href={dropdownItem.href}
                        className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-white transition-colors"
                        onClick={closeAllDropdowns}
                      >
                        {dropdownItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Account - Mobile */}
            {rightNavigationItems.map((item) => (
              <div key={item.name}>
                <button
                  onClick={() => toggleDropdown(`mobile-${item.name}`)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {item.name}
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openDropdown === `mobile-${item.name}` ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Mobile Account Dropdown */}
                {openDropdown === `mobile-${item.name}` && (
                  <div className="pl-6 space-y-1">
                    {item.dropdown.map((dropdownItem) => (
                      <a
                        key={dropdownItem.name}
                        href={dropdownItem.href}
                        className="block px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-white transition-colors"
                        onClick={closeAllDropdowns}
                      >
                        {dropdownItem.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Mobile Language Dropdown */}
            <div>
              <button
                onClick={() => toggleDropdown('mobile-language')}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="flex items-center">
                  <span className="mr-2">
                    {languages.find(lang => lang.code === selectedLanguage)?.flag}
                  </span>
                  Language ({selectedLanguage})
                </div>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${
                    openDropdown === 'mobile-language' ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mobile Language Dropdown */}
              {openDropdown === 'mobile-language' && (
                <div className="pl-6 space-y-1 max-h-48 overflow-y-auto">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium hover:text-blue-600 hover:bg-white transition-colors ${
                        selectedLanguage === language.code 
                          ? 'bg-white text-blue-600 font-semibold' 
                          : 'text-gray-600'
                      }`}
                    >
                      <span className="mr-3">{language.flag}</span>
                      <div className="flex-1">
                        <div>{language.code}</div>
                        <div className="text-xs text-gray-500">{language.name}</div>
                      </div>
                      {selectedLanguage === language.code && (
                        <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// Demo component to show the navbar in action
const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      {/* Demo content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Our Website</h1>
              <p className="text-gray-600">
                This navigation bar features a three-section layout with main services in the center and account functions on the right.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Resources</h3>
              <p className="text-blue-700">Access our comprehensive resources including about us, contact information, and blog posts.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Rent</h3>
              <p className="text-green-700">Find the perfect rental property including apartments, hostels, and studios.</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Services</h3>
              <p className="text-purple-700">Explore our services including property cleaning, load carrier, and help desk.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;