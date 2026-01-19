'use client'

import React,{useRef, useEffect} from 'react';
import image from '../assets/images/tiger.jpg';
import { Star } from 'lucide-react';
function Testimonial(){
    const scrollRef1 = useRef();
    const scrollRef2 = useRef();
    
    useEffect(() => {
        const container1 = scrollRef1.current;
        const container2 = scrollRef2.current;
        let animationId;

        const scroll = () => {
            // First row: scroll right to left
            if (container1) {
                container1.scrollLeft += 1;
                const singleSetWidth1 = container1.scrollWidth / 2;
                if (container1.scrollLeft >= singleSetWidth1) {
                    container1.scrollLeft = 0;
                }
            }
            
            // Second row: scroll left to right
            if (container2) {
                container2.scrollLeft -= 1;
                if (container2.scrollLeft <= 0) {
                    const singleSetWidth2 = container2.scrollWidth / 2;
                    container2.scrollLeft = singleSetWidth2;
                }
            }
            
            animationId = requestAnimationFrame(scroll);
        };

        animationId = requestAnimationFrame(scroll);
        
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <section className="w-full px-3 flex flex-col gap-4 mt-5 lg:mt-16">
            {/* First row - first 4 testimonials scrolling right to left */}
            <div 
                ref={scrollRef1} 
                className='flex flex-row gap-4 overflow-x-hidden w-full'
                style={{ touchAction: 'none' }}
            >
                {/* First set - first 4 testimonials */}
                {testimonials.slice(0, 4).map(
                    (data) => { 
                        const starRating = data.stars == 5;
                        return (
                            <div key={`first-row-first-${data.id}`} className='min-w-[20rem] max-w-[28rem] p-4 bg-white shadow-md shadow-gray-400/40 rounded-lg border hover:shadow-xl flex-shrink-0'>
                                <div className='flex flex-row justify-center gap-3 items-center'>
                                    <img src={image.src || image} alt="user1" className='size-10 rounded-full object-cover'/>
                                    <div className='flex-col flex-1 flex-nowrap flex justify-center items-start'>
                                        <h1 className='font-Custom font-bold text-sm text-gray-800'>{data.name}</h1>
                                        <p className='font-Custom font-normal text-xs text-blue-400/95'>{data.position}</p>
                                    </div>
                                </div>
                                <h2 className='py-3 font-Custom font-normal text-xs text-gray-800'>
                                    {data.body}
                                </h2>
                                {starRating ? (
                                    <div className='flex-row flex justify-start items-center gap-2'>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                    </div>
                                ) : (
                                    <div className='flex-row flex justify-start items-center gap-2'>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                    </div>
                                )}
                            </div>
                        )
                    }
                )}

                {/* Duplicate set for seamless loop - first 4 */}
                {testimonials.slice(0, 4).map(
                    (data) => { 
                        const starRating = data.stars == 5;
                        return (
                            <div key={`first-row-second-${data.id}`} className='min-w-[20rem] max-w-[28rem] p-4 bg-white shadow-xl shadow-gray-100/60 rounded-lg border hover:shadow-xl flex-shrink-0'>
                                <div className='flex flex-row justify-center gap-3 items-center'>
                                    <img src={image.src || image} alt="user1" className='size-10 rounded-full object-cover'/>
                                    <div className='flex-col flex-1 flex-nowrap flex justify-center items-start'>
                                        <h1 className='font-Custom font-bold text-sm text-gray-800'>{data.name}</h1>
                                        <p className='font-Custom font-normal text-xs text-blue-400/95'>{data.position}</p>
                                    </div>
                                </div>
                                <h2 className='py-3 font-Custom font-normal text-xs text-gray-800'>
                                    {data.body}
                                </h2>
                                {starRating ? (
                                    <div className='flex-row flex justify-start items-center gap-2'>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                    </div>
                                ) : (
                                    <div className='flex-row flex justify-start items-center gap-2'>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                    </div>
                                )}
                            </div>
                        )
                    }
                )}
            </div>

            {/* Second row - remaining 6 testimonials scrolling left to right */}
            <div 
                ref={scrollRef2} 
                className='flex flex-row gap-4 overflow-x-hidden w-full'
                style={{ touchAction: 'none' }}
            >
                {/* First set - remaining 6 testimonials */}
                {testimonials.slice(4).map(
                    (data) => { 
                        const starRating = data.stars == 5;
                        return (
                            <div key={`second-row-first-${data.id}`} className='min-w-[20rem] max-w-[28rem] p-4 bg-white shadow-md shadow-gray-400/40 rounded-lg border hover:shadow-xl flex-shrink-0'>
                                <div className='flex flex-row justify-center gap-3 items-center'>
                                    <img src={image.src || image} alt="user1" className='size-10 rounded-full object-cover'/>
                                    <div className='flex-col flex-1 flex-nowrap flex justify-center items-start'>
                                        <h1 className='font-Custom font-bold text-sm text-gray-800'>{data.name}</h1>
                                        <p className='font-Custom font-normal text-xs text-blue-400/95'>{data.position}</p>
                                    </div>
                                </div>
                                <h2 className='py-3 font-Custom font-normal text-xs text-gray-800'>
                                    {data.body}
                                </h2>
                                {starRating ? (
                                    <div className='flex-row flex justify-start items-center gap-2'>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                    </div>
                                ) : (
                                    <div className='flex-row flex justify-start items-center gap-2'>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                    </div>
                                )}
                            </div>
                        )
                    }
                )}

                {/* Duplicate set for seamless loop - remaining 6 */}
                {testimonials.slice(4).map(
                    (data) => { 
                        const starRating = data.stars == 5;
                        return (
                            <div key={`second-row-second-${data.id}`} className='min-w-[20rem] max-w-[28rem] p-4 bg-white shadow-xl shadow-gray-100/60 rounded-lg border hover:shadow-xl flex-shrink-0'>
                                <div className='flex flex-row justify-center gap-3 items-center'>
                                    <img src={image.src || image} alt="user1" className='size-10 rounded-full object-cover'/>
                                    <div className='flex-col flex-1 flex-nowrap flex justify-center items-start'>
                                        <h1 className='font-Custom font-bold text-sm text-gray-800'>{data.name}</h1>
                                        <p className='font-Custom font-normal text-xs text-blue-400/95'>{data.position}</p>
                                    </div>
                                </div>
                                <h2 className='py-3 font-Custom font-normal text-xs text-gray-800'>
                                    {data.body}
                                </h2>
                                {starRating ? (
                                    <div className='flex-row flex justify-start items-center gap-2'>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                    </div>
                                ) : (
                                    <div className='flex-row flex justify-start items-center gap-2'>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                         <Star fill='orange' color='orange' size={13}/>
                                    </div>
                                )}
                            </div>
                        )
                    }
                )}
            </div>
        </section>
    )
}

export default Testimonial


const testimonials = [
    {
        id: 1,
        name: 'Shneider Volsky',
        position: 'Software Engineer',
        body: 'The team`s attention to details and creative flairs made our collaboration truly enjoyable. The designs they delivered where impressive.',
        stars: 4
    },
    {
        id: 2,
        name: 'Pauline Mage',
        position: 'Shutland Ambassador',
        body: 'Rentspot is a real estate partner you can rely on. They grasped our brief accurately and produced designs.',
        stars: 5
    },
    {
        id: 3,
        name: 'David Scotch',
        position: 'Ceo of Crimson',
        body: 'Their Design expertise is unique and a bit of creativity that set`s them apart from other competitors in the market.',
        stars: 4
    },
    {
        id: 4,
        name: 'Henry Doe',
        position: 'Big Fish Ambassador',
        body: 'Kudos to this design crew! they made our dreams a living dream, delivering top-notch designs that wowed everyone.',
        stars: 5
    },
    {
        id: 5,
        name: 'Marry Rose',
        position: 'Food Scientist',
        body: 'Impressed doesn`t cover it! Our project went from good to outstanding, This design team understands perfection.',
        stars: 4
    },
    {
        id: 6,
        name: 'Praise Bossman',
        position: 'Backend Analyst',
        body: 'Working with the design team was fantastic! they nailed our vision delivering designs that blew us away. Highly recommended.',
        stars: 4
    },
    {
        id: 7,
        name: 'Becky Hance',
        position: 'System Designer',
        body: 'Working with the team was an absolute pleasure, they understood our design need and delivered a product above and beyond our expectations.',
        stars: 5
    },
    {
        id: 8,
        name: 'Daniel Cruz',
        position: 'Database Designer',
        body: 'Initially it seemed like a dream but later on the team was so motivated and they all gave their best and it was a moment of real happiness.',
        stars: 5
    },
    {
        id: 9,
        name: 'Florid Shine',
        position: 'Ceo at Coca Soft',
        body: 'At first glance, i believed it was just some huge scamming groups out there to make profit but i was me wrong when i got my first property using the platform and it was legit.',
        stars: 5
    },
    {
        id: 10,
        name: 'Charles Depol',
        position: 'Founder of Neptune',
        body: 'Nice , i recommend this platform for any real estate deals to anyone seeking to find a house or any property online, good work guys keep it up we, appreciate.',
        stars: 5
    },

];