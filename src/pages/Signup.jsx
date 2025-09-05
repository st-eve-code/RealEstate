import React from 'react';
import '../App.css';
import logo from '../assets/logo.svg';
import google from '../assets/images/google.png';
function Signup() {
  return (
    <section>
         <div className='max-w-[28rem] shadow-lg shadow-gray-200 mx-auto p-8 m-8 rounded-xl'>
            <img src={logo} alt="logo" className='w-[11rem] py-4 mx-auto'/>
            <p className='font-Nunito font-medium text-sm  text-gray-500 text-center'>
                Welcome to Rentspot where everything property has a calling. Fill in the form to get started.
            </p>
            <form action="" className='max-w-[28rem] py-10'>
                <label htmlFor="username" className='font-Nunito font-semibold text-gray-600 text-md'>
                    Username
                </label><br />
                <input type="text" name="username" maxLength={24} id="username" placeholder='John Doe'
                autoComplete='yes'  className='mb-5 mt-3 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border border-gray-300'/>
                <label htmlFor="email" className='font-Nunito font-semibold text-gray-600 text-md'>
                    Email
                </label><br />
                <input type="email" name="email" maxLength={24} id="email" placeholder='Your@gmail.com'
                autoComplete='yes'  className='mb-5 mt-3 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border border-gray-300'/>
                <label htmlFor="password" className='font-Nunito font-semibold text-gray-600 text-md'>
                    Password
                </label><br />
                <input type="password" name="password" id="password" maxLength={24} placeholder='****************'
                autoComplete='yes'  className='mt-3 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border border-gray-300'/>
                <button type="submit" className='font-Nunito font-medium text-lg h-11 rounded-md mt-8 w-full bg-blue-600 text-white'>
                    Register
                </button>
                {/* link to the login page */}
                <a href="#">
                    <p className='font-Nunito font-medium text-sm underline text-blue-600 text-center mx-auto pt-8'>Already have an account ? login </p><br /><p className='font-Nunito font-medium text-sm text-gray-500 text-center mx-auto'>OR</p>
                </a>
                <button type="button" className='justify-evenly bg-white text-gray-600 font-Nunito font-medium text-md w-full h-11 rounded-md shadow-md shadow-gray-300/70 mt-2 flex fle-col items-center text-center gap-2 mx-auto'>
                    <img src={google} alt="" className='w-12'/>
                    Continue with google
                </button>
                <p className='font-Nunito font-medium text-md text-gray-500 text-center pt-8'>
                    Sign up for an account means you agreed with our <a href="#"><span className='text-blue-600'>Terms & conditions</span></a> and <a href="#"><span className='text-blue-600'>user privacy</span></a>
                </p>
            </form>
         </div>
    </section>
  )
}

export default Signup