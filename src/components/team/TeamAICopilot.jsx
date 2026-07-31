'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, Send, FileText, AlertTriangle, CheckSquare } from 'lucide-react';
import axios from 'axios';

export default function TeamAICopilot() {
  const [prompt, setPrompt] = useState('');
  const [action, setAction] = useState('GENERATE_TASK');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRunAI = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/ai-copilot/`,
        { action, prompt: prompt.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResponse(res.data.result || 'No response generated.');
    } catch (err) {
      console.error('AI Copilot error:', err);
      setResponse('Failed to generate AI analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-2xs space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            AI Enterprise Copilot <Sparkles size={16} className="text-amber-500" />
          </h3>
          <p className="text-xs text-slate-400">Automate task scoping, daily report summaries, and blocker resolution</p>
        </div>
      </div>

      {/* Action Selector */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <button
          type="button"
          onClick={() => setAction('GENERATE_TASK')}
          className={`p-3 rounded-2xl border text-left font-semibold flex items-center gap-2 transition-all ${
            action === 'GENERATE_TASK'
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckSquare size={16} className="text-indigo-500" />
          <span>Task Breakdown Builder</span>
        </button>

        <button
          type="button"
          onClick={() => setAction('SUMMARIZE_REPORTS')}
          className={`p-3 rounded-2xl border text-left font-semibold flex items-center gap-2 transition-all ${
            action === 'SUMMARIZE_REPORTS'
              ? 'bg-purple-50 border-purple-200 text-purple-700 shadow-2xs'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText size={16} className="text-purple-500" />
          <span>Daily Report Summarizer</span>
        </button>

        <button
          type="button"
          onClick={() => setAction('DETECT_BLOCKERS')}
          className={`p-3 rounded-2xl border text-left font-semibold flex items-center gap-2 transition-all ${
            action === 'DETECT_BLOCKERS'
              ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-2xs'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle size={16} className="text-rose-500" />
          <span>Blocker & Delay Resolver</span>
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleRunAI} className="flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            action === 'GENERATE_TASK'
              ? 'e.g. Build Payment Gateway integration with webhooks...'
              : action === 'SUMMARIZE_REPORTS'
              ? 'e.g. Summarize today\'s engineering team progress...'
              : 'e.g. Backend deploy failing with timeout...'
          }
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium flex items-center gap-2 shrink-0 shadow-md shadow-indigo-200 transition-all disabled:opacity-50 text-xs"
        >
          <Sparkles size={15} />
          <span>{isLoading ? 'Thinking...' : 'Generate with AI'}</span>
        </button>
      </form>

      {/* Result Output */}
      {response && (
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">AI Enterprise Output</span>
          <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-mono">
            {response}
          </div>
        </div>
      )}
    </div>
  );
}
