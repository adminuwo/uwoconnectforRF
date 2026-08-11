"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Search,
  Loader2,
  User,
  Phone,
  Mail,
  MapPin,
  Send,
  Plus,
  MoreHorizontal,
  Filter,
  Smile,
  Paperclip,
  Zap,
  ArrowLeft,
  Check,
  CheckCheck,
  Archive,
  Sparkles,
  Lock,
  FileText,
  Download,
  Image as ImageIcon,
  Music,
  Film,
  ExternalLink,
  ShieldAlert,
  ArrowRightLeft,
  History,
  StickyNote,
} from "lucide-react";
import axios from "axios";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { cn } from "@/lib/utils";
const channelBadges = {
  WHATSAPP: { bg: "bg-emerald-100", text: "text-emerald-700" },
  INSTAGRAM: { bg: "bg-pink-100", text: "text-pink-700" },
  FACEBOOK: { bg: "bg-blue-100", text: "text-blue-700" },
  TELEGRAM: { bg: "bg-sky-100", text: "text-sky-700" },
  GMAIL: { bg: "bg-rose-100", text: "text-rose-700" },
};

const ClientInboxPage = () => {
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConvoId, setSelectedConvoId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [activeChannelFilter, setActiveChannelFilter] = useState("ALL");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSyncingGmail, setIsSyncingGmail] = useState(false);
  const [livePresence, setLivePresence] = useState({});
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const scrollRef = useRef(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const [msgRes, contactRes] = await Promise.all([
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/messages/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/contacts/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      ]);
      setMessages(msgRes.data);
      setContacts(contactRes.data);
      if (msgRes.data.length > 0 && !selectedConvoId) {
        const firstSender = [
          ...new Set(msgRes.data.map((m) => m.from_address)),
        ][0];
        setSelectedConvoId(firstSender);
      }
    } catch (err) {
      console.warn("Failed to fetch messages and contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-poll every 3 seconds so new messages load live without page refresh
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [selectedConvoId]);

  // Normalize contact string (e.g. phone numbers or handles)
  const normalizeContactId = (rawId) => {
    if (!rawId) return "Unknown";
    const digits = rawId.replace(/[^0-9]/g, "");
    return digits || rawId;
  };

  // Group messages into structured conversation threads
  const groupedConversations = messages.reduce((acc, msg) => {
    const rawContact =
      msg.message_type === "INCOMING" ? msg.from_address : msg.to_address;
    const contactKey = normalizeContactId(rawContact);

    if (!acc[contactKey]) {
      const contactObj = contacts.find(
        (c) =>
          normalizeContactId(c.platform_id || c.phone_number) === contactKey,
      );
      acc[contactKey] = {
        id: contactKey,
        name:
          contactObj?.name ||
          (rawContact.startsWith("+") ? rawContact : `+${rawContact}`),
        rawAddress: rawContact,
        lastMessage: msg.body || "📎 [Attachment]",
        time: msg.created_at,
        unread: msg.message_type === "INCOMING" ? 1 : 0,
        channel: msg.channel || "WHATSAPP",
        assignedTo: contactObj?.assigned_to || null,
        isLocked: false,
        lockedBy: null,
        status: "OPEN",
        contactObj,
        messages: [],
      };
    }
    // Deduplicate by message ID, temp ID, or exact body + timestamp proximity
    const isDuplicate = acc[contactKey].messages.some(
      (m) =>
        m.id === msg.id ||
        (m.id?.startsWith("temp_") && m.body === msg.body) ||
        (m.body === msg.body &&
          Math.abs(new Date(m.created_at) - new Date(msg.created_at)) < 3000),
    );

    if (!isDuplicate) {
      acc[contactKey].messages.push(msg);
      acc[contactKey].messages.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      );
    }

    if (new Date(msg.created_at) > new Date(acc[contactKey].time)) {
      acc[contactKey].lastMessage = msg.body || "📎 [Attachment]";
      acc[contactKey].time = msg.created_at;
      acc[contactKey].channel = msg.channel || "WHATSAPP";
    }
    return acc;
  }, {});

  const convoList = Object.values(groupedConversations)
    .filter(
      (c) =>
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter(
      (c) => activeChannelFilter === "ALL" || c.channel === activeChannelFilter,
    )
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  const activeConvo =
    convoList.find((c) => c.id === selectedConvoId) ||
    (convoList.length > 0 ? convoList[0] : null);

  // 2. Real-Time WebSocket Connection & Event Handlers
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let wsUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";
    wsUrl = wsUrl.replace(/^http/, "ws") + `/ws/inbox/?token=${token}`;

    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "new_message") {
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === data.message.id)) return prev;
            return [...prev, data.message];
          });
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.onerror = (err) => {
      console.warn("WebSocket error:", err);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleTakeover = () => {
    alert("Takeover functionality is coming soon!");
  };

  const fetchAuditLogs = () => {
    alert("Audit logs are coming soon!");
  };

  const activeContact = contacts.find(
    (c) =>
      c.platform_id === selectedConvoId || c.phone_number === selectedConvoId,
  );

  const handleToggleBot = async (contact) => {
    if (!contact) return;
    const targetState = !contact.bot_paused;
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/contacts/${contact.id}/`,
        { bot_paused: targetState },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setContacts((prev) =>
        prev.map((c) =>
          c.id === contact.id ? { ...c, bot_paused: targetState } : c,
        ),
      );
    } catch (err) {
      console.warn("Failed to toggle bot:", err);
      alert("Failed to toggle bot");
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedConvoId, messages]);

  const handleTyping = (text) => {
    setReplyText(text);
  };

  const handleSendMessage = async () => {
    if (!replyText.trim() || !activeConvo || isSending) return;

    const textToSend = replyText.trim();
    setReplyText(""); // Clear input
    setIsSending(true);

    const nowTs = Date.now();
    const targetAddress = activeConvo.rawAddress || activeConvo.id;
    const optimisticMsg = {
      id: `temp_${nowTs}`,
      from_address: (typeof window !== "undefined" && localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).username || "SYSTEM" : "SYSTEM",
      to_address: targetAddress,
      body: textToSend,
      channel: activeConvo.channel,
      message_type: isInternalNote ? "INTERNAL" : "OUTGOING",
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";

      const res = await axios.post(
        `${apiUrl}/api/messages/`,
        {
          to_number: targetAddress,
          body: textToSend,
          channel: activeConvo.channel,
          message_type: isInternalNote ? "INTERNAL" : "OUTGOING",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data) {
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMsg.id ? res.data : m)),
        );
      }
      fetchData();
    } catch (err) {
      console.warn("Failed to send message:", err);
      alert("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestDraft = async () => {
    if (!activeContact) return;
    setIsDrafting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/messages/suggest_draft/`,
        {
          contact_id: activeContact.id,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setReplyText(res.data.draft || "");
    } catch (err) {
      console.warn("Failed to get draft:", err);
      alert("Failed to generate draft");
    } finally {
      setIsDrafting(false);
    }
  };

  const handleArchive = async () => {
    if (!activeContact) return;
    try {
      const token = localStorage.getItem("token");
      const newState = !activeContact.is_archived;
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/contacts/${activeContact.id}/`,
        {
          is_archived: newState,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setContacts((prev) =>
        prev.map((c) =>
          c.id === activeContact.id ? { ...c, is_archived: newState } : c,
        ),
      );
    } catch (err) {
      console.warn("Failed to archive contact:", err);
      alert("Failed to archive");
    }
  };

  const handleSyncGmail = async () => {
    setIsSyncingGmail(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/auth/gmail/sync`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.synced_count > 0) {
        const msgRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/api/messages/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setMessages(msgRes.data);
        alert(`Successfully synced ${res.data.synced_count} new messages!`);
      } else {
        alert("No new messages found.");
      }
    } catch (err) {
      console.warn("Failed to sync gmail:", err);
      alert("Failed to sync Gmail. Make sure it's connected.");
    } finally {
      setIsSyncingGmail(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 overflow-hidden">
        {/* ========================================================================= */}
        {/* MAIN WORKSPACE split: SIDEBAR & LIVE CHAT MONITOR WINDOW                   */}
        {/* ========================================================================= */}
        <div className="flex-1 flex overflow-hidden">
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT SIDEBAR: CONVERSATIONS LIST & FILTERS                             */}
          {/* ----------------------------------------------------------------------- */}
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT SIDEBAR: CONVERSATIONS LIST & FILTERS                             */}
          {/* ----------------------------------------------------------------------- */}
          <div
            className={`w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col ${
              mobileShowChat ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Search & Channel Filter */}
            <div className="p-3.5 border-b border-slate-200 space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customer, phone or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Social Channels Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
                {[
                  "ALL",
                  "WHATSAPP",
                  "INSTAGRAM",
                  "FACEBOOK",
                  "TELEGRAM",
                  "GMAIL",
                ].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setActiveChannelFilter(ch)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wider transition-all uppercase whitespace-nowrap ${
                      activeChannelFilter === ch
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {loading ? (
                <div className="flex items-center justify-center h-48 text-emerald-600">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : convoList.length > 0 ? (
                convoList.map((convo) => {
                  const isSelected = convo.id === activeConvo?.id;
                  const channelInfo =
                    channelBadges[convo.channel] || channelBadges.WHATSAPP;
                  const liveState = livePresence[convo.id];

                  return (
                    <div
                      key={convo.id}
                      onClick={() => {
                        setSelectedConvoId(convo.id);
                        setMobileShowChat(true);
                      }}
                      className={`p-4 cursor-pointer transition-all border-l-4 ${
                        isSelected
                          ? "bg-emerald-50/80 border-emerald-500"
                          : "border-transparent hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                              {convo.name.charAt(0).toUpperCase()}
                            </div>
                            <span
                              className={`absolute -bottom-1 -right-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-2xs ${channelInfo.bg} ${channelInfo.text}`}
                            >
                              {convo.channel.slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              {convo.name}
                              {convo.isLocked && (
                                <Lock
                                  className="w-3 h-3 text-amber-500"
                                  title="Locked by team handler"
                                />
                              )}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {liveState?.isTyping ? (
                                <span className="text-emerald-600 font-bold animate-pulse">
                                  ✍️ {liveState.typingUser || "Employee"} is
                                  typing...
                                </span>
                              ) : (
                                convo.lastMessage
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(convo.time).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {liveState?.viewer && (
                            <div className="mt-1 flex justify-end">
                              <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 font-bold">
                                🟢 {liveState.viewer}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No conversations match filters.
                </div>
              )}
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT MAIN WINDOW: LIVE CHAT & ADMIN MONITORING PANEL                    */}
          {/* ----------------------------------------------------------------------- */}
          {activeConvo ? (
            <div
              className={`flex-1 flex flex-col bg-emerald-50/20 ${
                mobileShowChat ? "flex" : "hidden md:flex"
              }`}
            >
              {/* Live Chat Header & Control Bar */}
              <div className="bg-white border-b border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                {/* Customer Details & Live Indicator */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                    {activeConvo.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {activeConvo.name}
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {activeConvo.channel}
                      </span>
                    </h3>
                    <div className="flex items-center gap-2 text-xs mt-0.5">
                      {livePresence[activeConvo.id]?.isTyping ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1 animate-pulse">
                          ✍️{" "}
                          {livePresence[activeConvo.id]?.typingUser || "Abha"}{" "}
                          is typing...
                        </span>
                      ) : livePresence[activeConvo.id]?.viewer ? (
                        <span className="text-blue-600 font-semibold flex items-center gap-1">
                          🟢 {livePresence[activeConvo.id]?.viewer} is viewing
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">
                          👀 Admin & Team Watching
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <button className="hover:text-slate-900 transition-colors">
                      <Zap size={18} />
                    </button>
                    <button className="hover:text-slate-900 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>

                {/* Active Handler & Admin Actions */}
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shadow-sm">
                      <Lock className="w-3 h-3" />
                      <span>
                        Handling: <strong>Abha Patel</strong>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTakeover}
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3 h-3" />
                      Take Over
                    </button>

                    <button
                      onClick={() => setIsTransferModalOpen(true)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all flex items-center gap-1"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      Transfer
                    </button>

                    <button
                      onClick={fetchAuditLogs}
                      className="p-1.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 transition-colors"
                      title="Inspect Audit Log"
                    >
                      <History className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {activeContact?.bot_paused && (
                <div className="bg-rose-50 border-b border-rose-100 px-8 py-3.5 flex items-center justify-between z-10 animate-in slide-in-from-top duration-350 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🤖</span>
                    <span className="text-xs font-black text-rose-700 uppercase tracking-wider">
                      Auto-Bot is Paused — Human Agent Mode Active
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleBot(activeContact)}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm transition-all"
                  >
                    Resume Bot
                  </button>
                </div>
              )}

              {/* Timeline Messages View */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4"
              >
                {activeConvo.messages && activeConvo.messages.length > 0 ? (
                  activeConvo.messages.map((msg, index) => {
                    const isIncoming = msg.message_type === "INCOMING";
                    const isInternal = msg.message_type === "INTERNAL";
                    const meta = msg.metadata || {};
                    const payload = meta.payload || meta.message || meta;
                    const payloadType =
                      payload.type || meta.type || msg.message_type;
                    const isDoc =
                      payloadType === "document" || payloadType === "file";
                    const isImg = payloadType === "image";
                    const isAudio = payloadType === "audio";
                    const filename =
                      payload.document?.filename ||
                      payload.file?.filename ||
                      "Attachment";
                    const downloadUrl =
                      payload.document?.link ||
                      payload.image?.link ||
                      payload.audio?.link ||
                      payload.document?.url ||
                      payload.image?.url ||
                      payload.audio?.url ||
                      null;

                    if (isInternal) {
                      return (
                        <div
                          key={msg.id || index}
                          className="my-3 flex justify-center"
                        >
                          <div className="max-w-md bg-amber-50 border border-amber-200 rounded-xl p-3 shadow-xs">
                            <div className="flex items-center justify-between gap-2 text-xs font-bold text-amber-900 mb-1">
                              <span className="flex items-center gap-1.5">
                                <StickyNote className="w-3.5 h-3.5 text-amber-600" />
                                Internal Private Note •{" "}
                                {msg.sender_name || "Abha Patel"}
                              </span>
                              <span className="text-[10px] font-normal text-amber-700">
                                {new Date(msg.created_at).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" },
                                )}
                              </span>
                            </div>
                            <p className="text-xs text-amber-950 font-medium">
                              {msg.body}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={msg.id || i}
                        className={cn(
                          "flex flex-col",
                          isIncoming ? "items-start" : "items-end",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] md:max-w-[65%] p-2.5 px-4 rounded-2xl text-xs md:text-sm leading-snug shadow-2xs break-words whitespace-pre-wrap",
                            msg.message_type === "INTERNAL"
                              ? "bg-amber-100 text-amber-900 rounded-br-none border border-amber-200"
                              : isIncoming
                                ? "bg-white text-slate-700 rounded-bl-none border border-slate-100"
                                : "bg-emerald-600 text-white rounded-br-none shadow-emerald-100",
                          )}
                        >
                          {msg.message_type === "INTERNAL" && (
                            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-700 mb-1">
                              <Lock size={10} /> Internal Note
                            </div>
                          )}

                          {/* Rich Document Card */}
                          {isDoc && (
                            <div className="mb-2 p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 flex items-center gap-3 text-slate-800">
                              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                                <FileText size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">
                                  {filename}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium">
                                  Document Attachment
                                </p>
                              </div>
                              {downloadUrl && (
                                <a
                                  href={downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1 text-xs font-bold shrink-0 shadow-xs"
                                >
                                  <Download size={13} />
                                  <span>Download</span>
                                </a>
                              )}
                            </div>
                          )}

                          {/* Rich Image Preview */}
                          {isImg && (
                            <div className="mb-2 rounded-xl overflow-hidden border border-slate-200/60 bg-slate-100 max-w-xs">
                              {downloadUrl ? (
                                <a
                                  href={downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block relative group"
                                >
                                  <img
                                    src={downloadUrl}
                                    alt="Received attachment"
                                    className="w-full h-auto max-h-60 object-cover"
                                  />
                                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                                    <Download size={16} /> View Image
                                  </div>
                                </a>
                              ) : (
                                <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                                  <ImageIcon
                                    size={18}
                                    className="text-slate-400"
                                  />{" "}
                                  Photo Attachment
                                </div>
                              )}
                            </div>
                          )}

                          {/* Rich Audio Player */}
                          {isAudio && downloadUrl && (
                            <div className="mb-2">
                              <audio controls className="w-full max-w-xs h-9">
                                <source src={downloadUrl} />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          )}

                          {/* Message Body text if not redundant */}
                          {!isDoc &&
                            !isImg &&
                            (msg.body || "📎 [Media Attachment]")}
                          {(isDoc || isImg) && meta.document?.caption && (
                            <p className="mt-1 text-xs font-medium">
                              {meta.document.caption}
                            </p>
                          )}
                        </div>

                        {/* WhatsApp Media (Image) */}
                        {msg.metadata?.payload?.type === "image" &&
                          msg.metadata?.payload?.image?.link && (
                            <div className="mt-2 max-w-[85%] md:max-w-[70%]">
                              <img
                                src={msg.metadata.payload.image.link}
                                alt="Media"
                                className="rounded-[16px] border border-slate-100 shadow-sm max-h-60 object-cover"
                              />
                            </div>
                          )}

                        {/* WhatsApp Buttons */}
                        {msg.metadata?.payload?.interactive?.action
                          ?.buttons && (
                          <div
                            className={cn(
                              "flex flex-col gap-1.5 mt-2 w-full max-w-[85%] md:max-w-[70%]",
                              isIncoming ? "items-start" : "items-end",
                            )}
                          >
                            {msg.metadata.payload.interactive.action.buttons.map(
                              (btn, idx) => (
                                <div
                                  key={idx}
                                  className="w-full text-center py-2.5 px-4 bg-white border border-emerald-100 hover:bg-emerald-50 rounded-xl text-emerald-600 text-sm font-bold shadow-sm transition-colors cursor-default"
                                >
                                  {btn.reply.title}
                                </div>
                              ),
                            )}
                          </div>
                        )}

                        {/* Facebook/Instagram Quick Replies */}
                        {msg.metadata?.message?.quick_replies && (
                          <div
                            className={cn(
                              "flex flex-col gap-1.5 mt-2 w-full max-w-[85%] md:max-w-[70%]",
                              isIncoming ? "items-start" : "items-end",
                            )}
                          >
                            {msg.metadata.message.quick_replies.map(
                              (btn, idx) => (
                                <div
                                  key={idx}
                                  className="w-full text-center py-2.5 px-4 bg-white border border-blue-100 hover:bg-blue-50 rounded-xl text-blue-600 text-sm font-bold shadow-sm transition-colors cursor-default"
                                >
                                  {btn.title}
                                </div>
                              ),
                            )}
                          </div>
                        )}

                        <div className="mt-2 flex items-center gap-2 px-1">
                          <p className="text-[9px] font-bold text-slate-300 uppercase">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {!isIncoming && (
                            <CheckCheck
                              size={12}
                              className="text-emerald-500"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400">
                    <p className="text-sm font-medium">
                      No messages yet in this conversation.
                    </p>
                  </div>
                )}
              </div>

              {/* Composer Box (Public Reply vs Internal Note) */}
              <div className="bg-white border-t border-slate-200 p-4 space-y-3">
                {/* Note Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsInternalNote(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        !isInternalNote
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      Public Reply
                    </button>
                    <button
                      onClick={() => setIsInternalNote(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        isInternalNote
                          ? "bg-amber-500 text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <StickyNote className="w-3.5 h-3.5" />
                      Internal Private Note
                    </button>
                  </div>
                </div>

                {/* Text input area */}
                <div className="flex items-end gap-2">
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={
                      isInternalNote
                        ? "Add private internal note visible only to team..."
                        : "Type reply..."
                    }
                    className="flex-1 bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!replyText.trim() || isSending}
                    className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  {activeContact && (
                    <button
                      onClick={() => handleToggleBot(activeContact)}
                      className={cn(
                        "w-full py-2 px-3 border rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer",
                        activeContact.bot_paused
                          ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100/50"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50",
                      )}
                    >
                      <Zap
                        size={13}
                        className={
                          activeContact.bot_paused
                            ? "text-rose-600 animate-pulse"
                            : "text-slate-400"
                        }
                      />
                      {activeContact.bot_paused
                        ? "Resume Auto-Bot"
                        : "Pause Auto-Bot"}
                    </button>
                  )}
                  {activeContact && (
                    <button
                      onClick={handleArchive}
                      className={cn(
                        "w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer",
                        activeContact.is_archived
                          ? "text-amber-600"
                          : "text-slate-700",
                      )}
                    >
                      <Archive
                        size={13}
                        className={
                          activeContact.is_archived
                            ? "text-amber-600"
                            : "text-slate-400"
                        }
                      />
                      {activeContact.is_archived
                        ? "Unarchive Convo"
                        : "Archive Convo"}
                    </button>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Priority", "WhatsApp", "Support"].map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[9px] font-extrabold uppercase tracking-wider border border-emerald-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center opacity-20 grayscale">
              <User size={36} />
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ClientInboxPage;
