import { Edit3, Save, Trash2, Upload } from 'lucide-react';
import React from 'react';
import banner from  '../../assets/images/tiger.jpg';

function Profile() {
  const userDetails = [
  {
    Info: 'User Name',
    detail: 'Natasha Williams'
  },
  {
    Info: 'Country',
    detail: 'Cameroon'
  },
  {
    Info: 'Email Address',
    detail: 'Natasha@gmail.com'
  },
  {
    Info: 'Password',
    detail: 'rentspotiscool'
  },
  {
    Info: 'Phone Number',
    detail: '+237-680524109'
  },
  {
    Info: 'User Role',
    detail: 'Renter'
  },
];
  return (
    <section className='px-2'>
        <h1 className='font-Custom font-bold text-lg text-gray-600'>My Account</h1>
        {/* section containing the user profile image and cover image */}
        <section className='shadow w-full h-60 mt-5 px-1 rounded-md' style={{backgroundImage: `url(${banner})`,backgroundPosition:'center',backgroundSize: 'cover',backgroundRepeat:'no-repeat'}}>
          <div className='flex items-center gap-2 py-4 w-full'>
            <div className='py-2 px-2 relative mt-48'>
              <div>
                <div className='size-16 shadow rounded-full border-4 border-white' style={{backgroundImage: `url(${banner})`,backgroundPosition:'center',backgroundSize: 'cover',backgroundRepeat:'no-repeat'}}></div>
              </div>
              <button className='size-6 rounded-full p-1 shadow border-2 bg-white border-white absolute inset-0 top-14 left-6'>
                <Upload size={12} className='text-gray-700'/>
              </button>
            </div>
            <div className='mt-56'>
            <h1 className='font-Custom font-bold text-sm text-gray-600'> Natasha Williams </h1>
            <p className='font-Custom font-normal text-xs text-gray-500'> Cameroon </p>
            </div>
          </div>
        </section>
        <section className='relative mt-20'>
          <div>
            <h1 className='font-Custom font-bold text-base text-gray-600'> Personal Information </h1>
            <p className='font-Poppins font-normal text-sm text-gray-500'> User personal information</p>
          </div>
          <div className='bg-gray-100/20 rounded-md py-6 mt-4 px-3 flex flex-wrap gap-10 md:gap-20 items-center justify-between'>
            {userDetails.map(
              (user,index) => {
                return (
                  <div key={index}>
                    <p className='font-Poppins font-medium text-xs text-gray-800'> {user.Info} </p>
                    <h1 className='font-Custom font-semibold text-sm text-gray-600/70 pt-2'> {user.detail} </h1>
                  </div>
                )
              }
            )}
          </div>
        </section>
        {/* section to allow user to edit the information */}
        <section className='relative mt-20'>
              <div className='flex justify-between items-center gap-2'>
                <div>
                  <h1 className='font-Custom font-semibold text-base text-gray-600 pt-2'> Update my profile </h1>
                  <p className='font-Poppins font-medium text-sm text-gray-500'> Edit your profile details </p>
                </div>
                <div className='flex items-center gap-3 rounded-md px-2 py-2 bg-white '>
                  <Edit3 size={18} className='text-gray-600'/>
                  <p className='font-Custom font-bold text-sm text-gray-600'>Edit Profile</p>
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-between gap-2 md:gap-4 items-center'>
                <div className="mt-4">
                  <label htmlFor="Newusername" className='font-Poppins font-normal text-sm text-gray-600 '>Username</label><br />
                  <input type="text" name="Newusername" id="Newusername" placeholder='Enter new username' className='outline-blue-400 px-2 py-2 w-full mt-2 border border-gray-300 rounded-md font-medium font-Custom text-sm text-gray-800/60'/>
                </div>
                <div className="mt-4">
                  <label htmlFor="Email" className='font-Poppins font-normal text-sm text-gray-600 '>Email</label><br />
                  <input type="email" name="Email" id="Email" placeholder='Enter new Email' className='outline-blue-400 font-medium font-Custom text-sm text-gray-800/60 px-2 py-2 w-full mt-2 border border-gray-300 rounded-md'/>
                </div>
                <div className="mt-4">
                  <label htmlFor="Password" className='font-Poppins font-normal text-sm text-gray-600 '>Password</label><br />
                  <input type="password" name="Password" id="Password" placeholder='Enter new password' className='outline-blue-400 font-medium font-Custom text-sm text-gray-800/60 px-2 py-2 w-full mt-2 border border-gray-300 rounded-md'/>
                </div>
                <div className="mt-4">
                  <label htmlFor="mobile" className='font-Poppins font-normal text-sm text-gray-600 '>Phone Number</label><br />
                  <input type="tel" name="mobile" id="mobile" placeholder='Enter new phone number' className='outline-blue-400 font-medium font-Custom text-sm text-gray-800/60 px-2 py-2 w-full mt-2 border border-gray-300 rounded-md'/>
                </div>
              </div>
              <div className='flex justify-center items-center gap-4'>
                <button className='flex items-center mt-10 gap-3 rounded-md px-2 py-2 bg-blue-600 shadow-md'>
                  <Save size={18} className='text-white'/>
                  <p className='font-Custom font-medium text-sm text-white'>Save changes</p>
                </button>
                <button className='flex items-center mt-10 gap-3 rounded-md px-2 py-2 bg-white shadow-md '>
                  <Trash2 size={18} className='text-red-500/40'/>
                  <p className='font-Custom font-medium text-sm text-gray-800/60'>Delete account</p>
                </button>
              </div>
        </section>
    </section>
  )
}

export default Profile