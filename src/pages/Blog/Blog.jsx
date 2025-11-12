import React from 'react';
import '../../App.css';
import Nav_bar from '../../components/Navbar';
import Footer from '../Footer';

function Blog() {
  return (
    <section>
      <Nav_bar />
      <div className="blog-container">
        <h1 className="blog-title">Welcome to Our Blog</h1>
      </div>
      <Footer />
    </section>
  )
}

export default Blog