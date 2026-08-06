'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, ThumbsUp, MessageSquare, Eye, ArrowUpRight, 
  Send, Loader2, ArrowLeft, Calendar, Video, Heart, CornerDownRight,
  AlertCircle, Plus, Trash2, Sparkles
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const Youtube = ({ size = 20, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.528 3.545 12 3.545 12 3.545s-7.528 0-9.388.511a3.003 3.003 0 0 0-2.11 2.107A30.213 30.213 0 0 0 0 12c0 1.944.15 3.89.49 5.837a3.003 3.003 0 0 0 2.11 2.107c1.86.51 9.388.51 9.388.51s7.528 0 9.388-.51a3.003 3.003 0 0 0 2.11-2.107A30.213 30.213 0 0 0 24 12a30.213 30.213 0 0 0-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const YouTubeManager = () => {
  const [loading, setLoading] = useState(true);
  const [ytData, setYtData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [replyText, setReplyText] = useState({});
  const [sendingReply, setSendingReply] = useState({});
  const [toast, setToast] = useState(null);
  const [broadcastEnabled, setBroadcastEnabled] = useState(false);
  const [broadcastTemplate, setBroadcastTemplate] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [checkingBroadcast, setCheckingBroadcast] = useState(false);
  const [botEnabled, setBotEnabled] = useState(false);
  const [botBehavior, setBotBehavior] = useState('friendly');
  const [keywordRules, setKeywordRules] = useState([]);
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [newReplyInput, setNewReplyInput] = useState('');
  const [isKeywordSectionOpen, setIsKeywordSectionOpen] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [channelDescription, setChannelDescription] = useState('');
  const [savingDescription, setSavingDescription] = useState(false);

  // Upload video modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadPrivacy, setUploadPrivacy] = useState('public');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState(null);
  const [generatingAI, setGeneratingAI] = useState({});
  const [commentSearch, setCommentSearch] = useState('');
  const router = useRouter();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const headers = { Authorization: `Bearer ${token}` };

      try {
        // Fetch analytics/channel info
        const statsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/youtube/analytics`,
          { headers }
        );
        if (statsRes.data && !statsRes.data.error) {
          setYtData(statsRes.data);
          setChannelDescription(statsRes.data.channel_description || '');
        } else {
          // If not enabled/connected
          showToast('Please connect YouTube channel first.', 'error');
          router.push('/client/channels');
          return;
        }

        // Fetch videos list
        setLoadingVideos(true);
        const videosRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/youtube/videos`,
          { headers }
        );
        if (videosRes.data && videosRes.data.videos) {
          setVideos(videosRes.data.videos);
        }

        // Fetch broadcast & bot settings
        const settingsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/youtube/settings`,
          { headers }
        );
        if (settingsRes.data) {
          setBroadcastEnabled(settingsRes.data.broadcast_enabled);
          setBroadcastTemplate(settingsRes.data.broadcast_template);
          setBotEnabled(settingsRes.data.bot_enabled);
          setBotBehavior(settingsRes.data.bot_behavior || 'friendly');
          setKeywordRules(settingsRes.data.keyword_rules || []);
        }
      } catch (err) {
        console.error('Error fetching YouTube data:', err);
        showToast('Failed to load YouTube content. Check if YouTube is connected.', 'error');
      } finally {
        setLoading(false);
        setLoadingVideos(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/youtube/settings`,
        {
          broadcast_enabled: broadcastEnabled,
          broadcast_template: broadcastTemplate,
          bot_enabled: botEnabled,
          bot_behavior: botBehavior,
          keyword_rules: keywordRules
        },
        { headers }
      );
      if (res.data && !res.data.error) {
        showToast('Settings saved successfully!');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      showToast('Failed to save settings.', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const saveKeywordRules = async (updatedRules) => {
    setSavingSettings(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/youtube/settings`,
        {
          broadcast_enabled: broadcastEnabled,
          broadcast_template: broadcastTemplate,
          bot_enabled: botEnabled,
          bot_behavior: botBehavior,
          keyword_rules: updatedRules
        },
        { headers }
      );
      if (res.data && !res.data.error) {
        showToast('Keyword rule saved successfully!');
        if (res.data.config?.keyword_rules) {
          setKeywordRules(res.data.config.keyword_rules);
        }
      }
    } catch (err) {
      console.error('Error saving keyword rules:', err);
      showToast('Failed to save keyword rules.', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddKeywordRule = async () => {
    if (!newKeywordInput.trim() || !newReplyInput.trim()) {
      showToast('Please enter both keyword(s) and preset reply.', 'error');
      return;
    }
    const newRule = {
      id: Date.now().toString(),
      keywords: newKeywordInput.trim(),
      reply: newReplyInput.trim()
    };
    const updated = [...keywordRules, newRule];
    setKeywordRules(updated);
    setNewKeywordInput('');
    setNewReplyInput('');
    await saveKeywordRules(updated);
  };

  const handleDeleteKeywordRule = async (id) => {
    const updated = keywordRules.filter(r => r.id !== id);
    setKeywordRules(updated);
    await saveKeywordRules(updated);
  };

  const handleSaveDescription = async () => {
    setSavingDescription(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/youtube/profile`,
        { description: channelDescription },
        { headers }
      );
      if (res.data && !res.data.error) {
        showToast('YouTube Channel description updated successfully!');
        setYtData(prev => ({ ...prev, channel_description: channelDescription }));
        setIsEditingDescription(false);
      }
    } catch (err) {
      console.error('Error updating channel profile:', err);
      showToast('Failed to update channel description.', 'error');
    } finally {
      setSavingDescription(false);
    }
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      showToast('Please select a video file to upload.', 'error');
      return;
    }

    setUploadingVideo(true);
    const token = localStorage.getItem('token');
    const headers = { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    };

    const formData = new FormData();
    formData.append('video', uploadFile);
    formData.append('title', uploadTitle);
    formData.append('description', uploadDescription);
    formData.append('privacy_status', uploadPrivacy);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/youtube/upload`,
        formData,
        { headers }
      );
      if (res.data && !res.data.error) {
        showToast('🎥 Video uploaded successfully to YouTube!');
        setIsUploadModalOpen(false);
        // Reset states
        setUploadTitle('');
        setUploadDescription('');
        setUploadFile(null);
        
        // Refresh videos list
        setLoadingVideos(true);
        const videosRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/youtube/videos`,
          { headers }
        );
        if (videosRes.data && videosRes.data.videos) {
          setVideos(videosRes.data.videos);
        }
      }
    } catch (err) {
      console.error('Error uploading video:', err.response?.data || err.message);
      showToast(err.response?.data?.error || 'Failed to upload video to YouTube.', 'error');
    } finally {
      setUploadingVideo(false);
      setLoadingVideos(false);
    }
  };

  const handleDeleteVideo = async (videoId, videoTitle) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${videoTitle}" from YouTube?`)) {
      return;
    }

    setDeletingVideoId(videoId);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/youtube/delete?video_id=${videoId}`,
        { headers }
      );
      if (res.data && !res.data.error) {
        showToast('🗑️ Video deleted successfully from YouTube!');
        setVideos(prev => prev.filter(v => v.id !== videoId));
        if (selectedVideo?.id === videoId) {
          setSelectedVideo(null);
        }
      }
    } catch (err) {
      console.error('Error deleting video:', err);
      showToast(err.response?.data?.error || 'Failed to delete video.', 'error');
    } finally {
      setDeletingVideoId(null);
    }
  };

  const handleCheckBroadcast = async () => {
    setCheckingBroadcast(true);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/youtube/broadcast-check`,
        {},
        { headers }
      );
      if (res.data && !res.data.error) {
        if (res.data.recipients_count !== undefined) {
          showToast(`Broadcast sent to ${res.data.recipients_count} contacts!`);
        } else {
          showToast(res.data.detail || 'Checked for new uploads. No new video found.');
        }
      } else {
        showToast(res.data.error || 'Failed to check broadcast.', 'error');
      }
    } catch (err) {
      console.error('Error checking broadcast:', err);
      showToast(err.response?.data?.error || 'Failed to trigger broadcast check.', 'error');
    } finally {
      setCheckingBroadcast(false);
    }
  };

  const loadComments = async (video) => {
    setSelectedVideo(video);
    setLoadingComments(true);
    setComments([]);
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/youtube/comments?video_id=${video.id}`,
        { headers }
      );
      if (res.data && res.data.comments) {
        setComments(res.data.comments);
      }
    } catch (err) {
      console.error('Error loading comments:', err);
      showToast('Could not load comments for this video.', 'error');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSendReply = async (commentId) => {
    const text = replyText[commentId];
    if (!text || !text.trim()) return;

    setSendingReply(prev => ({ ...prev, [commentId]: true }));
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/youtube/comments`,
        {
          parent_id: commentId,
          reply_text: text
        },
        { headers }
      );
      
      if (res.data && !res.data.error) {
        showToast('Reply posted successfully!');
        // Clear reply text
        setReplyText(prev => ({ ...prev, [commentId]: '' }));
        // Reload comments to see replies
        if (selectedVideo) loadComments(selectedVideo);
      } else {
        showToast(res.data.error || 'Failed to post reply.', 'error');
      }
    } catch (err) {
      console.error('Error posting reply:', err);
      showToast(err.response?.data?.error || 'Error posting reply.', 'error');
    } finally {
      setSendingReply(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const handleAISuggestReply = async (commentId, commentText) => {
    setGeneratingAI(prev => ({ ...prev, [commentId]: true }));
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/youtube/ai-suggest-reply`,
        { comment_text: commentText },
        { headers }
      );
      if (res.data?.suggested_reply) {
        setReplyText(prev => ({ ...prev, [commentId]: res.data.suggested_reply }));
        showToast(`✨ AI reply suggestion generated in ${res.data.behavior || botBehavior} tone!`);
      } else {
        showToast(res.data.error || 'AI could not generate a reply.', 'error');
      }
    } catch (err) {
      console.error('Error generating AI reply:', err);
      showToast(err.response?.data?.error || 'Error generating AI reply.', 'error');
    } finally {
      setGeneratingAI(prev => ({ ...prev, [commentId]: false }));
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="CLIENT">
        <div className="h-[80vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-red-600" size={48} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="CLIENT">
      <div style={{ fontFamily: '"Times New Roman", Times, serif' }} className="max-w-7xl mx-auto pb-20 px-2 sm:px-4 md:px-0">
        
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg border transition-all ${
            toast.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            <AlertCircle size={18} />
            <span className="text-xs font-bold">{toast.msg}</span>
          </div>
        )}

        {/* Back navigation */}
        <button 
          onClick={() => router.push('/client/channels')}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-red-600 font-bold transition-all text-sm group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-all" />
          <span>Back to Integrations</span>
        </button>

        {/* Channel Banner Header */}
        {ytData && (
          <div className="mb-10 p-8 rounded-3xl glass-panel border border-red-100 bg-red-50/10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex items-center gap-5">
                {ytData.channel_thumbnail ? (
                  <img 
                    src={ytData.channel_thumbnail} 
                    alt={ytData.channel_name} 
                    className="w-20 h-20 rounded-full border-4 border-red-500 shadow-md object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center border-4 border-red-500 shadow-md">
                    <Youtube className="text-red-600" size={36} />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3">
                    {ytData.channel_name || 'YouTube Dashboard'}
                    <span className="text-xs font-black px-2 py-1 bg-red-100 text-red-700 rounded-lg uppercase tracking-wider">Active</span>
                  </h1>
                  
                  {isEditingDescription ? (
                    <div className="mt-2 flex flex-col gap-2">
                      <textarea
                        rows={2}
                        value={channelDescription}
                        onChange={(e) => setChannelDescription(e.target.value)}
                        className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-medium"
                      />
                      <div className="flex gap-2">
                        <button
                          disabled={savingDescription}
                          onClick={handleSaveDescription}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold uppercase transition-all"
                        >
                          {savingDescription ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={() => {
                            setChannelDescription(ytData.channel_description || '');
                            setIsEditingDescription(false);
                          }}
                          className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[10px] font-bold uppercase transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 mt-1.5 group/desc max-w-lg">
                      <p className="text-xs sm:text-sm text-slate-500 italic font-medium leading-relaxed">
                        {ytData.channel_description || 'No channel description provided.'}
                      </p>
                      <button
                        onClick={() => setIsEditingDescription(true)}
                        className="p-1 text-slate-400 hover:text-slate-800 transition-colors opacity-0 group-hover/desc:opacity-100"
                        title="Edit Description"
                      >
                        ✏️
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-6 bg-white/70 p-5 rounded-2xl border border-red-100/50 shadow-sm backdrop-blur-sm">
                <div className="text-center px-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Subscribers</span>
                  <span className="text-xl font-black text-red-600">{ytData.subscribers?.toLocaleString() || 0}</span>
                </div>
                <div className="text-center px-4 border-x border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Total Views</span>
                  <span className="text-xl font-black text-slate-800">{ytData.total_views?.toLocaleString() || 0}</span>
                </div>
                <div className="text-center px-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Videos</span>
                  <span className="text-xl font-black text-slate-800">{ytData.video_count?.toLocaleString() || 0}</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Content Section: 4 Rows Vertical Layout */}
        <div className="space-y-10">

          {/* Row 2: Uploaded Videos */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Video size={18} className="text-red-600" />
                <span>Uploads & Performance</span>
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Plus size={14} /> Upload Video
                </button>
                <span className="text-xs text-slate-400 font-bold italic">{videos.length} videos found</span>
              </div>
            </div>

            {loadingVideos ? (
              <div className="h-48 flex items-center justify-center bg-white border border-slate-100 rounded-3xl">
                <Loader2 className="animate-spin text-red-600" size={32} />
              </div>
            ) : videos.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-3xl p-6 text-center">
                <Youtube className="text-slate-200 mb-3" size={48} />
                <p className="text-slate-400 text-sm font-bold">No videos found on this channel.</p>
              </div>
            ) : (
              <div className="flex gap-5 overflow-x-auto pb-4 pt-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                {videos.map((vid) => (
                  <div 
                    key={vid.id}
                    onClick={() => loadComments(vid)}
                    className={`min-w-[280px] max-w-[280px] p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group flex flex-col justify-between shrink-0 snap-start ${
                      selectedVideo?.id === vid.id 
                        ? 'bg-red-50/20 border-red-400 shadow-md ring-2 ring-red-500/10' 
                        : 'bg-white hover:bg-slate-50/50 border-slate-100 hover:shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Video Thumbnail with Play Overlay */}
                      <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-100/50 mb-3">
                        <img 
                          src={vid.thumbnail} 
                          alt={vid.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all flex items-center justify-center">
                          <Play className="text-white opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow" size={28} />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteVideo(vid.id, vid.title);
                          }}
                          disabled={deletingVideoId === vid.id}
                          className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 text-white rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10 shadow-sm"
                          title="Delete Video from YouTube"
                        >
                          {deletingVideoId === vid.id ? (
                            <Loader2 className="animate-spin" size={14} />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>

                      <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-red-700 transition-colors mb-2">
                        {vid.title}
                      </h3>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-50">
                      {/* Stats Row */}
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                        <span className="flex items-center gap-1">
                          <Eye size={12} /> {vid.views?.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp size={12} /> {vid.likes?.toLocaleString()}
                        </span>
                        <span className={`flex items-center gap-1 ${vid.comments > 0 ? 'text-red-600' : ''}`}>
                          <MessageSquare size={12} /> {vid.comments || 0} Comments
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Row 3: YouTube Automation Settings */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Youtube className="text-red-600" size={20} />
                <span>YouTube Automation & AI Bot Control</span>
              </h3>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wider">Configure Automation Mode</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Column 1: WhatsApp Broadcasting */}
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">WhatsApp Broadcast Alert</h4>
                      <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Send alerts to contacts on upload</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        checked={broadcastEnabled}
                        onChange={(e) => setBroadcastEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>

                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    Sends an automated WhatsApp notification to your CRM lead lists when a new video goes live on your channel.
                  </p>
                </div>

                {broadcastEnabled && (
                  <div className="space-y-2 pt-2 border-t border-slate-100/50">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Message Template</label>
                    <textarea 
                      rows={2}
                      value={broadcastTemplate}
                      onChange={(e) => setBroadcastTemplate(e.target.value)}
                      placeholder="🎥 Check out our new video: {title}&#10;Watch here: {url}"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-medium resize-none"
                    />
                    <span className="text-[9px] text-slate-400 font-bold block">Tags: &#123;title&#125;, &#123;url&#125;</span>
                  </div>
                )}
              </div>

              {/* Column 2: AI Reply Mode (Manual vs Auto-Bot) */}
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">AI Reply Operation Mode</h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    Choose whether the AI should answer comments automatically or act as a manual dashboard assistant.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setBotEnabled(false)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                      !botEnabled
                        ? 'bg-red-50 border-red-500 text-red-700 shadow-sm ring-1 ring-red-500/10'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-red-200'
                    }`}
                  >
                    <span className="text-base">✍️</span>
                    <span className="text-[9px] font-black uppercase tracking-wide">Manual Assistant</span>
                    <span className="text-[7.5px] font-bold text-slate-400 leading-tight">AI drafts, you review & send</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBotEnabled(true)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all ${
                      botEnabled
                        ? 'bg-red-50 border-red-500 text-red-700 shadow-sm ring-1 ring-red-500/10'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-red-200'
                    }`}
                  >
                    <span className="text-base">🤖</span>
                    <span className="text-[9px] font-black uppercase tracking-wide">Auto AI Bot</span>
                    <span className="text-[7.5px] font-bold text-slate-400 leading-tight">AI replies automatically</span>
                  </button>
                </div>
              </div>

              {/* Column 3: Bot Tone & Action Buttons */}
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={12} className="text-red-500 animate-pulse" />
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">AI Personality Tone</h4>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                    Configure the wording style for both manual suggestions and automatic auto-replies.
                  </p>

                  <div className="grid grid-cols-3 gap-1.5 mt-2">
                    {[
                      { value: 'concise',      label: 'Concise',      emoji: '⚡' },
                      { value: 'friendly',     label: 'Friendly',     emoji: '😊' },
                      { value: 'professional', label: 'Professional', emoji: '💼' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setBotBehavior(opt.value)}
                        className={`flex flex-col items-center gap-0.5 py-1.5 rounded-lg border text-center transition-all ${
                          botBehavior === opt.value
                            ? 'bg-red-50 border-red-500 text-red-700 font-black shadow-sm ring-1 ring-red-500/10'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-red-200 text-slate-500'
                        }`}
                      >
                        <span className="text-xs">{opt.emoji}</span>
                        <span className="text-[8px] uppercase font-bold tracking-wider">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2 border-t border-slate-100/50">
                  <button 
                    disabled={savingSettings}
                    onClick={handleSaveSettings}
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5"
                  >
                    {savingSettings ? <Loader2 className="animate-spin" size={11} /> : 'Save Setup'}
                  </button>
                  <button 
                    disabled={checkingBroadcast}
                    onClick={handleCheckBroadcast}
                    className="flex-1 py-2.5 bg-red-50 hover:bg-red-100/80 text-red-600 border border-red-100 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5"
                  >
                    {checkingBroadcast ? <Loader2 className="animate-spin" size={11} /> : 'Check Uploads'}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Row 3.5: Custom Keyword Auto-Replies (Collapsible & Compact) */}
          <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-xs transition-all">
            <div 
              onClick={() => setIsKeywordSectionOpen(!isKeywordSectionOpen)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 shrink-0">
                  <Sparkles size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">Custom Keyword Rules</h3>
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-md">
                      {keywordRules.length} Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-normal">Auto-reply preset text for specific matching keywords</p>
                </div>
              </div>

              <button 
                type="button"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>{isKeywordSectionOpen ? 'Hide Rules' : '+ Add / Manage Rules'}</span>
                <span className={`transition-transform duration-200 text-[10px] ${isKeywordSectionOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>
            </div>

            {/* Expandable Content */}
            {isKeywordSectionOpen && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-150">
                {/* Form */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <input 
                    type="text" 
                    value={newKeywordInput}
                    onChange={(e) => setNewKeywordInput(e.target.value)}
                    placeholder="Keywords (e.g. price, cost)"
                    className="sm:w-1/3 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-medium bg-slate-50/50"
                  />
                  <input 
                    type="text" 
                    value={newReplyInput}
                    onChange={(e) => setNewReplyInput(e.target.value)}
                    placeholder="Preset Reply text..."
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-medium bg-slate-50/50"
                  />
                  <button
                    type="button"
                    disabled={savingSettings}
                    onClick={handleAddKeywordRule}
                    className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {savingSettings ? <Loader2 className="animate-spin" size={13} /> : <><Plus size={14} /> Add & Save</>}
                  </button>
                  <button
                    type="button"
                    disabled={savingSettings}
                    onClick={() => saveKeywordRules(keywordRules)}
                    className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {savingSettings ? <Loader2 className="animate-spin" size={13} /> : 'Save Rules'}
                  </button>
                </div>

                {/* Active Rules List */}
                {keywordRules.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Saved Active Rules ({keywordRules.length})
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {keywordRules.map((rule) => (
                        <div key={rule.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start justify-between gap-3 text-xs shadow-2xs">
                          <div className="min-w-0 space-y-1">
                            <span className="text-[10px] font-black uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded tracking-wide inline-block">
                              🔑 {rule.keywords}
                            </span>
                            <p className="text-slate-700 font-medium leading-snug break-words">
                              💬 "{rule.reply}"
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteKeywordRule(rule.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shrink-0 cursor-pointer"
                            title="Delete rule"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Row 4: Engagement Hub & Comments list */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
            
            {/* Header with Search and Dropdown Selector */}
            <div className="border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-red-600" size={20} />
                <div>
                  <h3 className="text-sm font-black text-slate-900">Engagement Hub & Comment Workspace</h3>
                  <p className="text-[9px] text-slate-400 font-bold">Select video and moderate comment threads using RAG AI suggestions</p>
                </div>
              </div>

              {/* Controls: Video Select + Comment Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl justify-end">
                {/* Video Select Dropdown */}
                <select 
                  value={selectedVideo?.id || ''} 
                  onChange={(e) => {
                    const video = videos.find(v => v.id === e.target.value);
                    if (video) loadComments(video);
                  }}
                  className="text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-bold bg-white max-w-xs shrink-0"
                >
                  <option value="">-- Choose Video to Moderate --</option>
                  {videos.map(v => (
                    <option key={v.id} value={v.id}>{v.title}</option>
                  ))}
                </select>

                {/* Comment Search input */}
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">🔍</span>
                  <input 
                    type="text" 
                    placeholder="Search comments by text or username..." 
                    value={commentSearch} 
                    onChange={(e) => setCommentSearch(e.target.value)} 
                    className="w-full text-xs pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {!selectedVideo ? (
              <div className="h-[280px] flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white border border-dashed border-slate-200 rounded-3xl p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-3 shadow-sm">
                  <MessageSquare size={22} />
                </div>
                <h3 className="text-sm font-bold text-slate-700 mb-1">Select a video</h3>
                <p className="text-xs text-slate-400 max-w-md font-medium">
                  Click on any video from the uploads row above, or select one from the dropdown menu to inspect its comments.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden flex flex-col justify-between">
                
                {/* Active Video Header Info */}
                <div className="p-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={selectedVideo.thumbnail} 
                      alt={selectedVideo.title} 
                      className="w-14 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-800 truncate max-w-md">{selectedVideo.title}</h3>
                      <a 
                        href={selectedVideo.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[9px] text-red-600 font-bold hover:underline flex items-center gap-0.5 mt-0.5"
                      >
                        Open on YouTube <ArrowUpRight size={8} />
                      </a>
                    </div>
                  </div>

                  {commentSearch && (
                    <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider shrink-0">
                      Filtered results
                    </span>
                  )}
                </div>

                {/* Comments List Area */}
                <div className="max-h-[450px] overflow-y-auto p-4 space-y-4 scrollbar-thin">
                  {loadingComments ? (
                    <div className="h-32 flex items-center justify-center">
                      <Loader2 className="animate-spin text-red-600" size={24} />
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                      <MessageSquare size={28} className="text-slate-200 mb-2" />
                      <p className="text-xs font-bold">No comments on this video yet.</p>
                    </div>
                  ) : (
                    (() => {
                      const filtered = comments.filter((comment) => 
                        comment.text?.toLowerCase().includes(commentSearch.toLowerCase()) || 
                        comment.author?.toLowerCase().includes(commentSearch.toLowerCase())
                      );

                      if (filtered.length === 0) {
                        return (
                          <div className="h-32 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                            <p className="text-xs font-bold">No comments match your search filter.</p>
                            <button onClick={() => setCommentSearch('')} className="text-[10px] text-red-600 font-black mt-1 hover:underline">
                              Clear Search
                            </button>
                          </div>
                        );
                      }

                      return filtered.map((comment) => (
                        <div key={comment.comment_id} className="space-y-3 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100/60">
                          {/* Author info */}
                          <div className="flex items-center gap-2.5">
                            {comment.author_photo ? (
                              <img 
                                src={comment.author_photo} 
                                alt={comment.author} 
                                className="w-6 h-6 rounded-full border border-slate-100"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                                {comment.author?.charAt(0)}
                              </div>
                            )}
                            <div>
                              <span className="text-xs font-bold text-slate-800 block leading-tight">{comment.author}</span>
                              <span className="text-[9px] font-bold text-slate-400">{new Date(comment.published_at).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Comment text */}
                          <p className="text-xs text-slate-600 leading-relaxed font-medium pl-1 bg-white p-2 rounded-xl border border-slate-50/50 shadow-inner">
                            {comment.text}
                          </p>

                          {/* Existing Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="pl-6 space-y-2 border-l-2 border-slate-100 mt-2">
                              {comment.replies.map((reply) => (
                                <div key={reply.reply_id} className="space-y-1 bg-white p-2 rounded-xl border border-slate-100/60 shadow-sm">
                                  <div className="flex items-center gap-1.5">
                                    {reply.author_photo ? (
                                      <img 
                                        src={reply.author_photo} 
                                        alt={reply.author} 
                                        className="w-4 h-4 rounded-full border border-slate-100"
                                      />
                                    ) : (
                                      <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[7px] font-bold">
                                        {reply.author?.charAt(0)}
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[9px] font-black text-slate-800 leading-tight">{reply.author}</span>
                                      <span className="text-[8px] font-bold text-slate-400">{new Date(reply.published_at).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                  <p className="text-[10px] text-slate-600 leading-relaxed font-medium pl-1">
                                    {reply.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply box */}
                          <div className="flex items-center gap-2 pt-1 border-t border-slate-100/50 pl-2">
                            <CornerDownRight size={12} className="text-slate-400" />
                            <input 
                              type="text" 
                              placeholder={`Write a reply (${botBehavior} AI mode)...`}
                              value={replyText[comment.comment_id] || ''}
                              onChange={(e) => setReplyText(prev => ({ ...prev, [comment.comment_id]: e.target.value }))}
                              onKeyDown={(e) => e.key === 'Enter' && handleSendReply(comment.comment_id)}
                              className="flex-1 bg-transparent text-xs text-slate-800 focus:outline-none placeholder-slate-300 font-bold"
                            />
                            <button 
                              disabled={generatingAI[comment.comment_id]}
                              onClick={() => handleAISuggestReply(comment.comment_id, comment.text)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40"
                              title="AI Suggest Reply"
                            >
                              {generatingAI[comment.comment_id] ? (
                                <Loader2 className="animate-spin" size={14} />
                              ) : (
                                <Sparkles size={14} />
                              )}
                            </button>
                            <button 
                              disabled={sendingReply[comment.comment_id]}
                              onClick={() => handleSendReply(comment.comment_id)}
                              className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-40"
                              title="Send Reply"
                            >
                              {sendingReply[comment.comment_id] ? (
                                <Loader2 className="animate-spin" size={14} />
                              ) : (
                                <Send size={14} />
                              )}
                            </button>
                          </div>
                        </div>
                      ));
                    })()
                  )}
                </div>

                {/* Footer disclaimer info */}
                <div className="p-3 bg-red-50/20 border-t border-slate-100 text-center">
                  <span className="text-[9px] font-bold text-red-700 uppercase tracking-widest">
                    Direct Comment Reply Feature Active
                  </span>
                </div>

              </div>
            )}

          </div>

        </div>

        {/* Upload Video Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl relative space-y-4 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Video size={18} className="text-red-600" />
                  <span>Upload Video to YouTube</span>
                </h3>
                <button 
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUploadVideo} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select Video File</label>
                  <input 
                    type="file" 
                    accept="video/*"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="w-full text-xs text-slate-600 border border-slate-200 rounded-xl p-2.5 focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-red-50 file:text-red-700 hover:file:bg-red-100/80 file:cursor-pointer"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Video Title</label>
                  <input 
                    type="text" 
                    placeholder="Enter video title"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Video Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Enter video description..."
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-medium resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Privacy Status</label>
                  <select 
                    value={uploadPrivacy}
                    onChange={(e) => setUploadPrivacy(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-bold bg-white"
                  >
                    <option value="public">🌐 Public (Everyone can view)</option>
                    <option value="unlisted">🔗 Unlisted (Only people with link)</option>
                    <option value="private">🔒 Private (Only you can view)</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={uploadingVideo}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    {uploadingVideo ? (
                      <>
                        <Loader2 className="animate-spin" size={14} /> Uploading...
                      </>
                    ) : (
                      'Publish Video'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default YouTubeManager;
