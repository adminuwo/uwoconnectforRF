import React from 'react';
import {
  Network,
  MessageSquare,
  Globe,
  Mail,
  Calendar,
  MessageCircle,
  HardDrive,
  Video,
  ShoppingBag,
  CreditCard,
  Code
} from 'lucide-react';

export default function Integrations({ isDark = true }) {
  const integrationsList = [
    { name: "WhatsApp", icon: MessageSquare, color: "text-[#25D366] bg-[#25D366]/10 border-[#25D366]/20 shadow-[0_0_15px_rgba(37,211,102,0.08)]" },
    { name: "Meta Business", icon: Globe, color: "text-[#1877F2] bg-[#1877F2]/10 border-[#1877F2]/20 shadow-[0_0_15px_rgba(24,119,242,0.08)]" },
    { name: "Gmail API", icon: Mail, color: "text-[#EA4335] bg-[#EA4335]/10 border-[#EA4335]/20 shadow-[0_0_15px_rgba(234,67,53,0.08)]" },
    { name: "Outlook 365", icon: Calendar, color: "text-[#0078D4] bg-[#0078D4]/10 border-[#0078D4]/20 shadow-[0_0_15px_rgba(0,120,212,0.08)]" },
    { name: "Slack Connect", icon: MessageCircle, color: "text-[#E01E5A] bg-[#E01E5A]/10 border-[#E01E5A]/20 shadow-[0_0_15px_rgba(224,30,90,0.08)]" },
    { name: "Google Drive", icon: HardDrive, color: "text-[#FBBC05] bg-[#FBBC05]/10 border-[#FBBC05]/20 shadow-[0_0_15px_rgba(251,188,5,0.08)]" },
    { name: "Zoom Rooms", icon: Video, color: "text-[#2D8CFF] bg-[#2D8CFF]/10 border-[#2D8CFF]/20 shadow-[0_0_15px_rgba(45,140,255,0.08)]" },
    { name: "Shopify Store", icon: ShoppingBag, color: "text-[#96BF48] bg-[#96BF48]/10 border-[#96BF48]/20 shadow-[0_0_15px_rgba(150,191,72,0.08)]" },
    { name: "Stripe Billing", icon: CreditCard, color: "text-[#635BFF] bg-[#635BFF]/10 border-[#635BFF]/20 shadow-[0_0_15px_rgba(99,91,255,0.08)]" },
    { name: "REST Webhooks", icon: Code, color: "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20 shadow-[0_0_15px_rgba(16,185,129,0.08)]" }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
      <div className="flex flex-col md:flex-row items-center gap-16">

        {/* Left Side Content */}
        <div className="flex-1 text-center md:text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#0F6B52]/20 border border-[#0F6B52]/40 flex items-center justify-center text-[#20C997] mb-6 mx-auto md:mx-0">
            <Network size={24} />
          </div>
          <h2 className={`text-3xl md:text-5xl font-bold tracking-tight mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Connects with your entire stack
          </h2>
          <p className={`text-lg font-medium mb-8 ${isDark ? 'text-[#8E99A8]' : 'text-slate-600'}`}>
            Native integrations with the tools you already use. Sync data bi-directionally without writing a single line of code.
          </p>
          <button className="text-[11px] font-bold uppercase tracking-widest text-[#20C997] hover:text-emerald-500 transition-colors pb-1 border-b border-[#20C997]/30 hover:border-emerald-500">
            View Integration Directory
          </button>
        </div>

        {/* Right Side Integrations Grid */}
        <div className="flex-1 w-full max-w-lg">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {integrationsList.map((item, idx) => (
              <div
                key={idx}
                className={`glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center aspect-square transition-all duration-300 transform hover:-translate-y-1.5 hover:scale-[1.03] group cursor-pointer border ${isDark
                    ? 'border-white/10 hover:border-white/20 hover:bg-white/5 shadow-[0_4px_12px_rgba(0,0,0,0.2)]'
                    : 'border-[#059669]/10 bg-white/70 hover:border-[#059669]/30 hover:bg-white shadow-sm'
                  }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 border ${item.color}`}>
                  <item.icon size={22} strokeWidth={1.5} />
                </div>
                <span className={`text-xs font-bold transition-colors ${isDark ? 'text-[#8E99A8] group-hover:text-white' : 'text-slate-700 group-hover:text-black'
                  }`}>
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}


