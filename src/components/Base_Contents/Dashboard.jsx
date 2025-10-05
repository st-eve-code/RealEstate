import React, { useState } from 'react';
import '../../App.css';
import bg from '../../assets/images/banner.jpg';
import bar from '../../assets/images/bar.png';
import line from '../../assets/images/line2.png';
import line2 from '../../assets/images/line.png';
import circle from '../../assets/images/circle.png';
import demo from '../../assets/images/12.jpg';
import { Languages, ChevronDown, Plus, Users, Eye, Coins, User2, UserCircle, Building2, PersonStanding,MapPin,Building, BookOpen, DoorOpenIcon, EggFried, ToiletIcon } from 'lucide-react';
function Dashboard() {
  // save selected language
  const [language, setLanguage] = useState('EN');
  
  // dropdown state
  const [isDropdown, setDropdown] = useState(false)
  const handleSelect = (option) => {
    setLanguage(option);
    setDropdown(false);
  };
  const options = [
    'En',
    'FR'
  ]; 

  // user information
  const userDetails = [
    {
      icon: Eye,
      title: 'Total Views',
      graph: bar,
      detail: '10',
      season: 'last month',
      rate: 0.8,
      
    },
    {
      icon: Coins,
      title: 'My plan',
      graph: line,
      detail: 'Basic',
      season: 'last month',
      rate: 2.5,
    },
    {
      icon: UserCircle,
      title: 'Total Users',
      graph: circle,
      detail: '1000+',
      season: 'last month',
      rate: 0.8,
    },
     {
      icon: BookOpen,
      title: 'Total Rents',
      graph: line2,
      detail: '300+',
      season: 'last month',
      rate: 3.2,
    }
  ]
  return (
    <section>
      <div className='flex justify-between items-center'>
        <h1 className='font-Custom font-bold text-lg text-gray-600'>Dashboard</h1>
        {/* on and off dark mode */}
        {/* <div className={`${isDark ? 'bg-gray-200/40 shadow' : 'bg-black/40'} max-w-5 shadow transition-colors max-lg:hidden duration-300 px-5 h-5 rounded-full`}>
          <button className={`bg-white size-5 rounded-full ${isDark ? 'bg-black/70 -translate-x-5 ease-in-out duration-300 transition-all': '-translate-x-0 ease-in-out duration-300 transition-all'}`} onClick={()=>setDarkMode(!isDark)}></button>
        </div> */}
        <div className='flex justify-center gap-3'>
          <div>
            <button onClick={()=>setDropdown(!isDropdown)} type="button" className='bg-white shadow rounded-lg flex justify-center gap-2 px-2 md:px-2 py-2  items-center'>
              <Languages size={15} className='text-blue-500'/>
              <p className='font-Custom font-medium text-xs lg:text-sm text-gray-600'>{language}</p>
              {isDropdown ? <ChevronDown size={15} className='text-gray-600 -rotate-90'/> : <ChevronDown size={15} className='text-gray-600 '/>}
            </button>
            {/* dropdown menu */}
            {isDropdown && (
            <div className="absolute z-10 w-16 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(option)}
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          </div>
          <button type="button" className='bg-blue-600 rounded-lg flex justify-center gap-1 px-4 md:px-2 py-2  items-center'>
            <Plus size={20} className='text-white'/>
            <p className='font-Custom font-medium text-xs lg:text-sm text-white'>Property</p>
          </button>
        </div>
      </div>
      {/* section for user details */}
      <section className='lg:flex justify-between items-center lg:px-2 grid md:grid-cols-4 max-md:grid-cols-1 mt-4 gap-4'>
         {userDetails.map(
          (data, index) => {
            const percentage = data.rate;
            const Icon = data.icon;
            return (
              <div key={index} className='p-2 shrink-0 lg:w-60 rounded-lg  shadow-md bg-white'>
                <div className='flex justify-start items-center gap-2'>
                  <Icon size={15} className='text-blue-600'/>
                  <h1 className='font-Poppins font-medium text-gray-600 text-sm'>{data.title}</h1>
                </div>
               <div className='flex justify-between items-center gap-4 mt-1'>
                 <p className='font-Poppins font-bold text-gray-800 lg:text-md text-xs max-md:text-sm'>{data.detail}</p>
                 <div className='p-1 w-[5.8rem] rounded-lg'><img src={data.graph} alt="" className='max-lg:w-12 lg:w-[6rem] max-md:w-20 h-auto'/></div>
               </div>
               <div className='mt-1 flex flex-row flex-1 gap-1 mx-auto justify-between items-center lg:px-2 max-md:px-2 flex-shrink-0'>
                 <button className={`${percentage >= 1 ? 'text-green-400 bg-green-100' : 'text-red-400 bg-red-100'} lg:px-2 px-1 font-Custom font-medium text-sm max-md:px-2 rounded-lg`}>
                  {percentage} %
                 </button>
                 <p className='font-Custom font-normal text-gray-400 lg:text-sm text-xs'>{data.season}</p>
               </div>
              </div>
            )
          }
         )}
      </section>

      {/* advertizement section */}
      <section className='lg:p-3 md:p-2 p-1 gap-3 my-4 bg-teal-800/80 h-20 rounded-lg flex flex-1 justify-between items-center'>
        <div className='flex flex-1 p-2 gap-4 items-center flex-shrink-0'>
          <img src={bg} alt="" srcset="" className='max-w-12 h-12 shrink-0 rounded-full'/>
          <div className='md:block text-wrap'>
            <p className='font-Custom font-normal text-white lg:text-sm text-xs '>
              74 tenants have been submitted recently, please check it out !
            </p>
            <p className='font-Custom font-normal text-white/50 md:block hidden text-xs'>
              follow us for more new updates like this.
            </p>
          </div>
        </div>
        <button className=' bg-white/20 font-Custom font-medium text-white text-sm backdrop-blur-md px-1 md:px-3 shrink-0 rounded-lg py-1'>
          60% off
        </button>
      </section>
      
      {/* section with statistics graph */}
      <main className='mt-4 lg:px-3 px-1 rounded-lg py-2 grid grid-cols-1 bg-gray-100/20 h-auto space-y-1 md:grid-cols-12 gap-4'>
        <div className='bg-white w-full rounded-md px-2 py-2 h-auto md:col-span-7 lg:col-span-8'>
          <h1 className='font-Poppins font-semibold text-gray-600 text-sm py-2'>Recent Activities</h1>
          <p className='font-Poppins font-medium text-gray-600 lg:text-md text-xs pb-4 max-md:pb-8'>Took a look at the visual records of all your activities within the past months and many more</p>
          {/* area for statistics based on user activities */}
          <div className='max-w-full h-auto md:h-[18rem] flex flex-1 justify-center shadow-md rounded-lg items-start'>
            <img src={line} alt="" srcset="" className='w-full h-full object-fit'/>
          </div>
        </div>
        <div className='bg-white rounded-lg px-3 py-2 h-auto w-full md:col-span-5 lg:col-span-4'>
         <h1 className='font-Poppins font-semibold text-gray-600 text-sm py-2'>Recent Activities</h1>
          <p className='font-Poppins font-medium text-gray-600 lg:text-md text-xs pb-4 max-md:pb-8'>Took a look at the visual records of all your activities within the past months and many more</p>
          <div className='max-w-full bg-black h-auto md:h-[16rem] flex flex-1 justify-center shadow-md rounded-lg items-start shrink-0'>
            <img src={circle} alt="" srcset="" className='w-full h-full object-fit shrink-0'/>
          </div>
        </div>
      </main>
    </section>
  )
}

export default Dashboard