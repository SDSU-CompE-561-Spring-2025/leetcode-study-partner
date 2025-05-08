// NOTE: When using HTTPS on the backend, run the frontend with:
// NODE_TLS_REJECT_UNAUTHORIZED=0 npm run dev
// This is necessary for self-signed certificates in development

// Make sure the URL has a trailing slash for consistent API calls
export const API_HOST_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL.endsWith('/') 
    ? process.env.NEXT_PUBLIC_API_URL 
    : `${process.env.NEXT_PUBLIC_API_URL}/`
  : "https://localhost:8000/";

// NEXT JS AND DOCKER SUCK!!!!
// PROCESS.ENV does NOT work so hardcoding as a fallback