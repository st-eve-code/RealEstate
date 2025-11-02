import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { IonIcon } from '@ionic/react';
import { logoInstagram, logoLinkedin, logoTwitter, logoFacebook, call, mail} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import '../App.css';
function Footer() {
    const links =[
        {
            path: '/',
            name: 'Home'
        },
        {
            path: '/about',
            name: 'About'
        },
        {
            path: '/contact',
            name: 'Contact Us'
        },
        {
            path: '/blog',
            name: 'Blog'
        },
        {
            path: '/plans',
            name: 'Subscription'
        },
    ];

    const legals = [
        {
            path: '/policy',
            name: 'Cookie Policy'
        },
        {
            path: '/terms',
            name: 'Terms & Conditions'
        },
        {
            path: '/user-policy',
            name: 'User Policy'
        },
    ];
    
    const Locations = [
        {
            path: "/location/muea",
            name: 'Muea'
        },
        {
            path: "/location/bomaka",
            name: 'Bomaka'
        },
        {
            path: "/location/malingo",
            name: 'Malingo'
        },
        {
            path: "/location/mayor-street",
            name: 'Mayor-Street'
        },
        {
            path: "/location/molyko",
            name: 'Molyko'
        },
            {
            path: "/location/checkpoint",
            name: 'CheckPoint'
        },
        {
            path: "/location/biaka",
            name: 'Biaka'
        },
        {
            path: "/location/all",
            name: 'More'
        },
    ];

    const Contact =[
        {
            Icons: call,
            name: '+237681987524'
        },
        {
            Icons: call,
            name: '+237651820548'
        },
        {
            Icons: mail,
            name: 'rentspot@gmail.com'
        },
    ];

    const navigate = useNavigate();
  return (
    <section className='bg-blue-100/40 backdrop-blur-sm mt-[5rem]'>
        <div className='flex flex-wrap justify-between items-start m-8 p-[1rem]'>
            <div className='p-3 max-w-[20rem]'> {/* links to all social medias */}
                <img src={logo} onClick={()=>navigate('/')} alt="" className='w-[8rem] cursor-pointer'/>
                <h1 className='font-Custom font-bold text-2xl text-gray-800 text-left max-w-[20rem] pt-3'>Discover real estate ideas from your own ease !</h1>
                <div className='flex items-center gap-4 pt-5'>
                    <a href="#">
                    <div className='bg-blue-600 size-7 rounded-full p-1'>
                            <IonIcon icon={logoFacebook} className='size-5 text-white'/>
                        </div>
                    </a>
                    <a href="#">
                    <div className='bg-blue-600 size-7 rounded-full p-1'>
                            <IonIcon icon={logoInstagram} className='size-5 text-white'/>
                        </div>
                    </a>
                    <a href="#">
                        <div className='bg-blue-600 size-7 rounded-full p-1'>
                            <IonIcon icon={logoLinkedin} className='size-5 text-white'/>
                        </div>
                    </a>
                    <a href="#">
                        <div className='bg-blue-600 size-7 rounded-full p-1'>
                            <IonIcon icon={logoTwitter} className='size-5 text-white'/>
                        </div>
                    </a>
                </div>
            </div>
            <div className='block p-5'>
                <h1 className='font-bold text-md font-Custom text-gray-800'> 
                    Quick Links
                </h1>
                <ul className='font-Custom font-normal text-sm text-gray-600'>
                    {links.map(
                        (name, index) => (
                            <div key={index} className='py-1'>
                                <li>
                                    <Link to={name.path}>{name.name}</Link>
                                </li>
                            </div>
                        )
                    )}
                </ul>
            </div>
            {/* links to different location */}
            <div className='block p-5'>
                <h1 className='font-bold text-md font-Custom text-gray-800'> 
                    Locations
                </h1>
                <ul className='font-Custom font-normal text-sm text-gray-600'>
                    {Locations.map(
                        (name, index) => (
                            <div key={index} className='py-1'>
                                <li>
                                    <Link to={name.path}>{name.name}</Link>
                                </li>
                            </div>
                        )
                    )}
                </ul>
            </div>
            {/* information concerning legals */}
            <div className='block p-5'>
                <h1 className='font-bold text-md font-Custom text-gray-800'> 
                    Legals
                </h1>
                <ul className='font-Custom font-normal text-sm text-gray-600'>
                    {legals.map(
                        (name, index) => (
                            <div key={index} className='py-1'>
                                <li>
                                    <Link to={name.path}>{name.name}</Link>
                                </li>
                            </div>
                        )
                    )}
                </ul>
            </div>
            {/* information concerning contacts */}
            <div className='block p-5'>
                <h1 className='font-bold text-md font-Custom text-gray-800 pb-2'> 
                    Contacts
                </h1>
                <div >
                    {Contact.map(
                        (detail, index) => (
                           <div key={index} className='flex p-1 mx-auto items-center gap-2 space-y-2 font-Custom font-normal text-sm text-gray-600'>
                             <IonIcon icon={detail.Icons} className='text-gray-500 size-4 pt-2'/>
                             <p className={`${detail.name.includes('@') ? 'text-blue-500' : 'text-gray-600'}`}>{detail.name}</p>
                           </div>
                        )
                    )}
                    
                </div>
            </div>
        </div>
        <div className='flex justify-center pb-5'>
            <p className='font-Custom font-normal text-xs text-gray-500'>
                copyright @ 2025 Rentspot ltd
            </p>
        </div>
    </section>
  )
}

export default Footer