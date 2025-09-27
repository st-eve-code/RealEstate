import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';
const Nav_bar = ({onAboutClick}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [currentLanguage, setCurrentLanguage] = useState('en');

    // Available languages
    const Languages = [
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'Français' },
    ];

    //passing useNavigate to navigate for better accessibility
    const navigate = useNavigate();
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
        setCurrentLanguage(langCode);
        setActiveDropdown(null);
    };

    // Navigation data
    const propertyTypes = [
        { name: 'Hostels', link: '/properties/hostels' },
        { name: 'Apartments', link: '/properties/apartments' },
        { name: 'Studios', link: '/properties/studios' },
    ];

    const servicesLinks = [
        { name: 'Cite Cleaning', link: '/services/management' },
        { name: 'Pickups', link: '/services/valuation' },
    ];

    const accountLinks = [
        { name: 'Login', link: '/login' },
        { name: 'Sign Up', link: '/signup' },
    ];

    // Mobile menu component
    const MobileMenu = () => (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-50">
            <div className="px-2 pt-2 pb-4 space-y-1">
                <MobileNavItem href="/" text="Home" />
                <MobileNavItem href="/#about-us" text="About" />
                
                <MobileDropdown 
                    title="Properties"
                    items={propertyTypes}
                    isOpen={activeDropdown === 'propertiesMobile'}
                    toggle={(e) => toggleDropdown(e, 'propertiesMobile')}
                />
                
                <MobileNavItem href="/contact" text="Contact Us" />
                
                
                <MobileDropdown
                    icon={<Globe size={16} className="mr-2" />}
                    title={Languages.find(l => l.code === currentLanguage)?.name}
                    items={Languages}
                    isOpen={activeDropdown === 'languageMobile'}
                    toggle={(e) => toggleDropdown(e, 'languageMobile')}
                    isLanguage
                />
                
                <AccountMobileDropdown />
            </div>
        </div>
    );

    // Account dropdown for mobile
    const AccountMobileDropdown = () => {
        const [showServices, setShowServices] = useState(false);

        return (
            <div>
                <button
                    onClick={(e) => toggleDropdown(e, 'accountMobile')}
                    className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                    <User className="mr-2" size={16} />
                    <span>Account</span>
                    <ChevronDown
                        className={`ml-auto transition-transform ${activeDropdown === 'accountMobile' ? 'transform rotate-180' : ''}`}
                        size={16}
                    />
                </button>
                
                {activeDropdown === 'accountMobile' && (
                    <div className="pl-6 py-2 space-y-1">
                        {accountLinks.map(link => (
                            <a
                                key={link.name}
                                href={link.link}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {link.name}
                            </a>
                        ))}
                        
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowServices(!showServices);
                            }}
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                            <div className="flex justify-between items-center font-Custom font-normal">
                                <span>Services</span>
                                <ChevronDown
                                    className={`transition-transform ${showServices ? 'transform rotate-180' : ''}`}
                                    size={12}
                                />
                            </div>
                        </button>
                        
                        {showServices && (
                            <div className="pl-4 space-y-1">
                                {servicesLinks.map(service => (
                                    <a
                                        key={service.name}
                                        href={service.link}
                                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {service.name}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Reusable components
    //mobile screen navigation links 
    
    const MobileNavItem = ({ href, text }) => (
        <Link
            to={href}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(false);
            }}
        >
            {text}
        </Link>
    );

    const MobileDropdown = ({ icon, title, items, isOpen, toggle, isLanguage = false }) => (
        <div>
            <button
                onClick={toggle}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
                {icon}
                <span className={icon ? 'ml-2' : ''}>{title}</span>
                <ChevronDown
                    className={`ml-auto transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                    size={16}
                />
            </button>
            {isOpen && (
                <div className="pl-6 py-2 space-y-1" onClick={(e) => e.stopPropagation()}>
                    {items.map((item) => (
                        <a
                            key={item.name || item.code}
                            href={isLanguage ? '#' : item.link}
                            className={`block px-4 py-2 text-sm ${isLanguage && item.code === currentLanguage ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:bg-blue-50 hover:text-blue-600`}
                            onClick={(e) => {
                                if (isLanguage) {
                                    e.preventDefault();
                                    handleLanguageChange(item.code);
                                }
                                setActiveDropdown(null);
                            }}
                        >
                            {item.name}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );

    const DesktopDropdown = ({ title, icon, items, dropdownKey, isLanguage = false }) => (
        <div className="relative">
            <button
                onClick={(e) => toggleDropdown(e, dropdownKey)}
                className="flex items-center px-3 py-2 text-xs font-medium text-gray-700 hover:text-blue-600"
            >
                {icon}
                <span className={icon ? 'ml-1' : ''}>
                    {isLanguage ? Languages.find(l => l.code === currentLanguage)?.name : title}
                </span>
                <ChevronDown className="ml-1" size={16} />
            </button>
            {activeDropdown === dropdownKey && (
                <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1" onClick={(e) => e.stopPropagation()}>
                    {items.map((item) => (
                        <React.Fragment key={item.name || item.code}>
                            {item.isDivider ? (
                                <div className="border-t border-gray-200 my-1"></div>
                            ) : (
                                <a
                                    href={isLanguage ? '#' : item.link}
                                    className={`block px-4 py-2 text-sm ${isLanguage && item.code === currentLanguage ? 'text-blue-600 font-medium' : 'text-gray-700'} hover:bg-blue-50 hover:text-blue-600`}
                                    onClick={(e) => {
                                        if (isLanguage) {
                                            e.preventDefault();
                                            handleLanguageChange(item.code);
                                        }
                                        setActiveDropdown(null);
                                    }}
                                >
                                    {item.name}
                                </a>
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
                        <img src={Logo} onClick={()=>navigate('/')} alt="RentSpot Logo" className="h-9 lg:h-9 w-auto cursor-pointer" />
                    </div>
                    
                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/" className="px-3 py-2 text-xs font-medium text-gray-700 hover:text-blue-600">
                            Home
                        </Link>
                        <Link to="/#about-us" className="px-3 py-2 text-xs font-medium text-gray-700 hover:text-blue-600 cursor-pointer">
                            About us
                        </Link>
                        
                        <DesktopDropdown 
                            title="Properties"
                            items={propertyTypes} 
                            dropdownKey="properties" 
                        />
                        
                        <a href="/contact" className="px-3 py-2 text-xs font-medium text-gray-700 hover:text-blue-600">
                            Contact Us
                        </a>
                        
                        <DesktopDropdown
                            icon={<Globe size={16} />}
                            title="Language"
                            items={Languages}
                            dropdownKey="language"
                            isLanguage
                        />
                        
                        <DesktopDropdown 
                            icon={<User size={16} />}
                            title="Account"
                            items={[
                                ...accountLinks,
                                { isDivider: true },
                                ...servicesLinks
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