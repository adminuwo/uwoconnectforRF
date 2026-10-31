'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Sparkles, CheckCircle2, Activity, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { RenderIndustry3D } from './Industry3DObjects';

// ════════════════════════════════════════════════════════════════
// 8 INDUSTRY HANGING WARDROBE ITEMS
// Designed as physical hanging panels & industry-specific garments/emblems
// ════════════════════════════════════════════════════════════════
export const WARDROBE_INDUSTRIES = [
  {
    id: 'education',
    num: '01',
    name: 'EDUCATION',
    tagline: 'Schools, Universities & Coaching',
    heroHeadline: 'CONNECT EVERY LEARNING JOURNEY',
    description: 'Manage student enquiries, admission follow-ups and communication from one connected platform.',
    workflow: ['Student Enquiry', 'CRM', 'Follow-up', 'Admission'],
    color: '#10B981',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    stat: '99.4% Student Retention',
    target: 'Admissions & Academic Deans',
    challenges: 'High enquiry drops when prospective parents wait hours for course details, syllabus, and fee structures.',
    solution: 'UWO Connect ingests student enquiries across WhatsApp and web forms, instantly auto-dispatches prospectus PDFs, and coordinates counselor follow-ups in a unified team inbox.',
    features: ['Instant Syllabus PDF Dispatch', 'Shared Counselor Inbox', 'Fee Due WhatsApp Reminders', 'Automated Admission Stages'],
    hangerLabel: 'Academic Attire & Diploma',
    garmentType: 'education'
  },
  {
    id: 'real-estate',
    num: '02',
    name: 'REAL ESTATE',
    tagline: 'Builders, Agencies & Consultants',
    heroHeadline: 'TURN PROPERTY ENQUIRIES INTO OPPORTUNITIES',
    description: 'Organize property leads, customer conversations and site visit follow-ups.',
    workflow: ['Property Enquiry', 'Lead Management', 'Site Visit', 'Follow-up'],
    color: '#3B82F6',
    accentText: 'text-blue-600 dark:text-blue-400',
    stat: '3x Faster Site Visits',
    target: 'Builders & Property Brokers',
    challenges: 'Property buyer leads turn cold within minutes without instant responses; field agents lose track of site-visit schedules.',
    solution: 'Ingests Meta Ad and website leads immediately into WhatsApp, auto-qualifies buyer budget, and schedules confirmed site visits with Google Maps directions.',
    features: ['Meta Ad Lead Webhooks', 'Automated GPS Location Dispatch', 'Site Visit Calendar Booking', 'Field Agent Timeline Audit'],
    hangerLabel: 'Architectural Blueprint & Keys',
    garmentType: 'real-estate'
  },
  {
    id: 'finance',
    num: '03',
    name: 'FINANCE',
    tagline: 'Advisors, Loans & Wealth Management',
    heroHeadline: 'BUILD STRONGER FINANCIAL CONNECTIONS',
    description: 'Manage customer enquiries, organize follow-ups and simplify financial service communication.',
    workflow: ['New Enquiry', 'Customer Record', 'Follow-up', 'Communication'],
    color: '#059669',
    accentText: 'text-emerald-600 dark:text-emerald-500',
    stat: '100% Document Auditing',
    target: 'Loan Brokers & Wealth Planners',
    challenges: 'Borrowers drop off during lengthy, confusing KYC document collection cycles; renewal dates are missed.',
    solution: 'Automates document collection checklists, sends encrypted statements and KYC prompts, and tracks policy renewal dates with auditable logs.',
    features: ['Secure Document Exchange', 'KYC & Bank Statement Reminders', 'Policy Expiry Auto-Nudges', 'Auditable Client Chat History'],
    hangerLabel: 'Tailored Pinstripe & Portfolio',
    garmentType: 'finance'
  },
  {
    id: 'healthcare',
    num: '04',
    name: 'HEALTHCARE',
    tagline: 'Hospitals, Clinics & Diagnostic Labs',
    heroHeadline: 'MAKE EVERY PATIENT INTERACTION COUNT',
    description: 'Organize appointment enquiries, reminders and patient communication.',
    workflow: ['Appointment', 'Booking', 'Reminder', 'Follow-up'],
    color: '#F43F5E',
    accentText: 'text-rose-600 dark:text-rose-400',
    stat: '0% Missed Patient Slots',
    target: 'Hospitals & Medical Clinics',
    challenges: 'Patient no-shows cost clinics thousands; phone lines are jammed with routine appointment questions and report inquiries.',
    solution: 'Allows 24/7 self-service appointment booking on WhatsApp, sends pre-consultation fasting guidelines, and delivers lab test reports automatically.',
    features: ['Self-Service Slot Booking', 'Automated Pre-Visit Reminders', 'Digital Diagnostic Lab Delivery', 'Post-Op Follow-up Automation'],
    hangerLabel: "Doctor's Coat & Stethoscope",
    garmentType: 'healthcare'
  },
  {
    id: 'automobile',
    num: '05',
    name: 'AUTOMOBILE',
    tagline: 'Dealerships, Showrooms & Service Centers',
    heroHeadline: 'DRIVE BETTER CUSTOMER EXPERIENCES',
    description: 'Manage vehicle enquiries, test drive requests and service communication.',
    workflow: ['Vehicle Enquiry', 'Test Drive', 'Follow-up', 'Service'],
    color: '#F59E0B',
    accentText: 'text-amber-600 dark:text-amber-400',
    stat: '85% Test Drive Conversion',
    target: 'Automobile Dealerships',
    challenges: 'Slow response to showroom car inquiries leads buyers to competitors; vehicle service reminders are overlooked.',
    solution: 'Instantly dispatches on-road price quotes and brochure PDFs, schedules test drive slots, and sends automated vehicle service reminders.',
    features: ['WhatsApp Brochure Dispatch', '1-Click Test Drive Scheduling', 'Automated Service & PUC Alerts', 'Insurance Renewal Broadcasts'],
    hangerLabel: 'Motorsport Jacket & Key Fob',
    garmentType: 'automobile'
  },
  {
    id: 'logistics',
    num: '06',
    name: 'LOGISTICS',
    tagline: 'Couriers, Transport & Delivery Fleets',
    heroHeadline: 'KEEP EVERY DELIVERY CONNECTED',
    description: 'Simplify shipment-related communication, customer enquiries and delivery updates.',
    workflow: ['Shipment', 'Status Update', 'Notification', 'Support'],
    color: '#8B5CF6',
    accentText: 'text-purple-600 dark:text-purple-400',
    stat: '0.1s Dispatch Alerts',
    target: 'Fleet & Cargo Operators',
    challenges: 'High volume of "Where is my parcel?" support calls overwhelms staff; delivery address errors cause high return costs.',
    solution: 'Sends real-time parcel dispatch alerts with live tracking links on WhatsApp, and allows customers to reschedule delivery with 1 click.',
    features: ['Live WhatsApp Tracking Links', 'Address Verification Bot', 'Failed Delivery Rescheduling', 'Support Agent Ticket Handoff'],
    hangerLabel: 'Courier High-Vis & Parcel Tag',
    garmentType: 'logistics'
  },
  {
    id: 'ecommerce',
    num: '07',
    name: 'E-COMMERCE',
    tagline: 'Online Stores, D2C Brands & Retail Shops',
    heroHeadline: 'CONNECT EVERY CUSTOMER AND ORDER',
    description: 'Manage customer enquiries, order communication and customer support.',
    workflow: ['Customer Order', 'CRM', 'Update', 'Support'],
    color: '#EC4899',
    accentText: 'text-pink-600 dark:text-pink-400',
    stat: '98% WhatsApp Open Rate',
    target: 'D2C Brands & Online Stores',
    challenges: 'Over 70% cart abandonment on e-commerce sites; email shipping notifications often land unread in spam folders.',
    solution: 'Automates abandoned cart WhatsApp nudges with direct checkout links, and sends order confirmation, invoice PDF, and tracking notifications.',
    features: ['Abandoned Cart Recovery Nudges', 'WhatsApp Order & Invoice Alert', 'Post-Purchase Review Collection', 'Broadcast Promotions & Coupons'],
    hangerLabel: 'Designer Retail Shopper & Tag',
    garmentType: 'ecommerce'
  },
  {
    id: 'travel',
    num: '08',
    name: 'TRAVEL & HOSPITALITY',
    tagline: 'Hotels, Resorts & Tour Operators',
    heroHeadline: 'MAKE EVERY JOURNEY SEAMLESS',
    description: 'Organize booking enquiries, customer communication and travel updates.',
    workflow: ['Booking Enquiry', 'Follow-up', 'Confirmation', 'Updates'],
    color: '#06B6D4',
    accentText: 'text-cyan-600 dark:text-cyan-400',
    stat: '24/7 Itinerary Assistant',
    target: 'Hotels, Resorts & Tour Curators',
    challenges: 'Travelers demand instant itinerary quotes across time zones; fragmented hotel check-in details cause guest frustration.',
    solution: 'Instant WhatsApp package quote generator, automated pre-arrival hotel check-in guides, and a 24/7 AI travel concierge for guests.',
    features: ['Instant Itinerary PDF Quotes', 'Automated Check-in Guides', 'Google Maps Location & Directions', '24/7 AI Guest Concierge Bot'],
    hangerLabel: 'Aviator Jacket & Boarding Pass',
    garmentType: 'travel'
  }
];

