import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, MessageSquare, Database, Activity, Settings, Users, 
  Brain, FileText, CreditCard, CheckCircle2, CheckCircle, Star, 
  Menu, X, Sun, Moon
} from 'lucide-react';
export default function EFVUnifiedLanding() {
  const [annual, setAnnual] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  const navItems = [
    { name: 'Platform', id: 'platform' },
    { name: 'Integrations', id: 'integrations' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'Documentation', id: 'documentation' },
    { name: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    const sections = ['platform', 'integrations', 'pricing', 'documentation', 'contact'];
    
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      
      if (window.scrollY < 100) {
        setActiveSection('hero');
        return;
      }

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden selection:bg-[#10B981]/30 selection:text-white relative transition-colors duration-500 ${isDark ? 'bg-[#030712] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Global Ambient Background Gradients */}
      <div className="fixed top-0 left-1/4 w-[800px] h-[800px] bg-[#10B981]/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#059669]/10 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -z-10" />

      {/* 2. Navigation Bar */}
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-[16px] saturate-[180%] border-b transition-colors duration-500 ${
        isDark 
          ? 'bg-[#030712]/75 border-white/[0.06] text-white' 
          : 'bg-white/75 border-[#10B981]/15 text-[#000000]'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#059669] to-[#047857] flex items-center justify-center shadow-[0_0_15px_rgba(5,150,105,0.3)] group-hover:shadow-[0_0_25px_rgba(5,150,105,0.5)] transition-all">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span className={`font-bold text-lg tracking-tight transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#000000]'}`}>
              Meta Connect
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] dark:bg-white/[0.02] border border-white/[0.05] dark:border-white/[0.03] rounded-full px-2 py-1.5 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.name}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`relative px-4 py-1.5 text-sm font-medium transition-colors duration-300 rounded-full ${
                    isActive 
                      ? (isDark ? 'text-white' : 'text-white')
                      : (isDark ? 'text-[#8E99A8] hover:text-white' : 'text-[#059669] hover:text-[#000000]')
                  }`}
                >
                  {isActive && (
                    <div
                      className={`absolute inset-0 rounded-full -z-10 ${
                        isDark ? 'bg-white/[0.08]' : 'bg-[#059669]'
                      }`}
                    />
                  )}
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 transition-colors rounded-full ${
                isDark 
                  ? 'text-[#8E99A8] hover:text-white hover:bg-white/5' 
                  : 'text-[#059669] hover:text-[#000000] hover:bg-[#059669]/10'
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link 
              href="/auth/login" 
              className={`text-sm font-medium transition-colors px-4 py-2 ${
                isDark ? 'text-[#8E99A8] hover:text-white' : 'text-[#059669] hover:text-[#000000]'
              }`}
            >
              Login
            </Link>
            <Link 
              href="/auth/register" 
              className="px-6 py-2.5 bg-[#059669] text-white font-semibold text-sm rounded-full shadow-[0_0_20px_rgba(5,150,105,0.2)] hover:shadow-[0_0_30px_rgba(5,150,105,0.4)] hover:bg-[#047857] transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-white/5 text-white' : 'hover:bg-[#059669]/10 text-[#059669]'
            }`} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        
          {mobileMenuOpen && (
            <div
              className={`md:hidden border-t backdrop-blur-[24px] px-6 py-6 flex flex-col gap-4 overflow-hidden ${
                isDark 
                  ? 'bg-[#030712]/95 border-white/[0.06] text-white' 
                  : 'bg-white/95 border-[#10B981]/15 text-[#000000]'
              }`}
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a 
                      key={item.name} 
                      href={`#${item.id}`} 
                      onClick={(e) => {
                        handleNavClick(e, item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive 
                          ? (isDark ? 'bg-white/10 text-white' : 'bg-[#059669]/10 text-[#059669]')
                          : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-[#059669]/80 hover:text-[#000000] hover:bg-[#059669]/5')
                      }`}
                    >
                      {item.name}
                    </a>
                  );
                })}
              </div>
              <hr className={`my-2 ${isDark ? 'border-white/10' : 'border-[#059669]/15'}`} />
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setIsDark(!isDark);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full py-3 text-center text-sm font-semibold flex items-center justify-center gap-2 border rounded-xl transition-all duration-200 ${
                    isDark 
                      ? 'border-white/10 hover:bg-white/5 text-slate-300' 
                      : 'border-[#059669]/20 hover:bg-[#059669]/5 text-[#059669]'
                  }`}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
                <Link 
                  href="/auth/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full py-3 text-center text-sm font-semibold border rounded-xl transition-all duration-200 ${
                    isDark 
                      ? 'border-white/10 hover:bg-white/5 text-slate-300' 
                      : 'border-[#059669]/20 hover:bg-[#059669]/5 text-[#059669]'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  href="/auth/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-sm font-bold bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-all hover:shadow-[0_0_20px_rgba(5,150,105,0.3)]"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        
      </header>

      {/* 3. Hero Section & Hyper-Realistic Dashboard */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative">
        
        {/* Left Column */}
        <div className="flex-1 text-center lg:text-left z-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981] text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Sparkles size={12} /> Version 2.0 is Live
          </div>
          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            One AI Platform.<br />
            <span className="bg-gradient-to-r from-white to-[#10B981] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(16,185,129,0.2)]">Every Business Operation.</span>
          </h1>
          <p
            className="text-lg text-slate-400 font-medium mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Run your CRM, Marketing, Sales, Projects, Finance, and WhatsApp Automation from a single, unified enterprise intelligence kernel.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-2xl text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300">
              Start Free Trial
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-[rgba(17,24,39,0.6)] backdrop-blur-[12px] saturate-[160%] border border-white/[0.08] rounded-2xl text-sm font-bold hover:bg-white/5 hover:border-white/20 transition-all duration-300">
              Book Demo
            </button>
          </div>
        </div>

        {/* Right Column: Dashboard Mockup */}
        <div
          className="flex-1 w-full max-w-[600px] perspective-1000 z-10"
        >
          <div className="bg-[rgba(17,24,39,0.6)] backdrop-blur-[12px] saturate-[160%] border border-white/[0.08] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col h-[500px]">
            {/* Top Bar */}
            <div className="h-12 border-b border-white/[0.08] flex items-center px-4 bg-black/20 gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-md text-[10px] text-slate-400 font-mono flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  efv-unified-kernel.app
                </div>
              </div>
              <div className="w-12" />
            </div>

            {/* App Layout */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-14 border-r border-white/[0.08] bg-black/10 flex flex-col items-center py-4 gap-4">
                {[MessageSquare, Database, Activity, Settings].map((Icon, i) => (
                  <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${i === 0 ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                    <Icon size={16} />
                  </div>
                ))}
              </div>

              {/* Main Content */}
              <div className="flex-1 p-5 bg-[#030712]/40 overflow-y-auto space-y-4">
                
                {/* Revenue Card */}
                <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-2xl flex flex-col gap-4 relative overflow-hidden group hover:border-white/[0.15] transition-colors">
                  <div className="flex justify-between items-start z-10 relative">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Q3 Revenue Projection</h4>
                      <p className="text-2xl font-bold">$1.48M</p>
                    </div>
                    <div className="px-2 py-1 bg-[#10B981]/20 text-[#10B981] text-[9px] font-bold rounded-md">
                      +18.4%
                    </div>
                  </div>
                  {/* Mini Chart */}
                  <div className="flex items-end gap-1.5 h-12 w-full z-10 relative">
                    {[30, 45, 25, 60, 50, 75, 60, 85, 70, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-[#10B981]/20 to-[#10B981] rounded-t-[2px] opacity-70 group-hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  {/* Leads Card */}
                  <div className="flex-1 p-4 bg-white/[0.02] border border-white/[0.08] rounded-2xl flex flex-col justify-between hover:border-white/[0.15] transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                      <Users size={14} className="text-[#10B981]" />
                      <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Active Leads</span>
                    </div>
                    <div>
                      <div className="text-xl font-bold mb-2">1,284</div>
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-6 h-6 rounded-full bg-[#10B981]/20 border border-[#030712] overflow-hidden">
                             <div className="w-full h-full bg-gradient-to-br from-[#10B981] to-[#059669] opacity-70" />
                          </div>
                        ))}
                        <div className="w-6 h-6 rounded-full bg-white/10 border border-[#030712] flex items-center justify-center text-[8px] font-bold">+42</div>
                      </div>
                    </div>
                  </div>

                  {/* AI Assistant Simulated */}
                  <div className="flex-[1.5] p-4 bg-gradient-to-br from-[#10B981]/10 to-transparent border border-[#10B981]/20 rounded-2xl flex flex-col relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={14} className="text-[#10B981]" />
                      <span className="text-[10px] uppercase tracking-widest text-[#10B981] font-bold">AI Assistant</span>
                    </div>
                    <div className="bg-[#030712]/50 border border-white/5 rounded-xl p-3 text-[10px] text-slate-300 relative flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      Drafting WhatsApp campaign...
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feature Matrix Section */}
      <section id="platform" className="py-24 relative z-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#10B981] uppercase tracking-widest block mb-2">The Paradigm Shift</span>
            <h2 className="text-3xl md:text-4xl font-bold">Why switch to a unified kernel?</h2>
          </div>

          <div className="bg-[rgba(17,24,39,0.4)] backdrop-blur-[12px] saturate-[160%] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
            {/* Header Row */}
            <div className="flex flex-col md:flex-row border-b border-white/[0.08] text-[11px] font-bold uppercase tracking-widest bg-black/20">
              <div className="flex-1 p-6 text-slate-500">Capability</div>
              <div className="flex-1 p-6 text-slate-500 md:border-l border-white/[0.08]">Traditional Stack</div>
              <div className="flex-[1.2] p-6 text-[#10B981] md:border-l border-[#10B981]/20 bg-[rgba(16,185,129,0.03)] relative">
                EFV Unified Platform
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#10B981] to-transparent opacity-50" />
              </div>
            </div>

            {/* Matrix Rows */}
            {[
              { cap: "Database Architecture", trad: "Siloed SQL & CSV Exports", efv: "Unified Vector Database" },
              { cap: "Automation", trad: "Zapier & 3rd Party Connectors", efv: "Native Neural Workflows" },
              { cap: "Customer Communication", trad: "Middleware APIs with markup", efv: "Direct Meta Cloud API integration" },
              { cap: "Analytics", trad: "Weekly manual reports", efv: "Real-time AI Business Intelligence" }
            ].map((row, i) => (
              <div key={i} className="flex flex-col md:flex-row border-b border-white/[0.08] last:border-0 hover:bg-white/[0.02] transition-colors">
                <div className="flex-1 p-6 font-bold text-white flex items-center text-sm">{row.cap}</div>
                <div className="flex-1 p-6 font-medium text-slate-400 flex items-center text-sm md:border-l border-white/[0.08]">{row.trad}</div>
                <div className="flex-[1.2] p-6 font-bold text-[#10B981] flex items-center gap-3 text-sm md:border-l border-[#10B981]/20 bg-[rgba(16,185,129,0.03)] group transition-colors">
                  <CheckCircle size={18} className="text-[#10B981] drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0 transition-transform" />
                  {row.efv}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Interactive Timeline Section */}
      <section id="integrations" className="py-24 relative z-10 px-6 bg-gradient-to-b from-transparent via-[#10B981]/[0.02] to-transparent border-y border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-4xl font-bold drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">A seamless lifecycle</h2>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-10 left-[5%] right-[5%] h-[2px] bg-white/5 z-0">
              <div className="h-full bg-gradient-to-r from-transparent via-[#10B981] to-transparent w-1/2 animate-[pulse-line-move_3s_linear_infinite] shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-4 relative z-10">
              {[
                { title: "Lead Captured", desc: "VIA WHATSAPP OR WEB FORM", icon: MessageSquare },
                { title: "CRM Profile Created", desc: "DATA STRUCTURED AUTO", icon: Database },
                { title: "AI Qualification", desc: "INTENT SCORING", icon: Brain },
                { title: "Proposal Sent", desc: "GENERATED VIA KNOWLEDGE", icon: FileText },
                { title: "Payment Secured", desc: "LEDGER UPDATED VIA STRIPE", icon: CreditCard },
                { title: "Project Initialized", desc: "TEAM TASKS ASSIGNED", icon: CheckCircle2 }
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex flex-col items-center text-center group cursor-default">
                    <div className="w-20 h-20 rounded-full bg-[#030712] border border-white/10 flex items-center justify-center mb-6 text-slate-400 group-hover:text-[#10B981] group-hover:border-[#10B981] transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] relative z-10">
                      <div className="absolute inset-0 rounded-full bg-[#10B981]/0 group-hover:bg-[#10B981]/10 transition-colors" />
                      <Icon size={28} className="relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all" />
                      <div className="absolute -inset-2 rounded-full border border-[#10B981]/0 group-hover:border-[#10B981]/50 group-hover: opacity-0 group-hover:opacity-100" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">{step.title}</h4>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 max-w-[120px] leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Transparent Scaling Pricing Cards */}
      <section id="pricing" className="py-24 relative z-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Transparent Scaling</h2>
            
            {/* Toggle Switch */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${!annual ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
              <button 
                onClick={() => setAnnual(!annual)}
                className="w-14 h-7 rounded-full bg-white/10 border border-white/20 p-1 relative flex items-center"
              >
                <div 
                  className={`w-5 h-5 rounded-full shadow-md transition-all duration-200 ${annual ? 'bg-[#10B981] ml-auto' : 'bg-slate-400'}`}
                />
              </button>
              <span className={`text-[11px] font-bold uppercase tracking-wider ${annual ? 'text-[#10B981]' : 'text-slate-500'}`}>Yearly (Save 20%)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Starter */}
            <div className="bg-[rgba(17,24,39,0.4)] backdrop-blur-[12px] saturate-[160%] border border-white/[0.08] rounded-3xl p-8 flex flex-col shadow-xl">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-slate-400 text-sm mb-6 h-10">For early stage startups establishing operations.</p>
              <div className="mb-8"><span className="text-4xl font-extrabold">${annual ? '39' : '49'}</span><span className="text-slate-500">/mo</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                {["5 User Licenses", "10,000 Contacts", "Basic AI Chat Assistant"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium"><div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center"><CheckCircle2 size={12} className="text-slate-300"/></div>{f}</li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 transition-all">Get Started</button>
            </div>

            {/* Growth (Most Popular) */}
            <div className="bg-[#111827]/80 backdrop-blur-[16px] saturate-[160%] border-2 border-[#10B981] rounded-3xl p-8 flex flex-col relative md:scale-105 z-10 shadow-[0_0_40px_rgba(16,185,129,0.15)]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#10B981] to-[#059669] text-black px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.6)]">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#10B981]">Growth</h3>
              <p className="text-slate-300 text-sm mb-6 h-10">Perfect for scaling operations and automation.</p>
              <div className="mb-8"><span className="text-4xl font-extrabold">${annual ? '79' : '99'}</span><span className="text-slate-400">/mo</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                {["25 User Licenses", "100,000 Contacts", "3 Custom AI Assistants", "Unified Financial Ledger"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold"><div className="w-5 h-5 rounded-full bg-[#10B981]/20 flex items-center justify-center"><CheckCircle2 size={12} className="text-[#10B981]"/></div>{f}</li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-[#10B981] to-[#059669] shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_25px_rgba(16,185,129,0.5)] transition-all text-white">Get Started</button>
            </div>

            {/* Enterprise */}
            <div className="bg-[rgba(17,24,39,0.4)] backdrop-blur-[12px] saturate-[160%] border border-white/[0.08] rounded-3xl p-8 flex flex-col shadow-xl">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-slate-400 text-sm mb-6 h-10">Custom scale cluster deployment for large teams.</p>
              <div className="mb-8"><span className="text-4xl font-extrabold">${annual ? '239' : '299'}</span><span className="text-slate-500">/mo</span></div>
              <ul className="space-y-4 mb-10 flex-1">
                {["Dedicated Vector DB", "Custom Webhooks", "99.99% SLA"].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium"><div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center"><CheckCircle2 size={12} className="text-slate-300"/></div>{f}</li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest bg-white/5 hover:bg-white/10 border border-white/10 transition-all">Get Started</button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Social Proof & Footer */}
      <section id="documentation" className="py-24 relative z-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Approved by Leading Teams</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
            {[
              { name: "Sarah Jenkins", role: "VP Operations", quote: "Consolidating our CRM, WhatsApp, and project management into EFV unified our scattered data immediately." },
              { name: "Marcus Chen", role: "Growth Director", quote: "The AI agent drafted responses based on our exact internal PDFs. Customer support resolution time dropped 40%." },
              { name: "Elena Rostova", role: "Founder", quote: "No more zapier connections breaking. The native neural workflows are bulletproof. Best ROI of the year." }
            ].map((test, i) => (
              <div key={i} className="bg-[rgba(17,24,39,0.6)] backdrop-blur-[12px] saturate-[160%] border border-white/[0.08] rounded-3xl p-8 flex flex-col gap-6">
                <div className="flex gap-1 text-[#10B981]">
                  {[1,2,3,4,5].map(star => <Star key={star} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1 italic">"{test.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center font-bold text-black">{test.name.charAt(0)}</div>
                  <div>
                    <h5 className="font-bold text-sm">{test.name}</h5>
                    <p className="text-xs text-slate-500">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="bg-gradient-to-r from-[rgba(16,185,129,0.1)] to-transparent border border-white/10 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#10B981]/20 blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <h2 className="text-3xl md:text-5xl font-bold mb-8 relative z-10">Ready to initialize your enterprise kernel?</h2>
            <button className="px-10 py-5 bg-[#10B981] text-black rounded-2xl text-sm font-bold shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all duration-300 relative z-10 uppercase tracking-widest">
              Start Free Trial Now
            </button>
          </div>
          
          <footer className="mt-24 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div>© 2026 EFV Unified. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="https://uwo24.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </footer>
        </div>
      </section>

    </div>
  );
}



