'use client';

import React from 'react';
import { Handle, Position } from 'reactflow';
import { MessageSquare, Zap, Target, UserPlus, HelpCircle } from 'lucide-react';

const BaseNode = ({ icon, title, content, children }) => (
  <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden w-64">
    <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center gap-2">
      {icon}
      <span className="font-medium text-slate-800 text-sm">{title}</span>
    </div>
    <div className="p-3">
      {content && <p className="text-xs text-slate-600 mb-2">{content}</p>}
      {children}
    </div>
  </div>
);

export const TriggerNode = ({ data, isConnectable }) => {
  return (
    <>
      <BaseNode 
        icon={<Zap size={14} className="text-amber-500" />} 
        title="Trigger"
        content={data.label || 'Incoming message'}
      >
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 mt-2">Keywords</div>
        <div className="flex flex-wrap gap-1">
          {data.keywords?.map((k, i) => (
            <span key={i} className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px]">{k}</span>
          ))}
          {(!data.keywords || data.keywords.length === 0) && (
            <span className="text-slate-400 text-xs italic">Configure keywords...</span>
          )}
        </div>
      </BaseNode>
      <Handle type="source" position={Position.Right} id="a" isConnectable={isConnectable} className="w-3 h-3 bg-amber-500 border-2 border-white" />
    </>
  );
};

export const MessageNode = ({ data, isConnectable }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-3 h-3 bg-emerald-500 border-2 border-white" />
      <BaseNode 
        icon={<MessageSquare size={14} className="text-emerald-500" />} 
        title="Send Message"
      >
        <div className="bg-emerald-50 p-2 rounded border border-emerald-100 text-xs text-emerald-900 line-clamp-3">
          {data.message || <span className="text-emerald-400 italic">Configure message...</span>}
        </div>
        {data.mediaUrl && (
          <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Media Attached
          </div>
        )}
      </BaseNode>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-3 h-3 bg-emerald-500 border-2 border-white" />
    </>
  );
};

export const ButtonsNode = ({ data, isConnectable }) => {
  const buttons = data.buttons || [];
  
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-3 h-3 bg-blue-500 border-2 border-white" />
      <BaseNode 
        icon={<Target size={14} className="text-blue-500" />} 
        title="Interactive Buttons"
      >
        <div className="bg-blue-50 p-2 rounded border border-blue-100 text-xs text-blue-900 line-clamp-2 mb-2">
          {data.message || <span className="text-blue-400 italic">Configure message...</span>}
        </div>
        
        <div className="space-y-1 relative">
          {buttons.map((btn, idx) => (
            <div key={idx} className="relative">
              <div className="bg-white border border-blue-200 text-blue-700 text-xs text-center py-1 rounded shadow-sm">
                {btn}
              </div>
              <Handle 
                type="source" 
                position={Position.Right} 
                id={`btn-${idx}`} 
                style={{ top: '50%', right: -15, transform: 'translateY(-50%)' }}
                isConnectable={isConnectable} 
                className="w-3 h-3 bg-blue-500 border-2 border-white"
              />
            </div>
          ))}
          {buttons.length === 0 && (
            <div className="text-xs text-slate-400 italic text-center">Configure buttons...</div>
          )}
        </div>
      </BaseNode>
    </>
  );
};

export const ConditionNode = ({ data, isConnectable }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-3 h-3 bg-purple-500 border-2 border-white" />
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden w-64 relative">
        <div className="bg-purple-50 px-3 py-2 border-b border-purple-200 flex items-center gap-2">
          <HelpCircle size={14} className="text-purple-600" />
          <span className="font-medium text-purple-800 text-sm">Condition</span>
        </div>
        <div className="p-3">
          <div className="text-xs text-slate-600 font-mono bg-slate-100 p-1.5 rounded border border-slate-200 text-center">
            {data.condition || 'Configure condition...'}
          </div>
        </div>
        
        {/* True Branch */}
        <div className="absolute top-1/3 right-0 -mr-2 bg-emerald-500 text-white text-[9px] px-1 rounded-sm shadow z-10 translate-x-full mt-2">True</div>
        <Handle 
          type="source" 
          position={Position.Right} 
          id="true" 
          style={{ top: '33%' }}
          isConnectable={isConnectable} 
          className="w-3 h-3 bg-emerald-500 border-2 border-white"
        />
        
        {/* False Branch */}
        <div className="absolute top-2/3 right-0 -mr-2 bg-rose-500 text-white text-[9px] px-1 rounded-sm shadow z-10 translate-x-full mt-2">False</div>
        <Handle 
          type="source" 
          position={Position.Right} 
          id="false" 
          style={{ top: '66%' }}
          isConnectable={isConnectable} 
          className="w-3 h-3 bg-rose-500 border-2 border-white"
        />
      </div>
    </>
  );
};

export const HandoffNode = ({ data, isConnectable }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-3 h-3 bg-rose-500 border-2 border-white" />
      <BaseNode 
        icon={<UserPlus size={14} className="text-rose-500" />} 
        title="Agent Handoff"
      >
        <div className="text-xs text-slate-600">
          Pauses bot and transfers conversation to a human agent.
        </div>
      </BaseNode>
    </>
  );
};