// ════════════════════════════════════════════════════════════════
// HANGER GARMENT ILLUSTRATION (PHYSICAL 3D HANGING OBJECT)
// ════════════════════════════════════════════════════════════════
function HangerGarmentVisual({ type, color }) {
  switch (type) {
    case 'education':
      return (
        <svg viewBox="0 0 160 230" className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wooden Hanger Hook */}
          <path d="M80 15 C80 4, 96 4, 96 18 C96 28, 80 32, 80 44" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <polygon points="25,58 80,44 135,58 130,68 80,52 30,68" fill="#92400E" stroke="#78350F" strokeWidth="1" />
          <line x1="30" y1="65" x2="130" y2="65" stroke="#B45309" strokeWidth="2.5" />
          
          {/* Academic Gown Silhouette */}
          <path d="M45 68 L115 68 L126 185 L34 185 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
          {/* Emerald Academic Stole */}
          <path d="M55 68 L68 185 L80 185 L70 68 Z" fill="#10B981" />
          <path d="M105 68 L92 185 L80 185 L90 68 Z" fill="#10B981" />
          <circle cx="80" cy="88" r="5" fill="#FBBF24" />
          
          {/* 3D Mortarboard Cap Silhouette */}
          <polygon points="80,118 112,130 80,142 48,130" fill="#0B8F78" stroke="#34D399" strokeWidth="1.2" />
          <polygon points="48,130 80,142 80,147 48,135" fill="#044E41" />
          <polygon points="80,142 112,130 112,135 80,147" fill="#022C24" />
          <circle cx="80" cy="130" r="2.5" fill="#FBBF24" />
          
          {/* Hanging Diploma Scroll Tag */}
          <rect x="62" y="156" width="36" height="20" rx="4" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
          <line x1="68" y1="166" x2="92" y2="166" stroke="#D97706" strokeWidth="1.2" />
        </svg>
      );
    case 'real-estate':
      return (
        <svg viewBox="0 0 160 230" className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M80 15 C80 4, 96 4, 96 18 C96 28, 80 32, 80 44" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <polygon points="25,58 80,44 135,58 130,68 80,52 30,68" fill="#92400E" stroke="#78350F" strokeWidth="1" />
          <line x1="30" y1="65" x2="130" y2="65" stroke="#B45309" strokeWidth="2.5" />
          
          {/* Broker Suit Jacket Silhouette */}
          <path d="M38 68 L122 68 L128 180 L32 180 Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.5" />
          <polygon points="80,68 96,118 80,112 64,118" fill="#93C5FD" opacity="0.6" />
          
          {/* Architectural 3D House Charm */}
          <polygon points="80,120 110,140 50,140" fill="#3B82F6" stroke="#93C5FD" strokeWidth="1.2" />
          <rect x="58" y="140" width="44" height="32" fill="#1E40AF" stroke="#60A5FA" strokeWidth="1.2" />
          <rect x="74" y="152" width="12" height="20" fill="#93C5FD" />
        </svg>
      );
    case 'finance':
      return (
        <svg viewBox="0 0 160 230" className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M80 15 C80 4, 96 4, 96 18 C96 28, 80 32, 80 44" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <polygon points="25,58 80,44 135,58 130,68 80,52 30,68" fill="#92400E" stroke="#78350F" strokeWidth="1" />
          <line x1="30" y1="65" x2="130" y2="65" stroke="#B45309" strokeWidth="2.5" />
          
          {/* Pinstripe Wealth Vest */}
          <path d="M42 68 L118 68 L124 185 L36 185 Z" fill="#047857" stroke="#065F46" strokeWidth="1.5" />
          <line x1="60" y1="68" x2="60" y2="185" stroke="#6EE7B7" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="80" y1="68" x2="80" y2="185" stroke="#6EE7B7" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="100" y1="68" x2="100" y2="185" stroke="#6EE7B7" strokeWidth="1" strokeDasharray="3 3" />
          
          {/* Gold Coin Growth Medal */}
          <circle cx="80" cy="132" r="19" fill="#F59E0B" stroke="#FDE68A" strokeWidth="1.8" />
          <path d="M71 138 L77 130 L83 133 L90 124" stroke="#78350F" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'healthcare':
      return (
        <svg viewBox="0 0 160 230" className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M80 15 C80 4, 96 4, 96 18 C96 28, 80 32, 80 44" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <polygon points="25,58 80,44 135,58 130,68 80,52 30,68" fill="#92400E" stroke="#78350F" strokeWidth="1" />
          <line x1="30" y1="65" x2="130" y2="65" stroke="#B45309" strokeWidth="2.5" />
          
          {/* White Clinical Doctor Coat */}
          <path d="M38 68 L122 68 L126 185 L34 185 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
          <path d="M58 68 Q58 125, 80 135 Q102 125, 102 68" stroke="#475569" strokeWidth="2.8" fill="none" />
          <circle cx="80" cy="140" r="7.5" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
          
          {/* Medical Red Cross Badge */}
          <rect x="72" y="156" width="16" height="16" rx="3" fill="#F43F5E" />
          <rect x="78" y="159" width="4" height="10" fill="white" />
          <rect x="75" y="162" width="10" height="4" fill="white" />
        </svg>
      );
    case 'automobile':
      return (
        <svg viewBox="0 0 160 230" className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M80 15 C80 4, 96 4, 96 18 C96 28, 80 32, 80 44" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <polygon points="25,58 80,44 135,58 130,68 80,52 30,68" fill="#92400E" stroke="#78350F" strokeWidth="1" />
          <line x1="30" y1="65" x2="130" y2="65" stroke="#B45309" strokeWidth="2.5" />
          
          {/* Racing Leather Bomber */}
          <path d="M36 68 L124 68 L128 180 L32 180 Z" fill="#27272A" stroke="#3F3F46" strokeWidth="1.5" />
          <line x1="68" y1="68" x2="68" y2="180" stroke="#F59E0B" strokeWidth="3" />
          <line x1="74" y1="68" x2="74" y2="180" stroke="#F59E0B" strokeWidth="1.5" />
          
          {/* Sports Car Fob Tag */}
          <rect x="54" y="128" width="52" height="28" rx="5" fill="#78350F" stroke="#F59E0B" strokeWidth="1.2" />
          <circle cx="68" cy="155" r="5.5" fill="#F59E0B" />
          <circle cx="92" cy="155" r="5.5" fill="#F59E0B" />
        </svg>
      );
    case 'logistics':
      return (
        <svg viewBox="0 0 160 230" className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M80 15 C80 4, 96 4, 96 18 C96 28, 80 32, 80 44" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <polygon points="25,58 80,44 135,58 130,68 80,52 30,68" fill="#92400E" stroke="#78350F" strokeWidth="1" />
          <line x1="30" y1="65" x2="130" y2="65" stroke="#B45309" strokeWidth="2.5" />
          
          {/* High-Vis Logistics Vest */}
          <path d="M40 68 L120 68 L124 180 L36 180 Z" fill="#6D28D9" stroke="#5B21B6" strokeWidth="1.5" />
          <rect x="38" y="108" width="84" height="13" fill="#C4B5FD" />
          
          {/* Cargo Parcel Tag */}
          <rect x="61" y="132" width="38" height="36" rx="3" fill="#D97706" stroke="#92400E" strokeWidth="1.2" />
          <line x1="61" y1="150" x2="99" y2="150" stroke="#92400E" strokeWidth="2.2" />
          <line x1="80" y1="132" x2="80" y2="168" stroke="#92400E" strokeWidth="2.2" />
        </svg>
      );
    case 'ecommerce':
      return (
        <svg viewBox="0 0 160 230" className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M80 15 C80 4, 96 4, 96 18 C96 28, 80 32, 80 44" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <polygon points="25,58 80,44 135,58 130,68 80,52 30,68" fill="#92400E" stroke="#78350F" strokeWidth="1" />
          <line x1="30" y1="65" x2="130" y2="65" stroke="#B45309" strokeWidth="2.5" />
          
          {/* Designer Shopper Bag on Hanger */}
          <rect x="40" y="78" width="80" height="98" rx="7" fill="#BE185D" stroke="#9D174D" strokeWidth="1.5" />
          <path d="M60 78 C60 56, 100 56, 100 78" stroke="#F472B6" strokeWidth="2.8" fill="none" />
          <polygon points="80,108 96,128 64,128" fill="#FBCFE8" />
          <circle cx="80" cy="142" r="11" fill="#9D174D" stroke="#F472B6" strokeWidth="1.2" />
        </svg>
      );
    case 'travel':
      return (
        <svg viewBox="0 0 160 230" className="w-full h-auto drop-shadow-[0_15px_25px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_20px_30px_rgba(0,0,0,0.7)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M80 15 C80 4, 96 4, 96 18 C96 28, 80 32, 80 44" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <polygon points="25,58 80,44 135,58 130,68 80,52 30,68" fill="#92400E" stroke="#78350F" strokeWidth="1" />
          <line x1="30" y1="65" x2="130" y2="65" stroke="#B45309" strokeWidth="2.5" />
          
          {/* Pilot Aviator Jacket */}
          <path d="M38 68 L122 68 L126 180 L34 180 Z" fill="#0891B2" stroke="#0E7490" strokeWidth="1.5" />
          <rect x="35" y="69" width="18" height="7" fill="#FBBF24" />
          <rect x="107" y="69" width="18" height="7" fill="#FBBF24" />
          
          {/* 3D Airplane Tag */}
          <polygon points="80,112 89,142 80,137 71,142" fill="white" />
          <polygon points="80,122 106,132 80,130 54,132" fill="white" />
          <rect x="64" y="155" width="32" height="15" rx="2" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1" />
        </svg>
      );
    default:
      return null;
  }
}

