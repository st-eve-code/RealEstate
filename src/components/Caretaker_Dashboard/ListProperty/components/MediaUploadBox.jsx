import React, { useRef, useState } from 'react';
import { Upload, X, Play } from 'lucide-react';

/**
 * MediaUploadBox Component
 * 
 * A reusable component for uploading images and videos
 * Supports drag-and-drop and click-to-upload
 * 
 * @param {string} title - Title of the upload section (e.g., "Parlor")
 * @param {string} instruction - Instruction text (e.g., "At least 2 images and 1 video")
 * @param {Array} images - Array of uploaded images
 * @param {Array} videos - Array of uploaded videos
 * @param {function} onImageUpload - Callback when images are uploaded (optional)
 * @param {function} onVideoUpload - Callback when videos are uploaded (optional)
 * @param {function} onImageRemove - Callback when an image is removed (optional)
 * @param {function} onVideoRemove - Callback when a video is removed (optional)
 * @param {boolean} allowVideo - Whether to allow video uploads (default: true)
 * @param {boolean} allowImages - Whether to allow image uploads (default: true)
 * @param {number} maxImageSize - Maximum image size in MB (default: 10)
 * @param {number} maxVideoSize - Maximum video size in MB (default: 100)
 */
function MediaUploadBox({
  title,
  instruction,
  images = [],
  videos = [],
  onImageUpload,
  onVideoUpload,
  onImageRemove,
  onVideoRemove,
  allowVideo = true,
  allowImages = true,
  maxImageSize = 10,
  maxVideoSize = 100
}) {
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle file validation
  const validateFile = (file, type, maxSize) => {
    if (type === 'image' && !file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return false;
    }
    if (type === 'video' && !file.type.startsWith('video/')) {
      alert('Please upload a valid video file');
      return false;
    }
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return false;
    }
    return true;
  };

  // Handle image upload
  const handleImageUpload = (files) => {
    if (!onImageUpload) {
      console.warn('onImageUpload callback is not provided');
      return;
    }
    Array.from(files).forEach(file => {
      if (validateFile(file, 'image', maxImageSize)) {
        onImageUpload(file);
      }
    });
  };

  // Handle video upload
  const handleVideoUpload = (files) => {
    Array.from(files).forEach(file => {
      if (validateFile(file, 'video', maxVideoSize)) {
        onVideoUpload(file);
      }
    });
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    
    if (type === 'image') {
      const imageFiles = files.filter(f => f.type.startsWith('image/'));
      handleImageUpload(imageFiles);
    } else if (type === 'video') {
      const videoFiles = files.filter(f => f.type.startsWith('video/'));
      handleVideoUpload(videoFiles);
    }
  };

  // Create preview URL for images
  const getImagePreview = (file) => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{instruction}</p>
      </div>

      {/* Image Upload Area - Only show if allowImages is true and onImageUpload is provided */}
      {allowImages && onImageUpload && (
      <div>
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragging
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-300 hover:border-purple-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'image')}
        >
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e.target.files)}
            className="hidden"
          />

          {images.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center cursor-pointer"
              onClick={() => imageInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-purple-500 mb-3" />
              <p className="text-sm text-gray-600">
                Click to upload images or Drag and drop here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={typeof image === 'string' ? image : getImagePreview(image)}
                    alt={`${title} ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => onImageRemove(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors"
                onClick={() => imageInputRef.current?.click()}
              >
                <div className="text-center p-4">
                  <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-600">Upload more</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Video Upload Area (if allowed) */}
      {allowVideo && (
        <div>
          <div
            className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
              isDragging
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-300 hover:border-purple-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, 'video')}
          >
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => handleVideoUpload(e.target.files)}
              className="hidden"
            />

            {videos.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center cursor-pointer"
                onClick={() => videoInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-purple-500 mb-3" />
                <p className="text-sm text-gray-600">
                  Click to upload video or Drag and drop here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {videos.map((video, index) => (
                  <div key={index} className="relative group">
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {typeof video === 'string' ? video : video.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => onVideoRemove(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <div className="text-center p-4">
                    <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Upload more</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaUploadBox;

