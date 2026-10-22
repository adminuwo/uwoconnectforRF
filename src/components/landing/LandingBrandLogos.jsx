'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export const WhatsAppLogo = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("shrink-0", className)}>
    <circle cx="24" cy="24" r="24" fill="#25D366" />
    <path fillRule="evenodd" clipRule="evenodd" d="M35.2 12.8C32.3 9.9 28.3 8.3 24.1 8.3C15.4 8.3 8.4 15.3 8.4 24C8.4 26.8 9.1 29.5 10.5 31.9L8.4 39.6L16.3 37.5C18.6 38.8 21.3 39.5 24.1 39.5C32.8 39.5 39.8 32.5 39.8 23.8C39.8 19.6 38.1 15.6 35.2 12.8ZM24.1 36.8C21.7 36.8 19.4 36.1 17.4 35L16.9 34.7L12.2 35.9L13.5 31.3L13.2 30.8C12 28.7 11.3 26.4 11.3 24C11.3 17 17 11.3 24.1 11.3C27.5 11.3 30.7 12.6 33.1 15C35.5 17.4 36.8 20.6 36.8 24C36.8 31 31.1 36.8 24.1 36.8ZM31 27.2C30.6 27 28.7 26.1 28.4 26C28 25.8 27.8 25.7 27.5 26.1C27.2 26.5 26.5 27.4 26.3 27.6C26.1 27.9 25.8 27.9 25.4 27.7C25 27.5 23.7 27.1 22.2 25.7C21 24.7 20.2 23.4 20 23C19.8 22.6 20 22.4 20.8 21.5C21 21.3 21.1 21.1 21.2 20.9C21.3 20.7 21.3 20.5 21.2 20.3C21.1 20.1 20.3 18.2 20 17.4C19.7 16.6 19.4 16.7 19.1 16.7H18.4C18.1 16.7 17.7 16.8 17.3 17.2C16.9 17.6 16 18.5 16 20.3C16 22.1 17.3 23.9 17.5 24.1C17.7 24.3 20.1 28 23.7 29.6C24.6 30 25.2 30.2 25.8 30.4C26.7 30.7 27.5 30.6 28.2 30.5C28.9 30.4 30.5 29.5 30.8 28.6C31.1 27.8 31.1 27.1 31 27.2Z" fill="white" />
  </svg>
);

export const InstagramLogo = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("shrink-0", className)}>
    <defs>
      <linearGradient id="igGradBrand" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFD600" />
        <stop offset="25%" stopColor="#FF7A00" />
        <stop offset="50%" stopColor="#FF0069" />
        <stop offset="75%" stopColor="#D300C5" />
        <stop offset="100%" stopColor="#7638FA" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#igGradBrand)" />
    <rect x="11" y="11" width="26" height="26" rx="7" stroke="white" strokeWidth="3" fill="none" />
    <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="3" fill="none" />
    <circle cx="31.5" cy="16.5" r="1.75" fill="white" />
  </svg>
);

export const FacebookLogo = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("shrink-0", className)}>
    <circle cx="24" cy="24" r="24" fill="#1877F2" />
    <path d="M29.5 25.1L30.3 19.9H25.3V16.5C25.3 15.1 26 13.7 28.2 13.7H30.5V9.3C30.5 9.3 28.4 9 26.4 9C22.3 9 19.6 11.5 19.6 16V19.9H15V25.1H19.6V37.7C20.5 37.9 21.5 38 22.5 38C23.5 38 24.4 37.9 25.3 37.7V25.1H29.5Z" fill="white" />
  </svg>
);

export const YouTubeLogo = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("shrink-0", className)}>
    <rect width="48" height="48" rx="12" fill="#FF0000" />
    <path d="M33.2 24.1L19.5 16.2C19.2 16 18.8 16.2 18.8 16.6V32.4C18.8 32.8 19.2 33 19.5 32.8L33.2 24.9C33.5 24.7 33.5 24.3 33.2 24.1Z" fill="white" />
  </svg>
);

export const GmailLogo = ({ size = 22, className = '' }) => (
  <img
    src="/Gmail.png"
    alt="Gmail"
    width={size}
    height={size}
    style={{ width: size, height: size }}
    className={cn("shrink-0 object-contain", className)}
  />
);

