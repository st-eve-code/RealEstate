# Media Upload Service Documentation

## Overview

The `mediaUploadService.js` provides a modular service for uploading images and videos to a PHP server. It handles unique ID generation, URL formatting, and progress tracking.

## URL Structure

Media files are uploaded with the following URL structure:
- **Upload Endpoint**: `https://example.com/upload`
- **View URL Format**: `https://example.com/viewMedia/{uniqueId}/{filename}`

Example:
- File: `image.png`
- Unique ID: `joseph14`
- Final URL: `https://example.com/viewMedia/joseph14/image.png`

## Usage

### Basic File Upload

```javascript
import { uploadFile, generateUniqueId } from '@/lib/services/mediaUploadService';

const uniqueId = generateUniqueId('joseph');
const result = await uploadFile(file, uniqueId, 'bedroom', 'image');

if (result.success) {
  console.log('File URL:', result.url);
}
```

### Upload Multiple Files

```javascript
import { uploadFiles } from '@/lib/services/mediaUploadService';

const results = await uploadFiles(
  filesArray,
  uniqueId,
  'bedroom',
  'image',
  (fileIndex, progress) => {
    console.log(`File ${fileIndex}: ${progress}%`);
  }
);
```

### Upload Property Media (Complete)

```javascript
import { uploadPropertyMedia, generateUniqueId } from '@/lib/services/mediaUploadService';

const uniqueId = generateUniqueId(caretakerName);
const result = await uploadPropertyMedia(
  mediaData,
  uniqueId,
  (category, progress, message) => {
    console.log(`${category}: ${progress}% - ${message}`);
  }
);

// Result structure:
// {
//   success: boolean,
//   images: [{ category: string, urls: string[], videoUrls: string[] }],
//   videoUrl?: string,
//   errors: string[]
// }
```

## PHP Server Implementation

### Upload Endpoint (`/upload`)

The PHP server should accept POST requests with:
- `file`: The file to upload
- `uniqueId`: Unique identifier for the upload session
- `category`: Category name (e.g., 'bedroom', 'parlor')
- `fileType`: 'image' or 'video'

**Expected Response:**
```json
{
  "success": true,
  "url": "https://example.com/viewMedia/joseph14/image.png",
  "fileName": "image.png"
}
```

**Example PHP Implementation:**

```php
<?php
// upload.php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$uniqueId = $_POST['uniqueId'] ?? '';
$category = $_POST['category'] ?? '';
$fileType = $_POST['fileType'] ?? 'image';

if (empty($uniqueId) || !isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

$file = $_FILES['file'];
$uploadDir = __DIR__ . '/uploads/' . $uniqueId . '/';
$fileName = basename($file['name']);

// Create directory if it doesn't exist
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$targetPath = $uploadDir . $fileName;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    $url = 'https://example.com/viewMedia/' . $uniqueId . '/' . $fileName;
    echo json_encode([
        'success' => true,
        'url' => $url,
        'fileName' => $fileName
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to upload file']);
}
?>
```

### Delete Endpoint (`/delete`)

The PHP server should accept DELETE requests with:
- `uniqueId`: Unique identifier
- `fileName`: Name of the file to delete

**Expected Response:**
```json
{
  "success": true
}
```

**Example PHP Implementation:**

```php
<?php
// delete.php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$uniqueId = $data['uniqueId'] ?? '';
$fileName = $data['fileName'] ?? '';

if (empty($uniqueId) || empty($fileName)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

$filePath = __DIR__ . '/uploads/' . $uniqueId . '/' . $fileName;

if (file_exists($filePath) && unlink($filePath)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'File not found']);
}
?>
```

### View Media Endpoint (`/viewMedia/{uniqueId}/{filename}`)

This endpoint should serve the media files. Example using Apache `.htaccess`:

```apache
RewriteEngine On
RewriteRule ^viewMedia/([^/]+)/(.+)$ uploads/$1/$2 [L]
```

Or using PHP:

```php
<?php
// viewMedia.php
$uniqueId = $_GET['uniqueId'] ?? '';
$fileName = $_GET['filename'] ?? '';

$filePath = __DIR__ . '/uploads/' . $uniqueId . '/' . $fileName;

if (file_exists($filePath)) {
    $mimeType = mime_content_type($filePath);
    header('Content-Type: ' . $mimeType);
    readfile($filePath);
} else {
    http_response_code(404);
    echo 'File not found';
}
?>
```

## Integration with Unit Interface

The service formats media data to match the `Unit` interface from `types.ts`:

```typescript
images: {
  category: string
  urls: string[]
  videoUrls?: string[]
}[]
videoUrl?: string
```

## Error Handling

The service handles errors gracefully:
- Network errors
- File size validation
- Invalid file types
- Server errors

All errors are returned in the `errors` array, allowing partial success scenarios.

## Security Considerations

1. **File Validation**: Validate file types and sizes on the server
2. **Authentication**: Add authentication tokens to upload requests
3. **Rate Limiting**: Implement rate limiting on the server
4. **File Size Limits**: Enforce maximum file sizes
5. **Unique ID Validation**: Validate unique IDs to prevent directory traversal

## Testing

To test with placeholder URLs, the service currently simulates uploads. Replace the placeholder code in `uploadFile()` with actual fetch calls when the PHP server is ready.

