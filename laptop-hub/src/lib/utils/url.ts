/**
 * getURL
 * Dynamically determines the base URL of the application.
 * Priority: 
 * 1. window.location.origin (if in browser)
 * 2. NEXT_PUBLIC_SITE_URL (from environment)
 * 3. NEXT_PUBLIC_VERCEL_URL (automatically set on Vercel)
 * 4. Fallback to localhost:3000
 */
export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Should be https://<project-name>.vercel.app
    'http://localhost:3000'

  // Make sure to include `https://` when not localhost
  url = url.includes('http') ? url : `https://${url}`
  // Remove trailing slash if present
  url = url.endsWith('/') ? url.slice(0, -1) : url
  
  // If in browser, window.location.origin is most reliable
  if (typeof window !== 'undefined' && window.location.origin) {
    url = window.location.origin
  }

  return url
}
