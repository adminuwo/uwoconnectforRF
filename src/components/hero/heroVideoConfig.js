/**
 * heroVideoConfig.js
 * Full-Screen Background Video Storyboard Config & Scene Timestamps for UWO Connect
 */

export const HERO_VIDEO_CONFIG = {
  sources: {
    desktop: "/videos/uwo-connect-hero-desktop.mp4",
    mobile: "/videos/uwo-connect-hero-mobile.mp4",
    poster: "/images/uwo-connect-hero-poster.webp"
  },
  durationSeconds: 35,
  brand: {
    name: "UWO Connect",
    tagline: "Everything Your Business Needs. Connected in One Place.",
    subtitle: "Manage conversations, clients, teams, projects and business operations from one connected workspace.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Explore UWO Connect"
  },
  scenes: [
    {
      id: "whatsapp",
      startTime: 0,
      endTime: 4,
      title: "Too many messages?",
      subtitle: "Your customers are contacting you on WhatsApp every minute.",
      badge: "WhatsApp Business"
    },
    {
      id: "instagram",
      startTime: 4,
      endTime: 8,
      title: "Too many conversations?",
      subtitle: "Managing Instagram DMs and social comments separately takes hours.",
      badge: "Instagram Direct"
    },
    {
      id: "email",
      startTime: 8,
      endTime: 12,
      title: "Too many things to manage?",
      subtitle: "Unread emails, pending quotes, and scattered customer data.",
      badge: "Email & Spreadsheets"
    },
    {
      id: "chaos",
      startTime: 12,
      endTime: 16,
      title: "Your business shouldn't feel this complicated.",
      subtitle: "Switching between 10 apps wastes time and loses sales.",
      badge: "Multi-Platform Chaos"
    },
    {
      id: "transition",
      startTime: 16,
      endTime: 20,
      title: "Everything. Connected.",
      subtitle: "Stopping the chaos and unifying all business communication.",
      badge: "Convergence"
    },
    {
      id: "solution",
      startTime: 20,
      endTime: 25,
      title: "Meet UWO Connect.",
      subtitle: "One intelligent operating system for your entire business.",
      badge: "UWO Connect"
    },
    {
      id: "workspace",
      startTime: 25,
      endTime: 30,
      title: "One connected workspace.",
      subtitle: "WhatsApp, Instagram, Email, Team QR, CRM & Invoices in one place.",
      badge: "Unified OS"
    },
    {
      id: "final-brand",
      startTime: 30,
      endTime: 35,
      title: "UWO Connect",
      subtitle: "Everything Your Business Needs. Connected in One Place.",
      badge: "Connect. Manage. Grow."
    }
  ]
};
