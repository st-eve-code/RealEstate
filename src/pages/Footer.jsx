import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { IonIcon } from '@ionic/react';
import { logoInstagram, logoLinkedin, logoTwitter, logoFacebook, call, mail} from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import '../App.css';
function Footer() {
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
                <ul>
                    <Link to="/">
                        <li className='font-Custom font-normal text-xs text-gray-600'> Home </li>
                    </Link>
                    <Link to="/about">
                        <li className='font-Custom font-normal text-xs text-gray-600'> About </li>
                    </Link>
                    <Link to="/contact">
                        <li className='font-Custom font-normal text-xs text-gray-600'> Contact us</li>
                    </Link>
                    <Link to="/blog">
                        <li className='font-Custom font-normal text-xs text-gray-600'> Blog </li>
                    </Link>
                    <Link to="/contact#faqs">
                        <li className='font-Custom font-normal text-xs text-gray-600'> FAQS </li>
                    </Link>
                    <Link to="/plans">
                        <li className='font-Custom font-normal text-xs text-gray-600'> Plans </li>
                    </Link>
                </ul>
            </div>
            {/* links to different location */}
            <div className='block p-5'>
                <h1 className='font-bold text-md font-Custom text-gray-800'> 
                    Locations
                </h1>
                <ul>
                    <Link to="/location/muea">
                        <li className='font-Custom font-normal text-xs text-gray-600'> Muea </li>
                    </Link>
                    <Link to="/location/bomaka">
                        <li className='font-Custom font-normal text-xs text-gray-600'> Bomaka </li>
                    </Link>
                    <Link to="/location/malingo">
                        <li className='font-Custom font-normal text-xs text-gray-600'> Malingo </li>
                    </Link>
                    <Link to="/location/mayor-street">
                        <li className='font-Custom font-normal text-xs text-gray-600'> Mayor Street </li>
                    </Link>
                    <Link to="/location/molyko">
                        <li className='font-Custom font-normal text-xs text-gray-600'> Molyko </li>
                    </Link>
                    <Link to="/location/checkpoint">
                        <li className='font-Custom font-normal text-xs text-gray-600'> Checkpoint </li>
                    </Link>
                    <Link to="/location/biaka">
                        <li className='font-Custom font-normal text-xs text-gray-600'> Biaka </li>
                    </Link>
                    <Link to="/location/all">
                        <li className='font-Custom font-normal text-xs text-gray-600'> More </li>
                    </Link>
                </ul>
            </div>
            {/* information concerning legals */}
            <div className='block p-5'>
                <h1 className='font-bold text-md font-Custom text-gray-800'> 
                    Legals
                </h1>
                <ul>
                    <Link to="/policy">
                        <li className='font-Custom font-normal text-xs text-gray-600'> Cookie Policy </li>
                    </Link>
                    <Link to="/terms">
                        <li className='font-Custom font-normal text-xs text-gray-600'> Terms & Conditions </li>
                    </Link>
                    <Link to="/user-policy">
                        <li className='font-Custom font-normal text-xs text-gray-600'> User Policy </li>
                    </Link>
                </ul>
            </div>
            {/* information concerning contacts */}
            <div className='block p-5'>
                <h1 className='font-bold text-md font-Custom text-gray-800 pb-2'> 
                    Contacts
                </h1>
                <div className='flex items-center gap-2 text-gray-600'>
                    <IonIcon icon={call} className='text-gray-500'/>
                    <p className='font-Custom font-normal text-xs'>+237681987524</p>
                </div>
                <div className='flex items-center gap-2 text-gray-600 py-2'>
                    <IonIcon icon={call} className='text-gray-500'/>
                    <p className='font-Custom font-normal text-xs'>+237651820548</p>
                </div>
                <div className='flex items-center gap-2 text-gray-600'>
                    <IonIcon icon={mail} className='text-gray-500'/>
                    <p className='font-Custom font-normal text-xs'>rentspot@gmail.com</p>
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