import React from 'react'
import notificationIcon from '../../assets/images/notification.jpg';
import { Bell, Trash2 } from 'lucide-react';
function Notification() {
  {/* this is a demo for notification , when notification is > or < 0 */}
  const notifications = 1;
  return (
    <section className='p-2'>
        <div className='flex justify-between items-center gap-2 flex-wrap max-md:space-y-4'>
          <div>
            <h1 className='font-Custom font-bold text-lg text-gray-600'>Notifications</h1>
            <p className="font-normal font-Poppins text-gray-500 text-sm">you have {notifications} new notification</p>
          </div>
          <button className='bg-blue-400 px-2.5 py-1.5 w-30 font-Custom font-medium text-white rounded flex justify-center gap-2'>
              <Trash2 size={20} />
              Delete all
          </button>
        </div>
        {notifications > 0 ? 
        <div className='flex justify-between flex-wrap max-md:space-y-5 items-center px-2 md:px-2 lg:px-4 mt-10 bg-gray-200/20 py-4 rounded-md'>
          <div className='flex flex-nowrap items-center gap-3'>
            <div className='size-10 rounded-full bg-white p-2.5 shadow'><Bell size={20} className='text-red-500/40'/></div>
            <div>
              <h1 className='font-Poppins font-bold text-sm text-gray-600'>New Property</h1>
              <p className="font-normal font-Poppins text-gray-500 text-sm ">Hey, new properties has been recently added</p>
            </div>
          </div>
          <div>
            <button className='bg-white px-3 py-1.5 w-28 font-Custom font-medium text-gray-500 rounded-lg'>
              2 Days ago
            </button>
          </div>
        </div> 
        
        : 
        
        <div className='mx-auto flex flex-grow justify-center max-w-md mt-4'>
          <img src={notificationIcon} alt="" />
        </div> }
    </section>
  )
}

export default Notification