import React from 'react';
import Nav_bar from '../../components/Navbar';
import '../../App.css';

function Blog() {
  return (
    <section className='mx-auto bg-white'>
        <Nav_bar/>
        <section className='max-w-7xl mx-auto px-3 md:p-6'>
          <h1 className='font-Poppins font-bold text-3xl text-center text-gray-800 mt-4 lg:mt-10 py-2'>Discover Our Latest News</h1>
            <h2 className='font-Poppins font-medium text-sm flex-wrap flex md:max-w-[58rem] mx-auto text-center text-gray-600'>
              Discover our latest articles, tips, and insights on property management, hosting, 
              and maximizing your rental income. Stay informed with expert advice and industry trends 
              to help you succeed in the world of short-term rentals.
            </h2>
            <article>
              <section>
                {/* section for adverts if any */}

              </section>
            </article>
        </section>
    </section>
  )
}

export default Blog