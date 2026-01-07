import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, Timestamp, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Search, CheckCircle, XCircle, Edit, Trash2, Eye, X, Plus, Save, Tag, Filter } from 'lucide-react';

function Blogs({ isSidebarCollapsed }) {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    content: '',
    excerpt: '',
    image: '',
    readTime: ''
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, filterStatus, filterCategory, blogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      // In a real app, you'd have a blogs collection
      // For now, we'll create mock data
      const blogsRef = collection(db, 'blogs');
      const querySnapshot = await getDocs(blogsRef);
      const blogsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // If no blogs exist, create some mock data
      if (blogsData.length === 0) {
        const mockBlogs = [
          {
            title: 'Top 10 Tips for First-Time Renters',
            author: 'John Doe',
            category: 'Tips & Guides',
            content: 'Full content here...',
            excerpt: 'Essential tips for first-time renters...',
            status: 'pending',
            createdAt: Timestamp.now(),
            readTime: '5 min read'
          },
          {
            title: 'Understanding Rental Agreements',
            author: 'Jane Smith',
            category: 'Legal',
            content: 'Full content here...',
            excerpt: 'Learn about rental agreements...',
            status: 'published',
            createdAt: Timestamp.now(),
            readTime: '7 min read'
          }
        ];
        setBlogs(mockBlogs);
      } else {
        setBlogs(blogsData);
      }

      // Extract unique categories
      const uniqueCategories = [...new Set(blogsData.map(b => b.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // Use mock data on error
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(blog => blog.status === filterStatus);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(blog => blog.category === filterCategory);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(term) ||
        blog.author.toLowerCase().includes(term) ||
        blog.excerpt.toLowerCase().includes(term) ||
        blog.category.toLowerCase().includes(term)
      );
    }

    setFilteredBlogs(filtered);
  };

  /**
   * 
   * @param {string} blogId 
   * @returns 
   */
  const handlePublish = async (blogId) => {
    try {
      const blogRef = doc(db, 'blogs', blogId);
      await updateDoc(blogRef, {
        status: 'published',
        updatedAt: Timestamp.now()
      });
      await fetchBlogs();
      alert('Blog published successfully');
    } catch (error) {
      console.error('Error publishing blog:', error);
      alert('Failed to publish blog');
    }
  };

  /**
   * 
   * @param {string} blogId 
   * @returns 
   */
  const handleReject = async (blogId) => {
    if (!confirm('Are you sure you want to reject this blog post?')) return;

    try {
      const blogRef = doc(db, 'blogs', blogId);
      await updateDoc(blogRef, {
        status: 'rejected',
        updatedAt: Timestamp.now()
      });
      await fetchBlogs();
      alert('Blog rejected');
    } catch (error) {
      console.error('Error rejecting blog:', error);
      alert('Failed to reject blog');
    }
  };

  /**
   * 
   * @param {string} blogId 
   * @returns 
   */
  const handleDelete = async (blogId) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const blogRef = doc(db, 'blogs', blogId);
      await deleteDoc(blogRef);
      await fetchBlogs();
      alert('Blog deleted successfully');
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    if (!selectedBlog) return;

    try {
      const blogRef = doc(db, 'blogs', selectedBlog.id);
      await updateDoc(blogRef, {
        ...formData,
        updatedAt: Timestamp.now()
      });
      await fetchBlogs();
      setShowEditModal(false);
      setSelectedBlog(null);
      resetForm();
      alert('Blog updated successfully');
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog');
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'blogs'), {
        ...formData,
        status: 'pending',
        createdAt: Timestamp.now()
      });
      await fetchBlogs();
      setShowModal(false);
      resetForm();
      alert('Blog created successfully');
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Failed to create blog');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      category: '',
      content: '',
      excerpt: '',
      image: '',
      readTime: ''
    });
  };

  const openEditModal = (blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      author: blog.author,
      category: blog.category,
      content: blog.content,
      excerpt: blog.excerpt,
      image: blog.image || '',
      readTime: blog.readTime || ''
    });
    setShowEditModal(true);
  };

  const openViewModal = (blog) => {
    setSelectedBlog(blog);
    setShowViewModal(true);
  };

  if (loading) {
    return (
      <section className={`bg-gray-50 min-h-screen w-full p-4 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
      }`}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-gray-50 max-md:mt-14 min-h-screen w-full p-4 transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-20 lg:ml-20' : 'md:ml-64 lg:ml-80'
    }`}>
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Blogs Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-between gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Create New Post
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
            <input
              type="text"
              placeholder="Search blogs by title, author, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Blogs Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Title</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Author</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Category</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Status</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Created</th>
                <th className="px-4 py-3 text-sm font-semibold text-left text-gray-700 border border-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500 border border-gray-200">
                    No blogs found
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 border border-gray-200">{blog.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">{blog.author}</td>
                    <td className="px-4 py-3 text-sm border border-gray-200">
                      <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm border border-gray-200">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        blog.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : blog.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 border border-gray-200">
                      {blog.createdAt?.toDate ? new Date(blog.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 border border-gray-200">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openViewModal(blog)}
                          className="p-2 text-blue-600 transition-colors rounded hover:bg-blue-50"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(blog)}
                          className="p-2 text-green-600 transition-colors rounded hover:bg-green-50"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        {blog.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handlePublish(blog.id)}
                              className="p-2 text-green-600 transition-colors rounded hover:bg-green-50"
                              title="Publish"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(blog.id)}
                              className="p-2 text-red-600 transition-colors rounded hover:bg-red-50"
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="p-2 text-red-600 transition-colors rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredBlogs.length} of {blogs.length} blogs
        </div>
      </div>

      {/* Create Blog Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Create New Blog Post</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateBlog}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Author</label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Excerpt</label>
                  <textarea
                    required
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Read Time</label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      placeholder="e.g., 5 min read"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Create Blog
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Blog Modal */}
      {showEditModal && selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Edit Blog Post</h2>
              <button onClick={() => { setShowEditModal(false); setSelectedBlog(null); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveBlog}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Author</label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Excerpt</label>
                  <textarea
                    required
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Content</label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Save size={16} className="inline mr-2" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setSelectedBlog(null); resetForm(); }}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Blog Modal */}
      {showViewModal && selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Blog Post Details</h2>
              <button onClick={() => { setShowViewModal(false); setSelectedBlog(null); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                <p className="text-gray-900">{selectedBlog.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Author</label>
                  <p className="text-gray-900">{selectedBlog.author}</p>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                  <span className="inline-block px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                    {selectedBlog.category}
                  </span>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  selectedBlog.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : selectedBlog.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedBlog.status}
                </span>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Excerpt</label>
                <p className="text-gray-900">{selectedBlog.excerpt}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Content</label>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedBlog.content}</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => { setShowViewModal(false); setSelectedBlog(null); }}
                className="w-full px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Blogs;