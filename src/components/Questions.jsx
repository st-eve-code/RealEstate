'use client'

import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/i18n';
import '../App.css';

function Questions() {
    const { t } = useTranslation();
    
    // State to track which dropdowns are open (by their ID)
    // This allows each dropdown to be controlled independently
    const [openDropdowns, setOpenDropdowns] = useState({});

    // FAQ data - each item has a unique ID for tracking
    const steps = [
        {
            id: 1,
            title: t('faq.pricing.title'),
            sub: t('faq.pricing.subtitle'),
            body: t('faq.pricing.description'),
        },
        {
            id: 2,
            title: t('faq.verification.title'),
            sub: t('faq.verification.subtitle'),
            body: t('faq.verification.description'),
        },
        {
            id: 3,
            title: t('faq.updates.title'),
            sub: t('faq.updates.subtitle'),
            body: t('faq.updates.description'),
        },
    ];

    // Function to toggle individual dropdown open/closed state
    const toggleDropdown = (itemId) => {
        setOpenDropdowns(prevState => ({
            ...prevState,
            [itemId]: !prevState[itemId] // Toggle the specific dropdown
        }));
    };

    // Check if a specific dropdown is open
    const isDropdownOpen = (itemId) => {
        return openDropdowns[itemId] || false;
    };

    return (
        <section className='mt-4 px-1 space-y-3'>
            {steps.map((data) => {
                // Check if this specific dropdown is open
                const isOpen = isDropdownOpen(data.id);
                
                return (
                    <div 
                        key={data.id} 
                        className='w-full bg-white rounded-lg shadow-sm border border-gray-100/60 overflow-hidden transition-all duration-200 hover:shadow-md'
                        >
                        {/* Dropdown Header - clickable area */}
                        <div 
                            className='border-l-4 border-blue-600 bg-white p-4 flex items-start justify-between cursor-pointer  transition-colors duration-150'
                            onClick={() => toggleDropdown(data.id)}
                        >
                            {/* Content Section */}
                            <div className='flex-1'>
                                <h2 className='font-Custom font-semibold text-sm text-gray-600 mb-1'>
                                    {data.title}
                                </h2>
                                <p className='font-Custom font-normal text-xs text-gray-500'>
                                    {data.sub}
                                </p>
                            </div>
                            
                            {/* Toggle Icon */}
                            <div className='ml-4 flex-shrink-0'>
                                <div className='p-1 rounded-full hover:bg-blue-50 transition-colors duration-150'>
                                    {isOpen ? (
                                        <ChevronDown 
                                            size={20} 
                                            className='text-blue-600 transition-transform duration-200'
                                        />
                                    ) : (
                                        <ChevronRight 
                                            size={20} 
                                            className='text-blue-600 transition-transform duration-200'
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Dropdown Content - only shows when open */}
                        {isOpen && (
                            <div className='px-4 pb-4 bg-gray-50/20 border-t border-t-gray-100'>
                                <p className='text-xs font-Custom font-normal text-gray-500 leading-relaxed pt-3'>
                                    {data.body}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </section>
    );
}

export default Questions;