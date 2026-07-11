'use client';

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Copy, Check, Trash2, Mail, Shield } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const TeamPage = () => {
  const [agents, setAgents] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/members/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAgents(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        window.location.href = '/auth/login';
      } else {
        console.error(err.message || 'Failed to fetch team');
      }
    }
  };

  const fetchInvites = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/invites/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInvites(res.data);
    } catch (err) {
      if (err.response?.status !== 401) {
        console.error(err.message || 'Failed to fetch invites');
      }
    }
  };

  useEffect(() => {
    Promise.all([fetchTeam(), fetchInvites()]).then(() => setLoading(false));
  }, []);

  const handleGenerateInvite = async () => {
    if (!inviteEmail) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/invites/`, {
        email: inviteEmail
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const link = `${window.location.origin}/auth/register?invite_token=${res.data.token}`;
      setGeneratedLink(link);
      fetchInvites();
    } catch (err) {
      console.error('Failed to generate invite');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleRemoveAgent = async (id) => {
      if(!confirm("Are you sure you want to remove this agent?")) return;
      try {
          const token = localStorage.getItem('token');
          await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/members/${id}/`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          fetchTeam();
      } catch (err) {
          console.error(err);
      }
  };
  
  const handleCancelInvite = async (id) => {
      try {
          const token = localStorage.getItem('token');
          await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/invites/?id=${id}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          fetchInvites();
      } catch (err) {
          console.error(err);
      }
  };

  return (
    <DashboardLayout role="CLIENT">
      <div className="p-6 md:p-8 w-full space-y-8 font-sans animate-in fade-in duration-500 bg-white min-h-screen text-slate-900 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Team Management</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Manage Workspace Agents</p>
        </div>
        <button 
          onClick={() => {
            setIsModalOpen(true);
            setGeneratedLink('');
            setInviteEmail('');
            setCopied(false);
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg flex items-center gap-2"
        >
          <UserPlus size={16} />
          Invite Agent
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-bold">Loading team...</div>
      ) : (
        <div className="space-y-8">
            
          {/* Active Agents */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
              <Users size={18} className="text-emerald-600" />
              Active Agents
            </h2>
            {agents.length === 0 ? (
                <p className="text-slate-500 text-sm">No active agents found.</p>
            ) : (
                <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                    <tr className="border-b border-slate-100">
                        <th className="pb-3 font-bold text-slate-400 uppercase tracking-wider text-xs">Name</th>
                        <th className="pb-3 font-bold text-slate-400 uppercase tracking-wider text-xs">Email</th>
                        <th className="pb-3 font-bold text-slate-400 uppercase tracking-wider text-xs">Role</th>
                        <th className="pb-3 font-bold text-slate-400 uppercase tracking-wider text-xs text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {agents.map((agent) => (
                        <tr key={agent.id} className="group">
                        <td className="py-4 font-bold text-slate-900">{agent.name || agent.first_name || 'N/A'}</td>
                        <td className="py-4 text-slate-600">{agent.email}</td>
                        <td className="py-4">
                            <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-max">
                                <Shield size={10} />
                                {agent.role}
                            </span>
                        </td>
                        <td className="py-4 text-right">
                            <button onClick={() => handleRemoveAgent(agent.id)} className="text-red-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={16} />
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
          </div>

          {/* Pending Invites */}
          {invites.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm opacity-80">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-6">
                <Mail size={18} className="text-orange-500" />
                Pending Invites
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                        <tr className="border-b border-slate-100">
                            <th className="pb-3 font-bold text-slate-400 uppercase tracking-wider text-xs">Email</th>
                            <th className="pb-3 font-bold text-slate-400 uppercase tracking-wider text-xs">Expires At</th>
                            <th className="pb-3 font-bold text-slate-400 uppercase tracking-wider text-xs text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                        {invites.map((invite) => (
                            <tr key={invite.id} className="group">
                            <td className="py-4 font-bold text-slate-900">{invite.email}</td>
                            <td className="py-4 text-slate-500">{new Date(invite.expires_at).toLocaleDateString()}</td>
                            <td className="py-4 text-right">
                                <button onClick={() => handleCancelInvite(invite.id)} className="text-red-400 hover:text-red-600 p-2 transition-opacity text-xs font-bold uppercase tracking-widest">
                                Cancel
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}

        </div>
      )}

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Invite Agent</h2>
            <p className="text-slate-500 text-sm mb-6">Generate an invite link for a new team member.</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Agent Email</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="agent@company.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {!generatedLink ? (
                <button
                  onClick={handleGenerateInvite}
                  disabled={!inviteEmail}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-md"
                >
                  Generate Invite Link
                </button>
              ) : (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 space-y-3">
                  <p className="text-emerald-800 text-xs font-bold uppercase tracking-widest">Share this link:</p>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={generatedLink}
                      className="flex-1 bg-white border border-emerald-200 rounded-lg px-3 py-2 text-xs text-emerald-900 outline-none"
                    />
                    <button 
                      onClick={copyToClipboard}
                      className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 w-full text-slate-500 hover:text-slate-700 font-bold py-2 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
};

export default TeamPage;
