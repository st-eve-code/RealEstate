import React from 'react';
import '../App.css';
import logo from '../assets/logo.svg';
import google from '../assets/images/google.png';
function Login() {
  return (
    <section>
        <div className='max-w-[28rem] shadow-lg shadow-gray-200 mx-auto p-8 m-8 rounded-xl'>
            <img src={logo} alt="logo" className='w-36 mx-auto'/>
            <p className='font-Nunito font-medium text-md pt-2 text-gray-500 text-center'>
                Welcome back to rentspot.
            </p>
            <form action="" className='max-w-[25rem] p-10'>
                <label htmlFor="email" className='font-Nunito font-semibold text-gray-600 text-md'>
                    Email
                </label><br />
                <input type="email" name="email" maxLength={24} id="email" placeholder='Your@gmail.com'
                autoComplete='yes'  className='mb-5 mt-3 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border border-gray-200'/>
                <label htmlFor="password" className='font-Nunito font-semibold text-gray-600 text-md'>
                    Password
                </label><br />
                <input type="password" name="password" id="password" maxLength={24} placeholder='****************'
                autoComplete='yes'  className='mt-3 w-full h-11 rounded-lg outline-blue-400 p-3 font-Nunito font-medium text-md border border-gray-200'/>
                {/* forgot password link */}
                <a href="#">
                    <p className='text-blue-600 font-Nunito font-medium text-md pt-4'>
                        forgot password ?
                    </p>
                </a>
                <button type="submit" className='font-Nunito font-medium text-lg h-11 rounded-md mt-8 w-full bg-blue-600 text-white'>
                    Login
                </button>
                {/* link to the login page */}
                <Link to="/signup">
                    <p className='font-Nunito font-medium text-md text-blue-600 text-center mx-auto pt-8'>Don't have an account ? Signup </p><br /><p className='font-Nunito font-medium text-sm text-gray-500 text-center mx-auto'>OR</p>
                </Link>
                <button type="button" className='justify-evenly bg-white text-gray-600 font-Nunito font-medium text-md w-full h-11 rounded-md shadow-md shadow-gray-200 mt-2 flex fle-col items-center text-center gap-2 mx-auto'>
                    <img src={google} alt="" className='w-12'/>
                    Continue with google
                </button>
            </form>
            </div>
    </section>
  )
}

export default Login