export const OutlookLogo = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("shrink-0", className)}>
    <path d="M26 10L42 16V34L26 40V10Z" fill="#0078D4" />
    <path d="M26 24.5L42 16V34L26 24.5Z" fill="#106EBE" />
    <path d="M26 24.5L42 34H26V24.5Z" fill="#005A9E" />
    <path d="M26 10L42 16H26V10Z" fill="#28A8E8" />
    <rect x="6" y="10" width="20" height="28" rx="4" fill="#0078D4" />
    <text x="11.5" y="29" fill="white" fontSize="16" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif">O</text>
  </svg>
);

export const GoogleSheetsLogo = ({ size = 22, className = '' }) => (
  <img
    src="/Google Sheet.png"
    alt="Google Sheets"
    width={size}
    height={size}
    style={{ width: size, height: size }}
    className={cn("shrink-0 object-contain", className)}
  />
);

export const GoogleDocsLogo = ({ size = 22, className = '' }) => (
  <img
    src="/Google Docs.png"
    alt="Google Docs"
    width={size}
    height={size}
    style={{ width: size, height: size }}
    className={cn("shrink-0 object-contain", className)}
  />
);

export const GoogleMapsLogo = ({ size = 22, className = '' }) => (
  <img
    src="/Google Maps.png"
    alt="Google Maps"
    width={size}
    height={size}
    style={{ width: size, height: size }}
    className={cn("shrink-0 object-contain", className)}
  />
);

export const OneDriveLogo = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("shrink-0", className)}>
    <path d="M34.5 18a10.5 10.5 0 0 0-19.6-3.8A12 12 0 0 0 4 25.5C4 32.4 9.6 38 16.5 38h18c6.35 0 11.5-5.15 11.5-11.5 0-5.8-4.3-10.6-9.9-11.3-.2-.7-.5-1.4-.8-2z" fill="#0078D4" />
    <path d="M22 38h12.5a11.5 11.5 0 0 0 11.5-11.5c0-5.8-4.3-10.6-9.9-11.3a10.5 10.5 0 0 0-14.1 22.8z" fill="#28A8E8" opacity="0.8" />
  </svg>
);

export const GoogleSlidesLogo = ({ size = 22, className = '' }) => (
  <img
    src="/Google Slides.png"
    alt="Google Slides"
    width={size}
    height={size}
    style={{ width: size, height: size }}
    className={cn("shrink-0 object-contain", className)}
  />
);

export const GoogleNewsLogo = ({ size = 22, className = '' }) => (
  <img
    src="/Google News.png"
    alt="Google News"
    width={size}
    height={size}
    style={{ width: size, height: size }}
    className={cn("shrink-0 object-contain", className)}
  />
);

export const XLogo = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)}>
    <rect width="24" height="24" rx="6" fill="#000000" />
    <path d="M17.75 4H19.5L13.25 11.25L20.5 20H15.5L11.5 14.75L7 20H5.25L12 12.25L5 4H10.25L13.75 8.75L17.75 4ZM17 18.5H18L8.25 5.5H7.25L17 18.5Z" fill="white" />
  </svg>
);

export const LinkedInLogo = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)}>
    <rect width="24" height="24" rx="6" fill="#0A66C2" />
    <path d="M6.5 9H9.5V19H6.5V9ZM8 7.75C7.03 7.75 6.25 6.97 6.25 6C6.25 5.03 7.03 4.25 8 4.25C8.97 4.25 9.75 5.03 9.75 6C9.75 6.97 8.97 7.75 8 7.75ZM11 9H13.8V10.4H13.85C14.2 9.7 15.1 9 16.4 9C19.1 9 19.6 10.8 19.6 13.1V19H16.6V13.8C16.6 12.5 16.6 10.9 14.8 10.9C13 10.9 12.7 12.3 12.7 13.7V19H9.7V9H11Z" fill="white" />
  </svg>
);

