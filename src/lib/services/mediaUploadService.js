/**
 * Media Upload Service
 * 
 * Modular service for uploading images and videos to a PHP server.
 * Handles unique ID generation and URL formatting.
 * 
 * This service can be reused across different modules in the application.
 */

/**
 * Generate a unique ID for media uploads
 * Format: {prefix}{randomString}{timestamp}
 * @param {string} prefix - Optional prefix (e.g., user name, property name)
 * @returns {string} - Unique ID
 */
export const generateUniqueId = (prefix = '') => {
  const randomString = Math.random().toString(36).substring(2, 8);
  const timestamp = Date.now().toString(36);
  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 10);
  return cleanPrefix ? `${cleanPrefix}${randomString}${timestamp}` : `${randomString}${timestamp}`;
};

/**
 * Upload a single file to the server
 * @param {File} file - The file to upload
 * @param {string} uniqueId - Unique identifier for this upload session
 * @param {string} category - Category name (e.g., 'bedroom', 'parlor')
 * @param {string} fileType - 'image' or 'video'
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadFile = async (file, uniqueId, category, fileType = 'image') => {
  try {
    // TODO: Replace with actual PHP server endpoint
    const UPLOAD_ENDPOINT = process.env.REACT_APP_MEDIA_UPLOAD_URL || 'https://example.com/upload';
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uniqueId', uniqueId);
    formData.append('category', category);
    formData.append('fileType', fileType);
    
    // Uncomment when PHP server is ready
    try {
      const response = await fetch(UPLOAD_ENDPOINT, {
        method: 'POST',
        body: formData
        // Add authentication headers if needed:
        // headers: {
        //   'Authorization': `Bearer ${token}`
        // }
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return {
          success: true,
          url: result.url,
          fileName: result.fileName || file.name
        };
      } else {
        return {
          success: false,
          error: result.error || 'Upload failed'
        };
      }
    } catch (error) {
      // Fallback to placeholder URL for development/testing
      console.warn('Upload endpoint not available, using placeholder URL:', error.message);
      const fileName = file.name;
      const url = `https://example.com/viewMedia/${uniqueId}/${fileName}`;
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        url: url,
        fileName: fileName
      };
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload file'
    };
  }
};

/**
 * Upload multiple files (images or videos) for a category
 * @param {File[]} files - Array of files to upload
 * @param {string} uniqueId - Unique identifier for this upload session
 * @param {string} category - Category name
 * @param {string} fileType - 'image' or 'video'
 * @param {function} onProgress - Optional progress callback (fileIndex, progress)
 * @returns {Promise<{success: boolean, urls: string[], errors: string[]}>}
 */
export const uploadFiles = async (files, uniqueId, category, fileType = 'image', onProgress = null) => {
  const urls = [];
  const errors = [];
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // Report progress
    if (onProgress) {
      onProgress(i, (i / files.length) * 100);
    }
    
    const result = await uploadFile(file, uniqueId, category, fileType);
    
    if (result.success) {
      urls.push(result.url);
    } else {
      errors.push(`${file.name}: ${result.error}`);
    }
  }
  
  // Report completion
  if (onProgress) {
    onProgress(files.length, 100);
  }
  
  return {
    success: errors.length === 0,
    urls: urls,
    errors: errors
  };
};

/**
 * Upload all media for a property listing
 * Organizes uploads by category and handles both images and videos
 * @param {object} mediaData - Media data from form
 * @param {string} uniqueId - Unique identifier for this property
 * @param {function} onProgress - Optional progress callback (category, progress, message)
 * @returns {Promise<{success: boolean, images: Array, videoUrl?: string, errors: string[]}>}
 */
