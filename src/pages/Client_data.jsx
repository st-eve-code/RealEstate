'use client'

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
function Client_data() {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [selections, setSelections] = useState({
        role: 'Select your role',
        age: 'Select your age',
        location: 'Select your location',
        means: 'How did you hear about us?'
    });

    const dropdownData = {
        role: ['Renter', 'Student', 'Caretaker', 'House Agent'],
        age: ['Under 18', '18 and above'],
        location: ['South West', 'Central', 'North West', 'Others'],
        means: ['Friends', 'Family', 'Flyers', 'Social Media']
    };

    const handleSelect = (dropdown, value) => {
        setSelections(prev => ({ ...prev, [dropdown]: value }));
        setOpenDropdown(null);
    };

    const toggleDropdown = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };
    const router = useRouter();
    return (
        <section className="p-6">
            <div className="max-w-md mx-auto bg-white font-Custom rounded-lg shadow-lg p-6">
                <h1 className="text-xl font-bold text-gray-800 text-center mb-2">
                    Tell us about yourself
                </h1>
                <p className="text-gray-600 text-center mb-6">
                    Help us provide better service by sharing a few details.
                </p>

                {Object.entries(dropdownData).map(([key, options]) => (
                    <div key={key} className="mb-4 font-Custom ">
                        <button
                            onClick={() => toggleDropdown(key)}
                            className="w-full flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-gray-700">{selections[key]}</span>
                            <ChevronDown 
                                size={20} 
                                className={`text-gray-400 transition-transform ${
                                    openDropdown === key ? 'rotate-180' : ''
                                }`}
                            />
                        </button>
                        
                        {openDropdown === key && (
                            <div className="mt-1 border border-gray-200 rounded-lg bg-white shadow-sm">
                                {options.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => handleSelect(key, option)}
                                        className="w-full font-Custom text-left p-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <button onClick={()=>router.push('/dashboard')} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4">
                    Continue
                </button>
                <p onClick={()=>router.push('/dashboard')} className='flex justify-center cursor-pointer mt-4 underline text-blue-600 hover:text-blue-400'>skip</p>
            </div>
        </section>
    );
}

export default Client_data;