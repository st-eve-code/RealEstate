import React from 'react';
import '../App.css';
import {Users, ThumbsUpIcon,TargetIcon,Waypoints,CloudyIcon} from 'lucide-react'
function Services() {
    const services = [
        {
            icon : Users,
            title: 'Client Focused',
            text: 'we prioritize our clients and attend to all their needs , making sure they are satisfied with our services.'
        },
        {
            icon: ThumbsUpIcon,
            title: 'Trusted Partners',
            text: 'Partnering with us is a benefits for both side which can lead to better trust and more partnerships.'
        },
        {
            icon: TargetIcon,
            title: 'Tailored Solutions',
            text: 'Problem solving has never been so easy with us, we provide the best solutions for your renting process.'
        },
        {
            icon: Waypoints,
            title: 'Customer Support',
            text: 'We provide a free customer support services to attend to all our customer`s problems and more.'
        },
        {
            icon: CloudyIcon,
            title: 'Transparent Market',
            text: 'All our decisions in the market are genuine and all for the interest of the customer`s unique needs.'
        },
    ];
  return (
    <section className='flex flex-wrap lg:p-[1rem] p-5 gap-10 mt-[2rem] items-center justify-center'>
        {/* section having all the services we offer */}
        {services.map(
            (e)=> {
                const Icons =e.icon;
                return (
                    <div className='bg-white shadow-md shadow-gray-300/40 md:max-w-[18rem] lg:max-w-[16rem] rounded-2xl h-[11rem] p-4'>
                        <div className='block-animate size-9 bg-blue-600 rounded-full p-2 mb-3 mx-auto m-2'>
                            <Icons size={20} className='text-white'/>
                        </div>
                        <h1 className='flex justify-center font-bold font-Custom text-sm text-gray-800 pt-2'>
                            {e.title}
                        </h1>
                        <p className='font-Custom font-normal text-xs text-gray-400 py-2 flex flex-wrap justify-center text-center'>
                            {e.text}
                        </p>
                    </div>
                )
            }
        )}
    </section>
)
}

export default Services