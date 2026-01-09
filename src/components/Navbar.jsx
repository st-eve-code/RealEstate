'use client'

import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '../assets/logo.svg';
import { LANGUAGES, SERVICE_LINKS, ACCOUNT_LINKS } from '@/constants';
import { useTranslation } from '@/i18n';

const Nav_bar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { t, language, changeLanguage } = useTranslation();

    //passing useNavigate to navigate for better accessibility
    const router = useRouter();
    
    // Constants imported from @/constants
    
    // Close dropdowns when clicking anywhere
    useEffect(() => {
        const handleClickOutside = () => {
            if (activeDropdown) {
                setActiveDropdown(null);
            }
            if (isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [activeDropdown, isMenuOpen]);

    const toggleMenu = (e) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
        if (isMenuOpen) setActiveDropdown(null);
    };

    const toggleDropdown = (e, dropdown) => {
        e.stopPropagation();
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const handleLanguageChange = (langCode) => {
        changeLanguage(langCode);
        setActiveDropdown(null);
    };

    // Navigation data imported from constants

    // Account dropdown for mobile
    const AccountMobileDropdown = () => {
        const [showServices, setShowServices] = useState(false);

        return (
            <div>
                <button
                    onClick={(e) => toggleDropdown(e, 'accountMobile')}
                    className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                    <User className="mr-2" size={16} />
                    <span>{t('nav.account')}</span>
                    <ChevronDown
                        className={`ml-auto transition-transform ${activeDropdown === 'accountMobile' ? 'transform rotate-180' : ''}`}
                        size={16}
                    />
                </button>
                
                {activeDropdown === 'accountMobile' && (
                    <div className="pl-6 py-2 space-y-1">
                        {ACCOUNT_LINKS.map(link => (
                            <Link
                                key={link.name}
                                href={link.link || '#'}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowServices(!showServices);
                            }}
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                            <div className="flex justify-between items-center font-Custom font-normal">
                                <span>{t('nav.services')}</span>
                                <ChevronDown
                                    className={`transition-transform ${showServices ? 'transform rotate-180' : ''}`}
                                    size={12}
                                />
                            </div>
                        </button>
                        
                        {showServices && (
                            <div className="pl-4 space-y-1">
                                {SERVICE_LINKS.map(service => (
                                    <Link
                                        key={service.name}
                                        href={service.link || '#'}
                                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {service.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Mobile menu component
    const MobileMenu = () => (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50">
            <div className="px-2 pt-2 pb-4 space-y-1">
                <Link
                    href="/"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                    }}
                >
                    {t('nav.home')}
                </Link>
                
                <Link
                    href="/about"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                    }}
                >
                    {t('nav.about')}
                </Link>
                
                <Link
                    href="/blog"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                    }}
                >
                    {t('nav.blog')}
                </Link>
                
                <Link
                    href="/contact"
                    className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(false);
                    }}
                >
                    {t('nav.contact')}
                </Link>
                
                <div>
                    <button
                        onClick={(e) => toggleDropdown(e, 'languageMobile')}
                        className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    >
                        <Globe size={16} className="mr-2" />
                        <span>{LANGUAGES.find(l => l.code === language)?.name}</span>
                        <ChevronDown
                            className={`ml-auto transition-transform ${activeDropdown === 'languageMobile' ? 'transform rotate-180' : ''}`}
                            size={16}
                        />
                    </button>
                    {activeDropdown === 'languageMobile' && (
                        <div className="pl-6 py-2 space-y-1" onClick={(e) => e.stopPropagation()}>
                            {LANGUAGES.map((item) => (
                                <button
                                    key={item.code}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleLanguageChange(item.code);
                                        setActiveDropdown(null);
                                    }}
                                    className={`block w-full text-left px-4 py-2 text-sm ${item.code === language ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:bg-blue-50 hover:text-blue-600`}
                                >
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                <AccountMobileDropdown />
            </div>
        </div>
    );

    const DesktopDropdown = ({ title, icon, items, dropdownKey, isLanguage = false }) => (
        <div className="relative">
            <button
                onClick={(e) => toggleDropdown(e, dropdownKey)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
            >
                {icon}
                <span className={icon ? 'ml-1' : ''}>
                    {isLanguage ? LANGUAGES.find(l => l.code === language)?.name : title}
                </span>
                <ChevronDown className="ml-1" size={16} />
            </button>
            {activeDropdown === dropdownKey && (
                <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1" onClick={(e) => e.stopPropagation()}>
                    {items.map((item, index) => (
                        <React.Fragment key={item.name || item.code || `item-${index}`}>
                            {item.isDivider ? (
                                <div className="border-t border-gray-200 my-1"></div>
                            ) : (
                                <Link
                                    href={item.link || '#'}
                                    className={`block px-4 py-2 text-sm ${isLanguage && item.code === language ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:bg-blue-50 hover:text-blue-600`}
                                    onClick={(e) => {
                                        if (isLanguage) {
                                            e.preventDefault();
                                            handleLanguageChange(item.code);
                                        }
                                        setActiveDropdown(null);
                                    }}
                                >
                                    {item.name}
                                </Link>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <nav className="bg-white shadow-sm h-13 top-0 sticky z-50">
            <div className="md:max-w-7xl w-full mx-auto px-3 lg:px-10">
                <div className="flex justify-between h-16">
                    {/* Logo - using imported SVG */}
                    <div className="flex-shrink-0 flex items-center">
                        <img src={Logo.src || Logo} onClick={()=>router.push('/')} alt="RentSpot Logo" className="h-9 lg:h-9 w-auto cursor-pointer" />
                    </div>
                    
                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                            {t('nav.home')}
                        </Link>
                        <Link href="/about" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 cursor-pointer">
                            {t('nav.about')}
                        </Link>
                        
                        <Link href="/blog" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                            {t('nav.blog')}
                        </Link>
                        
                        <Link href="/contact" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                            {t('nav.contact')}
                        </Link>
                        
                        <DesktopDropdown
                            icon={<Globe size={16} />}
                            title="Language"
                            items={LANGUAGES}
                            dropdownKey="language"
                            isLanguage
                        />
                        
                        <DesktopDropdown 
                            icon={<User size={16} />}
                            title={t('nav.account')}
                            items={[
                                ...ACCOUNT_LINKS,
                                { isDivider: true },
                                ...SERVICE_LINKS
                            ]} 
                            dropdownKey="account" 
                        />
                    </div>
                    
                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
                            aria-expanded={isMenuOpen}
                        >
                            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Mobile menu */}
            {isMenuOpen && <MobileMenu />}
        </nav>
    );
};

export default Nav_bar;