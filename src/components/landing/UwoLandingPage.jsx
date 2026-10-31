'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap, MessageSquare, Share2, Layers, CheckCircle2,
  LayoutDashboard, FileCheck, Receipt, FileText, ShoppingBag,
  CreditCard, Users, Bot, Video, Sparkles, ArrowRight, ShieldCheck,
  ChevronDown, ChevronUp, RefreshCw, Check, Star, Lock, Globe,
  HelpCircle, Plus, Minus, Sun, Moon, Menu, X, Play, Pause,
  Volume2, ExternalLink, Activity, ArrowUpRight, Cpu, SlidersHorizontal,
  Workflow, ArrowRightLeft, Radio, Bell, Database, Mail, Terminal, Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import UWOLoginModal from '@/components/UWOLoginModal';
import TermsModal from '@/components/TermsModal';
import PricingComparisonTable from '@/components/pricing/PricingComparisonTable';
import CustomPlanSection from './CustomPlanSection';
import ProjectsDropdown, { MobileProjectsAccordion } from './ProjectsDropdown';
import { useBrand } from '@/context/BrandContext';
import { useTheme } from '@/context/ThemeContext';
import ScrollReveal from './ScrollReveal';

// ── AUTHENTIC SVG BRAND LOGOS ──
const WhatsAppLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <circle cx="24" cy="24" r="24" fill="#25D366" />
    <path fillRule="evenodd" clipRule="evenodd" d="M35.2 12.8C32.3 9.9 28.3 8.3 24.1 8.3C15.4 8.3 8.4 15.3 8.4 24C8.4 26.8 9.1 29.5 10.5 31.9L8.4 39.6L16.3 37.5C18.6 38.8 21.3 39.5 24.1 39.5C32.8 39.5 39.8 32.5 39.8 23.8C39.8 19.6 38.1 15.6 35.2 12.8ZM24.1 36.8C21.7 36.8 19.4 36.1 17.4 35L16.9 34.7L12.2 35.9L13.5 31.3L13.2 30.8C12 28.7 11.3 26.4 11.3 24C11.3 17 17 11.3 24.1 11.3C27.5 11.3 30.7 12.6 33.1 15C35.5 17.4 36.8 20.6 36.8 24C36.8 31 31.1 36.8 24.1 36.8ZM31 27.2C30.6 27 28.7 26.1 28.4 26C28 25.8 27.8 25.7 27.5 26.1C27.2 26.5 26.5 27.4 26.3 27.6C26.1 27.9 25.8 27.9 25.4 27.7C25 27.5 23.7 27.1 22.2 25.7C21 24.7 20.2 23.4 20 23C19.8 22.6 20 22.4 20.8 21.5C21 21.3 21.1 21.1 21.2 20.9C21.3 20.7 21.3 20.5 21.2 20.3C21.1 20.1 20.3 18.2 20 17.4C19.7 16.6 19.4 16.7 19.1 16.7H18.4C18.1 16.7 17.7 16.8 17.3 17.2C16.9 17.6 16 18.5 16 20.3C16 22.1 17.3 23.9 17.5 24.1C17.7 24.3 20.1 28 23.7 29.6C24.6 30 25.2 30.2 25.8 30.4C26.7 30.7 27.5 30.6 28.2 30.5C28.9 30.4 30.5 29.5 30.8 28.6C31.1 27.8 31.1 27.1 31 27.2Z" fill="white" />
  </svg>
);

const InstagramLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <defs>
      <linearGradient id="igGradLandingModern" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFD600" />
        <stop offset="25%" stopColor="#FF7A00" />
        <stop offset="50%" stopColor="#FF0069" />
        <stop offset="75%" stopColor="#D300C5" />
        <stop offset="100%" stopColor="#7638FA" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#igGradLandingModern)" />
    <rect x="11" y="11" width="26" height="26" rx="7" stroke="white" strokeWidth="3" fill="none" />
    <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="3" fill="none" />
    <circle cx="31.5" cy="16.5" r="1.75" fill="white" />
  </svg>
);

const FacebookLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <circle cx="24" cy="24" r="24" fill="#1877F2" />
    <path d="M29.5 25.1L30.3 19.9H25.3V16.5C25.3 15.1 26 13.7 28.2 13.7H30.5V9.3C30.5 9.3 28.4 9 26.4 9C22.3 9 19.6 11.5 19.6 16V19.9H15V25.1H19.6V37.7C20.5 37.9 21.5 38 22.5 38C23.5 38 24.4 37.9 25.3 37.7V25.1H29.5Z" fill="white" />
  </svg>
);

const YouTubeLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect width="48" height="48" rx="12" fill="#FF0000" />
    <path d="M33.2 24.1L19.5 16.2C19.2 16 18.8 16.2 18.8 16.6V32.4C18.8 32.8 19.2 33 19.5 32.8L33.2 24.9C33.5 24.7 33.5 24.3 33.2 24.1Z" fill="white" />
  </svg>
);

const GmailLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <path d="M10 38V18.8L3 13.5V35C3 36.6 4.3 38 6 38H10Z" fill="#4285F4" />
    <path d="M38 38V18.8L45 13.5V35C45 36.6 43.7 38 42 38H38Z" fill="#34A853" />
    <path d="M38 18.8V10L24 20.5L10 10V18.8L24 29.3L38 18.8Z" fill="#EA4335" />
    <path d="M10 10L3 13.5L10 18.8V10Z" fill="#C5221F" />
    <path d="M38 10L45 13.5L38 18.8V10Z" fill="#FBBC04" />
  </svg>
);

const OutlookLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect x="4" y="8" width="24" height="32" rx="3" fill="#0078D4" />
    <rect x="6" y="10" width="20" height="28" rx="2" fill="#28A8E8" />
    <path d="M16 16 C12 16 9 19 9 23 C9 27 12 30 16 30 C20 30 23 27 23 23 C23 19 20 16 16 16Z" fill="white" />
    <path d="M28 14 L44 20 L44 28 L28 34 Z" fill="#0078D4" />
  </svg>
);

const GoogleSheetsLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect x="8" y="4" width="32" height="40" rx="4" fill="#0F9D58" />
    <path d="M30 4L40 14H32C30.9 14 30 13.1 30 12V4Z" fill="#87CEAC" />
    <rect x="15" y="19" width="18" height="16" rx="1" fill="white" />
    <line x1="15" y1="24.5" x2="33" y2="24.5" stroke="#0F9D58" strokeWidth="1.5" />
    <line x1="15" y1="30" x2="33" y2="30" stroke="#0F9D58" strokeWidth="1.5" />
    <line x1="24" y1="19" x2="24" y2="35" stroke="#0F9D58" strokeWidth="1.5" />
  </svg>
);

const GoogleDocsLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect x="8" y="4" width="32" height="40" rx="4" fill="#4285F4" />
    <path d="M30 4L40 14H32C30.9 14 30 13.1 30 12V4Z" fill="#A1C2FA" />
    <rect x="15" y="20" width="18" height="2.5" rx="1.25" fill="white" />
    <rect x="15" y="26" width="18" height="2.5" rx="1.25" fill="white" />
    <rect x="15" y="32" width="11" height="2.5" rx="1.25" fill="white" />
  </svg>
);

const GoogleMapsLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <path d="M24 4C15.16 4 8 11.16 8 20c0 12 16 24 16 24s16-12 16-24c0-8.84-7.16-16-16-16zm0 21.5c-3.04 0-5.5-2.46-5.5-5.5s2.46-5.5 5.5-5.5 5.5 2.46 5.5 5.5-2.46 5.5-5.5 5.5z" fill="#34A853" />
    <circle cx="24" cy="20" r="5.5" fill="#4285F4" />
  </svg>
);

const OneDriveLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <path d="M34.5 18a10.5 10.5 0 0 0-19.6-3.8A12 12 0 0 0 4 25.5C4 32.4 9.6 38 16.5 38h18c6.35 0 11.5-5.15 11.5-11.5 0-5.8-4.3-10.6-9.9-11.3-.2-.7-.5-1.4-.8-2z" fill="#0078D4" />
    <path d="M22 38h12.5a11.5 11.5 0 0 0 11.5-11.5c0-5.8-4.3-10.6-9.9-11.3a10.5 10.5 0 0 0-14.1 22.8z" fill="#28A8E8" opacity="0.8" />
  </svg>
);

const GoogleSlidesLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect x="8" y="4" width="32" height="40" rx="4" fill="#FBBC04" />
    <path d="M30 4L40 14H32C30.9 14 30 13.1 30 12V4Z" fill="#FCE8B2" />
    <rect x="15" y="19" width="18" height="12" rx="1.5" fill="white" />
  </svg>
);

const GoogleNewsLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect x="6" y="8" width="36" height="32" rx="6" fill="#4285F4" />
    <path d="M14 18h20v3H14zm0 6h20v3H14zm0 6h12v3H14z" fill="white" />
    <rect x="29" y="30" width="5" height="3" rx="0.5" fill="#34A853" />
  </svg>
);

const XLogo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
    <rect width="24" height="24" rx="6" fill="#000000" />
    <path d="M17.75 4H19.5L13.25 11.25L20.5 20H15.5L11.5 14.75L7 20H5.25L12 12.25L5 4H10.25L13.75 8.75L17.75 4ZM17 18.5H18L8.25 5.5H7.25L17 18.5Z" fill="white" />
  </svg>
);

const LinkedInLogo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
    <rect width="24" height="24" rx="6" fill="#0A66C2" />
    <path d="M6.5 9H9.5V19H6.5V9ZM8 7.75C7.03 7.75 6.25 6.97 6.25 6C6.25 5.03 7.03 4.25 8 4.25C8.97 4.25 9.75 5.03 9.75 6C9.75 6.97 8.97 7.75 8 7.75ZM11 9H13.8V10.4H13.85C14.2 9.7 15.1 9 16.4 9C19.1 9 19.6 10.8 19.6 13.1V19H16.6V13.8C16.6 12.5 16.6 10.9 14.8 10.9C13 10.9 12.7 12.3 12.7 13.7V19H9.7V9H11Z" fill="white" />
  </svg>
);

