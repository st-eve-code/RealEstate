import React from 'react';
import '../App.css';
function Otp_confirm() {
  return (
    <section>
        <div className='mt-[10rem] m-5 p-5 bg-white shadow-lg rounded-xl shadow-gray-200 max-w-[28rem] mx-auto'>
            <h1 className='font-Nunito font-bold text-lg text-gray-800 text-center mx-auto'>Verify Otp Code</h1>
            <p className='font-Nunito font-medium text-md text-center mx-auto text-gray-600'>Enter the otp verification code sent to you through email</p>
            <div className='flex flex-wrap justify-evenly items-center mt-4'>
                <input type="text" name="key1" id="key1" placeholder='*'  className='bg-white shadow-md shadow-gray-200 max-w-[3rem] rounded-lg h-10 font-medium font-Nunito text-md text-gray-600 text-center outline-blue-400 border border-gray-300'/>
                <input type="text" name="key2" id="key2" placeholder='*'  className='bg-white shadow-md shadow-gray-200 max-w-[3rem] rounded-lg h-10 font-medium font-Nunito text-md text-gray-600 text-center outline-blue-400 border border-gray-300'/>
                <input type="text" name="key3" id="key3" placeholder='*'  className='bg-white shadow-md shadow-gray-200 max-w-[3rem] rounded-lg h-10 font-medium font-Nunito text-md text-gray-600 text-center outline-blue-400 border border-gray-300'/>
                <input type="text" name="key4" id="key4" placeholder='*'  className='bg-white shadow-md shadow-gray-200 max-w-[3rem] rounded-lg h-10 font-medium font-Nunito text-md text-gray-600 text-center outline-blue-400 border border-gray-300'/>
                <input type="text" name="key5" id="key5" placeholder='*'  className='bg-white shadow-md shadow-gray-200 max-w-[3rem] rounded-lg h-10 font-medium font-Nunito text-md text-gray-600 text-center outline-blue-400 border border-gray-300'/>
            </div>
            <a href="#">
                    <p className='font-Nunito font-medium text-sm text-blue-600 text-center mx-auto pt-8'>Didn't receive the code ? Resend </p><br /><p className='font-Nunito font-medium text-sm text-gray-500 text-center mx-auto'>OR</p>
                </a>
            <button type="button" className='font-Nunito font-medium text-white text-md bg-blue-600 rounded-lg p-3 w-full mt-8'>
                Proceed
            </button>
        </div>
    </section>
  )
}

export default Otp_confirm