export const PinterestLogo = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)}>
    <circle cx="12" cy="12" r="12" fill="#E60023" />
    <path d="M12.2 5C8.3 5 6 7.8 6 10.5C6 11.9 6.6 13.1 7.7 13.6C7.9 13.7 8.1 13.6 8.1 13.4C8.2 13.1 8.3 12.6 8.4 12.4C8.4 12.2 8.4 12.1 8.2 11.9C7.8 11.4 7.5 10.6 7.5 9.8C7.5 7.6 9.1 5.8 11.8 5.8C14.1 5.8 15.6 7.1 15.6 9.3C15.6 11.8 14.3 14 12.3 14C11.3 14 10.5 13.1 10.7 12C11 10.7 11.6 9.4 11.6 8.5C11.6 7.7 11.2 7.1 10.3 7.1C9.3 7.1 8.5 8.1 8.5 9.6C8.5 10.5 8.8 11.1 8.8 11.1L7.6 16.3C7.2 17.9 7.4 19.8 7.4 19.9C7.4 20 7.5 20.1 7.6 20C7.7 19.9 9.1 18 9.6 16.1C9.8 15.4 10.6 12.3 10.6 12.3C10.9 12.9 11.8 13.4 12.8 13.4C15.7 13.4 17.8 10.7 17.8 7.3C17.7 4.8 15.2 5 12.2 5Z" fill="white" />
  </svg>
);

export const ThreadsLogo = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)}>
    <rect width="24" height="24" rx="6" fill="#000000" />
    <path d="M15.4 11.7C15.2 11.7 15.1 11.7 15 11.7C14.4 10 13.3 9.1 11.7 9.1C9.7 9.1 8.5 10.5 8.5 12.4C8.5 14.4 9.8 15.8 11.9 15.8C13.4 15.8 14.6 15.1 15.1 14C15.2 14.4 15.3 14.8 15.3 15.2C15.3 17.2 14.1 18.2 12 18.2C10.5 18.2 9.2 17.5 8.8 16.4C8.7 16.1 8.4 16 8.1 16.1L6.8 16.6C6.6 16.7 6.4 17 6.6 17.3C7.2 19.1 9.2 20.2 12 20.2C15.3 20.2 17.3 18.4 17.3 14.9C17.3 10 14.7 7.2 10.8 7.2C6.9 7.2 4.2 10 4.2 14.5C4.2 19 7 22 12.1 22C14.7 22 16.9 21.1 18.3 19.5C18.5 19.3 18.4 19 18.2 18.8L17.1 17.8C16.9 17.6 16.6 17.7 16.4 17.9C15.3 19.2 13.7 19.9 11.9 19.9C8.2 19.9 6.2 17.6 6.2 14.4C6.2 11.2 8.3 9.1 11 9.1C13.6 9.1 15.3 10.9 15.4 11.7Z" fill="white" />
  </svg>
);

export const RedditLogo = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)}>
    <circle cx="12" cy="12" r="12" fill="#FF4500" />
    <path d="M19 12C19 11.2 18.3 10.5 17.5 10.5C17.1 10.5 16.7 10.7 16.5 11C15.4 10.2 13.9 9.7 12.2 9.6L13 6L15.5 6.6C15.6 7.1 16.1 7.5 16.6 7.5C17.2 7.5 17.6 7 17.6 6.5C17.6 6 17.1 5.5 16.6 5.5C16.1 5.5 15.7 5.8 15.6 6.2L12.8 5.6C12.7 5.6 12.5 5.7 12.5 5.8L11.6 9.6C9.9 9.7 8.4 10.2 7.3 11C7 10.7 6.7 10.5 6.3 10.5C5.4 10.5 4.8 11.2 4.8 12C4.8 12.6 5.1 13.1 5.6 13.3C5.5 13.5 5.5 13.8 5.5 14C5.5 16.5 8.4 18.5 12 18.5C15.6 18.5 18.5 16.5 18.5 14C18.5 13.8 18.5 13.5 18.4 13.3C18.9 13.1 19.2 12.6 19 12ZM9 13.5C9.6 13.5 10 14 10 14.5C10 15 9.6 15.5 9 15.5C8.4 15.5 8 15 8 14.5C8 14 8.4 13.5 9 13.5ZM14.3 16.8C13.6 17.3 12.8 17.5 12 17.5C11.2 17.5 10.4 17.3 9.7 16.8C9.5 16.7 9.5 16.4 9.7 16.3C9.8 16.2 10.1 16.2 10.2 16.4C10.7 16.7 11.3 16.9 12 16.9C12.7 16.9 13.3 16.7 13.8 16.4C13.9 16.3 14.2 16.3 14.3 16.4C14.5 16.5 14.5 16.7 14.3 16.8ZM15 15.5C14.4 15.5 14 15 14 14.5C14 14 14.4 13.5 15 13.5C15.6 13.5 16 14 16 14.5C16 15 15.6 15.5 15 15.5Z" fill="white" />
  </svg>
);