const PinterestLogo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
    <circle cx="12" cy="12" r="12" fill="#E60023" />
    <path d="M12.2 5C8.3 5 6 7.8 6 10.5C6 11.9 6.6 13.1 7.7 13.6C7.9 13.7 8.1 13.6 8.1 13.4C8.2 13.1 8.3 12.6 8.4 12.4C8.4 12.2 8.4 12.1 8.2 11.9C7.8 11.4 7.5 10.6 7.5 9.8C7.5 7.6 9.1 5.8 11.8 5.8C14.1 5.8 15.6 7.1 15.6 9.3C15.6 11.8 14.3 14 12.3 14C11.3 14 10.5 13.1 10.7 12C11 10.7 11.6 9.4 11.6 8.5C11.6 7.7 11.2 7.1 10.3 7.1C9.3 7.1 8.5 8.1 8.5 9.6C8.5 10.5 8.8 11.1 8.8 11.1L7.6 16.3C7.2 17.9 7.4 19.8 7.4 19.9C7.4 20 7.5 20.1 7.6 20C7.7 19.9 9.1 18 9.6 16.1C9.8 15.4 10.6 12.3 10.6 12.3C10.9 12.9 11.8 13.4 12.8 13.4C15.7 13.4 17.8 10.7 17.8 7.3C17.7 4.8 15.2 5 12.2 5Z" fill="white" />
  </svg>
);

const ThreadsLogo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
    <rect width="24" height="24" rx="6" fill="#000000" />
    <path d="M15.4 11.7C15.2 11.7 15.1 11.7 15 11.7C14.4 10 13.3 9.1 11.7 9.1C9.7 9.1 8.5 10.5 8.5 12.4C8.5 14.4 9.8 15.8 11.9 15.8C13.4 15.8 14.6 15.1 15.1 14C15.2 14.4 15.3 14.8 15.3 15.2C15.3 17.2 14.1 18.2 12 18.2C10.5 18.2 9.2 17.5 8.8 16.4C8.7 16.1 8.4 16 8.1 16.1L6.8 16.6C6.6 16.7 6.4 17 6.6 17.3C7.2 19.1 9.2 20.2 12 20.2C15.3 20.2 17.3 18.4 17.3 14.9C17.3 10 14.7 7.2 10.8 7.2C6.9 7.2 4.2 10 4.2 14.5C4.2 19 7 22 12.1 22C14.7 22 16.9 21.1 18.3 19.5C18.5 19.3 18.4 19 18.2 18.8L17.1 17.8C16.9 17.6 16.6 17.7 16.4 17.9C15.3 19.2 13.7 19.9 11.9 19.9C8.2 19.9 6.2 17.6 6.2 14.4C6.2 11.2 8.3 9.1 11 9.1C13.6 9.1 15.3 10.9 15.4 11.7Z" fill="white" />
  </svg>
);

const RedditLogo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
    <circle cx="12" cy="12" r="12" fill="#FF4500" />
    <path d="M19 12C19 11.2 18.3 10.5 17.5 10.5C17.1 10.5 16.7 10.7 16.5 11C15.4 10.2 13.9 9.7 12.2 9.6L13 6L15.5 6.6C15.6 7.1 16.1 7.5 16.6 7.5C17.2 7.5 17.6 7 17.6 6.5C17.6 6 17.1 5.5 16.6 5.5C16.1 5.5 15.7 5.8 15.6 6.2L12.8 5.6C12.7 5.6 12.5 5.7 12.5 5.8L11.6 9.6C9.9 9.7 8.4 10.2 7.3 11C7 10.7 6.7 10.5 6.3 10.5C5.4 10.5 4.8 11.2 4.8 12C4.8 12.6 5.1 13.1 5.6 13.3C5.5 13.5 5.5 13.8 5.5 14C5.5 16.5 8.4 18.5 12 18.5C15.6 18.5 18.5 16.5 18.5 14C18.5 13.8 18.5 13.5 18.4 13.3C18.9 13.1 19.2 12.6 19 12ZM9 13.5C9.6 13.5 10 14 10 14.5C10 15 9.6 15.5 9 15.5C8.4 15.5 8 15 8 14.5C8 14 8.4 13.5 9 13.5ZM14.3 16.8C13.6 17.3 12.8 17.5 12 17.5C11.2 17.5 10.4 17.3 9.7 16.8C9.5 16.7 9.5 16.4 9.7 16.3C9.8 16.2 10.1 16.2 10.2 16.4C10.7 16.7 11.3 16.9 12 16.9C12.7 16.9 13.3 16.7 13.8 16.4C13.9 16.3 14.2 16.3 14.3 16.4C14.5 16.5 14.5 16.7 14.3 16.8ZM15 15.5C14.4 15.5 14 15 14 14.5C14 14 14.4 13.5 15 13.5C15.6 13.5 16 14 16 14.5C16 15 15.6 15.5 15 15.5Z" fill="white" />
  </svg>
);

const QuoraLogo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
    <rect width="24" height="24" rx="6" fill="#B92B27" />
    <path d="M12 4.5C8 4.5 4.8 7.5 4.8 11.5C4.8 15.5 8 18.5 12 18.5C13.5 18.5 14.8 18.1 15.9 17.3L17.2 19.2C17.4 19.5 17.8 19.5 18.1 19.3C18.3 19.1 18.4 18.7 18.2 18.4L17.1 16.7C18.4 15.3 19.2 13.5 19.2 11.5C19.2 7.5 16 4.5 12 4.5ZM12 16.2C9.2 16.2 7 14.1 7 11.5C7 8.9 9.2 6.8 12 6.8C14.8 6.8 17 8.9 17 11.5C17 14.1 14.8 16.2 12 16.2Z" fill="white" />
  </svg>
);

const MediumLogo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0">
    <rect width="24" height="24" rx="6" fill="#000000" />
    <path d="M7 16.5C9.48528 16.5 11.5 14.4853 11.5 12C11.5 9.51472 9.48528 7.5 7 7.5C4.51472 7.5 2.5 9.51472 2.5 12C2.5 14.4853 4.51472 16.5 7 16.5Z" fill="white" />
    <path d="M15.5 16.35C16.8807 16.35 18 14.4024 18 12C18 9.59763 16.8807 7.65 15.5 7.65C14.1193 7.65 13 9.59763 13 12C13 14.4024 14.1193 16.35 15.5 16.35Z" fill="white" />
    <path d="M20.5 16C21.0523 16 21.5 14.2091 21.5 12C21.5 9.79086 21.0523 8 20.5 8C19.9477 8 19.5 9.79086 19.5 12C19.5 14.2091 19.9477 16 20.5 16Z" fill="white" />
  </svg>
);

