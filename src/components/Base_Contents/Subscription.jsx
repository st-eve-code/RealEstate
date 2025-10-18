import React, { useState } from 'react';
import Subscription_plan from '../../pages/Subscription';
import mtn from '../../assets/images/mtn.png';
import orange from '../../assets/images/orange.jpg';

function Subscription() {
  const [plan, setPlan] = useState('');
  const [planAmount, setPlanAmount] = useState(null);
  const [isStep, setIsStep] = useState('step1');
  const [selected, selectedMethod] = useState('');

  const methods = [
    {
      image: mtn,
      name: mtn
    },
    {
      image: orange,
      name: orange
    }
  ]
  return (
    <section className='px-2 pb-8'>
      {isStep === 'step1' && (
        <>
          
          <div className='mt-0'>
            <Subscription_plan myPlan={setPlan} stepProcess={setIsStep} planAmount={setPlanAmount}/>
          </div>
        </>
      )}
      
      {/* Add other steps here if needed */}
      {isStep === 'step2' && (
        <div>
          {/* Step 2 payment methods */} 
          <h1 className='font-Custom font-bold text-lg text-gray-600'>Select Payment Method</h1>
          <div className='mt-8 p-2 max-w-[28rem] rounded-md shadow-md mx-auto'>
            <div className='flex items-center justify-between'>
              {
                methods.map(
                  (info,index)=>(
                    <button key={index} className='w-full rounded-lg py-5  h-16' style={{
                        backgroundImage: `url(${info.image})`, backgroundPosition:'center',backgroundSize:'cover',backgroundRepeat:'no-repeat'
                      }}>
                      <div className='size-3 float-right flex mr-1 rounded-full bg-white border-2'></div>
                    </button>
                  )
                )
              }
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Subscription