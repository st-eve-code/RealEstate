import React from 'react';
import '../App.css';
import { IonIcon } from '@ionic/react';
import {chatbubble, mail} from 'ionicons/icons';
function Otpcode_method() {
  return (
     <section>
        <div className='mx-auto p-2'>
            <div className='mt-[5rem]  p-5 bg-white shadow-lg rounded-xl shadow-gray-200 max-w-[28rem] mx-auto'>
                <h1 className='font-Nunito font-bold text-lg text-gray-800 text-center mx-auto'>Select a method of verification</h1>
                <p className='font-Nunito font-medium text-md text-center mx-auto text-gray-600'>choose a method to receive the verification code</p>
                <div className='flex items-center justify-between p-4'>
                    <div className='flex items-center'>
                        <IonIcon icon={chatbubble} className='size-6 text-gray-500'/>
                        <div className='ml-4'>
                            <h1 className='font-Nunito font-semibold text-md text-gray-800'>SMS</h1>
                            <p className='font-Nunito font-medium text-md text-gray-500'>Send code by sms</p>
                        </div>
                    </div>
                    <input type="checkbox" name="sms" id="sms" className='w-6 bg-white'/>
                </div>
                <div className='flex items-center justify-between p-4'>
                    <div className='flex items-center'>
                        <IonIcon icon={mail} className='size-6 text-gray-500'/>
                        <div className='ml-4'>
                            <h1 className='font-Nunito font-semibold text-md text-gray-800'>Email</h1>
                            <p className='font-Nunito font-medium text-md text-gray-500'>Send code by email</p>
                        </div>
                    </div>
                    <input type="checkbox" name="email" id="email" className='w-6 bg-white'/>
                </div>
                <button type="button" className='font-Nunito font-medium text-white text-md bg-blue-600 rounded-lg p-3 w-full mt-8'>
                    Proceed
                </button>
                <a href="#">
                    <p className='font-Nunito font-medium text-sm text-blue-600 text-center mx-auto pt-8'> back </p>
                </a>
            </div>
        </div>
    </section>
  )
}

export default Otpcode_method