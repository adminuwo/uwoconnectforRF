'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  ExternalLink, 
  RotateCcw, 
  ChevronRight,
  Maximize2,
  Minimize2,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { API_BASE_URL } from '@/config/apiConfig';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

const QUICK_PROMPTS = [
  { label: '💳 Razorpay connect kaise karein?', text: 'Razorpay payment gateway connect kaise karein?' },
  { label: '🛍️ Catalog link kaise share karein?', text: 'Catalog se product ka checkout link customer ko kaise share karein?' },
  { label: '🧾 GST Invoice WhatsApp par bhejna?', text: 'GST Invoice generate karke customer ko WhatsApp par kaise bhejein?' },
  { label: '🔗 WhatsApp Cloud API connection?', text: 'WhatsApp Cloud API account kaise connect karein?' },
  { label: '⚡ 24/7 AI Auto-Replies?', text: '24/7 AI Auto Replies aur Workflows kaise set karein?' },
  { label: '👥 Leads & CRM ka use?', text: 'Customer leads aur CRM contacts kahan dikhte hain?' },
];

const INITIAL_MESSAGE = {
  id: 'welcome-msg',
  role: 'assistant',
  content: `Namaste! Main aapka **UWOConnect BOT** hoon. 😊

UWOConnect software ke kisi bhi feature ke baare mein poochiye — jaise:
- 💳 **Razorpay Payment Gateway** connect karna
- 🛍️ **Catalog** se public checkout links share karna
- 🧾 **GST Invoices** generate karke WhatsApp par bhejna
- 🔗 **WhatsApp Cloud API** & Social Channels link karna
- ⚡ **24/7 AI Auto Replies** activate karna

Neeche diye gaye buttons par click karke turant pooch sakte hain!`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  source: 'system'
};

/**
 * Helper to render message content with bold text, bullets, and clickable internal dashboard links.
 * High-contrast, theme-aware styling for perfect readability in both light and dark mode.
 */
