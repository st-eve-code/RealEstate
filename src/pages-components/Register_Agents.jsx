'use client'

import React from 'react';
import '../App.css';
import logo from '../assets/logo.svg';
function Register_Agents() {
  return (
    <section>
        <div className='max-w-[28rem] shadow-lg shadow-gray-200 mx-auto p-5 m-8 rounded-xl'>
            <img src={logo.src || logo} alt="logo" className='w-36 mx-auto'/>
            <p className='text-gray-500 text-center mx-auto font-Nunito font-medium text-md pt-2'>
                please fill in the form and get registered as an agent
            </p>
            <form action="" className='max-w-[25rem] p-10'>
                <label htmlFor="username" className='font-Nunito font-semibold text-gray-600 text-md'>
                    Username
                </label><br />
                <input type="text" name="username" maxLength={24} id="username" placeholder='john doe'
                autoComplete='yes'  className='mb-5 mt-1 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border border-gray-200'/>
                <label htmlFor="email" className='font-Nunito font-semibold text-gray-600 text-md'>
                    Email
                </label><br />
                <input type="email" name="email" maxLength={24} id="email" placeholder='Your@gmail.com'
                autoComplete='yes'  className='mb-5 mt-1 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border border-gray-200'/>
                <label htmlFor="mobile" className='font-Nunito font-semibold text-gray-600 text-md'>
                    Mobile
                </label><br />
                <input type="tel" name="mobile" id="mobile" maxLength={24} placeholder='+2376**********8'
                autoComplete='yes'  className='mb-4 mt-1 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border border-gray-200'/>
                <label htmlFor="location" className='font-Nunito font-semibold text-gray-600 text-md '>
                    Location
                </label><br />
                <input type="text" name="location" id="location" maxLength={24} placeholder='Molyko'
                autoComplete='yes'  className='mt-1 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border border-gray-200'/>
                <button type="submit" className='font-Nunito font-medium text-lg h-11 rounded-md mt-8 w-full bg-blue-600 text-white'>
                    Register
                </button>
                {/* link to the login page */}
            </form>
        </div>
    </section>
  )
}

export default Register_Agents