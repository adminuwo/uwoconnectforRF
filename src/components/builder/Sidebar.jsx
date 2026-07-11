'use client';

import React from 'react';
import { Zap, MessageSquare, Target, UserPlus, HelpCircle } from 'lucide-react';

export default function Sidebar() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full z-10 shadow-sm relative">
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-800">Nodes</h3>
        <p className="text-xs text-slate-500 mt-1">Drag and drop to build workflow.</p>
      </div>
      
      <div className="p-4 space-y-3 overflow-y-auto">
        <div 
          className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded cursor-grab hover:bg-slate-100 transition-colors"
          onDragStart={(event) => onDragStart(event, 'trigger')}
          draggable
        >
          <div className="p-2 bg-amber-100 rounded-lg"><Zap size={16} className="text-amber-600" /></div>
          <div>
            <div className="text-sm font-medium text-slate-700">Trigger</div>
            <div className="text-[10px] text-slate-500">Starts the flow</div>
          </div>
        </div>

        <div 
          className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded cursor-grab hover:bg-slate-100 transition-colors"
          onDragStart={(event) => onDragStart(event, 'message')}
          draggable
        >
          <div className="p-2 bg-emerald-100 rounded-lg"><MessageSquare size={16} className="text-emerald-600" /></div>
          <div>
            <div className="text-sm font-medium text-slate-700">Send Message</div>
            <div className="text-[10px] text-slate-500">Text, image, or video</div>
          </div>
        </div>

        <div 
          className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded cursor-grab hover:bg-slate-100 transition-colors"
          onDragStart={(event) => onDragStart(event, 'buttons')}
          draggable
        >
          <div className="p-2 bg-blue-100 rounded-lg"><Target size={16} className="text-blue-600" /></div>
          <div>
            <div className="text-sm font-medium text-slate-700">Buttons</div>
            <div className="text-[10px] text-slate-500">Interactive choices</div>
          </div>
        </div>

        <div 
          className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded cursor-grab hover:bg-slate-100 transition-colors"
          onDragStart={(event) => onDragStart(event, 'condition')}
          draggable
        >
          <div className="p-2 bg-purple-100 rounded-lg"><HelpCircle size={16} className="text-purple-600" /></div>
          <div>
            <div className="text-sm font-medium text-slate-700">Condition</div>
            <div className="text-[10px] text-slate-500">Branch based on tags</div>
          </div>
        </div>

        <div 
          className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded cursor-grab hover:bg-slate-100 transition-colors"
          onDragStart={(event) => onDragStart(event, 'handoff')}
          draggable
        >
          <div className="p-2 bg-rose-100 rounded-lg"><UserPlus size={16} className="text-rose-600" /></div>
          <div>
            <div className="text-sm font-medium text-slate-700">Agent Handoff</div>
            <div className="text-[10px] text-slate-500">Transfer to human</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
