import React from 'react';

function Blogs() {
  return (
    <section className="bg-white min-h-screen max-md:mt-16 w-full mx-auto shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Blogs Management</h1>
      <div className="bg-gray-50 p-4 rounded-lg">
        <p>Manage blog posts, approve submissions, and moderate content.</p>
        <ul className="mt-4 list-disc list-inside">
          <li>Review pending blog posts</li>
          <li>Publish or reject posts</li>
          <li>Edit existing posts</li>
          <li>Manage blog categories</li>
        </ul>
      </div>
    </section>
  );
}

export default Blogs;