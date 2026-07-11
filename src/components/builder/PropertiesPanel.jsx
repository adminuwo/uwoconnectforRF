'use client';

import React from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

export default function PropertiesPanel({ selectedNode, setNodes, closePanel }) {
  if (!selectedNode) return null;

  const updateNodeData = (newData) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === selectedNode.id) {
          return { ...n, data: { ...n.data, ...newData } };
        }
        return n;
      })
    );
  };

  const renderContent = () => {
    switch (selectedNode.type) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Trigger Name</label>
              <input
                type="text"
                value={selectedNode.data.label || ''}
                onChange={(e) => updateNodeData({ label: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 text-sm focus:outline-none focus:border-brand-500"
                placeholder="e.g. Greeting"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Keywords (Comma separated)</label>
              <input
                type="text"
                value={(selectedNode.data.keywords || []).join(', ')}
                onChange={(e) => {
                  const val = e.target.value;
                  const keys = val.split(',').map(k => k.trim()).filter(k => k.length > 0);
                  updateNodeData({ keywords: keys });
                }}
                className="w-full border border-slate-300 rounded p-2 text-sm focus:outline-none focus:border-brand-500"
                placeholder="hello, hi, hey"
              />
              <p className="text-[10px] text-slate-500 mt-1">When user sends any of these, workflow starts.</p>
            </div>
          </div>
        );
      
      case 'message':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Message Text</label>
              <textarea
                rows="4"
                value={selectedNode.data.message || ''}
                onChange={(e) => updateNodeData({ message: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 text-sm focus:outline-none focus:border-brand-500"
                placeholder="Type your message here..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Media URL (Optional)</label>
              <input
                type="text"
                value={selectedNode.data.mediaUrl || ''}
                onChange={(e) => updateNodeData({ mediaUrl: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 text-sm focus:outline-none focus:border-brand-500"
                placeholder="https://example.com/image.png"
              />
            </div>
          </div>
        );

      case 'buttons':
        const buttons = selectedNode.data.buttons || [];
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Message Text</label>
              <textarea
                rows="3"
                value={selectedNode.data.message || ''}
                onChange={(e) => updateNodeData({ message: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 text-sm focus:outline-none focus:border-brand-500"
                placeholder="Choose an option below:"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">Buttons (Max 3)</label>
              <div className="space-y-2">
                {buttons.map((btn, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={btn}
                      onChange={(e) => {
                        const newBtns = [...buttons];
                        newBtns[idx] = e.target.value;
                        updateNodeData({ buttons: newBtns });
                      }}
                      className="flex-1 border border-slate-300 rounded p-2 text-sm focus:outline-none focus:border-brand-500"
                      placeholder={`Button ${idx + 1}`}
                    />
                    <button 
                      onClick={() => {
                        const newBtns = buttons.filter((_, i) => i !== idx);
                        updateNodeData({ buttons: newBtns });
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              {buttons.length < 3 && (
                <button 
                  onClick={() => updateNodeData({ buttons: [...buttons, `Option ${buttons.length + 1}`] })}
                  className="mt-2 text-xs text-brand-600 font-medium flex items-center gap-1 hover:text-brand-700"
                >
                  <Plus size={14} /> Add Button
                </button>
              )}
            </div>
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Condition Expression</label>
              <input
                type="text"
                value={selectedNode.data.condition || ''}
                onChange={(e) => updateNodeData({ condition: e.target.value })}
                className="w-full border border-slate-300 rounded p-2 text-sm focus:outline-none focus:border-brand-500 font-mono"
                placeholder="tag = VIP"
              />
              <p className="text-[10px] text-slate-500 mt-1">Example: <code className="bg-slate-100 px-1 rounded">tag = VIP</code> or <code className="bg-slate-100 px-1 rounded">stage = WON</code></p>
            </div>
          </div>
        );

      case 'handoff':
        return (
          <div className="text-sm text-slate-600">
            No configuration needed. This node automatically stops the bot and routes the conversation to the team's inbox.
          </div>
        );

      default:
        return <div className="text-sm text-slate-500">Select a node to configure its properties.</div>;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-slate-200 h-full flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-20 absolute right-0 top-0">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <h3 className="font-semibold text-slate-800 capitalize">{selectedNode.type} Settings</h3>
        <button onClick={closePanel} className="text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}
