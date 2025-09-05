import React from 'react';
import '../App.css';
import logo from '../assets/logo.svg';
function Reset_password() {
  return (
    <section>
        <div className='max-w-[28rem] shadow-lg shadow-gray-200 mx-auto p-8 m-8 rounded-xl'>
            <img src={logo} alt="logo" className='w-36 mx-auto'/>
            <p className='font-Nunito font-medium text-md pt-2 text-gray-500 text-center'>
               Enter a new password to continue.
            </p>
            <form action="" className='max-w-[25rem] p-5 mx-auto'>
                <label htmlFor="password" className='font-Nunito font-semibold text-gray-600 text-md'>
                    New Password
                </label><br />
                <input type="password" name="password" id="password" maxLength={24} placeholder='****************'
                autoComplete='yes'  className='mb-4 mt-3 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border border-gray-200'/>
                <label htmlFor="confirm_password" className='font-Nunito font-semibold text-gray-600 text-md'>
                    Confirm Password
                </label><br />
                <input type="password" name="confirm_password" id="confirm_password" maxLength={24} placeholder='****************'
                autoComplete='yes'  className='mt-3 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border border-gray-200'/>
                
                <button type="submit" className='font-Nunito font-medium text-lg h-11 rounded-md mt-8 w-full bg-blue-600 text-white'>
                    update password
                </button>
                {/* link to the login page */}
            </form>
        </div>
    </section>
  )
}

export default Reset_password