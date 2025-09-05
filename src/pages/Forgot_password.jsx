import React from 'react';
import '../App.css';
import logo from '../assets/logo.svg';
function Forgot_password() {
  return (
    <section>
         <div className='max-w-[28rem] shadow-lg shadow-gray-200 mx-auto p-8 m-8 rounded-xl'>
            <img src={logo} alt="logo" className='w-36 mx-auto'/>
            <p className='font-Nunito font-medium text-md pt-2 text-gray-500 text-center'>
                Enter the email associated with your account
            </p>
            <form action="" className='max-w-[25rem] p-10'>
                <label htmlFor="email" className='font-Nunito font-semibold text-gray-600 text-md'>
                    Email
                </label><br />
                <input type="email" name="email" maxLength={24} id="email" placeholder='Your@gmail.com'
                autoComplete='yes'  className='mb-1 mt-2 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border border-gray-300'/>
                <button type="submit" className='font-Nunito font-medium text-lg h-11 rounded-md mt-8 w-full bg-blue-600 text-white'>
                    Verify
                </button>
                {/* link to the login page */}
                <a href="#">
                    <p className='font-Nunito font-medium text-md text-blue-600 text-center mx-auto pt-8'>use another email </p>
                </a>
                
            </form>
        </div>
    </section>
  )
}

export default Forgot_password