import React from 'react';
import '../App.css';
import logo from '../assets/logo.svg';
import google from '../assets/images/google.png';
import { Link } from 'react-router-dom';
function Signup() {
  return (
    <section>
         <div className='max-w-[28rem] shadow-lg shadow-gray-300 mx-auto p-8 rounded-xl'>
            <img src={logo} alt="logo" className='w-[11rem] py-4 mx-auto'/>
            <p className='font-Nunito font-medium text-sm  text-gray-500 text-center'>
                Welcome to Rentspot where every rental property has a calling. Fill in the form to get started.
            </p>
            <form action="" className='max-w-[28rem] mx-auto py-5'>
                <label htmlFor="username" className='font-Nunito font-semibold text-gray-800 text-md'>
                    Username
                </label><br />
                <input type="text" name="username" maxLength={24} id="username" placeholder='John Doe'
                autoComplete='yes'  className='mb-5 mt-3 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border text-gray-700 border-gray-300'/>
                <label htmlFor="email" className='font-Nunito font-semibold text-gray-800 text-md'>
                    Email
                </label><br />
                <input type="email" name="email" maxLength={24} id="email" placeholder='Your@gmail.com'
                autoComplete='yes'  className='mb-5 mt-3 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border text-gray-700 border-gray-300'/>
                <label htmlFor="password" className='font-Nunito font-semibold text-gray-800 text-md'>
                    Password
                </label><br />
                <input type="password" name="password" id="password" maxLength={25} placeholder='****************'
                autoComplete='yes'  className='mt-3 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border border-gray-300 text-gray-700'/>
                <button type="submit" className='font-Nunito font-medium text-lg h-12 rounded-md mt-5 w-full bg-blue-600 text-white'>
                    Register
                </button>
                {/* link to the login page */}
                <button type="button" className='justify-center border bg-white text-gray-800 font-Nunito font-medium text-md w-full h-12 rounded-md shadow-md shadow-gray-300/70 mt-4 flex fle-col items-center text-center gap-2 mx-auto'>
                    <img src={google} alt="" className='w-12'/>
                    Continue with google
                </button>
                <Link to="/login">
                    <p className='font-Nunito font-medium text-sm underline text-blue-600 text-center mx-auto pt-8'>Already have an account ? login </p>
                </Link>
                <p className='font-Nunito font-medium text-sm text-gray-500 text-center pt-4'>
                    Sign up for an account means you agreed with our <a href="#"><span className='text-blue-600'>Terms & conditions</span></a> and <a href="#"><span className='text-blue-600'>user privacy</span></a>
                </p>
            </form>
         </div>
    </section>
  )
}

export default Signup