// ════════════════════════════════════════════════════════════════
// MAIN INTERACTIVE 3D WARDROBE COMPONENT (CARD-FREE & LIGHT THEME)
// ════════════════════════════════════════════════════════════════
export default function Wardrobe3DExperience({ isDarkMode = false }) {
  const [hoveredIdx, setHoveredIdx] = useState(0);
  const [activeIndustry, setActiveIndustry] = useState(null); // null = Wardrobe view, object = Zoomed presentation view
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const wardrobeRef = useRef(null);

  // Smooth mouse move handler for physical 3D cabinet perspective tilt
  const handleMouseMove = useCallback((e) => {
    if (!wardrobeRef.current || activeIndustry) return;
    const rect = wardrobeRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1
    setMouseOffset({ x, y });
  }, [activeIndustry]);

  const handleMouseLeave = useCallback(() => {
    setMouseOffset({ x: 0, y: 0 });
  }, []);

  const currentHoveredIndustry = WARDROBE_INDUSTRIES[hoveredIdx];

  return (
    <div className="w-full relative select-none">

      <AnimatePresence mode="wait">
        {!activeIndustry ? (
          // ════════════════════════════════════════════════════════════════
          // VIEW 1: OPEN WARDROBE ON THE RAIL (CARD-FREE, LIGHT THEME)
          // ════════════════════════════════════════════════════════════════
          <motion.div
            key="wardrobe-cabinet"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, z: 200 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full space-y-8"
          >
            {/* Header info directly above wardrobe */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#0B8F78]">
                  <Sparkles size={14} />
                  <span>Interactive 3D Solution Wardrobe</span>
                </div>
                <h2 className={cn(
                  "text-3xl sm:text-5xl font-black tracking-tight mt-1",
                  isDarkMode ? "text-white" : "text-slate-900"
                )}>
                  Browse Business Worlds On The Rail
                </h2>
              </div>
              <p className={cn("text-xs sm:text-sm max-w-sm", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                Move cursor over each hanger to inspect. Click any garment to take it off the rail and enter its world.
              </p>
            </div>

            {/* ════════════════════════════════════════════════════════════ */}
            {/* THE OPEN 3D WARDROBE RAIL (CARD-FREE & LIGHT THEME)          */}
            {/* ════════════════════════════════════════════════════════════ */}
            <div
              ref={wardrobeRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full py-6 sm:py-10 transition-all duration-300"
              style={{
                perspective: '1600px',
                minHeight: '560px'
              }}
            >
              {/* 3D Perspective Motion Container */}
              <div
                className="relative w-full h-full flex flex-col justify-between transition-transform duration-300 ease-out"
                style={{
                  transform: `rotateX(${mouseOffset.y * -3}deg) rotateY(${mouseOffset.x * 5}deg)`,
                  transformStyle: 'preserve-3d'
                }}
              >
                
                {/* Giant Background Industry Watermark (Open in Light/Dark Theme) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -z-10 overflow-hidden">
                  <span className={cn(
                    "text-[12vw] sm:text-[14vw] font-black uppercase whitespace-nowrap tracking-tighter leading-none transition-all duration-500",
                    isDarkMode ? "text-white/[0.04]" : "text-slate-900/[0.04]"
                  )}>
                    {currentHoveredIndustry.name}
                  </span>
                </div>

                {/* Overhead Top Shelf Architectural Bar */}
                <div className="relative w-full z-20">
                  <div className={cn(
                    "w-full h-4 sm:h-5 rounded-md flex items-center justify-between px-6 border-b transition-colors shadow-2xs",
                    isDarkMode
                      ? "bg-slate-900 border-slate-800 text-slate-500"
                      : "bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 border-slate-300/80 text-slate-600"
                  )}>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-700" />
                    <span className="text-[10px] font-mono tracking-widest uppercase">
                      UWO LUXURY ATELIER • WARDROBE RAIL
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-700" />
                  </div>

                  {/* Ceiling Spotlight Glow cone onto the active hanger */}
                  <div
                    className="absolute top-2 w-72 sm:w-96 h-96 rounded-full blur-[110px] pointer-events-none transition-all duration-500"
                    style={{
                      left: `${(hoveredIdx / (WARDROBE_INDUSTRIES.length - 1)) * 80 + 10}%`,
                      transform: 'translateX(-50%)',
                      backgroundColor: currentHoveredIndustry.color,
                      opacity: isDarkMode ? 0.45 : 0.2
                    }}
                  />
                </div>

                {/* Solid Metallic Hanging Rod (Brushed Chrome/Brass Rail) */}
                <div className="relative w-full my-6 sm:my-8 z-20">
                  {/* Left Mounting Bracket */}
                  <div className="absolute left-0 -top-3 w-4 h-9 bg-slate-400 dark:bg-stone-600 rounded-sm shadow-md" />
                  {/* The Rail */}
                  <div className="w-full h-3.5 rounded-full bg-gradient-to-b from-slate-200 via-slate-400 to-slate-300 dark:from-slate-300 dark:via-slate-500 dark:to-slate-700 shadow-[0_8px_16px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_15px_rgba(0,0,0,0.8)] border-t border-white" />
                  {/* Right Mounting Bracket */}
                  <div className="absolute right-0 -top-3 w-4 h-9 bg-slate-400 dark:bg-stone-600 rounded-sm shadow-md" />
                </div>

                {/* ════════════════════════════════════════════════════════ */}
                {/* 8 INTERACTIVE HANGING ELEMENTS ON THE RAIL               */}
                {/* ════════════════════════════════════════════════════════ */}
                <div className="relative w-full z-30 flex items-start justify-between gap-1 sm:gap-4 px-2 sm:px-6 min-h-[320px] overflow-x-auto pb-4 scrollbar-none">
                  {WARDROBE_INDUSTRIES.map((ind, idx) => {
                    const isHovered = hoveredIdx === idx;
                    return (
                      <div
                        key={ind.id}
                        onMouseEnter={() => setHoveredIdx(idx)}
                        onClick={() => setActiveIndustry(ind)}
                        className={cn(
                          "relative flex-1 min-w-[75px] sm:min-w-[100px] max-w-[130px] flex flex-col items-center cursor-pointer transition-all duration-300 group",
                          isHovered ? "z-40 scale-110" : "opacity-75 hover:opacity-100 z-10"
                        )}
                        style={{
                          transform: isHovered
                            ? `translate3d(0px, -18px, 70px) rotateZ(${mouseOffset.x * 5}deg)`
                            : `translate3d(0px, 0px, 0px) rotateZ(${(idx % 2 === 0 ? 1 : -1) * 1.5}deg)`,
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        {/* Hanger Hook Ring Glint */}
                        <div
                          className={cn(
                            "w-2.5 h-2.5 rounded-full mb-1 transition-all",
                            isHovered
                              ? "bg-emerald-500 shadow-[0_0_12px_#10B981] animate-ping"
                              : "bg-transparent"
                          )}
                        />

                        {/* Garment / Object Visual on Hanger */}
                        <div className="w-full relative transition-transform duration-300">
                          <HangerGarmentVisual type={ind.garmentType} color={ind.color} />
                        </div>

                        {/* Hanger Label Tag (Light Theme Compatible) */}
                        <div className={cn(
                          "mt-3 px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold text-center transition-all whitespace-nowrap border",
                          isHovered
                            ? "bg-[#0B8F78] text-white border-[#0B8F78] shadow-md scale-105"
                            : isDarkMode
                              ? "bg-slate-900 text-slate-300 border-slate-700"
                              : "bg-white text-slate-700 border-slate-200 shadow-2xs hover:border-[#0B8F78]"
                        )}>
                          <span>{ind.name}</span>
                        </div>

                        {/* Click cue */}
                        {isHovered && (
                          <div className="mt-1 text-[9px] font-black tracking-widest uppercase text-[#0B8F78] flex items-center gap-1 animate-pulse">
                            <span>Open</span>
                            <ChevronRight size={10} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Wardrobe Floor Shelf Divider */}
                <div className="relative w-full z-20 mt-4">
                  <div className={cn(
                    "w-full h-3 rounded-md border-t transition-colors",
                    isDarkMode
                      ? "bg-slate-900 border-slate-800"
                      : "bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 border-slate-300 shadow-2xs"
                  )} />
                </div>

                {/* Active Hovered Industry Inspection Bar (Open & Borderless) */}
                <div className="relative z-30 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentHoveredIndustry.color }} />
                      <span className="text-[11px] font-mono tracking-wider uppercase text-[#0B8F78] font-bold">
                        Inspecting Hanger #{currentHoveredIndustry.num} • {currentHoveredIndustry.hangerLabel}
                      </span>
                    </div>
                    <h3 className={cn(
                      "text-2xl sm:text-3xl font-black tracking-tight",
                      isDarkMode ? "text-white" : "text-slate-900"
                    )}>
                      {currentHoveredIndustry.heroHeadline}
                    </h3>
                    <p className={cn(
                      "text-sm leading-relaxed",
                      isDarkMode ? "text-slate-300" : "text-slate-600"
                    )}>
                      {currentHoveredIndustry.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveIndustry(currentHoveredIndustry)}
                    className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0B8F78] to-[#0F766E] text-white text-sm font-bold shadow-lg shadow-emerald-700/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer self-end md:self-auto shrink-0"
                  >
                    <span>Enter {currentHoveredIndustry.name} World</span>
                    <ArrowRight size={15} />
                  </button>
                </div>

              </div>
            </div>

          </motion.div>
        ) : (
          // ════════════════════════════════════════════════════════════════
          // VIEW 2: CINEMATIC FULL INDUSTRY PRESENTATION (CARD-FREE & LIGHT)
          // ════════════════════════════════════════════════════════════════
          <motion.div
            key="industry-presentation"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full space-y-8"
          >
            {/* Top Navigation Bar with "Back to Wardrobe" */}
            <div className="flex items-center justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveIndustry(null)}
                className={cn(
                  "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border transition-all cursor-pointer shadow-xs",
                  isDarkMode
                    ? "border-slate-800 bg-slate-900/80 text-emerald-400 hover:bg-slate-800"
                    : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100 hover:text-[#0B8F78]"
                )}
              >
                <ArrowLeft size={16} />
                <span>← Back to Wardrobe Rack</span>
              </button>

              {/* Quick switch tabs for other hangers */}
              <div className="hidden lg:flex items-center gap-1.5">
                {WARDROBE_INDUSTRIES.map((ind) => (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => setActiveIndustry(ind)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer",
                      activeIndustry.id === ind.id
                        ? "bg-[#0B8F78] text-white"
                        : isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )}
                  >
                    {ind.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Presentation Stage (Open & Card-Free) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center py-4">
              
              {/* Left Column: Complete Storytelling, Problem, Solution & Workflow */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Tagline & Stat */}
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white"
                    style={{ backgroundColor: activeIndustry.color }}
                  >
                    {activeIndustry.num} • {activeIndustry.name}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {activeIndustry.tagline}
                  </span>
                  <span>•</span>
                  <span className="text-xs font-bold text-[#0B8F78]">
                    {activeIndustry.stat}
                  </span>
                </div>

                {/* Big Headline */}
                <h2 className={cn(
                  "text-3xl sm:text-5xl font-black tracking-tight leading-tight",
                  isDarkMode ? "text-white" : "text-slate-900"
                )}>
                  {activeIndustry.heroHeadline}
                </h2>

                {/* Description */}
                <p className={cn(
                  "text-base sm:text-lg leading-relaxed font-normal",
                  isDarkMode ? "text-slate-300" : "text-slate-600"
                )}>
                  {activeIndustry.description}
                </p>

                {/* Connected 4-Step Animated Workflow Sequence */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <Activity className="w-3.5 h-3.5 text-[#0B8F78]" />
                    <span>Automated Workflow Pipeline:</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {activeIndustry.workflow.map((step, sidx) => (
                      <React.Fragment key={sidx}>
                        <span
                          className={cn(
                            "px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5",
                            sidx === 0
                              ? "bg-[#0B8F78]/15 border-[#0B8F78] text-[#0B8F78]"
                              : isDarkMode
                                ? "bg-slate-900/80 border-slate-800 text-slate-300"
                                : "bg-white border-slate-200 text-slate-800 shadow-2xs"
                          )}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0B8F78]" />
                          <span>{step}</span>
                        </span>
                        {sidx < activeIndustry.workflow.length - 1 && (
                          <span className="text-slate-400 font-bold text-xs sm:text-sm">──►</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Business Challenge vs UWO Connect Solution */}
                <div className="space-y-3 pt-2">
                  <div className={cn(
                    "p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed",
                    isDarkMode
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-200/90"
                      : "bg-amber-50 border-amber-200 text-amber-900"
                  )}>
                    <span className="font-bold block mb-1 text-amber-700 dark:text-amber-400">Common Industry Challenge:</span>
                    {activeIndustry.challenges}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed",
                    isDarkMode
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200/90"
                      : "bg-emerald-50 border-emerald-200 text-emerald-900"
                  )}>
                    <span className="font-bold block mb-1 text-emerald-700 dark:text-emerald-400">How UWO Connect Solves It:</span>
                    {activeIndustry.solution}
                  </div>
                </div>

                {/* 4 Feature Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {activeIndustry.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <CheckCircle2 size={15} className="text-[#0B8F78] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <Link
                    href="/auth/register"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0B8F78] to-[#0F766E] text-white text-sm font-bold shadow-lg shadow-emerald-700/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Launch for {activeIndustry.name}</span>
                    <ArrowRight size={15} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setActiveIndustry(null)}
                    className={cn(
                      "w-full sm:w-auto px-6 py-3.5 rounded-full border text-sm font-bold transition-colors cursor-pointer",
                      isDarkMode
                        ? "border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                        : "border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    Back to All Hangers
                  </button>
                </div>

              </div>

              {/* Right Column: 3D Visual Object with Spotlight in Open Space */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                
                {/* Radial Glow */}
                <div
                  className="absolute inset-0 rounded-full blur-[120px] pointer-events-none"
                  style={{
                    backgroundColor: activeIndustry.color,
                    opacity: isDarkMode ? 0.35 : 0.18
                  }}
                />

                {/* Main 3D Illustration */}
                <div className="relative z-10 w-full max-w-[420px] py-4">
                  <RenderIndustry3D sceneId={activeIndustry.id} className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]" />
                </div>

                {/* Floating Stat Pill (Light Theme) */}
                <div className={cn(
                  "relative z-20 mt-4 p-4 rounded-2xl border backdrop-blur-xl shadow-md flex items-center gap-3 w-full max-w-[340px]",
                  isDarkMode
                    ? "bg-slate-900/90 border-slate-700 text-white"
                    : "bg-white/95 border-slate-200 text-slate-900"
                )}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                    style={{ backgroundColor: activeIndustry.color }}
                  >
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      {activeIndustry.target}
                    </div>
                    <div className="text-sm font-black text-[#0B8F78]">
                      {activeIndustry.stat}
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
