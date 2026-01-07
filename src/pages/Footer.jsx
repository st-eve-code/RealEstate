'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import logo from '../assets/logo.svg';
import { IonIcon } from '@ionic/react';
import { logoInstagram, logoLinkedin, logoTwitter, logoFacebook, call, mail} from 'ionicons/icons';
import { useRouter } from 'next/navigation';
import { FOOTER_COMPANY_LINKS, FOOTER_LEGAL_LINKS, FOOTER_LOCATIONS, FOOTER_CONTACT } from '@/constants';
import '../App.css';
function Footer() {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    // Constants imported from @/constants

    const router = useRouter();
  return (
    <section className='bg-white backdrop-blur-sm mt-[5rem]'>
        <div className='flex flex-wrap justify-between items-start m-8 p-[1rem]'>
            <div className='p-3 max-w-[20rem]'> {/* links to all social medias */}
                <img src={logo.src || logo} onClick={()=>router.push('/')} alt="" className='w-[8rem] cursor-pointer'/>
                <h1 className='font-Custom font-bold text-2xl text-gray-800 text-left max-w-[20rem] pt-3'>Discover real estate ideas from your own ease !</h1>
                <div className='flex items-center gap-4 pt-5'>
                    {mounted ? (
                        <>
                            <a href="#">
                            <div className='bg-blue-600 size-7 rounded-full p-1'>
                                    <IonIcon icon={logoFacebook} className='size-5 text-white'/>
                                </div>
                            </a>
                            <a href="#">
                            <div className='bg-blue-600 size-7 rounded-full p-1'>
                                    <IonIcon icon={logoInstagram} className='size-5 text-white'/>
                                </div>
                            </a>
                            <a href="#">
                                <div className='bg-blue-600 size-7 rounded-full p-1'>
                                    <IonIcon icon={logoLinkedin} className='size-5 text-white'/>
                                </div>
                            </a>
                            <a href="#">
                                <div className='bg-blue-600 size-7 rounded-full p-1'>
                                    <IonIcon icon={logoTwitter} className='size-5 text-white'/>
                                </div>
                            </a>
                        </>
                    ) : (
                        // Placeholder to prevent layout shift
                        <div className='h-7'></div>
                    )}
                </div>
            </div>
            <div className='block p-5'>
                <h1 className='font-bold text-md font-Custom text-gray-800'> 
                    Quick Links
                </h1>
                <ul className='font-Custom font-normal text-sm text-gray-600'>
                    {FOOTER_COMPANY_LINKS.map(
                        (name, index) => (
                            <div key={index} className='py-1'>
                                <li>
                                    <Link href={name.path}>{name.name}</Link>
                                </li>
                            </div>
                        )
                    )}
                </ul>
            </div>
            {/* links to different location */}
            <div className='block p-5'>
                <h1 className='font-bold text-md font-Custom text-gray-800'> 
                    Locations
                </h1>
                <ul className='font-Custom font-normal text-sm text-gray-600'>
                    {FOOTER_LOCATIONS.map(
                        (name, index) => (
                            <div key={index} className='py-1'>
                                <li>
                                    <Link href={name.path}>{name.name}</Link>
                                </li>
                            </div>
                        )
                    )}
                </ul>
            </div>
            {/* information concerning legals */}
            <div className='block p-5'>
                <h1 className='font-bold text-md font-Custom text-gray-800'> 
                    Legals
                </h1>
                <ul className='font-Custom font-normal text-sm text-gray-600'>
                    {FOOTER_LEGAL_LINKS.map(
                        (name, index) => (
                            <div key={index} className='py-1'>
                                <li>
                                    <Link href={name.path}>{name.name}</Link>
                                </li>
                            </div>
                        )
                    )}
                </ul>
            </div>
            {/* information concerning contacts */}
            <div className='block p-5'>
                <h1 className='font-bold text-md font-Custom text-gray-800 pb-2'> 
                    Contacts
                </h1>
                <div >
                    {FOOTER_CONTACT.map(
                        (detail, index) => (
                           <div key={index} className='flex p-1 mx-auto items-center gap-2 space-y-2 font-Custom font-normal text-sm text-gray-600'>
                             {mounted && <IonIcon icon={detail.Icons} className='text-gray-500 size-4 pt-2'/>}
                             <p className={`${detail.name.includes('@') ? 'text-blue-500' : 'text-gray-600'}`}>{detail.name}</p>
                           </div>
                        )
                    )}
                    
                </div>
            </div>
        </div>
        <div className='flex justify-center pb-5'>
            <p className='font-Custom font-normal text-xs text-gray-500'>
                copyright @ 2025 Rentspot ltd
            </p>
        </div>
    </section>
  )
}

export default Footer