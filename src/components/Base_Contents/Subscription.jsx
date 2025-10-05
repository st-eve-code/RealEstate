import React from 'react';
import Subscription_plan from '../../pages/Subscription';

function Subscription() {
  return (
    <section className='px-2'>
        <h1 className='font-Custom font-bold text-lg text-gray-600'>Subscription Plans</h1>
        <div className='mt-10'>
          <Subscription_plan/>
        </div>
    </section>
  )
}

export default Subscription