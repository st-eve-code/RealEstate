'use client'

import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import '../App.css';

function Questions() {
    // State to track which dropdowns are open (by their ID)
    // This allows each dropdown to be controlled independently
    const [openDropdowns, setOpenDropdowns] = useState({});

    // FAQ data - each item has a unique ID for tracking
    const steps = [
        {
            id: 1,
            title: 'Clear pricing and fee structure',
            sub: 'Customize your subscription',
            body: 'Create an account and profit from our numerous services that we offer at affordable prices. Our transparent pricing ensures you know exactly what you\'re paying for.',
        },
        {
            id: 2,
            title: 'Document, Transparency and Verification',
            sub: 'Savings and added value with our subscription plan',
            body: 'Select a subscription plan and save more efficiently rather than spending more. All transactions are documented and verified for your security.',
        },
        {
            id: 3,
            title: 'Real Time Transaction Updates',
            sub: 'Subscribers are our priority, gain early access',
            body: 'Subscribe right now and gain a place in real estate movements and enjoy the benefits as well. Get instant notifications for all your transactions.',
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