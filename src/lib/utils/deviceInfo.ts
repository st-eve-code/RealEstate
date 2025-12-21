/**
 * Generate a unique device token
 */
export function generateDeviceToken(): string {
  // Generate a unique token using timestamp, random number, and crypto if available
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  const cryptoPart = typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID().replace(/-/g, '').substring(0, 16)
    : Math.random().toString(36).substring(2, 18);
  
  return `${timestamp}-${random}-${cryptoPart}`;
}

/**
 * Get device information from the browser
 */
export function getDeviceInfo() {
  const userAgent = navigator.userAgent || '';
  const platform = navigator.platform || '';
  
  // Detect device type
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const deviceType = isMobile ? 'mobile' : 'desktop';
  
  // Detect OS
  let deviceOS = 'unknown';
  let deviceOSVersion = 'unknown';
  
  if (/Windows NT/i.test(userAgent)) {
    deviceOS = 'Windows';
    const match = userAgent.match(/Windows NT (\d+\.\d+)/);
    if (match) deviceOSVersion = match[1];
  } else if (/Mac OS X/i.test(userAgent)) {
    deviceOS = 'macOS';
    const match = userAgent.match(/Mac OS X (\d+[._]\d+)/);
    if (match) deviceOSVersion = match[1].replace('_', '.');
  } else if (/Linux/i.test(userAgent)) {
    deviceOS = 'Linux';
  } else if (/Android/i.test(userAgent)) {
    deviceOS = 'Android';
    const match = userAgent.match(/Android (\d+(\.\d+)?)/);
    if (match) deviceOSVersion = match[1];
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    deviceOS = /iPad/i.test(userAgent) ? 'iPadOS' : 'iOS';
    const match = userAgent.match(/OS (\d+[._]\d+)/);
    if (match) deviceOSVersion = match[1].replace('_', '.');
  }
  
  // Detect browser/model (simplified)
  let deviceModel = 'unknown';
  if (/iPhone/i.test(userAgent)) {
    deviceModel = 'iPhone';
  } else if (/iPad/i.test(userAgent)) {
    deviceModel = 'iPad';
  } else if (/Android/i.test(userAgent)) {
    // Try to extract device model from user agent
    const match = userAgent.match(/Android.*?;\s([^)]+)\)/);
    if (match) deviceModel = match[1];
  } else {
    deviceModel = platform || 'Desktop';
  }
  
  return {
    currentDeviceToken: generateDeviceToken(),
    deviceType,
    deviceModel,
    deviceOS,
    deviceOSVersion,
    deviceOSBuild: undefined, // Not available in browser
    deviceOSBuildVersion: undefined, // Not available in browser
    deviceOSBuildVersionCode: undefined, // Not available in browser
    deviceOSBuildVersionName: undefined, // Not available in browser
  };
}

