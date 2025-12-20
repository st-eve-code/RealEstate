/**
 * Media Upload Service
 * 
 * Provides functions for uploading images and videos to a PHP server.
 * Handles unique ID generation, file uploads, and URL formatting.
 */

/**
 * Get environment variable (supports both CRA and Vite)
 */
const getEnvVar = (key, defaultValue) => {
  // Try process.env first (Create React App)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  
  // Try import.meta.env (Vite) - using eval to avoid linter issues
  try {
    // eslint-disable-next-line no-eval
    const viteEnv = eval('typeof import !== "undefined" && import.meta && import.meta.env ? import.meta.env : null');
    if (viteEnv && viteEnv[key]) {
      return viteEnv[key];
    }
  } catch (e) {
    // Ignore if import.meta is not available
  }
  
  return defaultValue;
};

/**
 * Generate a unique ID for media uploads
 * Format: name + randomNumber
 * Example: "joseph14", "property23"
 * @param {string} baseName - Base name for the unique ID
 * @returns {string} - Unique identifier
 */
export const generateUniqueId = (baseName = 'property') => {
  const sanitizedName = baseName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const randomNum = Math.floor(Math.random() * 10000);
  return `${sanitizedName}${randomNum}`;
};

/**
 * Upload a single file to the server
 * @param {File} file - The file to upload
 * @param {string} uniqueId - Unique identifier for this upload session
 * @param {string} category - Category name (e.g., 'bedroom', 'parlor')
 * @param {string} fileType - 'image' or 'video'
 * @returns {Promise<{success: boolean, url?: string, fileName?: string, error?: string}>}
 */
