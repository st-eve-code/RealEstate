'use client'

import React from 'react';
import '../App.css';
import {Users, ThumbsUpIcon,TargetIcon,Waypoints,CloudyIcon} from 'lucide-react'
import { useTranslation } from '@/i18n';

function Services() {
    const { t } = useTranslation();
    
    const services = [
        {
            icon : Users,
            title: t('services.clientFocused.title'),
            text: t('services.clientFocused.description')
        },
        {
            icon: ThumbsUpIcon,
            title: t('services.trustedPartners.title'),
            text: t('services.trustedPartners.description')
        },
        {
            icon: TargetIcon,
            title: t('services.tailoredSolutions.title'),
            text: t('services.tailoredSolutions.description')
        },
        {
            icon: Waypoints,
            title: t('services.customerSupport.title'),
            text: t('services.customerSupport.description')
        },
        {
            icon: CloudyIcon,
            title: t('services.transparentMarket.title'),
            text: t('services.transparentMarket.description')
        },
    ];
  return (
    <section className='flex flex-wrap lg:p-[1rem] p-5 gap-10 mt-[2rem] items-center justify-center'>
        {/* section having all the services we offer */}
        {services.map(
            (e, index)=> {
                const Icons =e.icon;
                return (
                    <div key={index} className='bg-white shadow-md shadow-gray-300/40 md:max-w-[18rem] lg:max-w-[16rem] rounded-2xl h-[11rem] p-4'>
                        <div className='block-animate size-9 bg-blue-600 rounded-full p-2 mb-3 mx-auto m-2'>
                            <Icons size={20} className='text-white'/>
                        </div>
                        <h1 className='flex justify-center font-bold font-Custom text-sm text-gray-800 pt-2'>
                            {e.title}
                        </h1>
                        <p className='font-Custom font-normal text-xs text-gray-400 py-2 flex flex-wrap justify-center text-center'>
                            {e.text}
                        </p>
                    </div>
                )
            }
        )}
    </section>
)
}

export default Services