import { LogOut, X } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
function Logout() {
    const navigate = useNavigate();
  return (
    <section className='px-2 py-8 mx-auto flex justify-center'>
        <div>
            <div className='mx-auto'>
                <h1 className=' text-center font-Custom font-bold text-lg text-gray-600'>Logout</h1>
                <p className=" text-center font-normal font-Poppins text-sm text-gray-600"> Are you sure you want to logout from this account ? </p>
            </div>
            <div className='flex items-center justify-center mt-4 gap-5'>
                <button onClick={()=>navigate('/login')}  className='bg-red-100 px-2.5 py-1.5 w-40 font-Custom font-medium text-red-400 rounded flex justify-center gap-2'>
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    </section>
  )
}

export default Logout