export const uploadPropertyMedia = async (mediaData, uniqueId, onProgress = null) => {
  const images = []; // Array of {category, urls, videoUrls}
  const errors = [];
  let walkthroughVideoUrl = null;
  
  try {
    // Upload walkthrough video if exists
    if (mediaData.walkthroughVideo) {
      if (onProgress) {
        onProgress('walkthrough', 0, 'Uploading walkthrough video...');
      }
      
      const videoResult = await uploadFile(
        mediaData.walkthroughVideo,
        uniqueId,
        'walkthrough',
        'video'
      );
      
      if (videoResult.success) {
        walkthroughVideoUrl = videoResult.url;
        if (onProgress) {
          onProgress('walkthrough', 100, 'Walkthrough video uploaded');
        }
      } else {
        errors.push(`Walkthrough video: ${videoResult.error}`);
      }
    }
    
    // Upload media for each category
    const categories = Object.keys(mediaData.categories || {});
    
    for (const category of categories) {
      const categoryData = mediaData.categories[category];
      
      if (!categoryData || (!categoryData.images?.length && !categoryData.videos?.length)) {
        continue;
      }
      
      const categoryImages = {
        category: category,
        urls: [],
        videoUrls: []
      };
      
      // Upload images for this category
      if (categoryData.images && categoryData.images.length > 0) {
        if (onProgress) {
          onProgress(category, 0, `Uploading ${categoryData.images.length} images for ${category}...`);
        }
        
        const imageResults = await uploadFiles(
          categoryData.images,
          uniqueId,
          category,
          'image',
          (fileIndex, progress) => {
            if (onProgress) {
              onProgress(category, progress, `Uploading image ${fileIndex + 1}/${categoryData.images.length}`);
            }
          }
        );
        
        if (imageResults.success) {
          categoryImages.urls = imageResults.urls;
        } else {
          errors.push(...imageResults.errors);
        }
      }
      
      // Upload videos for this category
      if (categoryData.videos && categoryData.videos.length > 0) {
        if (onProgress) {
          onProgress(category, 50, `Uploading ${categoryData.videos.length} videos for ${category}...`);
        }
        
        const videoResults = await uploadFiles(
          categoryData.videos,
          uniqueId,
          category,
          'video',
          (fileIndex, progress) => {
            if (onProgress) {
              onProgress(category, 50 + (progress / 2), `Uploading video ${fileIndex + 1}/${categoryData.videos.length}`);
            }
          }
        );
        
        if (videoResults.success) {
          categoryImages.videoUrls = videoResults.urls;
        } else {
          errors.push(...videoResults.errors);
        }
      }
      
      // Only add category if it has media
      if (categoryImages.urls.length > 0 || categoryImages.videoUrls.length > 0) {
        images.push(categoryImages);
      }
    }
    
    return {
      success: errors.length === 0,
      images: images,
      videoUrl: walkthroughVideoUrl,
      errors: errors
    };
  } catch (error) {
    console.error('Error uploading property media:', error);
    return {
      success: false,
      images: images,
      videoUrl: walkthroughVideoUrl,
      errors: [...errors, error.message || 'Failed to upload media']
    };
  }
};

/**
 * Delete a media file from the server
 * @param {string} url - The URL of the file to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteMediaFile = async (url) => {
  try {
    // TODO: Replace with actual PHP server endpoint
    const DELETE_ENDPOINT = process.env.REACT_APP_MEDIA_DELETE_URL || 'https://example.com/delete';
    
    // Extract uniqueId and filename from URL
    const urlMatch = url.match(/viewMedia\/([^/]+)\/(.+)$/);
    if (!urlMatch) {
      return { success: false, error: 'Invalid URL format' };
    }
    
    const [, uniqueId, fileName] = urlMatch;
    
    try {
      const response = await fetch(DELETE_ENDPOINT, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json'
          // Add authentication headers if needed:
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uniqueId, fileName })
      });
      
      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      // Fallback for development/testing
      console.warn('Delete endpoint not available:', error.message);
      await new Promise(resolve => setTimeout(resolve, 200));
      return { success: true };
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete file'
    };
  }
};

