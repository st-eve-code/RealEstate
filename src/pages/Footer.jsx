import React from 'react';
import logo from '../assets/logo.svg';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaPhone, FaEnvelope } from 'react-icons/fa';
import '../App.css';

function Footer() {
  return (
    <section className='bg-gray-100 mt-[5rem]'>
        <div className='flex flex-wrap justify-between items-start m-8 p-[1rem]'>
            <div className='p-3 max-w-[20rem]'> {/* links to all social medias */}
            <img src={logo} alt="" className='w-[8rem]'/>
            <h1 className='font-Nunito font-bold text-2xl text-gray-800 text-left max-w-[20rem] pt-3'>Discover real estate ideas from your own ease !</h1>
            <div className='flex items-center gap-4 pt-5'>
                <a href="#">
                   <div className='bg-blue-600 size-7 rounded-full p-1 flex items-center justify-center'>
                        <FaFacebook className='text-white text-sm'/>
                    </div>
                </a>
                <a href="#">
                   <div className='bg-blue-600 size-7 rounded-full p-1 flex items-center justify-center'>
                        <FaInstagram className='text-white text-sm'/>
                    </div>
                </a>
                <a href="#">
                    <div className='bg-blue-600 size-7 rounded-full p-1 flex items-center justify-center'>
                        <FaLinkedin className='text-white text-sm'/>
                    </div>
                </a>
                <a href="#">
                    <div className='bg-blue-600 size-7 rounded-full p-1 flex items-center justify-center'>
                        <FaTwitter className='text-white text-sm'/>
                    </div>
                </a>
            </div>
        </div>
            <div className='block p-5'>
                <h1 className='font-bold text-md font-Nunito text-gray-800'> 
                    Quick Links
                </h1>
                <ul>
                    <a href="">
                        <li className='font-Nunito font-medium text-md text-gray-600'> Home </li>
                    </a>
                    <a href="">
                        <li className='font-Nunito font-medium text-md text-gray-600'> About </li>
                    </a>
                    <a href="">
                        <li className='font-Nunito font-medium text-md text-gray-600'> Contact </li>
                    </a>
                    <a href="">
                        <li className='font-Nunito font-medium text-md text-gray-600'> Blog </li>
                    </a>
                    <a href="">
                        <li className='font-Nunito font-medium text-md text-gray-600'> Faqs </li>
                    </a>
                    <a href="">
                        <li className='font-Nunito font-medium text-md text-gray-600'> Plans </li>
                    </a>
                </ul>
            </div>
            {/* links to different location */}
            <div className='block p-5'>
                <h1 className='font-bold text-md font-Nunito text-gray-800'> 
                    Locations
                </h1>
                <ul>
                    <a href="">
                        <li className='font-Nunito font-medium text-md text-gray-600'> Molyko </li>
                    </a>
                    <a href="">
                        <li className='font-Nunito font-medium text-md text-gray-600'> Bomaka </li>
                    </a>
                    <a href="">
                        <li className='font-Nunito font-medium text-md text-gray-600'> Malingo </li>
                    </a>
                    <a href="">
                        <li className='font-Nunito font-medium text-md text-gray-600'> Mayor street </li>
                    </a>
                    <a href="">
                        <li className='font-Nunito font-medium text-md text-gray-600'> Muea </li>
                    </a>
                    <a href="">
                        <li className='font-Nunito font-medium text-md text-gray-600'> Checkpoint </li>
                    </a>
                    <a href="">
                        <li className='font-Nunito font-medium text-md text-gray-600'> Biaka </li>
                    </a>
                    <a href="">
                        <li className='font-Nunito font-medium text-md text-gray-600'> More </li>
                    </a>
                </ul>
            </div>
            {/* information concerning legals */}
            <div className='block p-5'>
                <h1 className='font-bold text-md font-Nunito text-gray-800'> 
                    Legals
                </h1>
                <ul>
                    <a href="">
                        <li className='font-Nunito font-medium text-md text-gray-600'> Cookie Policy </li>
                    </a>
                    <a href="">
                        <li className='font-Nunito font-medium text-md text-gray-600'> Terms & Conditions </li>
                    </a>
                    <a href="">
                        <li className='font-Nunito font-medium text-md text-gray-600'> User Policies </li>
                    </a>
                </ul>
            </div>
            {/* information concerning contacts */}
            <div className='block p-5'>
                <h1 className='font-bold text-md font-Nunito text-gray-800'> 
                    Contacts
                </h1>
                <div className='flex items-center gap-2 text-gray-600'>
                    <FaPhone className='text-gray-500'/>
                    <p className='font-Nunito font-medium text-md'>+237681987524</p>
                </div>
                <div className='flex items-center gap-2 text-gray-600 py-2'>
                    <FaPhone className='text-gray-500'/>
                    <p className='font-Nunito font-medium text-md'>+237651820548</p>
                </div>
                <div className='flex items-center gap-2 text-gray-600'>
                    <FaEnvelope className='text-gray-500'/>
                    <p className='font-Nunito font-medium text-md'>rentspot@gmail.com</p>
                </div>
            </div>
        </div>
        <div className='flex justify-center pb-4'>
            <p className='font-Nunito font-medium text-md text-gray-600'>
                copyright @ 2025 Rentspot ltd
            </p>
        </div>
    </section>
  )
}

export default Footer