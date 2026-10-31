/**
 * Centralized Google OAuth 2.0 Scope Configuration for UWOConnect Frontend.
 * 
 * Provides single source of truth for:
 * - Scopes requested across each Google integration.
 * - Human-readable explanations of permissions for modal consent displays.
 * - Least-privilege compliance definitions matching backend registry.
 */

export const GOOGLE_SCOPES_MAP = {
  gmail: [
    {
      scope: 'https://www.googleapis.com/auth/gmail.readonly',
      title: 'Gmail Read-Only Inbox Access',
      desc: 'Required to read and sync incoming customer inquiries and support emails.',
      badge: 'Restricted',
      status: 'Active',
    },
  ],
  calendar: [
    {
      scope: 'https://www.googleapis.com/auth/calendar.events',
      title: 'Calendar Events & Google Meet Scheduling',
      desc: 'Required to schedule client appointments and auto-generate Google Meet conference links.',
      badge: 'Sensitive',
      status: 'Active',
    },
    {
      scope: 'https://www.googleapis.com/auth/calendar',
      title: 'Calendar Availability & FreeBusy Queries',
      desc: 'Allows UWOConnect to check calendar slot availability and avoid overlapping bookings.',
      badge: 'Sensitive',
      status: 'Active',
    },
  ],
  sheets: [
    {
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      title: 'Google Sheets Data Export & Management',
      desc: 'Used to auto-export incoming leads, customer contacts, and e-commerce orders into spreadsheets.',
      badge: 'Sensitive',
      status: 'Active',
    },
    {
      scope: 'https://www.googleapis.com/auth/drive.file',
      title: 'Google Drive File Access',
      desc: 'Restricted to creating and updating files specifically opened or created by UWOConnect.',
      badge: 'Non-Sensitive',
      status: 'Active',
    },
  ],
  docs: [
    {
      scope: 'https://www.googleapis.com/auth/documents',
      title: 'Google Docs Document Creation',
      desc: 'Used to auto-assemble digital agreements, sales proposals, and client service contracts.',
      badge: 'Sensitive',
      status: 'Active',
    },
    {
      scope: 'https://www.googleapis.com/auth/drive.file',
      title: 'Google Drive File Access',
      desc: 'Enables saving generated proposal documents to the user\'s Google Drive.',
      badge: 'Non-Sensitive',
      status: 'Active',
    },
  ],
  slides: [
    {
      scope: 'https://www.googleapis.com/auth/presentations',
      title: 'Google Slides Presentation Creation',
      desc: 'Used to generate customized sales pitch presentations and dynamic product portfolio decks.',
      badge: 'Sensitive',
      status: 'Active',
    },
    {
      scope: 'https://www.googleapis.com/auth/drive.file',
      title: 'Google Drive File Access',
      desc: 'Enables saving generated presentation decks to the user\'s Google Drive.',
      badge: 'Non-Sensitive',
      status: 'Active',
    },
  ],
  youtube: [
    {
      scope: 'https://www.googleapis.com/auth/youtube.readonly',
      title: 'YouTube Channel & Comment Viewing',
      desc: 'Allows reading channel analytics, video statistics, and community questions.',
      badge: 'Non-Sensitive',
      status: 'Active',
    },
    {
      scope: 'https://www.googleapis.com/auth/youtube.upload',
      title: 'YouTube Video Uploading',
      desc: 'Enables publishing promotional video content directly from the UWOConnect dashboard.',
      badge: 'Sensitive',
      status: 'Active',
    },
    {
      scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
      title: 'YouTube Comment Moderation & AI Replies',
      desc: 'Enables the AI Community Bot to reply to product inquiries and moderate comments.',
      badge: 'Sensitive',
      status: 'Active',
    },
  ],
};

export const BASE_IDENTITY_SCOPES = [
  'openid',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];
