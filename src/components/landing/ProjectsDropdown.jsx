'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export const UWO_PROJECTS = [
  { id: 'ai-legal', name: 'AI Legal', url: 'https://ailegal.aisa24.com' },
  { id: 'ai-ads', name: 'AI Ads', url: 'https://aiads.aisa24.com' },
  { id: 'ai-education', name: 'AI Education', url: 'https://education.uwo24.com' },
  { id: 'ai-mall', name: 'AI Mall', url: 'https://aimall24.com' },
  { id: 'aisa-core', name: 'AISA', url: 'https://aisa24.com' },
  { id: 'efv-framework', name: 'EFV Framework', url: 'https://efvframework.com' },
];

export default function ProjectsDropdown({ isDarkMode = true, align = 'right' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Navbar Trigger Button (Clean matching link style) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          "px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer",
          isOpen
            ? (isDarkMode ? "text-[#0B8F78] bg-slate-800 font-bold" : "text-[#0B8F78] bg-emerald-50 font-bold")
            : (isDarkMode ? "text-slate-200 hover:text-white hover:bg-slate-800/60" : "text-black font-bold hover:text-[#0B8F78] hover:bg-slate-100")
        )}
      >
        <span className={isDarkMode ? "text-slate-200" : "text-black font-bold"}>Projects</span>
        <ChevronDown
          size={12}
          className={cn(
            "transition-transform duration-200",
            isOpen ? "rotate-180 text-[#0B8F78]" : (isDarkMode ? "text-slate-300 opacity-70" : "text-black opacity-90")
          )}
        />
      </button>

      {/* Simple, Sleek Dropdown (Names Only) */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-full mt-2 w-48 rounded-xl shadow-xl py-1.5 px-1 z-50 transition-all animate-in fade-in zoom-in-95 duration-150",
            align === 'right' ? "right-0" : "left-0",
            isDarkMode
              ? "bg-[#090E1A]/95 border border-slate-800 text-white backdrop-blur-xl shadow-black/70"
              : "bg-white border border-slate-200 text-black backdrop-blur-xl shadow-lg shadow-slate-300/60"
          )}
        >
          {UWO_PROJECTS.map((proj) => (
            <a
              key={proj.id}
              href={proj.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-bold transition-colors group",
                isDarkMode
                  ? "hover:bg-slate-800/80 hover:text-[#0B8F78] text-white"
                  : "hover:bg-emerald-50 hover:text-[#0B8F78] text-black"
              )}
            >
              <span className={cn(
                "transition-colors",
                isDarkMode ? "text-white group-hover:text-[#0B8F78]" : "text-black group-hover:text-[#0B8F78]"
              )}>
                {proj.name}
              </span>
              <ExternalLink
                size={11}
                className={cn(
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  isDarkMode ? "text-slate-400 group-hover:text-[#0B8F78]" : "text-slate-500 group-hover:text-[#0B8F78]"
                )}
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// Mobile Simple Accordion (Names Only)
export function MobileProjectsAccordion({ isDarkMode = true, onItemClick }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="py-1">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between py-1.5 text-sm font-semibold transition-colors cursor-pointer",
          isDarkMode ? "text-white" : "text-black"
        )}
      >
        <span>Projects</span>
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            isExpanded && "rotate-180 text-[#0B8F78]"
          )}
        />
      </button>

      {isExpanded && (
        <div className="pl-3 py-1 space-y-1">
          {UWO_PROJECTS.map((proj) => (
            <a
              key={proj.id}
              href={proj.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onItemClick}
              className={cn(
                "block py-1.5 text-xs font-medium transition-colors",
                isDarkMode ? "text-slate-300 hover:text-white" : "text-black hover:text-[#0B8F78]"
              )}
            >
              {proj.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
