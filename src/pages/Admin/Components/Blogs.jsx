'use client'

import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  Timestamp,
  orderBy,
  query
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  Tag,
  FileText,
  TrendingUp,
  BookOpen,
  Sparkles,
  X,
  Save
} from 'lucide-react';
import ConfirmModal from '@/components/ConfirmModal';

export default function Blogs({ isSidebarCollapsed }) {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: '',
    imageUrl: '',
    published: true
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const blogsRef = collection(db, 'blogs');
      const q = query(blogsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const blogsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBlogs(blogsData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      alert('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const filterBlogs = () => {
    let filtered = blogs;
    if (searchTerm) {
      filtered = filtered.filter(blog =>
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredBlogs(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.author) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingBlog) {
        // Update existing blog
        const blogRef = doc(db, 'blogs', editingBlog.id);
        await updateDoc(blogRef, {
          ...formData,
          updatedAt: Timestamp.now()
        });
        alert('Blog updated successfully');
      } else {
        // Create new blog
        await addDoc(collection(db, 'blogs'), {
          ...formData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          views: 0,
          likes: 0
        });
        alert('Blog created successfully');
      }
      
      resetForm();
      setShowModal(false);
      await fetchBlogs();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Failed to save blog');
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      content: blog.content || '',
      author: blog.author || '',
      category: blog.category || '',
      imageUrl: blog.imageUrl || '',
      published: blog.published !== false
    });
    setShowModal(true);
  };

  const openDeleteModal = (blog) => {
    setBlogToDelete(blog);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;

    try {
      await deleteDoc(doc(db, 'blogs', blogToDelete.id));
      alert('Blog deleted successfully');
      await fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    } finally {
      setBlogToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      author: '',
      category: '',
      imageUrl: '',
      published: true
    });
    setEditingBlog(null);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.published !== false).length,
    draft: blogs.filter(b => b.published === false).length,
    totalViews: blogs.reduce((sum, b) => sum + (b.views || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <section className={`flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen transition-all duration-300 ${
      isSidebarCollapsed ? 'md:ml-16 lg:ml-16' : 'md:ml-64 lg:ml-64'
    }`}>
      <div className="p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                <BookOpen size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Blog Management</h1>
                <p className="text-gray-600">Create and manage blog posts</p>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              <Plus size={20} />
              <span>New Blog Post</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Total Blogs</div>
              <FileText size={20} className="text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">All posts</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Published</div>
              <Sparkles size={20} className="text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">{stats.published}</div>
            <div className="text-xs text-gray-500 mt-1">Live posts</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Drafts</div>
              <Edit size={20} className="text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-yellow-600">{stats.draft}</div>
            <div className="text-xs text-gray-500 mt-1">Unpublished</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">Total Views</div>
              <TrendingUp size={20} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">All time</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by title, author, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Blog Cards */}
        {filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <BookOpen size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Blogs Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first blog post'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-md"
              >
                <Plus size={20} />
                <span>Create First Blog</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-purple-100 to-purple-200 overflow-hidden">
                  {blog.imageUrl ? (
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <FileText size={48} className="text-purple-300" />
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase shadow-md ${
                      blog.published !== false
                        ? 'bg-gradient-to-r from-green-400 to-green-600 text-white'
                        : 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
                    }`}>
                      {blog.published !== false ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {blog.content}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {blog.author && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <User size={14} />
                        <span>{blog.author}</span>
                      </div>
                    )}
                    {blog.category && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Tag size={14} />
                        <span>{blog.category}</span>
                      </div>
                    )}
                    {blog.views !== undefined && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Eye size={14} />
                        <span>{blog.views}</span>
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Calendar size={12} />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => openDeleteModal(blog)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[200px]"
                  placeholder="Write your blog content here..."
                  required
                />
              </div>

              {/* Author & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Author name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Technology, Real Estate"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Published Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                  Publish immediately
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-md font-medium"
                >
                  <Save size={20} />
                  <span>{editingBlog ? 'Update Blog' : 'Create Blog'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setBlogToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${blogToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </section>
  );
}