export default function UwoLandingPage() {
  const router = useRouter();
  const { brand, isWhiteLabel } = useBrand();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [activeChannelTab, setActiveChannelTab] = useState('whatsapp');
  const [activeConnectorIndex, setActiveConnectorIndex] = useState(0);
  const [activeStoryStep, setActiveStoryStep] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(35);
  const [comparisonPosition, setComparisonPosition] = useState(50);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const { theme, isDark, toggleTheme } = useTheme();
  const isDarkMode = isDark;
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWhiteLabelDetails, setShowWhiteLabelDetails] = useState(false);

  // Parallax state for hero section
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [heroEntered, setHeroEntered] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroEntered(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        setLoggedInUser(JSON.parse(userStr));
      } else {
        setLoggedInUser(null);
      }
    } catch (e) { }
  }, []);

  // Parallax listener on desktop
  const handleMouseMove = (e) => {
    if (typeof window === 'undefined' || window.innerWidth < 1024) return;
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setMousePos({
      x: (clientX - centerX) / 45,
      y: (clientY - centerY) / 45
    });
  };

  // Auto-advance workflow simulator
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWorkflowStep((prev) => (prev + 1) % 7);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Video progress simulator when playing
  useEffect(() => {
    let interval;
    if (isVideoPlaying) {
      interval = setInterval(() => {
        setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isVideoPlaying]);

  const handleDashboardRedirect = () => {
    if (loggedInUser?.role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/client');
    }
  };

  const handleStartFree = () => {
    if (loggedInUser) {
      handleDashboardRedirect();
    } else {
      router.push('/auth/login');
    }
  };

  const brandName = isWhiteLabel && brand?.brand_name ? brand.brand_name : 'UWO Connect';
  const logoUrl = isWhiteLabel && brand?.logo_url ? brand.logo_url : '/logo.png';

  // ── DATA DEFINITIONS ──
  const channelsList = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      logo: <WhatsAppLogo size={24} />,
      badge: 'Official API',
      color: '#25D366',
      headline: 'Automated WhatsApp Business Messaging',
      desc: 'Engage customers through automated catalog sharing, quick-replies, and official verified business messaging with zero delay.',
      sampleSender: 'Rohan Sharma (+91 98200-XXXX)',
      sampleMsg: '“Hi! Can you share the pricing catalog for enterprise CRM?”',
      sampleReply: '“Hello Rohan! Here is the latest 2026 catalog and GST quotation PDF.”',
      screenshot: '/inbox_preview_live.png'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      logo: <InstagramLogo size={24} />,
      badge: 'Direct & Comments',
      color: '#E1306C',
      headline: 'Instagram DM & Story Mention Automation',
      desc: 'Capture hot social leads immediately when they send a DM, tag your brand in a Story, or comment on any reel or product post.',
      sampleSender: '@priya_designstudio',
      sampleMsg: '“Loved your latest automation reel! Can you send the pricing link?”',
      sampleReply: '“Hey Priya! Sent you the instant access link with our special 15% discount.”',
      screenshot: '/dashboard/dashboard_instagram_live.png'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      logo: <FacebookLogo size={24} />,
      badge: 'Messenger & Pages',
      color: '#1877F2',
      headline: 'Facebook Messenger & Lead Ad Synchronization',
      desc: 'Connect your Facebook Pages and instantly sync incoming ad form leads directly into your central CRM pipeline.',
      sampleSender: 'Amit Patel (Bangalore)',
      sampleMsg: '“Submitted inquiry via Facebook Ad regarding multi-agent inbox.”',
      sampleReply: '“Welcome Amit! Lead assigned to Agent Sarah. Quotation dispatched.”',
      screenshot: '/dashboard/dashboard_facebook_live.png'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      logo: <YouTubeLogo size={24} />,
      badge: 'Channel Community',
      color: '#FF0000',
      comingSoon: true,
      headline: 'YouTube Community & Lead Conversions',
      desc: 'Monitor high-intent comments on your YouTube channel videos and convert active viewers into CRM pipeline leads seamlessly.',
      sampleSender: 'TechReviews India (Subscriber)',
      sampleMsg: '“Which payment gateways are supported for UPI recurring invoices?”',
      sampleReply: '“Razorpay, Cashfree & UPI QR codes are supported natively!”',
      screenshot: '/dashboard/dashboard_analytics.png'
    }
  ];

  const connectorsList = [
    {
      id: 'gmail',
      name: 'Gmail',
      logo: <img src="/Gmail.png" alt="Gmail" className="w-[26px] h-[26px] object-contain" />,
      category: 'Email Intelligence',
      desc: 'Auto-syncs incoming client emails & triggers automated replies and CRM contact updates in real time.',
      stat: '0.1s Email Sync'
    },
    {
      id: 'zoho-crm',
      name: 'Zoho CRM',
      logo: <img src="/Zoho CRM.png" alt="Zoho CRM" className="w-[26px] h-[26px] object-contain" />,
      category: 'Sales Automation',
      desc: 'Seamlessly syncs your lead pipelines, automated triggers, and customer contact data with Zoho CRM.',
      stat: 'Pipeline Sync'
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      logo: <img src="/Google Sheet.png" alt="Google Sheets" className="w-[26px] h-[26px] object-contain" />,
      category: 'Real-time Database',
      desc: 'Automatically writes every qualified lead, issued quotation, and verified invoice directly as a new sheet row.',
      stat: 'Live 2-Way Sync'
    },
    {
      id: 'google-docs',
      name: 'Google Docs',
      logo: <img src="/Google Docs.png" alt="Google Docs" className="w-[26px] h-[26px] object-contain" />,
      category: 'Document Automation',
      desc: 'Generates branded service contracts, customized agreements, and proposals from real-time customer data.',
      stat: 'Instant DOCX/PDF'
    },
    {
      id: 'google-maps',
      name: 'Google Maps',
      logo: <img src="/Google Maps.png" alt="Google Maps" className="w-[26px] h-[26px] object-contain" />,
      category: 'Location Intelligence',
      desc: 'Automatically maps customer addresses, verifies store locations, and pinpoints branch coordinates.',
      stat: 'Geo-Routing'
    },
    {
      id: 'google-slides',
      name: 'Google Slides',
      logo: <img src="/Google Slides.png" alt="Google Slides" className="w-[26px] h-[26px] object-contain" />,
      category: 'Dynamic Presentations',
      desc: 'Creates personalized pitch decks and interactive enterprise solution overviews on the fly.',
      stat: 'Deck Automation'
    },
    {
      id: 'google-news',
      name: 'Google News Feed',
      logo: <img src="/Google News.png" alt="Google News" className="w-[26px] h-[26px] object-contain" />,
      category: 'Market Intelligence',
      desc: 'Monitors brand press mentions, market movements, and competitor alerts right inside your dashboard feed.',
      stat: 'Real-time Alerts'
    }
  ];

  const automationSteps = [
    {
      step: '01',
      title: 'Customer Message',
      desc: 'WhatsApp / DM query received',
      tag: 'Trigger',
      detail: 'Customer sends “Hi, can I get a quotation for the Growth Plan?” via WhatsApp.',
      icon: <MessageSquare size={18} className="text-[#25D366]" />,
      activeColor: 'border-[#25D366] text-[#25D366]'
    },
    {
      step: '02',
      title: 'CRM Lead Created',
      desc: 'Auto-saved to sales pipeline',
      tag: 'Capture',
      detail: 'Contact details and phone number extracted. Deal created in Stage: Qualified Inbound.',
      icon: <Users size={18} className="text-[#0B8F78]" />,
      activeColor: 'border-[#0B8F78] text-[#0B8F78]'
    },
    {
      step: '03',
      title: 'AI Auto Reply',
      desc: 'Catalog & price bot dispatches',
      tag: 'AI Dispatch',
      detail: 'AI Assistant recognizes intent and sends interactive product catalog in 0.2s.',
      icon: <Bot size={18} className="text-[#2563EB]" />,
      activeColor: 'border-[#2563EB] text-[#2563EB]'
    },
    {
      step: '04',
      title: 'Quotation Generated',
      desc: 'Instant GST quotation PDF',
      tag: 'Document',
      detail: 'GST quotation #QT-8402 generated with dynamic line items and shared into the chat.',
      icon: <FileCheck size={18} className="text-amber-500" />,
      activeColor: 'border-amber-500 text-amber-500'
    },
    {
      step: '05',
      title: 'Payment Link Sent',
      desc: 'Native Razorpay UPI link',
      tag: 'Checkout',
      detail: 'Razorpay UPI payment link shared via WhatsApp. Client taps once to authorize.',
      icon: <CreditCard size={18} className="text-rose-500" />,
      activeColor: 'border-rose-500 text-rose-500'
    },
    {
      step: '06',
      title: 'Invoice Issued',
      desc: 'Synced to Google Sheets',
      tag: 'Accounting',
      detail: 'Payment confirmed. Official GST invoice #INV-2901 issued and logged to Google Sheets.',
      icon: <Receipt size={18} className="text-teal-500" />,
      activeColor: 'border-teal-500 text-teal-500'
    },
    {
      step: '07',
      title: 'Workflow Completed',
      desc: 'Closed deal in 0.2s',
      tag: 'Revenue',
      detail: 'Deal closed automatically without manual intervention. Welcome email dispatched.',
      icon: <CheckCircle2 size={18} className="text-emerald-500" />,
      activeColor: 'border-emerald-500 text-emerald-500'
    }
  ];

  const modulesList = [
    {
      num: '01',
      id: 'team-dashboard',
      icon: <LayoutDashboard size={24} />,
      title: 'Team Dashboard',
      desc: 'Keep team tasks, channel feeds, and automated business activity organized in one central hub with real-time updates and live activity monitoring.',
      features: ['Multi-user Team Permissions', 'Real-time Feed Sync', 'Role-Based Access'],
      screenshot: '/dashboard/dashboard_main.png',
      badge: 'CORE COMMAND HUB'
    },
    {
      num: '02',
      id: 'unified-crm',
      icon: <Users size={24} />,
      title: 'Unified CRM',
      desc: 'Auto-capture customer leads from WhatsApp, Instagram DMs, and contact forms directly into visual sales pipeline stages with smart tags.',
      features: ['Automated Lead Scoring', 'Custom Deal Pipeline', 'Contact History Log'],
      screenshot: '/dashboard/dashboard_crm.png',
      badge: 'SALES ENGINE'
    },
    {
      num: '03',
      id: 'ai-auto-reply',
      icon: <Bot size={24} />,
      title: 'Smart AI Auto Reply',
      desc: 'Instant 24/7 customer response bot with intelligent catalog lookup, FAQs resolution, and automated lead qualification without human delay.',
      features: ['0.2s Instant Dispatch', 'Multi-lingual Understanding', 'Human Handover Mode'],
      screenshot: '/dashboard/dashboard_automation.png',
      badge: '24/7 INTELLIGENCE'
    },
    {
      num: '04',
      id: 'quotation-generator',
      icon: <FileCheck size={24} />,
      title: 'Quotation Generator',
      desc: 'Create, customize, and dispatch professional PDF GST quotations directly to customer chat conversations in seconds.',
      features: ['GST & HSN Tax Calculation', 'Dynamic Discounting', 'Instant WhatsApp Share'],
      screenshot: '/dashboard/dashboard_quotations.png',
      badge: 'INSTANT PDF'
    },
    {
      num: '05',
      id: 'gst-invoicing',
      icon: <Receipt size={24} />,
      title: 'GST Invoicing Engine',
      desc: 'Generate official GST tax invoices automatically upon successful payment and sync records directly to Google Sheets & Tally.',
      features: ['Automatic PDF Issuance', 'Google Sheets Sync', 'Tax Audit Compliance'],
      screenshot: '/dashboard/dashboard_billing.png',
      badge: 'TAX & BILLING'
    },
    {
      num: '06',
      id: 'proposal-deals',
      icon: <FileText size={24} />,
      title: 'Proposal & Deals',
      desc: 'Design high-converting business proposals with custom pricing tables, e-signature links, and real-time open notifications.',
      features: ['Real-time View Tracking', 'E-Signature Ready', 'Interactive Pricing Tables'],
      screenshot: '/dashboard/dashboard_crm.png',
      badge: 'CLOSING DEALS'
    },
    {
      num: '07',
      id: 'product-catalog',
      icon: <ShoppingBag size={24} />,
      title: 'Product Catalog',
      desc: 'Present digital product catalogs with rich images, descriptions, pricing, and 1-click WhatsApp order checkout links.',
      features: ['Interactive Category Grid', '1-Click WhatsApp Cart', 'Live Stock Sync'],
      screenshot: '/dashboard/dashboard_connectors.png',
      badge: 'COMMERCE FLOW'
    },
    {
      num: '08',
      id: 'payment-integration',
      icon: <CreditCard size={24} />,
      title: 'Payment Integration',
      desc: 'Connect Razorpay, PhonePe, and UPI payment actions directly into your business chat workflow for 0-friction sales.',
      features: ['Native UPI Link Dispatch', 'Instant Payment Verification', 'Auto Webhook Triggers'],
      screenshot: '/dashboard/dashboard_billing.png',
      badge: 'ZERO FRICTION PAY'
    },
    {
      num: '09',
      id: 'voice-video',
      icon: <Video size={24} />,
      title: 'Voice & Video Calling',
      desc: 'Engage high-intent customers through crystal-clear HD WebRTC voice and video calls directly inside the web browser without any download.',
      features: ['In-Browser HD Video', 'Call Recording Logs', 'Screen Share Support'],
      screenshot: '/dashboard/dashboard_inbox.png',
      badge: 'LIVE WEBRTC'
    }
  ];

  const faqs = [
    {
      q: 'What is UWO Connect?',
      a: 'UWO Connect is a business automation platform that helps businesses manage customer conversations, leads, sales, payments and daily business activities from one place.'
    },
    {
      q: 'Which channels can I connect with UWO Connect?',
      a: 'UWO Connect supports supported channels such as WhatsApp Business, Instagram, Facebook and other available communication integrations. Channel availability may depend on the selected plan and third-party platform requirements.'
    },
    {
      q: 'What is included in my UWO Connect plan?',
      a: 'Each plan includes a specific set of features, channels, connectors and usage limits. The exact features included in each plan are shown in the Pricing Plans section above.'
    },
    {
      q: 'Are subscription and wallet charges separate?',
      a: 'Yes. Your UWO Connect subscription and prepaid usage wallet are completely separate. Subscription pays for your platform plan, while the wallet covers usage-based services. Wallet balance is not used to pay the subscription.'
    },
    {
      q: 'What is the UWO Connect wallet?',
      a: 'The wallet is a prepaid balance that can be used for applicable usage-based UWO Connect services. You can add money to the wallet separately from your subscription.'
    },
    {
      q: 'How can I add money to my wallet?',
      a: 'You can select an amount from the available recharge options or enter a custom amount. You will then complete the payment through the available payment gateway. The wallet is credited only after successful payment confirmation.'
    },
    {
      q: 'What happens after I use all my included broadcasts?',
      a: 'Once the broadcasts included in your plan have been used, additional broadcasts can be charged from your wallet if sufficient wallet balance is available. The applicable additional broadcast price will be shown in UWO Connect.'
    },
    {
      q: 'How much does an additional broadcast cost?',
      a: 'The applicable additional broadcast charge is shown in the UWO Connect platform and may be updated according to the current pricing configuration.'
    },
    {
      q: 'Will my wallet be charged when I recharge it?',
      a: 'No. When you recharge your wallet, the amount you pay is added to your wallet balance. Usage charges are deducted separately when a billable service is actually used.'
    },
    {
      q: 'What happens if my wallet balance reaches zero?',
      a: 'Your subscription can remain active. However, usage-based services that require wallet balance may be restricted until you recharge your wallet.'
    },
    {
      q: 'Can I use UWO Connect without coding?',
      a: 'Yes. UWO Connect is designed to make common business automation workflows accessible without requiring coding for normal use.'
    },
    {
      q: 'Can I use AI automation?',
      a: 'Yes. UWO Connect provides AI-powered automation for supported customer conversations, FAQs, lead qualification and business workflows. AI-generated responses may not always be perfect, so important information should be reviewed.'
    },
    {
      q: 'Can I manage my leads and customers?',
      a: 'Yes. UWO Connect provides CRM and lead-management capabilities to help businesses organize customer information and manage sales stages.'
    },
    {
      q: 'Can I create quotations and invoices?',
      a: 'Yes. Supported UWO Connect features allow businesses to create quotations, proposals and GST invoices. Businesses are responsible for checking their invoice and tax information.'
    },
    {
      q: 'Can I connect my existing business tools?',
      a: 'UWO Connect provides connectors for supported services such as Google, Microsoft, payment services and other business tools. Available connectors depend on your plan and the current integration availability.'
    },
    {
      q: 'Can I add team members?',
      a: 'Yes. Depending on your plan, you can add team members and manage their access using supported roles and permissions.'
    },
    {
      q: 'Does UWO Connect offer white-label solutions?',
      a: 'Yes. UWO Connect provides white-label/agency capabilities for eligible partners. Availability and commercial terms may vary.'
    },
    {
      q: 'Is my payment information secure?',
      a: 'Payments are processed through supported payment providers. UWO Connect does not ask users to share payment credentials directly through normal chat or support channels.'
    }
  ];

  const displayedFaqs = showAllFaqs ? faqs : faqs.slice(0, 8);

  return (
    <div
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
      className={cn(
        "landing-page-root min-h-screen transition-colors duration-300 selection:bg-emerald-500/20 selection:text-emerald-900 pt-16",
        isDarkMode ? "bg-[#070B14] text-slate-100 dark" : "bg-[#F8FAFC] text-slate-900"
      )}
    >

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 1. FIXED GLASSY NAVBAR                                          */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-xl border-b transition-all duration-300",
          isDarkMode
            ? "bg-[#070B14]/90 border-slate-800/80 text-slate-100"
            : "bg-white/90 border-slate-200/80 text-slate-900"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <img
              src={isWhiteLabel && logoUrl ? logoUrl : "/logo.png"}
              alt={brandName}
              width={34}
              height={34}
              className="w-8.5 h-8.5 object-contain group-hover:scale-105 transition-transform duration-200 shrink-0"
            />
            <div className="text-left">
              <span className="text-lg font-black tracking-tight leading-none text-slate-900 dark:text-white block group-hover:text-[#0B8F78] transition-colors">
                {brandName}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#0B8F78] uppercase block leading-none">
                AI MULTI-CHANNEL SAAS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Link href="/channels" className="px-3 py-1.5 rounded-lg hover:text-[#0B8F78] hover:bg-emerald-50/50 dark:hover:bg-slate-800/60 transition-colors">
              Channels
            </Link>
            <Link href="/connectors" className="px-3 py-1.5 rounded-lg hover:text-[#0B8F78] hover:bg-emerald-50/50 dark:hover:bg-slate-800/60 transition-colors">
              Connectors
            </Link>
            <Link href="/automation" className="px-3 py-1.5 rounded-lg hover:text-[#0B8F78] hover:bg-emerald-50/50 dark:hover:bg-slate-800/60 transition-colors">
              Automation
            </Link>
            <Link href="/features" className="px-3 py-1.5 rounded-lg hover:text-[#0B8F78] hover:bg-emerald-50/50 dark:hover:bg-slate-800/60 transition-colors">
              Features
            </Link>
            <Link href="/solutions" className="px-3 py-1.5 rounded-lg hover:text-[#0B8F78] hover:bg-emerald-50/50 dark:hover:bg-slate-800/60 transition-colors">
              Solutions
            </Link>
            <Link href="/how-it-works" className="px-3 py-1.5 rounded-lg hover:text-[#0B8F78] hover:bg-emerald-50/50 dark:hover:bg-slate-800/60 transition-colors">
              How It Work
            </Link>
            <Link href="/pricing" className="px-3 py-1.5 rounded-lg hover:text-[#0B8F78] hover:bg-emerald-50/50 dark:hover:bg-slate-800/60 transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="px-3 py-1.5 rounded-lg hover:text-[#0B8F78] hover:bg-emerald-50/50 dark:hover:bg-slate-800/60 transition-colors">
              About
            </Link>
            <ProjectsDropdown isDarkMode={isDarkMode} align="right" />
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center",
                isDarkMode
                  ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-850"
                  : "bg-slate-100/80 border-slate-200 text-slate-700 hover:bg-slate-200/80"
              )}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Platform / Login Trigger */}
            {loggedInUser ? (
              <button
                type="button"
                onClick={handleDashboardRedirect}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0B8F78] to-[#0F766E] text-white text-xs font-bold shadow-md shadow-emerald-700/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.push('/auth/login')}
                  className={cn(
                    "hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    isDarkMode ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-slate-900"
                  )}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={handleStartFree}
                  className="px-4 py-2 rounded-xl bg-[#0B8F78] hover:bg-[#097361] text-white text-xs font-bold shadow-md shadow-emerald-700/25 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Start Free</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className={cn(
            "lg:hidden border-t px-6 py-5 space-y-3 transition-all",
            isDarkMode ? "bg-[#070B14] border-slate-800" : "bg-white border-slate-200"
          )}>
            <Link
              href="/channels"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300 py-1"
            >
              Channels
            </Link>
            <Link
              href="/connectors"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300 py-1"
            >
              Connectors
            </Link>
            <Link
              href="/automation"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300 py-1"
            >
              Automation
            </Link>
            <Link
              href="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300 py-1"
            >
              Features
            </Link>
            <Link
              href="/solutions"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300 py-1"
            >
              Solutions
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300 py-1"
            >
              How It Work
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300 py-1"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300 py-1"
            >
              About
            </Link>
            <MobileProjectsAccordion isDarkMode={isDarkMode} onItemClick={() => setMobileMenuOpen(false)} />
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); router.push('/auth/login'); }}
                className="w-1/2 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); handleStartFree(); }}
                className="w-1/2 py-2 rounded-xl bg-[#0B8F78] text-white text-xs font-bold"
              >
                Start Free
              </button>
            </div>
          </div>
        )}
      </header>

      <main id="main-content">

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 2. HERO SECTION — CINEMATIC EDITORIAL WITH ABHA & DEV          */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <section
          ref={heroRef}
          onMouseMove={handleMouseMove}
          className={cn(
            "relative w-full pt-16 sm:pt-20 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-500 border-b",
            isDarkMode
              ? "bg-gradient-to-b from-[#070B14] via-[#0B1220] to-[#070B14] border-slate-800/80"
              : "bg-gradient-to-b from-white via-[#F0FDF9]/60 to-white border-slate-200/80"
          )}
        >
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

          {/* Ultra-subtle Tech Grid */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #0B8F78 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto text-center space-y-8">

            {/* Top Pill Badge */}
            <ScrollReveal y={20} delay={0.05}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 tracking-wide">
                  Unified Communication &amp; Business Automation
                </span>
              </div>
            </ScrollReveal>

            {/* Main Headline */}
            <ScrollReveal y={25} delay={0.15}>
              <div className="space-y-4 max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
                  <span>Connect Everything. </span>
                  <span className="bg-gradient-to-r from-[#0B8F78] via-[#0F766E] to-[#2563EB] bg-clip-text text-transparent">
                    Automate Anything.
                  </span>
                </h1>
                <p className={cn(
                  "text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mx-auto",
                  isDarkMode ? "text-slate-300" : "text-slate-600"
                )}>
                  UWO Connect brings your communication channels, business tools, and automation into one intelligent workspace.
                </p>
              </div>
            </ScrollReveal>

            {/* Action Buttons */}
            <ScrollReveal y={20} delay={0.25}>
              <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={handleStartFree}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#0B8F78] to-[#0F766E] hover:from-[#097361] hover:to-[#0B8F78] text-white text-sm font-bold shadow-lg shadow-emerald-700/25 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Start Free</span>
                  <ArrowRight size={16} />
                </button>
                <a
                  href="#channels"
                  className={cn(
                    "px-7 py-3.5 rounded-xl border text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2",
                    isDarkMode
                      ? "bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700"
                      : "bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-xs"
                  )}
                >
                  <span>Explore Platform</span>
                  <ChevronDown size={15} />
                </a>
              </div>
            </ScrollReveal>


            {/* ══════════════════════════════════════════════════════════════ */}
            {/* HERO VISUAL COMPOSITION: ABHA (LEFT) + DASHBOARD (CENTER) + DEV (RIGHT) */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <div className="relative pt-10 sm:pt-14 max-w-7xl mx-auto px-2 sm:px-4">

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center justify-center">

                {/* ── LEFT: DEV (CONNECTOR ECOSYSTEM) ── */}
                <div
                  className={cn(
                    "hidden lg:flex lg:col-span-3 flex-col items-center text-center order-1 lg:order-1 transition-all duration-700 ease-out",
                    heroEntered
                      ? "opacity-100 translate-x-0 lg:translate-x-3.5"
                      : "opacity-0 -translate-x-8 lg:-translate-x-3"
                  )}
                >
                  <div
                    className="relative group lg:-rotate-[3.5deg] transition-transform duration-500 ease-out"
                    style={{
                      transformOrigin: '50% 90%'
                    }}
                  >
                    {/* Glowing subtle ambient backlight behind Dev */}
                    <div className="absolute inset-0 bg-blue-500/12 dark:bg-blue-400/15 rounded-full blur-2xl transform scale-95 pointer-events-none" />

                    {/* Dev Character Image - enlarged ~25%, uncropped full body */}
                    <img
                      src="/Dev_transparent.png"
                      alt="Dev - UWO Connect Connector Intelligence"
                      className="relative z-10 w-52 sm:w-64 lg:w-[285px] xl:w-[305px] h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_16px_32px_rgba(0,0,0,0.28)] hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>

                  <div className="mt-4 space-y-1 text-center">
                    <span className="text-[11px] font-black tracking-widest text-[#2563EB] uppercase block">
                      DEV • CONNECTORS
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-[210px] mx-auto leading-relaxed">
                      Orchestrates Google, Microsoft, maps, sheets &amp; external business integrations.
                    </p>
                  </div>
                </div>

                {/* ── CENTER: REAL UWO CONNECT DASHBOARD INTERFACE ── */}
                <div
                  className={cn(
                    "col-span-1 lg:col-span-6 relative order-2 lg:order-2 transition-all duration-700 delay-100 ease-out",
                    heroEntered
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-[0.98]"
                  )}
                >
                  <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-2xl shadow-emerald-950/15 overflow-hidden backdrop-blur-xl">
                    {/* Browser Chrome Header */}
                    <div className="px-4 py-3 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/60">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400/90" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/90" />
                      </div>
                      <div className="px-3 py-0.5 rounded-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Lock size={10} className="text-emerald-500" />
                        <span>app.uwoconnect.com/workspace</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span className="hidden sm:inline">LIVE SYNC</span>
                      </div>
                    </div>

                    {/* Real Dashboard Screenshot */}
                    <div className="relative group overflow-hidden">
                      <img
                        src="/dashboard/uwo_client_dashboard.png"
                        alt="UWO Connect Unified Platform Workspace"
                        className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-500"
                      />

                      {/* Subtle floating overlay metrics */}
                      <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-white/90 dark:bg-slate-950/90 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md flex items-center justify-between text-left text-xs font-semibold shadow-lg">
                        <div className="flex items-center gap-2">
                          <Activity size={15} className="text-emerald-500" />
                          <span className="text-slate-700 dark:text-slate-200">
                            Automation Engine: <strong className="text-emerald-600">Active</strong>
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Response Time: <span className="font-bold text-[#0B8F78]">0.2s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── RIGHT: ABHA (AUTOMATION INTELLIGENCE) ── */}
                <div
                  className={cn(
                    "hidden lg:flex lg:col-span-3 flex-col items-center text-center order-3 lg:order-3 transition-all duration-700 delay-150 ease-out",
                    heroEntered
                      ? "opacity-100 translate-x-0 lg:-translate-x-3.5"
                      : "opacity-0 translate-x-8 lg:translate-x-3"
                  )}
                >
                  <div
                    className="relative group lg:rotate-[3.5deg] transition-transform duration-500 ease-out"
                    style={{
                      transformOrigin: '50% 90%'
                    }}
                  >
                    {/* Glowing subtle ambient backlight behind Abha */}
                    <div className="absolute inset-0 bg-emerald-500/12 dark:bg-emerald-400/15 rounded-full blur-2xl transform scale-95 pointer-events-none" />

                    {/* Abha Character Image - enlarged ~25%, uncropped full body */}
                    <img
                      src="/Abha_transparent.png"
                      alt="Abha - UWO Connect Automation Intelligence"
                      className="relative z-10 w-52 sm:w-64 lg:w-[285px] xl:w-[305px] h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_16px_32px_rgba(0,0,0,0.28)] hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>

                  <div className="mt-4 space-y-1 text-center">
                    <span className="text-[11px] font-black tracking-widest text-[#0B8F78] uppercase block">
                      ABHA • AUTOMATION
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-[210px] mx-auto leading-relaxed">
                      Drives instant AI replies, CRM lead scoring, GST quotes &amp; invoice dispatch.
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>



        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 4. CHANNELS SECTION — UNIFIED COMMUNICATION WORKSPACE          */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <section
          id="channels"
          className={cn(
            "py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b transition-colors",
            isDarkMode ? "bg-[#070B14] border-slate-800" : "bg-[#F8FAFC] border-slate-200/80"
          )}
        >
          <div className="max-w-7xl mx-auto space-y-12">

            {/* Section Header */}
            <ScrollReveal y={30}>
              <div className="text-center space-y-3 max-w-3xl mx-auto">
                <span className="text-xs font-bold tracking-widest text-[#0B8F78] uppercase block">
                  MULTI-CHANNEL UNIFIED INBOX
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  Meet Your Customers Where They Are
                </h2>
                <p className={cn("text-sm sm:text-base font-normal", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                  Manage conversations across your most important communication channels from one unified platform.
                </p>
              </div>
            </ScrollReveal>

            {/* Interactive Channel Selector Tabs */}
            <ScrollReveal y={25} delay={0.15}>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">

                {channelsList.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setActiveChannelTab(ch.id)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer",
                      activeChannelTab === ch.id
                        ? "bg-[#0B8F78] text-white border-[#0B8F78] shadow-md shadow-emerald-700/20 scale-105"
                        : isDarkMode
                          ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
                          : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300"
                    )}
                  >
                    {ch.logo}
                    <span>{ch.name}</span>
                    {ch.comingSoon && (
                      <span className="ml-0.5 text-[8px] px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-500 font-extrabold border border-red-500/25 uppercase leading-none">Soon</span>
                    )}
                  </button>
                ))}
              </div>
            </ScrollReveal>

            {/* Realistic Unified Communication Interface Mockup */}
            {(() => {
              const currentChannel = channelsList.find(c => c.id === activeChannelTab) || channelsList[0];
              return (
                <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">

                  {/* Left Column: Channel Details & Live Simulation */}
                  <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 text-left">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                          {currentChannel.logo}
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 block">
                            {currentChannel.badge}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-extrabold">{currentChannel.name}</h3>
                        </div>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                        {currentChannel.headline}
                      </h4>
                      <p className={cn("text-xs sm:text-sm leading-relaxed", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                        {currentChannel.desc}
                      </p>

                      {/* Live Simulated Message Bubble */}
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3 mt-4">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-bold text-slate-600 dark:text-slate-300">{currentChannel.sampleSender}</span>
                          <span>Just now</span>
                        </div>
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                          {currentChannel.sampleMsg}
                        </p>
                        <div className="pl-4 border-l-2 border-emerald-500 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          ⚡ AI Automated Response: {currentChannel.sampleReply}
                        </div>
                      </div>
                    </div>

                    {currentChannel.comingSoon ? (
                      <div className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold inline-flex items-center gap-2 w-fit cursor-not-allowed select-none">
                        <span>🚀 Coming Soon</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStartFree}
                        className="px-6 py-3 rounded-xl bg-[#0B8F78] hover:bg-[#097361] text-white text-xs font-bold shadow-md shadow-emerald-700/20 inline-flex items-center gap-2 transition-all w-fit cursor-pointer"
                      >
                        <span>Connect {currentChannel.name}</span>
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>

                  {/* Right Column: Actual Dashboard Screenshot OR Coming Soon Banner */}
                  <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950/40 p-4 sm:p-8 flex items-center justify-center">
                    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xl w-full bg-white dark:bg-slate-900">
                      <div className="px-3 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[10px] text-slate-400">
                        <span className={`w-2 h-2 rounded-full ${currentChannel.comingSoon ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                        <span>Unified Inbox View • {currentChannel.name} {currentChannel.comingSoon ? 'Integration' : 'Feed Active'}</span>
                      </div>

                      {currentChannel.comingSoon ? (
                        <div className="p-10 sm:p-14 text-center space-y-4 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100/80 dark:from-slate-900 dark:to-slate-950 min-h-[350px]">
                          <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 shadow-sm animate-bounce">
                            {currentChannel.logo}
                          </div>
                          <div className="space-y-1.5 max-w-sm">
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/10 text-red-600 border border-red-500/20 inline-block">
                              🚀 Launching Soon
                            </span>
                            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
                              {currentChannel.name} Integration Coming Soon
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              We are actively building native {currentChannel.name} community lead capture, comment auto-replies, and engagement synchronization.
                            </p>
                          </div>
                          <div className="pt-2 flex items-center gap-2 text-[11px] font-bold text-slate-400 font-mono">
                            <span>Status: In Active Engineering Development</span>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={currentChannel.screenshot}
                          alt={`${currentChannel.name} Dashboard Mockup`}
                          className="w-full h-auto object-cover max-h-[460px]"
                        />
                      )}
                    </div>
                  </div>

                </div>
              );
            })()}

          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 5. CONNECTORS SECTION — DEV & INTEGRATION NETWORK              */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <section
          id="connectors"
          className={cn(
            "py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b transition-colors relative overflow-hidden",
            isDarkMode ? "bg-[#090E1A] border-slate-800" : "bg-white border-slate-200/80"
          )}
        >
          {/* Subtle Ambient Blue Glow */}
          <div className="absolute top-1/2 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto space-y-14">

            {/* Section Header */}
            <ScrollReveal y={30}>
              <div className="text-center space-y-3 max-w-3xl mx-auto">
                <span className="text-xs font-bold tracking-widest text-[#2563EB] uppercase block">
                  INTEGRATION NETWORK
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  Connect the Tools Your Business Already Uses
                </h2>
                <p className={cn("text-sm sm:text-base font-normal", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                  Bring your emails, documents, spreadsheets, maps, and business data into the same workflow.
                </p>
              </div>
            </ScrollReveal>

            {/* Connected Integration Ecosystem (Dev + Interactive Network) */}
            <ScrollReveal y={35} delay={0.15}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">


                {/* Dev Character Showcase */}
                <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />
                    <img
                      src="/Dev_transparent.png"
                      alt="Dev - Integration Intelligence"
                      className="relative z-10 w-48 sm:w-60 object-contain drop-shadow-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-black tracking-widest text-[#2563EB] uppercase block">
                      MEET DEV • CHIEF CONNECTOR
                    </span>
                    <h4 className="text-lg font-bold">Unifying All Business Data Streams</h4>
                    <p className={cn("text-xs leading-relaxed max-w-xs", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                      Dev automatically synchronizes external emails, documents, spreadsheets, and calendar invites straight into UWO Connect workflows.
                    </p>
                  </div>
                </div>

                {/* Interactive Orbital Network (No 8 Generic Cards) */}
                <div className="lg:col-span-8">
                  <div className={cn(
                    "p-6 sm:p-10 rounded-3xl border relative",
                    isDarkMode
                      ? "bg-slate-950/80 border-slate-800 shadow-xl"
                      : "bg-[#F8FAFC] border-slate-200/90 shadow-md"
                  )}>
                    {/* Central Node Description */}
                    <div className="pb-6 mb-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                      <div>
                        <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">
                          ACTIVE CONNECTOR SELECTION
                        </span>
                        <h4 className="text-xl font-bold flex items-center gap-2 mt-0.5">
                          {connectorsList[activeConnectorIndex].logo}
                          <span>{connectorsList[activeConnectorIndex].name}</span>
                        </h4>
                      </div>
                      <div className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 w-fit">
                        {connectorsList[activeConnectorIndex].stat}
                      </div>
                    </div>

                    <p className={cn("text-xs sm:text-sm font-normal text-left mb-8 leading-relaxed", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                      {connectorsList[activeConnectorIndex].desc}
                    </p>

                    {/* Connector Grid Selector */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {connectorsList.map((conn, idx) => {
                        const isActive = activeConnectorIndex === idx;
                        return (
                          <button
                            key={conn.id}
                            type="button"
                            onClick={() => setActiveConnectorIndex(idx)}
                            className={cn(
                              "p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all duration-200 cursor-pointer",
                              isActive
                                ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25 scale-[1.03]"
                                : isDarkMode
                                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850"
                                  : "bg-white border-slate-200/90 text-slate-700 hover:text-slate-900 hover:border-slate-300"
                            )}
                          >
                            <div className="shrink-0">{conn.logo}</div>
                            <div className="overflow-hidden">
                              <span className="text-xs font-bold block truncate">{conn.name}</span>
                              <span className={cn(
                                "text-[10px] block truncate",
                                isActive ? "text-blue-100" : "text-slate-400"
                              )}>
                                {conn.category}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Connected Status Line */}
                    <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <CheckCircle2 size={13} /> All 8 connectors ready for 1-click authorization
                      </span>
                      <span>Zero custom coding needed</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 6. AUTOMATION SECTION — ABHA & SEQUENTIAL WORKFLOW TIMELINE    */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <section
          className={cn(
            "py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b transition-colors relative overflow-hidden",
            isDarkMode ? "bg-[#070B14] border-slate-800" : "bg-[#F8FAFC] border-slate-200/80"
          )}
        >
          {/* Subtle Ambient Emerald Glow */}
          <div className="absolute top-1/2 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-7xl mx-auto space-y-14">

            {/* Section Header */}
            <ScrollReveal y={30}>
              <div className="text-center space-y-3 max-w-3xl mx-auto">
                <span className="text-xs font-bold tracking-widest text-[#0B8F78] uppercase block">
                  END-TO-END AUTOMATION FLOW
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  From Conversation to Completion — Automatically
                </h2>
                <p className={cn("text-sm sm:text-base font-normal", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                  Turn everyday business activity into automated workflows.
                </p>
              </div>
            </ScrollReveal>

            {/* Abha + Connected Workflow Timeline */}
            <ScrollReveal y={35} delay={0.15}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">


                {/* Connected Timeline (No 7 repetitive cards) */}
                <div className="lg:col-span-8 order-2 lg:order-1">
                  <div className={cn(
                    "p-6 sm:p-10 rounded-3xl border text-left",
                    isDarkMode ? "bg-slate-950/80 border-slate-800" : "bg-white border-slate-200/90 shadow-md"
                  )}>

                    {/* Current Active Step Spotlight */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-500/30 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#0B8F78] text-white">
                            STEP {automationSteps[activeWorkflowStep].step}
                          </span>
                          <h4 className="text-sm sm:text-base font-extrabold">
                            {automationSteps[activeWorkflowStep].title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                          {automationSteps[activeWorkflowStep].detail}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
                        ⚡ 0.2s Execution Time
                      </span>
                    </div>

                    {/* Sequential Timeline Nodes */}
                    <div className="space-y-2 relative">
                      {/* Glowing vertical connector line */}
                      <div className="absolute top-6 bottom-6 left-5 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-500 to-emerald-700 opacity-30" />

                      {automationSteps.map((st, i) => {
                        const isActive = activeWorkflowStep === i;
                        return (
                          <div
                            key={st.step}
                            onClick={() => setActiveWorkflowStep(i)}
                            className={cn(
                              "relative z-10 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4",
                              isActive
                                ? "bg-emerald-500/10 border-emerald-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-emerald-500/30 translate-x-1"
                                : isDarkMode
                                  ? "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                                  : "bg-slate-50/50 border-slate-200/70 text-slate-600 hover:text-slate-900 hover:border-slate-300"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 transition-colors",
                                isActive
                                  ? "bg-[#0B8F78] text-white"
                                  : isDarkMode ? "bg-slate-800 text-slate-400" : "bg-white text-slate-500 border border-slate-200"
                              )}>
                                {st.step}
                              </span>
                              <div>
                                <h5 className="text-xs sm:text-sm font-bold leading-tight">{st.title}</h5>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">{st.desc}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-md",
                                isActive ? "bg-emerald-500 text-white" : "text-slate-400"
                              )}>
                                {st.tag}
                              </span>
                              <div className="shrink-0">{st.icon}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>

                {/* Abha Character Showcase */}
                <div className="lg:col-span-4 flex flex-col items-center lg:items-end text-center lg:text-right space-y-4 order-1 lg:order-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
                    <img
                      src="/Abha_transparent.png"
                      alt="Abha - Automation Intelligence"
                      className="relative z-10 w-48 sm:w-60 object-contain drop-shadow-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-black tracking-widest text-[#0B8F78] uppercase block">
                      MEET ABHA • AUTOMATION LEADER
                    </span>
                    <h4 className="text-lg font-bold">Zero-Manual Delay from Query to Cash</h4>
                    <p className={cn("text-xs leading-relaxed max-w-xs", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                      Abha triggers AI price catalogs, creates CRM pipeline deals, compiles GST quotation PDFs, and records closed invoices in under 0.2s.
                    </p>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 7. "HOW UWO CONNECT WORKS" — CONNECT → AUTOMATE → GROW        */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <section
          id="how-it-works"
          className={cn(
            "py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b transition-colors",
            isDarkMode ? "bg-[#090E1A] border-slate-800" : "bg-white border-slate-200/80"
          )}
        >
          <div className="max-w-7xl mx-auto space-y-14">

            {/* Section Header */}
            <ScrollReveal y={30}>
              <div className="text-center space-y-3 max-w-3xl mx-auto">
                <span className="text-xs font-bold tracking-widest text-[#0B8F78] uppercase block">
                  THREE-STEP VALUE SYSTEM
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  How UWO Connect Works
                </h2>
                <p className={cn("text-sm sm:text-base font-normal", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                  3 simple steps to transform manual customer tasks into automated revenue pipelines.
                </p>
              </div>
            </ScrollReveal>

            {/* Horizontal Storytelling Experience */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative">


              {/* 01. CONNECT (DEV) */}
              <ScrollReveal y={30} delay={0.1}>
                <div className={cn(
                  "p-8 rounded-3xl border space-y-5 transition-all duration-300 relative group h-full",
                  isDarkMode ? "bg-slate-950/80 border-slate-800 hover:border-blue-500/50" : "bg-[#F8FAFC] border-slate-200/90 hover:border-blue-300 shadow-sm"
                )}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-blue-600 font-mono">01</span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600">
                      <Share2 size={20} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">DEV ORCHESTRATION</span>
                    <h3 className="text-xl font-bold">CONNECT</h3>
                    <p className={cn("text-xs leading-relaxed", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                      Link your social channels (WhatsApp, Instagram, Facebook, YouTube) and business tools (Gmail, Sheets, Docs, OneDrive) in a few clicks.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-2 text-[11px] font-bold text-blue-600">
                    <CheckCircle2 size={14} />
                    <span>Instant OAuth &amp; Webhooks</span>
                  </div>
                </div>
              </ScrollReveal>

              {/* 02. AUTOMATE (ABHA) */}
              <ScrollReveal y={30} delay={0.2}>
                <div className={cn(
                  "p-8 rounded-3xl border space-y-5 transition-all duration-300 relative group h-full",
                  isDarkMode ? "bg-slate-950/80 border-slate-800 hover:border-emerald-500/50" : "bg-[#F8FAFC] border-slate-200/90 hover:border-emerald-300 shadow-sm"
                )}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-[#0B8F78] font-mono">02</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#0B8F78]">
                      <Bot size={20} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#0B8F78]">ABHA INTELLIGENCE</span>
                    <h3 className="text-xl font-bold">AUTOMATE</h3>
                    <p className={cn("text-xs leading-relaxed", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                      Abha triggers AI price catalogs, creates CRM pipeline deals, compiles GST quotation PDFs, and records closed invoices in under 0.2s.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-2 text-[11px] font-bold text-emerald-600">
                    <CheckCircle2 size={14} />
                    <span>Autonomous 24/7 Dispatch</span>
                  </div>
                </div>
              </ScrollReveal>

              {/* 03. GROW (UWO PLATFORM) */}
              <ScrollReveal y={30} delay={0.3}>
                <div className={cn(
                  "p-8 rounded-3xl border space-y-5 transition-all duration-300 relative group h-full",
                  isDarkMode ? "bg-slate-950/80 border-slate-800 hover:border-emerald-500/50" : "bg-[#F8FAFC] border-slate-200/90 hover:border-emerald-300 shadow-sm"
                )}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-emerald-600 font-mono">03</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600">
                      <Activity size={20} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">SCALE &amp; REVENUE</span>
                    <h3 className="text-xl font-bold">GROW</h3>
                    <p className={cn("text-xs leading-relaxed", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                      Monitor conversion velocity, team agent performance, and cash collections from your unified dashboard with zero manual drop-off.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-2 text-[11px] font-bold text-emerald-600">
                    <CheckCircle2 size={14} />
                    <span>10x Deal Velocity</span>
                  </div>
                </div>
              </ScrollReveal>

            </div>

          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 8. VIDEO SECTION — "SEE AUTOMATION IN ACTION"                  */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <section
          className={cn(
            "py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b transition-colors relative overflow-hidden",
            isDarkMode ? "bg-[#070B14] border-slate-800" : "bg-[#F8FAFC] border-slate-200/80"
          )}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-6xl mx-auto space-y-10">

            {/* Section Header */}
            <ScrollReveal y={30}>
              <div className="text-center space-y-3 max-w-3xl mx-auto">
                <span className="text-xs font-bold tracking-widest text-[#0B8F78] uppercase block">
                  INTERACTIVE PRODUCT DEMONSTRATION
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  See Automation in Action
                </h2>
                <p className={cn("text-sm sm:text-base font-normal", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                  Watch how UWO Connect handles customer inquiries, quotation generation, and payment settlement automatically.
                </p>
              </div>
            </ScrollReveal>

            {/* 16:9 Cinematic Video Frame with Real Poster and Interactive Player */}
            <ScrollReveal y={35} delay={0.15}>
              <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden backdrop-blur-xl">


                {/* Browser-style Titlebar Header */}
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/80">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span>LIVE DEMO: Omnichannel Inbound → GST Invoice</span>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>1080p HD</span>
                  </div>
                </div>

                {/* 16:9 Aspect Ratio Display Screen */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950 group">
                  <img
                    src="/dashboard/dashboard_main.png"
                    alt="UWO Connect Interactive Demo Screen"
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      isVideoPlaying ? "scale-105 filter brightness-105" : "filter brightness-90"
                    )}
                  />

                  {/* Overlay Play Button & Simulated State */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-center justify-center p-6">
                    {!isVideoPlaying ? (
                      <button
                        type="button"
                        onClick={() => setIsVideoPlaying(true)}
                        className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0B8F78] to-[#2563EB] text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all cursor-pointer group"
                      >
                        <Play size={32} className="ml-1 fill-white" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsVideoPlaying(false)}
                        className="w-16 h-16 rounded-full bg-slate-900/80 text-white flex items-center justify-center shadow-2xl backdrop-blur-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
                      >
                        <Pause size={26} className="fill-white" />
                      </button>
                    )}
                  </div>

                  {/* Video Playback Controls Bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-slate-950 to-transparent flex flex-col gap-2">
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full transition-all duration-300"
                        style={{ width: `${videoProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-white text-[11px] font-semibold">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                          className="hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          {isVideoPlaying ? <Pause size={14} /> : <Play size={14} className="fill-white" />}
                        </button>
                        <span>0:{videoProgress < 10 ? `0${videoProgress}` : videoProgress} / 2:15</span>
                        <span className="text-emerald-400 font-bold hidden sm:inline">
                          • AI Catalog Bot Dispatched Quotation in 0.2s
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Volume2 size={14} className="text-slate-400" />
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                          AUTO-PLAYBACK
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 9. "STOP SWITCHING BETWEEN TOOLS" — BEFORE VS AFTER             */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <section
          className={cn(
            "py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b transition-colors",
            isDarkMode ? "bg-[#090E1A] border-slate-800" : "bg-white border-slate-200/80"
          )}
        >
          <div className="max-w-6xl mx-auto space-y-12">

            {/* Section Header */}
            <ScrollReveal y={30}>
              <div className="text-center space-y-3 max-w-3xl mx-auto">
                <span className="text-xs font-bold tracking-widest text-rose-500 uppercase block">
                  THE WORKSPACE REVOLUTION
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  Stop Switching Between Tools
                </h2>
              </div>
            </ScrollReveal>

            {/* Visual Before → After Transition */}
            <ScrollReveal y={35} delay={0.15}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch text-left">


                {/* BEFORE: DISCONNECTED CHAOS */}
                <div className={cn(
                  "p-8 sm:p-10 rounded-3xl border flex flex-col justify-between space-y-6 transition-all duration-300 relative overflow-hidden",
                  isDarkMode
                    ? "bg-rose-950/20 border-rose-900/40 text-slate-100"
                    : "bg-rose-50/50 border-rose-200/90 text-slate-900"
                )}>
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-extrabold border border-rose-200 dark:border-rose-900">
                      <X size={13} strokeWidth={3} />
                      <span>Without UWO Connect</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
                      Disconnected Chaos
                    </h3>

                    <p className={cn("text-xs sm:text-sm font-normal leading-relaxed", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                      10 browser tabs, manual copy-pasting, lost leads, delayed replies, and chaotic manual invoicing.
                    </p>

                    {/* Chaos Visual Mockup Badges */}
                    <div className="space-y-2 pt-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between text-rose-700 dark:text-rose-300">
                        <span>❌ 10+ Scattered Browser Tabs</span>
                        <span className="font-mono text-[10px]">Overwhelmed</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between text-rose-700 dark:text-rose-300">
                        <span>❌ Unanswered WhatsApp &amp; DMs</span>
                        <span className="font-mono text-[10px]">Lost Leads</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between text-rose-700 dark:text-rose-300">
                        <span>❌ Manual GST Invoice Calculations</span>
                        <span className="font-mono text-[10px]">Prone to Error</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] font-bold text-rose-500 pt-4 border-t border-rose-200/60 dark:border-rose-900/40">
                    Average response time: 4 to 8 hours
                  </div>
                </div>

                {/* AFTER: ONE CLEAN CENTRAL WORKSPACE */}
                <div className={cn(
                  "p-8 sm:p-10 rounded-3xl border flex flex-col justify-between space-y-6 transition-all duration-300 relative overflow-hidden shadow-xl",
                  isDarkMode
                    ? "bg-emerald-950/20 border-emerald-800/60 text-slate-100"
                    : "bg-emerald-50/50 border-emerald-200/90 text-slate-900"
                )}>
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold border border-emerald-200 dark:border-emerald-800">
                      <Check size={13} strokeWidth={3} />
                      <span>With UWO Connect</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400">
                      One Clean Central Workspace
                    </h3>

                    <p className={cn("text-xs sm:text-sm font-normal leading-relaxed", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                      Messages, Leads, Documents, Quotations, Payments, and Invoices automatically synced in real time.
                    </p>

                    {/* Clean Visual Mockup Badges */}
                    <div className="space-y-2 pt-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800/80 flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-medium">
                        <span>✅ Unified Inbox (WhatsApp, IG, FB, YT)</span>
                        <span className="font-mono text-[10px] text-emerald-600">1 Window</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800/80 flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-medium">
                        <span>✅ AI Auto-Replies &amp; Catalog Dispatch</span>
                        <span className="font-mono text-[10px] text-emerald-600">0.2s Speed</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800/80 flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-medium">
                        <span>✅ Automated GST Billing &amp; Google Sheets</span>
                        <span className="font-mono text-[10px] text-emerald-600">100% Synced</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] font-bold text-emerald-600 pt-4 border-t border-emerald-200/60 dark:border-emerald-800/40">
                    Average response time: 0.2s instant closure
                  </div>
                </div>

              </div>
            </ScrollReveal>

          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 10. BUSINESS ENGINES / FEATURES — PRODUCT SHOWCASE             */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <section
          id="features"
          className={cn(
            "py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b transition-colors",
            isDarkMode ? "bg-[#070B14] border-slate-800" : "bg-[#F8FAFC] border-slate-200/80"
          )}
        >
          <div className="max-w-7xl mx-auto space-y-12">

            {/* Section Header */}
            <ScrollReveal y={30}>
              <div className="text-center space-y-3 max-w-3xl mx-auto">
                <span className="text-xs font-bold tracking-widest text-[#0B8F78] uppercase block">
                  COMPLETE SAAS CAPABILITIES
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  Everything You Need to Run Smarter
                </h2>
                <p className={cn("text-sm sm:text-base font-normal", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                  9 powerful business engines built natively into your unified workspace. Select any module to inspect.
                </p>
              </div>
            </ScrollReveal>

            {/* Interactive Product Explorer Layout */}
            <ScrollReveal y={35} delay={0.15}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">


                {/* Left Column: Vertical Feature Navigation */}
                <div className="lg:col-span-5 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    {modulesList.map((mod, idx) => {
                      const isActive = activeModuleIndex === idx;
                      return (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => setActiveModuleIndex(idx)}
                          className={cn(
                            "w-full p-3 sm:p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer",
                            isActive
                              ? "bg-[#0B8F78] text-white border-[#0B8F78] shadow-md shadow-emerald-700/20 translate-x-1 font-bold"
                              : isDarkMode
                                ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850"
                                : "bg-white border-slate-200/90 text-slate-700 hover:text-slate-900 hover:border-slate-300"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black",
                              isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                            )}>
                              {mod.num}
                            </span>
                            <span className="text-xs sm:text-sm font-bold">{mod.title}</span>
                          </div>
                          <ArrowRight size={14} className={cn("transition-transform", isActive ? "translate-x-0.5 opacity-100" : "opacity-0")} />
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleStartFree}
                      className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0B8F78] to-[#0F766E] text-white text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                    >
                      <span>Launch Free Workspace</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Right Column: Large Dashboard Screenshot & Details */}
                {(() => {
                  const activeMod = modulesList[activeModuleIndex] || modulesList[0];
                  return (
                    <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl overflow-hidden">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#0B8F78]">
                              {activeMod.icon}
                            </div>
                            <div>
                              <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">
                                MODULE {activeMod.num} • {activeMod.badge}
                              </span>
                              <h3 className="text-xl sm:text-2xl font-bold">{activeMod.title}</h3>
                            </div>
                          </div>
                        </div>

                        <p className={cn("text-xs sm:text-sm font-normal leading-relaxed", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                          {activeMod.desc}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {activeMod.features.map((f, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                            >
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Screenshot Container */}
                      <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-md">
                        <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                          <span>Live Dashboard Screen</span>
                          <span className="text-emerald-500 font-bold">100% Native SaaS</span>
                        </div>
                        <img
                          src={activeMod.screenshot}
                          alt={`${activeMod.title} Screen`}
                          className="w-full h-auto object-cover max-h-[360px]"
                        />
                      </div>
                    </div>
                  );
                })()}

              </div>
            </ScrollReveal>

          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 11. PRICING & SUBSCRIPTION PLANS                               */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <section
          id="pricing"
          className={cn(
            "py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b transition-colors",
            isDarkMode ? "bg-[#090E1A] border-slate-800" : "bg-white border-slate-200/80"
          )}
        >
          <div className="max-w-7xl mx-auto space-y-12">

            {/* Existing Pricing Comparison Table Component with Preserved Plan Logic */}
            <ScrollReveal y={30}>
              <PricingComparisonTable
                onSelectPlan={() => router.push('/auth/login')}
                dark={isDarkMode}
              />
            </ScrollReveal>

            {/* Custom Plan Architect Section */}
            <ScrollReveal y={30} delay={0.15}>
              <CustomPlanSection isDarkMode={isDarkMode} />
            </ScrollReveal>

          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 12. WHITE-LABEL & RESELLER PROGRAM                              */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <section
          id="white-label"
          className={cn(
            "py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b transition-colors relative overflow-hidden",
            isDarkMode ? "bg-[#070B14] border-slate-800" : "bg-[#F8FAFC] border-slate-200/80"
          )}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-6xl mx-auto space-y-10 text-left relative z-10">

            {/* White Label Banner Header */}
            <ScrollReveal y={30}>
              <div className="space-y-4 max-w-3xl">
                <span className="text-xs font-bold tracking-widest text-[#0B8F78] uppercase block">
                  PARTNER &amp; AGENCY PROGRAM
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  Build &amp; Scale Your Own White-Label Software Agency
                </h2>
                <p className={cn("text-sm sm:text-base font-normal leading-relaxed", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                  Rebrand the entire UWO Connect platform under your own brand name, custom domain, and logo. Charge your clients directly and keep 100% of all subscription profits.
                </p>
              </div>
            </ScrollReveal>

            {/* 4 Pillars of White Label */}
            <ScrollReveal y={35} delay={0.15}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {[
                  { title: 'Custom Domain & Logo', desc: 'Point your subdomain (e.g. portal.youragency.com) with custom logo & palette.' },
                  { title: '100% Profit Retention', desc: 'Plug in your own payment gateway. Keep 100% of subscription fees directly.' },
                  { title: 'Multi-Tenant Isolation', desc: 'Provision independent, isolated workspaces for every business client you sign.' },
                  { title: 'Full AI & Automation', desc: 'Provide WhatsApp, IG, FB bots, CRM pipelines, and GST billing under your brand.' }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-6 rounded-2xl border transition-all",
                      isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200/90 shadow-sm"
                    )}
                  >
                    <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-1">{item.title}</h4>
                    <p className={cn("text-xs leading-relaxed", isDarkMode ? "text-slate-400" : "text-slate-600")}>{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <a
                  href="mailto:connect@uwo24.com?subject=Agency%20White-Label%20Inquiry%20-%20UWO%20Connect"
                  className="px-6 py-3.5 rounded-xl bg-[#0B8F78] hover:bg-[#097361] text-white text-xs font-bold shadow-md shadow-emerald-700/20 inline-flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                >
                  <span>Apply for Agency White-Label</span>
                  <ArrowRight size={14} />
                </a>
                <Link
                  href="/book"
                  className={cn(
                    "px-6 py-3.5 rounded-xl border text-xs font-bold inline-flex items-center gap-2 transition-all hover:scale-105 cursor-pointer",
                    isDarkMode ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white" : "bg-white border-slate-200 text-slate-700 hover:text-slate-900"
                  )}
                >
                  <span>Book a Live Platform Demo</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </ScrollReveal>

          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 13. FREQUENTLY ASKED QUESTIONS (FAQ)                           */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <section
          id="faq"
          className={cn(
            "py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b transition-colors",
            isDarkMode ? "bg-[#090E1A] border-slate-800" : "bg-white border-slate-200/80"
          )}
        >
          <div className="max-w-4xl mx-auto space-y-12 text-left">

            {/* Section Header */}
            <ScrollReveal y={30}>
              <div className="text-center space-y-3">
                <span className="text-xs font-bold tracking-widest text-[#0B8F78] uppercase block">
                  CLEAR ANSWERS
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                  Frequently Asked Questions
                </h2>
                <p className={cn("text-sm sm:text-base font-normal", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                  Everything you need to know about UWO Connect.
                </p>
              </div>
            </ScrollReveal>

            {/* Premium Minimal Accordion List */}
            <ScrollReveal y={35} delay={0.15}>
              <div className="space-y-3">

                {displayedFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "rounded-2xl border transition-all duration-200 overflow-hidden",
                        isDarkMode
                          ? "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                          : "bg-slate-50/60 border-slate-200/80 hover:border-slate-300"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <span className="font-bold text-sm sm:text-base leading-snug">{faq.q}</span>
                        <span className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-all",
                          isOpen
                            ? "bg-[#0B8F78] text-white border-[#0B8F78]"
                            : isDarkMode ? "bg-slate-800 text-slate-400 border-slate-700" : "bg-white text-slate-500 border-slate-200"
                        )}>
                          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm leading-relaxed border-t border-slate-200/40 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>

            {/* Show More Button */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setShowAllFaqs(!showAllFaqs)}
                className="px-6 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-850 transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>{showAllFaqs ? 'Show Fewer Questions' : 'View More FAQs'}</span>
                {showAllFaqs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {/* Help Contact Link */}
            <div className="text-center pt-2">
              <p className={cn("text-xs sm:text-sm font-medium", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                Still have questions?{' '}
                <Link href="/contact" className="text-[#0B8F78] hover:underline font-bold">
                  Contact our support &amp; sales team →
                </Link>
              </p>
            </div>

          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* 14. FINAL CTA SECTION — WITH ABHA & DEV                        */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <section
          className={cn(
            "py-20 sm:py-28 px-4 sm:px-6 lg:px-8 transition-colors relative overflow-hidden text-center",
            isDarkMode ? "bg-[#070B14]" : "bg-white"
          )}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-blue-500/15 rounded-full blur-[140px] pointer-events-none" />

          <ScrollReveal y={35}>
            <div className="max-w-4xl mx-auto space-y-8 relative z-10">

              <div className="flex items-center justify-center gap-6">
                <img
                  src="/Abha_transparent.png"
                  alt="Abha"
                  className="w-16 sm:w-20 object-contain drop-shadow-md hover:scale-105 transition-transform"
                />
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30 overflow-hidden">
                  <img src="/uwo-icon.png" alt="UWO Connect Logo" className="w-full h-full object-cover" />
                </div>
                <img
                  src="/Dev_transparent.png"
                  alt="Dev"
                  className="w-16 sm:w-20 object-contain drop-shadow-md hover:scale-105 transition-transform"
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                  Ready to simplify your business?
                </h2>
                <p className={cn("text-sm sm:text-base font-normal max-w-xl mx-auto", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                  Start managing your conversations, leads and automation with UWO Connect.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/auth/register')}
                  className="px-8 py-4 rounded-xl bg-[#0B8F78] hover:bg-[#097361] text-white text-sm font-bold shadow-xl shadow-emerald-700/25 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight size={16} />
                </button>
                <Link
                  href="/book"
                  className={cn(
                    "px-7 py-4 rounded-xl border text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer",
                    isDarkMode ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-700 shadow-xs"
                  )}
                >
                  Schedule Demo
                </Link>
              </div>

            </div>
          </ScrollReveal>
        </section>

      </main>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 15. FOOTER — PRESERVED ROUTES & SUPPORT EMAIL: connect@uwo24.com */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <footer
        className={cn(
          "border-t py-16 px-4 sm:px-6 lg:px-8 transition-colors text-xs font-medium",
          isDarkMode ? "bg-[#05080F] border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
        )}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 items-start">

          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1 text-left">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="UWO Connect"
                width={28}
                height={28}
                className="w-7 h-7 object-contain filter brightness-110 shrink-0"
              />
              <span className="text-base font-extrabold text-slate-900 dark:text-white">
                UWO Connect
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              Unified Communication &amp; Business Automation Platform. Connect channels, tools, and workflows seamlessly.
            </p>
            <div className="text-xs">
              <span>Support &amp; Operations: </span>
              <a href="mailto:connect@uwo24.com" className="font-bold text-[#0B8F78] hover:underline">
                connect@uwo24.com
              </a>
            </div>
          </div>

          {/* Column 2: Company Links */}
          <div className="space-y-3 text-left">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Company
            </h5>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-[#0B8F78] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#0B8F78] transition-colors">Contact</Link></li>
              <li><Link href="/book" className="hover:text-[#0B8F78] transition-colors">Book Demo</Link></li>
              <li><a href="#white-label" className="hover:text-[#0B8F78] transition-colors">White Label</a></li>
            </ul>
          </div>

          {/* Column 3: Legal Links */}
          <div className="space-y-3 text-left">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Legal
            </h5>
            <ul className="space-y-2">
              <li><Link href="/terms-and-conditions" className="hover:text-[#0B8F78] transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-[#0B8F78] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-[#0B8F78] transition-colors">Cookie Policy</Link></li>
              <li>
                <button
                  type="button"
                  onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('open_cookie_settings'))}
                  className="hover:text-[#0B8F78] transition-colors text-left cursor-pointer"
                >
                  Cookie Settings
                </button>
              </li>
              <li><Link href="/refund-policy" className="hover:text-[#0B8F78] transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Social Network Links */}
          <div className="space-y-3 text-left">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Connect With Us
            </h5>
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { href: "https://www.instagram.com/aimall.global/", title: "Instagram", icon: <InstagramLogo size={16} /> },
                { href: "https://www.linkedin.com/in/aimall-global/", title: "LinkedIn", icon: <LinkedInLogo size={16} /> },
                { href: "https://x.com/aimallglobal", title: "X (Twitter)", icon: <XLogo size={16} /> },
                { href: "https://www.youtube.com/@aimallglobal", title: "YouTube", icon: <YouTubeLogo size={16} /> },
                { href: "https://in.pinterest.com/aimallglobal/", title: "Pinterest", icon: <PinterestLogo size={16} /> },
                { href: "https://www.facebook.com/aimallglobal/", title: "Facebook", icon: <FacebookLogo size={16} /> },
                { href: "https://api.whatsapp.com/send?phone=918359890909", title: "WhatsApp", icon: <WhatsAppLogo size={16} /> },
                { href: "mailto:connect@uwo24.com", title: "Email", icon: <GmailLogo size={16} /> },
                { href: "https://www.threads.net/@aimallglobal", title: "Threads", icon: <ThreadsLogo size={16} /> },
                { href: "https://www.reddit.com/settings/profile/#visibility", title: "Reddit", icon: <RedditLogo size={16} /> },
                { href: "https://www.quora.com/profile/Aimallglobal", title: "Quora", icon: <QuoraLogo size={16} /> },
                { href: "https://medium.com/@03sonalijain", title: "Medium", icon: <MediumLogo size={16} /> },
              ].map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.title}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:scale-110 hover:border-emerald-500 transition-all cursor-pointer bg-white dark:bg-slate-900"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © 2026 UWO Connect. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Official Platform</span>
            <span>•</span>
            <span>Direct Support: connect@uwo24.com</span>
          </div>
        </div>
      </footer>

      {/* Auth Modal Trigger */}
      {isLoginModalOpen && (
        <UWOLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      )}

      {/* Terms & Legal Popup Modal Trigger */}
      {isTermsModalOpen && (
        <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
      )}

    </div>
  );
}