function FormattedMessage({ content, onNavigate }) {
  const lines = (content || '').split('\n');

  const renderFormattedText = (text) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIdx = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(renderBoldText(text.substring(lastIdx, match.index)));
      }
      const label = match[1];
      const url = match[2];

      if (url.startsWith('/client') || url.startsWith('/checkout') || url.startsWith('/public')) {
        parts.push(
          <Link
            key={match.index}
            href={url}
            onClick={() => onNavigate && onNavigate()}
            className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 underline underline-offset-2 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300/80 dark:border-emerald-700/60 transition-colors mx-0.5"
          >
            {label}
            <ExternalLink size={11} className="inline opacity-80" />
          </Link>
        );
      } else {
        parts.push(
          <a
            key={match.index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 underline underline-offset-2 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300/80 dark:border-emerald-700/60 transition-colors mx-0.5"
          >
            {label}
            <ExternalLink size={11} className="inline opacity-80" />
          </a>
        );
      }
      lastIdx = linkRegex.lastIndex;
    }

    if (lastIdx < text.length) {
      parts.push(renderBoldText(text.substring(lastIdx)));
    }

    return parts.length > 0 ? parts : renderBoldText(text);
  };

  const renderBoldText = (subText) => {
    const boldParts = subText.split(/(\*\*[^*]+\*\*|`[^`]+`|\/client\/[a-zA-Z0-9_\-\/]+)/g);
    return boldParts.map((chunk, i) => {
      if (!chunk) return null;
      if (chunk.startsWith('**') && chunk.endsWith('**')) {
        return (
          <strong 
            key={i} 
            className="font-bold text-slate-900 dark:text-white"
          >
            {chunk.slice(2, -2)}
          </strong>
        );
      }
      if (chunk.startsWith('`') && chunk.endsWith('`')) {
        return (
          <code 
            key={i} 
            className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-semibold"
          >
            {chunk.slice(1, -1)}
          </code>
        );
      }
      if (chunk.startsWith('/client/')) {
        return (
          <Link
            key={i}
            href={chunk}
            onClick={() => onNavigate && onNavigate()}
            className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 underline underline-offset-2 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-xs transition-colors mx-0.5"
          >
            {chunk}
            <ChevronRight size={10} className="inline opacity-80" />
          </Link>
        );
      }
      return <span key={i} className="text-slate-800 dark:text-slate-200">{chunk}</span>;
    });
  };

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-extrabold text-emerald-800 dark:text-emerald-300 text-sm mt-2.5 mb-1 tracking-tight">
              {renderFormattedText(trimmed.replace('### ', ''))}
            </h4>
          );
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 text-xs">•</span>
              <div className="flex-1 text-slate-800 dark:text-slate-200">
                {renderFormattedText(trimmed.substring(2))}
              </div>
            </div>
          );
        }

        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs mt-0.5">{numMatch[1]}.</span>
              <div className="flex-1 text-slate-800 dark:text-slate-200">
                {renderFormattedText(numMatch[2])}
              </div>
            </div>
          );
        }

        return <p key={idx} className="text-slate-800 dark:text-slate-200">{renderFormattedText(trimmed)}</p>;
      })}
    </div>
  );
}

export default function PlatformAIAssistantWidget() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('uwo_platform_ai_chat');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      if (messages.length > 1) {
        sessionStorage.setItem('uwo_platform_ai_chat', JSON.stringify(messages));
      }
    } catch (e) {}
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = typeof window !== 'undefined' 
        ? (localStorage.getItem('token') || localStorage.getItem('uwo_token'))
        : null;

      const historyPayload = messages
        .filter(m => m.id !== 'welcome-msg')
        .slice(-6)
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const res = await axios.post(
        `${API_BASE_URL}/api/platform/ai-assistant/chat`,
        {
          message: text,
          history: historyPayload
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      const botReply = res.data?.reply || "Mujhe aapke sawal ka jawab dene mein dikkat aayi. Kripya thodi der baad koshish karein.";

      const assistantMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.data?.source || 'openai'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('[Platform AI Assistant Error]:', err);
      const assistantMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: `**Aapka connection offline lag raha hai ya request poori nahi ho saki.**\n\nPlatform help ke liye:\n- 💳 Razorpay setup ke liye **[Channels](/client/channels)** par jaayein.\n- 🛍️ Product Catalog ke liye **[Catalog](/client/catalog)** par jaayein.\n- 🧾 Invoices ke liye **[Invoices](/client/invoices)** par jaayein.\n- 📚 Full video aur visual tutorial ke liye **[Learning Center](/client/guides)** check karein.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'offline_fallback'
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    try {
      sessionStorage.removeItem('uwo_platform_ai_chat');
    } catch (e) {}
  };

  return (
    <>
      {/* Floating Circular Trigger Button (Bottom Right) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 group flex items-center">
          {/* Tooltip on Hover */}
          <span 
            className={cn(
              "absolute right-16 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shadow-lg border transition-all duration-200 pointer-events-none opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0",
              isDark 
                ? "bg-slate-900/95 text-emerald-300 border-slate-700 shadow-black/40" 
                : "bg-slate-900/90 text-white border-slate-800 shadow-slate-400/30"
            )}
          >
            BOT
          </span>

          {/* Circular Button Matching Platform Theme */}
          <button
            id="platform-ai-assistant-btn"
            onClick={() => setIsOpen(true)}
            className={cn(
              "w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center relative cursor-pointer",
              "bg-[#059669] hover:bg-[#047857] text-white",
              "shadow-lg shadow-emerald-900/25 hover:shadow-xl hover:shadow-emerald-700/35",
              "hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white ring-2 ring-emerald-500/20"
            )}
            title="Ask Platform AI"
            aria-label="Open Platform AI Assistant"
          >
            <div className="relative flex items-center justify-center">
              <Bot size={24} className="text-white drop-shadow-xs" />
              <Sparkles size={12} className="absolute -top-1 -right-1 text-emerald-200 animate-pulse" />
            </div>

            {/* Online Status Beacon */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-300 border-2 border-white ring-1 ring-emerald-600 shadow-xs" />
          </button>
        </div>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          id="platform-ai-assistant-modal"
          className={cn(
            "fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl overflow-hidden",
            "border shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5",
            isExpanded 
              ? "w-[94vw] sm:w-[580px] h-[640px] max-h-[85vh]" 
              : "w-[94vw] sm:w-[420px] h-[560px] max-h-[82vh]",
            isDark 
              ? "bg-slate-900 border-slate-800 text-slate-100 shadow-black/40" 
              : "bg-white border-slate-200 text-slate-900 shadow-slate-400/25"
          )}
        >
          {/* Header Matching Platform Emerald Palette (#059669) */}
          <div className="relative px-4 py-3.5 bg-[#059669] dark:bg-emerald-700 text-white flex items-center justify-between border-b border-emerald-700/60 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl bg-emerald-700/60 border border-emerald-400/40 flex items-center justify-center shadow-xs">
                <Bot size={20} className="text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-300 border-2 border-emerald-800" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight text-white">BOT</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-700/80 border border-emerald-400/40 text-emerald-100 font-bold uppercase tracking-wider">
                    UWO Guide
                  </span>
                </div>
                <p className="text-[11px] text-emerald-100/90 font-normal">
                  Ask how any feature works (Hinglish/English)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Reset conversation"
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                aria-label="Reset chat"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse width" : "Expand width"}
                className="hidden sm:inline-flex p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors"
                aria-label="Toggle width"
              >
                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors ml-0.5"
                aria-label="Close"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth custom-scrollbar bg-slate-50/70 dark:bg-slate-900/60">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2.5 max-w-[92%]",
                    isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
                  )}
                >
                  {isAssistant ? (
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-[#059669] dark:text-emerald-400 shadow-xs">
                      <Sparkles size={13} />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-[#059669] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <User size={13} />
                    </div>
                  )}

                  <div
                    className={cn(
                      "px-4 py-3 rounded-2xl text-sm transition-all",
                      isAssistant
                        ? isDark
                          ? "bg-slate-800/95 border border-slate-700/80 text-slate-100 rounded-tl-sm shadow-xs"
                          : "bg-white border border-slate-200/90 text-slate-900 rounded-tl-sm shadow-xs"
                        : "bg-[#059669] text-white rounded-2xl rounded-tr-sm shadow-xs font-medium"
                    )}
                  >
                    {isAssistant ? (
                      <FormattedMessage content={msg.content} onNavigate={() => {}} />
                    ) : (
                      <p className="whitespace-pre-wrap font-medium text-white">{msg.content}</p>
                    )}
                    <span 
                      className={cn(
                        "block text-[10px] mt-1.5 text-right font-medium",
                        isAssistant 
                          ? isDark ? "text-slate-400" : "text-slate-400" 
                          : "text-emerald-100"
                      )}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2.5 max-w-[85%] mr-auto items-center">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center shrink-0 text-emerald-700 dark:text-emerald-400">
                  <Sparkles size={13} className="animate-spin" />
                </div>
                <div className={cn(
                  "px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-xs",
                  isDark ? "bg-slate-800/95 border border-slate-700" : "bg-white border border-slate-200"
                )}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel/Pills */}
          {messages.length <= 4 && !loading && (
            <div className="px-3 py-2.5 border-t border-slate-200 dark:border-emerald-900/30 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0 bg-slate-100/80 dark:bg-emerald-950/20">
              {QUICK_PROMPTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.text)}
                  className={cn(
                    "whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all border shadow-xs cursor-pointer active:scale-95",
                    isDark 
                      ? "bg-slate-800/90 hover:bg-slate-700 text-emerald-300 border-emerald-800/50 hover:border-emerald-500" 
                      : "bg-white hover:bg-emerald-50 text-emerald-800 border-emerald-300/90 hover:border-emerald-500"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-white dark:bg-[#070d18]">
            <div className={cn(
              "flex items-center gap-2 rounded-xl px-3.5 py-2 border transition-all shadow-inner",
              isDark 
                ? "bg-slate-950/90 border-slate-700 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/20" 
                : "bg-slate-50/90 border-slate-300 focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600/20"
            )}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Platform ke kisi bhi feature ke baare mein poochiye..."
                className={cn(
                  "flex-1 bg-transparent text-sm resize-none outline-none py-1 max-h-20 custom-scrollbar font-normal",
                  isDark ? "text-slate-100 placeholder:text-slate-500" : "text-slate-900 placeholder:text-slate-500"
                )}
              />
              <button
                id="send-platform-ai-msg"
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || loading}
                className={cn(
                  "p-2.5 rounded-xl transition-all",
                  input.trim() && !loading
                    ? "bg-[#059669] hover:bg-[#047857] text-white shadow-md shadow-emerald-700/30 active:scale-95 cursor-pointer"
                    : "text-slate-400 opacity-40 cursor-not-allowed"
                )}
                aria-label="Send message"
              >
                <Send size={15} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-[10px] text-slate-500 font-medium">
                Shift + Enter for new line • Enter to send
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold tracking-tight">
                BOT
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