export const QuoraLogo = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)}>
    <rect width="24" height="24" rx="6" fill="#B92B27" />
    <path d="M12 4.5C8 4.5 4.8 7.5 4.8 11.5C4.8 15.5 8 18.5 12 18.5C13.5 18.5 14.8 18.1 15.9 17.3L17.2 19.2C17.4 19.5 17.8 19.5 18.1 19.3C18.3 19.1 18.4 18.7 18.2 18.4L17.1 16.7C18.4 15.3 19.2 13.5 19.2 11.5C19.2 7.5 16 4.5 12 4.5ZM12 16.2C9.2 16.2 7 14.1 7 11.5C7 8.9 9.2 6.8 12 6.8C14.8 6.8 17 8.9 17 11.5C17 14.1 14.8 16.2 12 16.2Z" fill="white" />
  </svg>
);

export const MediumLogo = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={cn("shrink-0", className)}>
    <rect width="24" height="24" rx="6" fill="#000000" />
    <path d="M7 16.5C9.48528 16.5 11.5 14.4853 11.5 12C11.5 9.51472 9.48528 7.5 7 7.5C4.51472 7.5 2.5 9.51472 2.5 12C2.5 14.4853 4.51472 16.5 7 16.5Z" fill="white" />
    <path d="M15.5 16.35C16.8807 16.35 18 14.4024 18 12C18 9.59763 16.8807 7.65 15.5 7.65C14.1193 7.65 13 9.59763 13 12C13 14.4024 14.1193 16.35 15.5 16.35Z" fill="white" />
    <path d="M20.5 16C21.0523 16 21.5 14.2091 21.5 12C21.5 9.79086 21.0523 8 20.5 8C19.9477 8 19.5 9.79086 19.5 12C19.5 14.2091 19.9477 16 20.5 16Z" fill="white" />
  </svg>
);

export const GooglePlayLogo = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("shrink-0", className)}>
    <path d="M7.704 4.116C7.272 4.572 7.02 5.268 7.02 6.156V41.844C7.02 42.732 7.272 43.428 7.704 43.884L7.812 43.98L27.648 24.144V23.856L7.812 4.02L7.704 4.116Z" fill="#4285F4" />
    <path d="M34.248 30.756L27.648 24.144V23.856L34.248 17.244L34.38 17.316L42.192 21.768C44.424 23.028 44.424 25.068 42.192 26.34L34.38 30.684L34.248 30.756Z" fill="#FBBC04" />
    <path d="M34.38 30.684L27.648 23.952L7.704 43.884C8.4 44.628 9.54 44.724 10.824 43.98L34.38 30.684Z" fill="#EA4335" />
    <path d="M34.38 17.316L10.824 4.02C9.54 3.276 8.4 3.372 7.704 4.116L27.648 24.048L34.38 17.316Z" fill="#34A853" />
  </svg>
);

export const AppleLogo = ({ size = 22, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={cn("shrink-0", className)}>
    <path d="M35.76 25.14C35.7 20.46 39.54 18.18 39.72 18.06C37.56 14.94 34.2 14.52 33.06 14.46C30.24 14.16 27.54 16.14 26.1 16.14C24.66 16.14 22.44 14.52 20.1 14.52C17.04 14.58 14.16 16.32 12.6 19.08C9.36 24.72 11.76 33.06 14.88 37.56C16.44 39.78 18.24 42.24 20.58 42.18C22.86 42.06 23.7 40.74 26.46 40.74C29.22 40.74 29.94 42.18 32.34 42.12C34.8 42.06 36.36 39.84 37.86 37.62C39.66 35.1 40.38 32.64 40.44 32.52C40.38 32.46 35.82 30.72 35.76 25.14Z" fill="currentColor" />
    <path d="M31.38 11.46C32.64 9.9 33.54 7.8 33.3 5.7C31.44 5.76 29.16 6.96 27.84 8.52C26.7 9.84 25.62 12.06 25.86 14.1C27.96 14.28 30.06 13.02 31.38 11.46Z" fill="currentColor" />
  </svg>
);