export const uploadFile = async (file, uniqueId, category, fileType = 'image') => {
  if (!file || !(file instanceof File)) {
    return {
      success: false,
      error: 'Invalid file provided'
    };
  }

  if (!uniqueId || !category) {
    return {
      success: false,
      error: 'Missing required parameters: uniqueId and category are required'
    };
  }

  try {
    const UPLOAD_ENDPOINT = getEnvVar('REACT_APP_MEDIA_UPLOAD_URL', 'http://192.168.1.151/tests/upload.php');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uniqueId', uniqueId);
    formData.append('category', category);
    formData.append('fileType', fileType);
    
    try {
      const response = await fetch(UPLOAD_ENDPOINT, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error (${response.status}): ${errorText || response.statusText}`);
      }
      
      let result;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Invalid response format. Expected JSON, got: ${text.substring(0, 100)}`);
      }
      
      if (result.success) {
        return {
          success: true,
          url: result.url,
          fileName: result.fileName || file.name
        };
      } else {
        return {
          success: false,
          error: result.error || 'Upload failed on server'
        };
      }
    } catch (fetchError) {
      console.error('Upload fetch error:', {
        name: fetchError.name,
        message: fetchError.message,
        stack: fetchError.stack,
        endpoint: UPLOAD_ENDPOINT
      });
      
      if (fetchError.name === 'TypeError' && (fetchError.message.includes('fetch') || fetchError.message.includes('Failed to fetch'))) {
        return {
          success: false,
          error: `Network error: Cannot connect to ${UPLOAD_ENDPOINT}. Check if the server is running and CORS is configured.`
        };
      }
      
      return {
        success: false,
        error: fetchError.message || 'Failed to upload file'
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
 * Upload multiple files sequentially
 * @param {File[]} files - Array of files to upload
 * @param {string} uniqueId - Unique identifier for this upload session
 * @param {string} category - Category name
 * @param {string} fileType - 'image' or 'video'
 * @param {function} onProgress - Optional progress callback (fileIndex, progress)
 * @returns {Promise<{success: boolean, urls: string[], errors: string[]}>}
 */
export const uploadFiles = async (files, uniqueId, category, fileType = 'image', onProgress = null) => {
  if (!Array.isArray(files) || files.length === 0) {
    return {
      success: true,
      urls: [],
      errors: []
    };
  }

  const urls = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
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
 * Upload all media for a property listing (with support for preserving existing media)
 * Organizes uploads by category and handles both images and videos
 * @param {object} mediaData - Media data from form
 * @param {string} uniqueId - Unique identifier for this property
 * @param {function} onProgress - Optional progress callback (category, progress, message)
 * @param {object} originalMedia - Optional original media data to preserve existing URLs
 * @returns {Promise<{success: boolean, images: Array, videoUrl?: string, errors: string[]}>}
 */
export const uploadPropertyMedia = async (mediaData, uniqueId, onProgress = null, originalMedia = null) => {
  const images = []; // Array of {category, urls, videoUrls}
  const errors = [];
  let walkthroughVideoUrl = null;
  
  try {
    // Handle walkthrough video
    if (mediaData.walkthroughVideo) {
      // Check if it's a File object (new upload) or a string URL (existing)
      if (mediaData.walkthroughVideo instanceof File) {
        // New file to upload
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
      } else if (typeof mediaData.walkthroughVideo === 'string' && mediaData.walkthroughVideo.trim() !== '') {
        // Existing URL, preserve it
        walkthroughVideoUrl = mediaData.walkthroughVideo;
      }
    } else if (originalMedia?.videoUrl) {
      // No new video, but preserve original if it exists
      walkthroughVideoUrl = originalMedia.videoUrl;
    }
    
    // Upload media for each category
    const categories = Object.keys(mediaData.categories || {});
    
    for (const category of categories) {
      const categoryData = mediaData.categories[category];
      
      if (!categoryData || (!categoryData.images?.length && !categoryData.videos?.length)) {
        // Check if we should preserve original media for this category
        if (originalMedia?.images) {
          const originalCategory = originalMedia.images.find(img => img.category === category);
          if (originalCategory && (originalCategory.urls?.length > 0 || originalCategory.videoUrls?.length > 0)) {
            images.push({
              category: category,
              urls: originalCategory.urls || [],
              videoUrls: originalCategory.videoUrls || []
            });
          }
        }
        continue;
      }
      
      const categoryImages = {
        category: category,
        urls: [],
        videoUrls: []
      };
      
      // Separate File objects (new) from strings (existing URLs)
      const newImageFiles = [];
      const existingImageUrls = [];
      
      if (categoryData.images && categoryData.images.length > 0) {
        categoryData.images.forEach(item => {
          if (item instanceof File) {
            newImageFiles.push(item);
          } else if (typeof item === 'string' && item.trim() !== '') {
            existingImageUrls.push(item);
          }
        });
      }
      
      // Preserve existing URLs
      categoryImages.urls = [...existingImageUrls];
      
      // Upload new image files
      if (newImageFiles.length > 0) {
        if (onProgress) {
          onProgress(category, 0, `Uploading ${newImageFiles.length} new images for ${category}...`);
        }
        
        const imageResults = await uploadFiles(
          newImageFiles,
          uniqueId,
          category,
          'image',
          (fileIndex, progress) => {
            if (onProgress) {
              onProgress(category, progress, `Uploading image ${fileIndex + 1}/${newImageFiles.length}`);
            }
          }
        );
        
        if (imageResults.success) {
          // Merge new URLs with existing ones
          categoryImages.urls = [...categoryImages.urls, ...imageResults.urls];
        } else {
          errors.push(...imageResults.errors);
        }
      }
      
      // Separate File objects (new) from strings (existing URLs) for videos
      const newVideoFiles = [];
      const existingVideoUrls = [];
      
      if (categoryData.videos && categoryData.videos.length > 0) {
        categoryData.videos.forEach(item => {
          if (item instanceof File) {
            newVideoFiles.push(item);
          } else if (typeof item === 'string' && item.trim() !== '') {
            existingVideoUrls.push(item);
          }
        });
      }
      
      // Preserve existing video URLs
      categoryImages.videoUrls = [...existingVideoUrls];
      
      // Upload new video files
      if (newVideoFiles.length > 0) {
        if (onProgress) {
          onProgress(category, 50, `Uploading ${newVideoFiles.length} new videos for ${category}...`);
        }
        
        const videoResults = await uploadFiles(
          newVideoFiles,
          uniqueId,
          category,
          'video',
          (fileIndex, progress) => {
            if (onProgress) {
              onProgress(category, 50 + (progress / 2), `Uploading video ${fileIndex + 1}/${newVideoFiles.length}`);
            }
          }
        );
        
        if (videoResults.success) {
          // Merge new URLs with existing ones
          categoryImages.videoUrls = [...categoryImages.videoUrls, ...videoResults.urls];
        } else {
          errors.push(...videoResults.errors);
        }
      }
      
      // Only add category if it has media
      if (categoryImages.urls.length > 0 || categoryImages.videoUrls.length > 0) {
        images.push(categoryImages);
      }
    }
    
    // Handle custom categories
    if (mediaData.customCategories && mediaData.customCategories.length > 0) {
      for (const customCategory of mediaData.customCategories) {
        // Similar logic for custom categories
        const customImages = {
          category: customCategory.category || 'custom',
          urls: [],
          videoUrls: []
        };
        
        // Process images
        if (customCategory.urls) {
          customCategory.urls.forEach(item => {
            if (item instanceof File) {
              // Would need to upload, but for now preserve structure
            } else if (typeof item === 'string') {
              customImages.urls.push(item);
            }
          });
        }
        
        // Process videos
        if (customCategory.videoUrls) {
          customCategory.videoUrls.forEach(item => {
            if (item instanceof File) {
              // Would need to upload, but for now preserve structure
            } else if (typeof item === 'string') {
              customImages.videoUrls.push(item);
            }
          });
        }
        
        if (customImages.urls.length > 0 || customImages.videoUrls.length > 0) {
          images.push(customImages);
        }
      }
    }
    
    // Preserve original categories that weren't modified
    if (originalMedia?.images) {
      const processedCategories = new Set(categories);
      originalMedia.images.forEach(originalCategory => {
        if (originalCategory.category && !processedCategories.has(originalCategory.category)) {
          // This category exists in original but wasn't in the form data, preserve it
          images.push({
            category: originalCategory.category,
            urls: originalCategory.urls || [],
            videoUrls: originalCategory.videoUrls || []
          });
        }
      });
    }
    
    if (onProgress) {
      onProgress('complete', 100, 'Media processing complete');
    }
    
  } catch (error) {
    console.error('Error uploading property media:', error);
    errors.push(`Upload error: ${error.message}`);
  }
  
  return {
    success: errors.length === 0,
    images: images,
    videoUrl: walkthroughVideoUrl,
    errors: errors
  };
};

/**
 * Delete a media file from the server
 * @param {string} fileUrl - URL of the file to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteMediaFile = async (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== 'string') {
    return {
      success: false,
      error: 'Invalid file URL provided'
    };
  }

  try {
    const DELETE_ENDPOINT = getEnvVar('REACT_APP_MEDIA_DELETE_URL', 'http://192.168.1.151/tests/delete.php');
    
    const response = await fetch(DELETE_ENDPOINT, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: fileUrl })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error (${response.status}): ${errorText || response.statusText}`);
    }
    
    const result = await response.json();
    
    return {
      success: result.success || false,
      error: result.error || null
    };
  } catch (error) {
    console.error('Error deleting media file:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete media file'
    };
  }
};
