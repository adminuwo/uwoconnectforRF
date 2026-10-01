'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Panel,
  Handle,
  Position,
  useReactFlow,
  ReactFlowProvider,
  getBezierPath,
  EdgeLabelRenderer
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Save, MessageSquare, Clock, Zap, Loader2,
  ChevronDown, Image as ImageIcon, Video, List, FileText, Webhook, Tag, BarChart3,
  MousePointer2, ArrowLeft, CheckCircle2, XCircle, Play, X, Plus, Trash2, Edit3, User, ShoppingBag, ExternalLink, Check, Sparkles, Bot,
  Sun, Moon, Upload
} from 'lucide-react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { templateData } from '../../templateData';
import { API_BASE_URL } from '@/config/apiConfig';
import { useTheme } from '@/context/ThemeContext';


const cn = (...classes) => classes.filter(Boolean).join(' ');

// --- CUSTOM NODE WRAPPER ---
const NodeContainer = ({ children, title, icon: Icon, color, id, isTrigger }) => {
  const { isDark } = useTheme();
  const { deleteElements } = useReactFlow();
  const onDelete = (e) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <div className={cn(
      "rounded-xl shadow-2xl border overflow-hidden w-64 group relative animate-in fade-in zoom-in duration-200",
      isDark ? "bg-[#0f172a] border-slate-700/80 shadow-black/70 text-slate-100" : "bg-white border-slate-200 text-slate-800"
    )}>
      <div className={cn("px-4 py-2.5 flex items-center justify-between border-b", color, isDark ? "border-slate-800/60" : "border-slate-100")}>
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-white" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{title}</span>
        </div>
        {!isTrigger && (
          <button onClick={onDelete} title="Delete Step" className="w-5 h-5 bg-white/20 hover:bg-red-500 text-white rounded-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xs cursor-pointer">
            <X size={12} strokeWidth={3} />
          </button>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

// --- NODE TYPES ---

const TriggerNode = ({ id, data = {} }) => {
  const isAnyMessage = data.triggerMode === 'ALL' || data.keyword === '*' || data.isAnyMessage;
  return (
    <div className="bg-emerald-600 rounded-xl shadow-2xl p-5 w-64 border-b-4 border-b-emerald-500 group relative">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center"><Zap size={16} fill="currentColor" /></div>
        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Start Flow</h4>
      </div>
      <div className="bg-slate-900/90 rounded-lg p-2.5 border border-emerald-500/30">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest truncate">
          {isAnyMessage ? '⚡ Any Incoming Message' : `"${data.keyword || 'Any Keyword'}"`}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 -bottom-1" />
    </div>
  );
};

const PlainNode = ({ id, data = {} }) => {
  const { isDark } = useTheme();
  return (
    <NodeContainer id={id} title="Message" icon={MessageSquare} color="bg-emerald-600">
      <p className={cn("text-xs font-semibold leading-relaxed line-clamp-3", isDark ? "text-slate-200" : "text-slate-700")}>"{data.message || 'Enter message...'}"</p>
      <Handle type="target" position={Position.Top} className={cn("w-2.5 h-2.5 bg-slate-400 border-2 -top-1", isDark ? "border-slate-900" : "border-white")} />
      <Handle type="source" position={Position.Bottom} className={cn("w-2.5 h-2.5 bg-emerald-600 border-2 -bottom-1", isDark ? "border-slate-900" : "border-white")} />
    </NodeContainer>
  );
};

const ButtonsNode = ({ id, data = {} }) => {
  const { isDark } = useTheme();
  const { setNodes } = useReactFlow();

  const handleAddButton = (e) => {
    e.stopPropagation();
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          const currentButtons = n.data.buttons || ['Option 1'];
          if (currentButtons.length < 3) {
            return {
              ...n,
              data: {
                ...n.data,
                buttons: [...currentButtons, `Option ${currentButtons.length + 1}`],
              },
            };
          }
        }
        return n;
      })
    );
  };

  const buttons = data.buttons || ['Option 1'];

  return (
    <NodeContainer id={id} title="Buttons" icon={MousePointer2} color="bg-indigo-600">
      <p className={cn("text-[11px] font-semibold mb-4 line-clamp-2", isDark ? "text-slate-200" : "text-slate-700")}>"{data.message || 'Options...'}"</p>
      <div className="space-y-2">
        {buttons.map((btn, i) => (
          <div key={i} className="relative">
            <div className={cn(
              "px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-center border",
              isDark ? "bg-indigo-950/60 border-indigo-800/80 text-indigo-300" : "bg-indigo-50 border-indigo-100 text-indigo-600"
            )}>
              {btn}
            </div>
            <Handle type="source" position={Position.Right} id={`btn-${i}`} className={cn("w-2 h-2 bg-indigo-500 border-2 -right-1", isDark ? "border-slate-900" : "border-white")} />
          </div>
        ))}
        {buttons.length < 3 && (
          <button
            onClick={handleAddButton}
            className={cn(
              "w-full mt-2 py-1.5 border border-dashed rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-1 cursor-pointer",
              isDark
                ? "border-indigo-800/70 text-indigo-400 hover:text-indigo-300 hover:border-indigo-600 hover:bg-indigo-950/40"
                : "border-indigo-200 text-indigo-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50"
            )}
          >
            <Plus size={10} strokeWidth={3} /> Add Button
          </button>
        )}
      </div>
      <Handle type="target" position={Position.Top} className={cn("w-2.5 h-2.5 bg-slate-400 border-2 -top-1", isDark ? "border-slate-900" : "border-white")} />
    </NodeContainer>
  );
};

const ImageNode = ({ id, data = {} }) => {
  const { isDark } = useTheme();
  return (
    <NodeContainer id={id} title="Image" icon={ImageIcon} color="bg-purple-600">
      <div className={cn(
        "aspect-video rounded-lg flex items-center justify-center mb-2 border border-dashed overflow-hidden relative",
        isDark ? "bg-slate-800/80 border-slate-700 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-300"
      )}>
        {data.mediaUrl ? (
          <img
            src={data.mediaUrl}
            alt="Upload preview"
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <ImageIcon size={20} />
        )}
      </div>
      {data.message && (
        <p className={cn("text-[11px] font-semibold leading-relaxed line-clamp-2 mt-1", isDark ? "text-slate-300" : "text-slate-600")}>
          "{data.message}"
        </p>
      )}
      <Handle type="target" position={Position.Top} className={cn("w-2.5 h-2.5 bg-slate-400 border-2 -top-1", isDark ? "border-slate-900" : "border-white")} />
      <Handle type="source" position={Position.Bottom} className={cn("w-2.5 h-2.5 bg-purple-600 border-2 -bottom-1", isDark ? "border-slate-900" : "border-white")} />
    </NodeContainer>
  );
};

const VideoNode = ({ id, data = {} }) => {
  const { isDark } = useTheme();
  return (
    <NodeContainer id={id} title="Video" icon={Video} color="bg-rose-600">
      <div className={cn(
        "aspect-video rounded-lg flex items-center justify-center mb-2 border border-dashed overflow-hidden relative",
        isDark ? "bg-slate-800/80 border-slate-700 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-300"
      )}>
        {data.mediaUrl ? (
          <video src={data.mediaUrl} className="w-full h-full object-cover" controls />
        ) : (
          <Video size={20} />
        )}
      </div>
      {data.message && (
        <p className={cn("text-[11px] font-semibold leading-relaxed line-clamp-2 mt-1", isDark ? "text-slate-300" : "text-slate-600")}>
          "{data.message}"
        </p>
      )}
      <Handle type="target" position={Position.Top} className={cn("w-2.5 h-2.5 bg-slate-400 border-2 -top-1", isDark ? "border-slate-900" : "border-white")} />
      <Handle type="source" position={Position.Bottom} className={cn("w-2.5 h-2.5 bg-rose-600 border-2 -bottom-1", isDark ? "border-slate-900" : "border-white")} />
    </NodeContainer>
  );
};

const BranchNode = ({ id, data = {} }) => {
  const { isDark } = useTheme();
  return (
    <NodeContainer id={id} title="Condition" icon={Zap} color="bg-amber-500">
      <div className={cn(
        "p-3 rounded-lg border mb-3 text-center",
        isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-100"
      )}>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Check Logic</p>
        <p className={cn("text-[10px] font-bold uppercase", isDark ? "text-slate-200" : "text-slate-700")}>{data.condition || 'IF TAG = VIP'}</p>
      </div>
      <div className="flex justify-between items-center px-2">
        <CheckCircle2 size={16} className="text-emerald-500" />
        <XCircle size={16} className="text-red-500" />
      </div>
      <Handle type="target" position={Position.Top} className={cn("w-2.5 h-2.5 bg-slate-400 border-2 -top-1", isDark ? "border-slate-900" : "border-white")} />
      <Handle type="source" position={Position.Right} id="true" style={{ top: '75%' }} className={cn("w-2.5 h-2.5 bg-emerald-500 border-2 -right-1", isDark ? "border-slate-900" : "border-white")} />
      <Handle type="source" position={Position.Right} id="false" style={{ top: '75%', right: '-34px' }} className={cn("w-2.5 h-2.5 bg-red-500 border-2 -right-1", isDark ? "border-slate-900" : "border-white")} />
    </NodeContainer>
  );
};

const HandoffNode = ({ id, data = {} }) => {
  const { isDark } = useTheme();
  return (
    <NodeContainer id={id} title="Talk to Human" icon={User} color="bg-rose-500">
      <p className={cn("text-xs font-semibold leading-relaxed line-clamp-3", isDark ? "text-slate-200" : "text-slate-700")}>"{data.message || 'Connecting you to a human agent. Please wait...'}"</p>
      <Handle type="target" position={Position.Top} className={cn("w-2.5 h-2.5 bg-slate-400 border-2 -top-1", isDark ? "border-slate-900" : "border-white")} />
    </NodeContainer>
  );
};

const GoogleMeetNode = ({ id, data = {} }) => {
  const { isDark } = useTheme();
  return (
    <NodeContainer id={id} title="Google Meet & Calendar" icon={Video} color="bg-blue-600">
      <div className={cn(
        "p-2.5 rounded-lg border mb-2",
        isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-100"
      )}>
        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">📅 Schedule Meeting</p>
        <p className={cn("text-xs font-semibold leading-relaxed truncate", isDark ? "text-slate-200" : "text-slate-700")}>"{data.title || 'Product Demo Call'}"</p>
        <div className={cn("mt-2 flex items-center justify-between text-[9px] font-bold", isDark ? "text-slate-400" : "text-slate-500")}>
          <span>⏱️ {data.duration || 30} mins</span>
          <span className="text-blue-500">📹 Auto Meet Link</span>
        </div>
      </div>
      <Handle type="target" position={Position.Top} className={cn("w-2.5 h-2.5 bg-slate-400 border-2 -top-1", isDark ? "border-slate-900" : "border-white")} />
      <Handle type="source" position={Position.Bottom} className={cn("w-2.5 h-2.5 bg-blue-600 border-2 -bottom-1", isDark ? "border-slate-900" : "border-white")} />
    </NodeContainer>
  );
};

const CatalogProductNode = ({ id, data = {} }) => {
  const { isDark } = useTheme();
  return (
    <NodeContainer id={id} title="Send Catalog Product" icon={ShoppingBag} color="bg-emerald-600">
      <div className={cn(
        "p-2.5 rounded-lg border mb-2",
        isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-100"
      )}>
        {data.mediaUrl && (
          <div className={cn(
            "w-full h-24 mb-2 rounded-lg overflow-hidden border relative",
            isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-100"
          )}>
            <img src={data.mediaUrl} alt={data.productName || 'Product'} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">🛍️ Catalog Item</span>
          <span className={cn("text-xs font-black", isDark ? "text-white" : "text-slate-900")}>${data.productPrice || '20.00'}</span>
        </div>
        <p className={cn("text-xs font-bold truncate mb-1", isDark ? "text-slate-200" : "text-slate-800")}>"{data.productName || 'Select Product...'}"</p>
        <div className={cn(
          "p-1.5 rounded text-[10px] font-semibold flex items-center justify-between border",
          isDark ? "bg-emerald-950/60 border-emerald-800/60 text-emerald-300" : "bg-emerald-50 border-emerald-100 text-emerald-800"
        )}>
          <span>🔗 [{data.ctaText || 'View Product'}]</span>
          <ExternalLink size={10} />
        </div>
      </div>
      <Handle type="target" position={Position.Top} className={cn("w-2.5 h-2.5 bg-slate-400 border-2 -top-1", isDark ? "border-slate-900" : "border-white")} />
      <Handle type="source" position={Position.Bottom} className={cn("w-2.5 h-2.5 bg-emerald-600 border-2 -bottom-1", isDark ? "border-slate-900" : "border-white")} />
    </NodeContainer>
  );
};

const AIChatNode = ({ id, data = {} }) => {
  const { isDark } = useTheme();
  return (
    <NodeContainer id={id} title="Talk to AI (RAG)" icon={Sparkles} color="bg-indigo-600">
      <div className={cn(
        "p-2.5 rounded-lg border mb-2",
        isDark ? "bg-indigo-950/40 border-indigo-800/60" : "bg-indigo-50/60 border-indigo-100"
      )}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1">
            <Sparkles size={11} className="text-indigo-400" /> AI Assistant
          </span>
          <span className={cn(
            "text-[8px] font-bold px-1.5 py-0.5 rounded border",
            isDark ? "bg-slate-800 text-indigo-300 border-indigo-800/80" : "bg-white text-indigo-700 border-indigo-200"
          )}>
            ⏱️ 2 Min Auto-Cycle
          </span>
        </div>
        <p className={cn("text-xs font-semibold leading-relaxed line-clamp-2", isDark ? "text-slate-200" : "text-slate-700")}>
          "{data.message || 'I am your 24/7 AI Assistant. Ask me anything about our services!'}"
        </p>
        <div className={cn(
          "mt-2 pt-2 border-t flex items-center justify-between text-[9px] font-bold",
          isDark ? "border-indigo-900/60 text-slate-400" : "border-indigo-100/80 text-slate-500"
        )}>
          <span>Knowledge Base RAG</span>
          <span className="text-indigo-400 flex items-center gap-1"><Zap size={10} /> Active</span>
        </div>
      </div>
      <Handle type="target" position={Position.Top} className={cn("w-2.5 h-2.5 bg-slate-400 border-2 -top-1", isDark ? "border-slate-900" : "border-white")} />
      <Handle type="source" position={Position.Bottom} className={cn("w-2.5 h-2.5 bg-indigo-600 border-2 -bottom-1", isDark ? "border-slate-900" : "border-white")} />
    </NodeContainer>
  );
};

const DeletableEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  const { isDark } = useTheme();
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (evt) => {
    evt.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <path
        id={id}
        style={{ ...style, strokeWidth: 3, stroke: isDark ? '#475569' : '#94a3b8', cursor: 'pointer' }}
        className="react-flow__edge-path hover:stroke-red-500 transition-colors"
        d={edgePath}
        markerEnd={markerEnd}
        onClick={onEdgeClick}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button
            onClick={onEdgeClick}
            title="Delete Wire Connection"
            className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer hover:scale-125 border",
              isDark
                ? "bg-slate-800 border-slate-700 text-slate-400 hover:bg-red-500 hover:text-white hover:border-red-500"
                : "bg-white border-slate-300 text-slate-400 hover:bg-red-500 hover:text-white hover:border-red-500"
            )}
          >
            <X size={10} strokeWidth={3} />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

// --- MAIN BUILDER ---

const WorkflowBuilderInner = () => {
  const { isDark, toggleTheme } = useTheme();
  const { id } = useParams();
  const router = useRouter();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflow, setWorkflow] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [deploymentChannels, setDeploymentChannels] = useState(['WHATSAPP']); // WHATSAPP, INSTAGRAM, FACEBOOK
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');

  const handleSaveWorkflowName = async () => {
    if (!editedName.trim()) {
      setIsEditingName(false);
      return;
    }
    const newName = editedName.trim();
    setWorkflow(prev => ({ ...prev, name: newName }));
    setIsEditingName(false);

    if (id !== 'new') {
      try {
        const token = localStorage.getItem('uwo_token');
        await axios.patch(
          `${API_BASE_URL}/api/workflows/${id}/`,
          { name: newName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error('Failed to update workflow name:', err);
      }
    }
  };

  const { screenToFlowPosition } = useReactFlow();

  const handleAddNodeDirectly = useCallback((type) => {
    let defaultMsg = 'Type your message here...';
    if (type === 'handoff') {
      defaultMsg = 'Connecting you to a human agent. Please wait...';
    }
    const center = typeof window !== 'undefined'
      ? { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      : { x: 250, y: 250 };
    const position = screenToFlowPosition(center);
    const newNode = {
      id: `node_${Date.now()}`,
      type,
      position,
      data: { message: defaultMsg, buttons: ['Option 1'], keyword: 'hello', condition: 'If Tag = VIP' },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [screenToFlowPosition, setNodes]);

  const nodeTypes = useMemo(() => ({
    trigger: TriggerNode,
    plain: PlainNode,
    default: PlainNode,
    buttons: ButtonsNode,
    image: ImageNode,
    video: VideoNode,
    condition: BranchNode,
    handoff: HandoffNode,
    google_meet: GoogleMeetNode,
    calendar: GoogleMeetNode,
    catalog_product: CatalogProductNode,
    ai_chat: AIChatNode,
  }), []);

  const edgeTypes = useMemo(() => ({
    default: DeletableEdge,
  }), []);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (id === 'new') {
        const params = new URLSearchParams(window.location.search);
        const name = params.get('name') || 'Untitled Workflow';
        const template = params.get('template') || '';
        const channelsParam = params.get('channels') || params.get('channel') || 'WHATSAPP';
        const channels = channelsParam.split(',').filter(Boolean);
        const is_shared = params.get('is_shared') === 'true';
        const category = params.get('category') || 'General';

        setWorkflow({ name, enabled: false, channels, is_shared, category });
        setDeploymentChannels(channels);

        if (template && templateData[template]) {
          const tData = templateData[template];
          setNodes(tData.nodes.map(n => ({
            ...n,
            data: n.data || {},
            position: n.position || { x: 0, y: 0 },
            type: (!n.type || n.type === 'default') ? 'plain' : n.type
          })));
          setEdges(Array.isArray(tData.edges) ? tData.edges : []);
        } else {
          setNodes([{ id: 'start', type: 'trigger', position: { x: 250, y: 50 }, data: { keyword: 'Any Keyword' } }]);
        }
      } else {
        const token = localStorage.getItem('uwo_token');
        const res = await axios.get(`${API_BASE_URL}/api/workflows/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
        setWorkflow(res.data);
        setDeploymentChannels(res.data.channels || ['WHATSAPP']);
        let steps = res.data.steps;
        if (typeof steps === 'string') try { steps = JSON.parse(steps); } catch (e) { steps = {}; }
        if (steps && Array.isArray(steps.nodes) && steps.nodes.length > 0) {
          setNodes(steps.nodes.map(n => ({
            ...n,
            data: n.data || {},
            position: n.position || { x: 0, y: 0 },
            type: (!n.type || n.type === 'default') ? 'plain' : n.type
          })));
          setEdges(Array.isArray(steps.edges) ? steps.edges : []);
        } else {
          setNodes([{ id: 'start', type: 'trigger', position: { x: 250, y: 50 }, data: { keyword: 'Any Keyword' } }]);
        }
      }

      // Fetch available products from Catalog for dropdown selection
      try {
        const token = localStorage.getItem('uwo_token');
        const prodRes = await axios.get(`${API_BASE_URL}/api/products/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const prods = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.results || []);
        setAvailableProducts(prods);
      } catch (pErr) {
        console.warn('Failed to load products for catalog node selector:', pErr);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const onConnect = useCallback((p) => setEdges((eds) => addEdge({ ...p, animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 } }, eds)), [setEdges]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('uwo_token');

      // Find the trigger node and extract its keyword(s)
      const triggerNode = nodes.find(n => n.type === 'trigger');
      let trigger_value = [];
      if (triggerNode && triggerNode.data && triggerNode.data.keyword) {
        // Split by comma and clean up whitespace
        trigger_value = triggerNode.data.keyword.split(',').map(k => k.trim()).filter(k => k);
      }

      if (id === 'new') {
        const params = new URLSearchParams(window.location.search);
        const template = params.get('template') || '';
        const category = params.get('category') || 'General';
        const isShared = params.get('is_shared') === 'true' || deploymentChannels.length > 1;

        if (isShared) {
          const res = await axios.post(
            `${API_BASE_URL}/api/workflows/`,
            {
              name: workflow.name,
              category: category,
              industry: template || 'None',
              trigger_type: 'KEYWORD',
              trigger_value: trigger_value,
              steps: { nodes, edges },
              channels: deploymentChannels,
              is_shared: true,
              enabled: false
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          alert('Workflow created successfully!');
          router.push(`/client/workflows/builder/${res.data.id}`);
        } else {
          let firstSavedId = null;
          for (const channel of deploymentChannels) {
            const res = await axios.post(
              `${API_BASE_URL}/api/workflows/`,
              {
                name: deploymentChannels.length > 1 ? `${workflow.name} (${channel})` : workflow.name,
                category: category,
                industry: template || 'None',
                trigger_type: 'KEYWORD',
                trigger_value: trigger_value,
                steps: { nodes, edges },
                channels: [channel],
                is_shared: false,
                enabled: false
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!firstSavedId) firstSavedId = res.data.id;
          }
          alert('Workflow created successfully!');
          if (firstSavedId) {
            router.push(`/client/workflows/builder/${firstSavedId}`);
          } else {
            router.push('/client/workflows');
          }
        }
      } else {
        await axios.patch(
          `${API_BASE_URL}/api/workflows/${id}/`,
          {
            name: workflow?.name,
            steps: { nodes, edges },
            trigger_value: trigger_value,
            channels: deploymentChannels,
            is_shared: deploymentChannels.length > 1 || (workflow && workflow.is_shared)
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Workflow saved successfully!');
      }
    } catch (err) {
      console.error('Workflow save error:', err);
      alert('Save failed: ' + (err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;
    const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

    let defaultMsg = 'Type your message here...';
    if (type === 'handoff') {
      defaultMsg = 'Connecting you to a human agent. Please wait...';
    }

    const newNode = {
      id: `node_${Date.now()}`,
      type,
      position,
      data: { message: defaultMsg, buttons: ['Option 1'], keyword: 'hello', condition: 'If Tag = VIP' },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [screenToFlowPosition, setNodes]);

  const onNodeDoubleClick = (_, node) => setSelectedNode(node);
  const updateNodeData = (nodeId, newData) => {
    setNodes((nds) => nds.map((node) => node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node));
    setSelectedNode(null);
  };

  if (loading) return <div className={cn("h-screen flex items-center justify-center", isDark ? "bg-[#090d16]" : "bg-slate-50")}><Loader2 className="animate-spin text-emerald-500" size={30} /></div>;
  const isShared = deploymentChannels.length > 1 || (workflow && workflow.is_shared);

  return (
    <div className={cn("h-screen w-full flex flex-col overflow-hidden font-sans", isDark ? "bg-[#090d16] text-white workflow-builder" : "bg-[#f8fafc] text-slate-900")}>
      {/* Responsive Top Bar */}
      <div className={cn(
        "flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:px-6 md:py-0 md:h-16 border-b z-10 gap-4 shrink-0 shadow-sm transition-colors",
        isDark ? "bg-[#0f172a] border-slate-800" : "bg-white border-slate-200"
      )}>
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/client/workflows')}
              className={cn(
                "flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors shrink-0 cursor-pointer",
                isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <ArrowLeft size={14} /> <span className="hidden sm:inline">Go back</span>
            </button>
            <div className={cn("h-6 w-px", isDark ? "bg-slate-800" : "bg-slate-200")} />
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(
                "md:hidden p-2 rounded-xl transition-colors shrink-0 border cursor-pointer",
                isDark ? "text-slate-300 border-slate-700 bg-slate-800 hover:bg-slate-700" : "text-slate-600 border-slate-200 bg-slate-50 hover:bg-slate-100"
              )}
              title="Toggle actions panel"
            >
              <List size={16} />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveWorkflowName();
                      if (e.key === 'Escape') setIsEditingName(false);
                    }}
                    autoFocus
                    placeholder="Workflow Name"
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold focus:outline-none ring-2 ring-emerald-500/20 max-w-[180px] sm:max-w-xs border",
                      isDark ? "bg-slate-800 border-emerald-500 text-white" : "bg-white border-emerald-500 text-slate-800"
                    )}
                  />
                  <button
                    onClick={handleSaveWorkflowName}
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                    title="Save name"
                  >
                    <Check size={12} strokeWidth={3} />
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors cursor-pointer",
                      isDark ? "bg-slate-800 hover:bg-slate-700 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    )}
                    title="Cancel"
                  >
                    <X size={12} strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => {
                    setEditedName(workflow?.name || '');
                    setIsEditingName(true);
                  }}
                  className={cn(
                    "flex items-center gap-1.5 group cursor-pointer px-2 py-1 rounded-lg transition-colors min-w-0",
                    isDark ? "hover:bg-slate-800/60" : "hover:bg-slate-100"
                  )}
                  title="Click to rename workflow"
                >
                  <h1 className={cn("text-xs sm:text-sm font-bold tracking-tight uppercase truncate", isDark ? "text-white" : "text-slate-800")}>
                    {workflow?.name || 'Untitled Workflow'}
                  </h1>
                  <Edit3 size={13} className={cn("opacity-60 group-hover:opacity-100 transition-all shrink-0", isDark ? "text-slate-500 group-hover:text-slate-300" : "text-slate-400 group-hover:text-slate-700")} />
                </div>
              )}
              {isShared && (
                <span className={cn(
                  "text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider shrink-0 hidden sm:inline border",
                  isDark ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-900 text-white border-transparent"
                )}>
                  Shared
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Current Deployment Selector */}
        <div className={cn(
          "flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl px-4 py-2 w-full md:w-auto border",
          isDark ? "bg-slate-800/80 border-slate-700/80" : "bg-slate-50 border-slate-100"
        )}>
          <span className={cn("text-[9px] font-black uppercase tracking-wider w-full sm:w-auto", isDark ? "text-slate-400" : "text-slate-400")}>Deployment:</span>
          <label className={cn("flex items-center gap-1.5 text-xs font-bold cursor-pointer", isDark ? "text-slate-200" : "text-slate-700")}>
            <input
              type="checkbox"
              checked={deploymentChannels.includes('WHATSAPP')}
              onChange={(e) => {
                const checked = e.target.checked;
                let updated = [...deploymentChannels];
                if (checked) {
                  if (!updated.includes('WHATSAPP')) updated.push('WHATSAPP');
                } else {
                  if (updated.length > 1) updated = updated.filter(c => c !== 'WHATSAPP');
                }
                setDeploymentChannels(updated);
              }}
              className="accent-emerald-600 rounded"
            />
            <span>🟢 WhatsApp</span>
          </label>
          <label className={cn("flex items-center gap-1.5 text-xs font-bold cursor-pointer", isDark ? "text-slate-200" : "text-slate-700")}>
            <input
              type="checkbox"
              checked={deploymentChannels.includes('INSTAGRAM')}
              onChange={(e) => {
                const checked = e.target.checked;
                let updated = [...deploymentChannels];
                if (checked) {
                  if (!updated.includes('INSTAGRAM')) updated.push('INSTAGRAM');
                } else {
                  if (updated.length > 1) updated = updated.filter(c => c !== 'INSTAGRAM');
                }
                setDeploymentChannels(updated);
              }}
              className="accent-emerald-600 rounded"
            />
            <span>🟣 Instagram</span>
          </label>
          <label className={cn("flex items-center gap-1.5 text-xs font-bold cursor-pointer", isDark ? "text-slate-200" : "text-slate-700")}>
            <input
              type="checkbox"
              checked={deploymentChannels.includes('FACEBOOK')}
              onChange={(e) => {
                const checked = e.target.checked;
                let updated = [...deploymentChannels];
                if (checked) {
                  if (!updated.includes('FACEBOOK')) updated.push('FACEBOOK');
                } else {
                  if (updated.length > 1) updated = updated.filter(c => c !== 'FACEBOOK');
                }
                setDeploymentChannels(updated);
              }}
              className="accent-emerald-600 rounded"
            />
            <span>🔵 Facebook</span>
          </label>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className={cn(
              "p-2.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer shrink-0 shadow-xs",
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
            )}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button onClick={handleSave} className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0">
            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={14} />} Save Workflow
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar Overlay */}
        {isSidebarOpen && (
          <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-xs md:hidden" />
        )}

        {/* Collapsible Left Sidebar */}
        <div className={cn(
          "w-72 border-r flex flex-col overflow-y-auto transition-all duration-300 shrink-0 fixed md:static inset-y-0 left-0 z-30 md:z-auto",
          isDark ? "bg-[#0f172a] border-slate-800" : "bg-white border-slate-200",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <div className={cn("p-4 border-b flex items-center justify-between md:hidden", isDark ? "border-slate-800 bg-slate-900/80 text-slate-400" : "border-slate-100 bg-slate-50 text-slate-400")}>
            <span className="text-[10px] font-black uppercase tracking-widest">Actions Menu</span>
            <button onClick={() => setIsSidebarOpen(false)} className={cn("cursor-pointer", isDark ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-900")}><X size={18} /></button>
          </div>
          <div className={cn("p-5 border-b", isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-100 bg-slate-50/50")}>
            <h3 className={cn("text-[10px] font-black uppercase tracking-[0.3em]", isDark ? "text-slate-400" : "text-slate-400")}>Actions</h3>
          </div>
          <div className="flex-1">
            <SidebarCategory title="Messages" icon={MessageSquare} expanded>
              <SidebarItem icon={MessageSquare} label="Plain Message" onDragStart={(e) => onDragStart(e, 'plain')} onClick={() => { handleAddNodeDirectly('plain'); setIsSidebarOpen(false); }} />
              <SidebarItem icon={MousePointer2} label="Message + Buttons" onDragStart={(e) => onDragStart(e, 'buttons')} onClick={() => { handleAddNodeDirectly('buttons'); setIsSidebarOpen(false); }} />
              <SidebarItem icon={ImageIcon} label="Message + Image" onDragStart={(e) => onDragStart(e, 'image')} onClick={() => { handleAddNodeDirectly('image'); setIsSidebarOpen(false); }} />
              <SidebarItem icon={Video} label="Message + Video" onDragStart={(e) => onDragStart(e, 'video')} onClick={() => { handleAddNodeDirectly('video'); setIsSidebarOpen(false); }} />
            </SidebarCategory>
            <SidebarCategory title="Commerce & Catalog" icon={ShoppingBag} expanded>
              <SidebarItem icon={ShoppingBag} label="Send Catalog Product" onDragStart={(e) => onDragStart(e, 'catalog_product')} onClick={() => { handleAddNodeDirectly('catalog_product'); setIsSidebarOpen(false); }} color="emerald" />
            </SidebarCategory>
            <SidebarCategory title="Integrations & Meetings" icon={Zap} expanded>
              <SidebarItem icon={Video} label="Google Meet & Calendar" onDragStart={(e) => onDragStart(e, 'google_meet')} onClick={() => { handleAddNodeDirectly('google_meet'); setIsSidebarOpen(false); }} color="blue" />
            </SidebarCategory>
            <div className="px-4 py-2 mt-4">
              <SidebarItem icon={Sparkles} label="Talk to AI Assistant" onDragStart={(e) => onDragStart(e, 'ai_chat')} onClick={() => { handleAddNodeDirectly('ai_chat'); setIsSidebarOpen(false); }} color="indigo" />
            </div>
            <div className="px-4 py-2">
              <SidebarItem icon={Zap} label="Set a Condition" onDragStart={(e) => onDragStart(e, 'condition')} onClick={() => { handleAddNodeDirectly('condition'); setIsSidebarOpen(false); }} color="amber" />
            </div>
            <div className="px-4 py-2">
              <SidebarItem icon={User} label="Talk to Human" onDragStart={(e) => onDragStart(e, 'handoff')} onClick={() => { handleAddNodeDirectly('handoff'); setIsSidebarOpen(false); }} color="rose" />
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className={cn("flex-1 relative transition-colors", isDark ? "bg-[#090d16]" : "bg-[#f1f5f9]")} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onNodeDoubleClick={onNodeDoubleClick}
            fitView
          >
            <Background color={isDark ? "#334155" : "#cbd5e1"} gap={25} size={1} variant="dots" />
            <Controls className={cn(
              "shadow-xl rounded-xl overflow-hidden m-4 sm:m-8 border",
              isDark
                ? "bg-slate-900 border-slate-800 text-white [&>button]:border-slate-800 [&>button]:bg-slate-900 [&>button]:fill-slate-300 [&>button:hover]:bg-slate-800"
                : "bg-white border-slate-200"
            )} />
          </ReactFlow>
        </div>

        {/* Responsive Edit Drawer */}
        {selectedNode && (
          <>
            <div onClick={() => setSelectedNode(null)} className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-xs sm:hidden" />
            <div className={cn(
              "w-full sm:w-[400px] border-l shadow-2xl flex flex-col z-30 fixed sm:absolute inset-y-0 right-0 max-h-screen overflow-y-auto transition-colors",
              isDark ? "bg-[#0f172a] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
            )}>
              <div className={cn("p-6 border-b flex items-center justify-between", isDark ? "border-slate-800 bg-slate-900/80 text-white" : "border-slate-100 bg-slate-50/50 text-slate-900")}>
                <h3 className="text-sm font-black uppercase tracking-widest">Edit Step</h3>
                <button onClick={() => setSelectedNode(null)} className={cn("cursor-pointer transition-colors", isDark ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-900")}><X size={20} /></button>
              </div>
              <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
                <MessageForm
                  key={selectedNode.id}
                  data={selectedNode.data}
                  type={selectedNode.type}
                  availableProducts={availableProducts}
                  onSave={(d) => updateNodeData(selectedNode.id, d)}
                  onDelete={() => {
                    setNodes(nds => nds.filter(n => n.id !== selectedNode.id));
                    setEdges(eds => eds.filter(e => e.source !== selectedNode.id && e.target !== selectedNode.id));
                    setSelectedNode(null);
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- FORM COMPONENT ---
const MessageForm = ({ data, type, onSave, onDelete, availableProducts = [] }) => {
  const { isDark } = useTheme();
  const [selectedProductId, setSelectedProductId] = useState(data.productId || '');
  const [msg, setMsg] = useState(data.message || data.productName || '');
  const [title, setTitle] = useState(data.title || data.productPrice || 'Product Demo Call');
  const [duration, setDuration] = useState(data.duration || '30');
  const [buttons, setButtons] = useState(data.buttons || ['Option 1']);
  const [mediaUrl, setMediaUrl] = useState(data.mediaUrl || null);
  const [keyword, setKeyword] = useState(data.keyword || data.ctaText || '');
  const [conditionField, setConditionField] = useState(data.conditionField || 'tag');
  const [conditionOperator, setConditionOperator] = useState(data.conditionOperator || '=');
  const [conditionValue, setConditionValue] = useState(data.conditionValue || '');
  const [condition, setCondition] = useState(data.condition || '');

  const handleProductSelect = (prodId) => {
    setSelectedProductId(prodId);
    const prod = availableProducts.find(p => String(p.id) === String(prodId));
    if (prod) {
      setMsg(prod.name || '');
      setTitle(String(prod.price || ''));
      setMediaUrl(prod.image_url || null);
      if (prod.cta_text) setKeyword(prod.cta_text);
    }
  };

  const [triggerMode, setTriggerMode] = useState(data.triggerMode || (data.keyword === '*' ? 'ALL' : 'KEYWORDS'));

  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const mediaInputRef = useRef(null);

  const handleMediaUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setUploadError("File size must be under 50MB.");
      return;
    }

    setUploadError('');
    setUploadingMedia(true);

    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(`${API_BASE_URL}/api/workflows/upload_media/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.media_url) {
        setMediaUrl(res.data.media_url);
      }
    } catch (err) {
      console.error("Workflow media upload failed:", err);
      setUploadError(err.response?.data?.error || "Upload failed. Please try again.");
    } finally {
      setUploadingMedia(false);
      if (mediaInputRef.current) {
        mediaInputRef.current.value = '';
      }
    }
  };

  const handleAddButton = () => {
    if (buttons.length < 3) {
      setButtons([...buttons, `Option ${buttons.length + 1}`]);
    }
  };

  const handleButtonChange = (index, value) => {
    const newButtons = [...buttons];
    newButtons[index] = value;
    setButtons(newButtons);
  };

  const handleRemoveButton = (index) => {
    const newButtons = buttons.filter((_, i) => i !== index);
    setButtons(newButtons);
  };

  // Build condition string from parts
  const buildCondition = () => {
    return `IF ${conditionField.toUpperCase()} ${conditionOperator} ${conditionValue}`;
  };

  return (<div className="space-y-6">
    {type === 'trigger' ? (
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Trigger Event</label>
          <div className={cn("grid grid-cols-2 gap-2 p-1 rounded-xl border", isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-100 border-slate-200")}>
            <button
              type="button"
              onClick={() => {
                setTriggerMode('KEYWORDS');
                if (keyword === '*') setKeyword('hi, hello');
              }}
              className={cn(
                "py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer",
                triggerMode === 'KEYWORDS'
                  ? isDark ? "bg-slate-700 text-emerald-400 shadow-sm border border-slate-600" : "bg-white text-emerald-600 shadow-sm border border-slate-200"
                  : isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-900"
              )}
            >
              Specific Keywords
            </button>
            <button
              type="button"
              onClick={() => {
                setTriggerMode('ALL');
                setKeyword('*');
              }}
              className={cn(
                "py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer",
                triggerMode === 'ALL'
                  ? isDark ? "bg-slate-700 text-emerald-400 shadow-sm border border-slate-600" : "bg-white text-emerald-600 shadow-sm border border-slate-200"
                  : isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-900"
              )}
            >
              ⚡ Any Message
            </button>
          </div>
        </div>

        {triggerMode === 'KEYWORDS' ? (
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Trigger Keywords</label>
            <p className={cn("text-[10px] mb-2", isDark ? "text-slate-400" : "text-slate-500")}>Enter keywords separated by commas (e.g. mall, offer, hi)</p>
            <input
              value={keyword === '*' ? '' : keyword}
              onChange={e => setKeyword(e.target.value)}
              className={cn(
                "w-full border p-4 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none",
                isDark ? "bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400"
              )}
              placeholder="e.g. hi, hello, hospital..."
            />
          </div>
        ) : (
          <div className={cn("border rounded-xl p-4", isDark ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-800")}>
            <p className={cn("text-xs font-bold flex items-center gap-1.5 mb-1", isDark ? "text-emerald-400" : "text-emerald-800")}>
              <Zap size={14} className={isDark ? "text-emerald-400 fill-emerald-400" : "text-emerald-600 fill-emerald-600"} />
              All Messages Trigger Enabled
            </p>
            <p className={cn("text-[11px] leading-relaxed", isDark ? "text-emerald-300" : "text-emerald-700")}>
              This workflow will automatically trigger whenever a customer sends <strong>ANY message</strong> on the selected channels.
            </p>
          </div>
        )}
      </div>
    ) : type === 'condition' ? (
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Condition Field</label>
          <select
            value={conditionField}
            onChange={e => setConditionField(e.target.value)}
            className={cn(
              "w-full border p-3 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none",
              isDark ? "bg-slate-800/80 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
            )}
          >
            <option value="tag" className={isDark ? "text-slate-200 bg-slate-800" : "text-slate-700 bg-white"}>Tag</option>
            <option value="name" className={isDark ? "text-slate-200 bg-slate-800" : "text-slate-700 bg-white"}>Name</option>
            <option value="phone" className={isDark ? "text-slate-200 bg-slate-800" : "text-slate-700 bg-white"}>Phone</option>
            <option value="message" className={isDark ? "text-slate-200 bg-slate-800" : "text-slate-700 bg-white"}>Message</option>
            <option value="keyword" className={isDark ? "text-slate-200 bg-slate-800" : "text-slate-700 bg-white"}>Keyword</option>
            <option value="custom" className={isDark ? "text-slate-200 bg-slate-800" : "text-slate-700 bg-white"}>Custom Field</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Operator</label>
          <select
            value={conditionOperator}
            onChange={e => setConditionOperator(e.target.value)}
            className={cn(
              "w-full border p-3 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none",
              isDark ? "bg-slate-800/80 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
            )}
          >
            <option value="=" className={isDark ? "text-slate-200 bg-slate-800" : "text-slate-700 bg-white"}>=  (Equals)</option>
            <option value="!=" className={isDark ? "text-slate-200 bg-slate-800" : "text-slate-700 bg-white"}>!=  (Not Equals)</option>
            <option value="contains" className={isDark ? "text-slate-200 bg-slate-800" : "text-slate-700 bg-white"}>Contains</option>
            <option value="starts_with" className={isDark ? "text-slate-200 bg-slate-800" : "text-slate-700 bg-white"}>Starts With</option>
            <option value="ends_with" className={isDark ? "text-slate-200 bg-slate-800" : "text-slate-700 bg-white"}>Ends With</option>
            <option value="is_empty" className={isDark ? "text-slate-200 bg-slate-800" : "text-slate-700 bg-white"}>Is Empty</option>
            <option value="is_not_empty" className={isDark ? "text-slate-200 bg-slate-800" : "text-slate-700 bg-white"}>Is Not Empty</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Value</label>
          <input
            value={conditionValue}
            onChange={e => setConditionValue(e.target.value)}
            className={cn(
              "w-full border p-3 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none",
              isDark ? "bg-slate-800/80 border-slate-700 text-slate-200 placeholder:text-slate-500" : "bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400"
            )}
            placeholder="e.g. VIP, Premium, etc."
          />
        </div>
        <div className={cn("border rounded-xl p-4", isDark ? "bg-amber-950/40 border-amber-800/60 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-800")}>
          <p className={cn("text-[10px] font-black uppercase mb-1", isDark ? "text-amber-400" : "text-amber-600")}>Preview</p>
          <p className={cn("text-sm font-bold", isDark ? "text-amber-300" : "text-amber-800")}>{buildCondition()}</p>
        </div>
      </div>
    ) : (type === 'plain' || type === 'buttons' || type === 'handoff') ? (
      <div>
        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Message Content</label>
        <textarea
          value={msg}
          onChange={e => setMsg(e.target.value)}
          className={cn(
            "w-full border p-4 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none",
            isDark ? "bg-slate-800/80 border-slate-700 text-slate-200 placeholder:text-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400"
          )}
          rows={4}
          placeholder="Type your message here..."
        />
      </div>
    ) : null}

    {type === 'buttons' && (
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-[10px] font-black uppercase text-slate-400 block mb-0">Buttons</label>
          {buttons.length < 3 && (
            <button onClick={handleAddButton} className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-widest flex items-center gap-1 cursor-pointer">
              <Plus size={10} strokeWidth={3} /> Add Button
            </button>
          )}
        </div>
        <div className="space-y-3">
          {buttons.map((btn, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={btn}
                onChange={(e) => handleButtonChange(i, e.target.value)}
                className={cn(
                  "flex-1 border p-3 rounded-xl text-xs font-bold focus:border-emerald-500 outline-none",
                  isDark ? "bg-slate-800/80 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"
                )}
              />
              <button
                onClick={() => handleRemoveButton(i)}
                className={cn(
                  "p-3 rounded-xl border transition-colors cursor-pointer",
                  isDark
                    ? "text-slate-500 hover:text-red-400 hover:bg-red-950/50 border-transparent hover:border-red-900/60"
                    : "text-slate-400 hover:text-red-500 hover:bg-red-50 border-transparent hover:border-red-100"
                )}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {buttons.length === 0 && <p className={cn("text-xs font-semibold italic", isDark ? "text-slate-500" : "text-slate-400")}>No buttons added.</p>}
        </div>
        {buttons.length < 3 && !buttons.some(b => b.toLowerCase().includes('ai')) && (
          <button
            type="button"
            onClick={() => setButtons([...buttons, '🤖 Talk to AI'])}
            className={cn(
              "w-full mt-2 py-2 px-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border",
              isDark
                ? "bg-indigo-950/50 hover:bg-indigo-900/60 border-indigo-800/80 text-indigo-300"
                : "bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700"
            )}
          >
            <Sparkles size={13} />
            <span>+ Add "🤖 Talk to AI" Button</span>
          </button>
        )}
      </div>
    )}

    {type === 'google_meet' || type === 'calendar' ? (
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Meeting Title / Subject</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={cn(
              "w-full border p-3 rounded-xl text-sm font-bold focus:border-blue-500 outline-none",
              isDark ? "bg-slate-800/80 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
            )}
            placeholder="e.g. Product Demo Call"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Meeting Duration (Minutes)</label>
          <select
            value={duration}
            onChange={e => setDuration(e.target.value)}
            className={cn(
              "w-full border p-3 rounded-xl text-sm font-bold focus:border-blue-500 outline-none",
              isDark ? "bg-slate-800/80 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
            )}
          >
            <option value="15" className={isDark ? "bg-slate-800 text-slate-200" : "bg-white text-slate-800"}>15 Minutes</option>
            <option value="30" className={isDark ? "bg-slate-800 text-slate-200" : "bg-white text-slate-800"}>30 Minutes</option>
            <option value="45" className={isDark ? "bg-slate-800 text-slate-200" : "bg-white text-slate-800"}>45 Minutes</option>
            <option value="60" className={isDark ? "bg-slate-800 text-slate-200" : "bg-white text-slate-800"}>60 Minutes (1 Hour)</option>
          </select>
        </div>
        <div className={cn("p-3 border rounded-xl", isDark ? "bg-blue-950/40 border-blue-800/60 text-blue-300" : "bg-blue-50 border-blue-100 text-blue-800")}>
          <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-1", isDark ? "text-blue-400" : "text-blue-600")}>📹 Automatic Feature</p>
          <p className={cn("text-xs font-medium", isDark ? "text-blue-200" : "text-blue-800")}>When a customer reaches this step, Google Meet will generate a video link and schedule it on Google Calendar with automated reminders!</p>
        </div>
      </div>
    ) : type === 'ai_chat' ? (
      <div className="space-y-4">
        <div className={cn("p-3.5 border rounded-xl", isDark ? "bg-indigo-950/40 border-indigo-800/60 text-indigo-300" : "bg-indigo-50 border-indigo-200 text-indigo-900")}>
          <div className={cn("flex items-center gap-2 font-bold text-xs mb-1", isDark ? "text-indigo-400" : "text-indigo-700")}>
            <Sparkles size={16} />
            <span>AI Assistant Hybrid Handoff</span>
          </div>
          <p className={cn("text-xs leading-relaxed font-medium", isDark ? "text-indigo-200" : "text-indigo-900")}>
            When customer reaches this step, conversation hands off to your <strong>Automations AI Smart Assistant</strong> and answers queries dynamically using your <strong>RAG Knowledge Base</strong>.
          </p>
        </div>

        <div className={cn("p-3 border rounded-xl", isDark ? "bg-amber-950/40 border-amber-800/60 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-900")}>
          <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-0.5", isDark ? "text-amber-400" : "text-amber-800")}>⏱️ 2-Minute Inactivity Auto-Cycle</p>
          <p className={cn("text-xs font-medium", isDark ? "text-amber-200" : "text-amber-900")}>
            If the customer does not send any message for <strong>2 minutes</strong>, the AI session automatically closes and returns the customer back to the Workflow / Main Menu!
          </p>
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">AI Welcome Message</label>
          <textarea
            value={msg || ''}
            onChange={e => setMsg(e.target.value)}
            rows={4}
            className={cn(
              "w-full border p-3 rounded-xl text-xs font-semibold focus:border-indigo-500 outline-none leading-relaxed",
              isDark ? "bg-slate-800/80 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
            )}
            placeholder="e.g. 🤖 AI Assistant Connected! Ask me anything about our products, pricing, or services..."
          />
        </div>
      </div>
    ) : type === 'catalog_product' ? (
      <div className="space-y-4">
        <div className={cn("p-3 border rounded-xl", isDark ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-900")}>
          <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-1", isDark ? "text-emerald-400" : "text-emerald-700")}>🛍️ Send Catalog Product</p>
          <p className={cn("text-xs font-medium", isDark ? "text-emerald-200" : "text-emerald-900")}>Select a product from your Catalog to send its photo, price, and Buy Now button directly to the customer on WhatsApp.</p>
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 flex items-center justify-between">
            <span>Select Product from Catalog *</span>
            <span className="text-emerald-500 font-semibold lowercase">
              {availableProducts.length} {availableProducts.length === 1 ? 'item' : 'items'} available
            </span>
          </label>
          <select
            value={selectedProductId}
            onChange={e => handleProductSelect(e.target.value)}
            className={cn(
              "w-full border p-3 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none",
              isDark ? "bg-slate-800/80 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
            )}
          >
            <option value="" className={isDark ? "bg-slate-800 text-slate-200" : "bg-white text-slate-800"}>-- Choose from Catalog --</option>
            {availableProducts.map(p => (
              <option key={p.id} value={p.id} className={isDark ? "bg-slate-800 text-slate-200" : "bg-white text-slate-800"}>
                {p.name} — ${p.price || '0.00'} {p.sku ? `(SKU: ${p.sku})` : ''}
              </option>
            ))}
          </select>
        </div>

        {mediaUrl && (
          <div className={cn("flex items-center gap-3 p-3 border rounded-xl", isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200")}>
            <img src={mediaUrl} alt="Product Preview" className={cn("w-16 h-16 rounded-lg object-cover border", isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-white")} />
            <div className="flex-1 min-w-0">
              <p className={cn("text-xs font-bold truncate", isDark ? "text-slate-200" : "text-slate-800")}>{msg || 'Selected Product'}</p>
              <p className="text-xs font-bold text-emerald-500">${title || '0.00'}</p>
              <span className="text-[9px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={10} className="text-emerald-500" /> Photo attached for WhatsApp
              </span>
            </div>
          </div>
        )}

        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Product Display Name</label>
          <input
            value={msg || ''}
            onChange={e => setMsg(e.target.value)}
            className={cn(
              "w-full border p-3 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none",
              isDark ? "bg-slate-800/80 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
            )}
            placeholder="e.g. Books"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Price ($)</label>
            <input
              value={title || ''}
              onChange={e => setTitle(e.target.value)}
              className={cn(
                "w-full border p-3 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none",
                isDark ? "bg-slate-800/80 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
              )}
              placeholder="20.00"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">CTA Button Text</label>
            <input
              value={keyword || 'View Product'}
              onChange={e => setKeyword(e.target.value)}
              className={cn(
                "w-full border p-3 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none",
                isDark ? "bg-slate-800/80 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
              )}
              placeholder="View Product"
            />
          </div>
        </div>

        <div className={cn("p-3 border rounded-xl space-y-1.5", isDark ? "bg-emerald-950/30 border-emerald-800/50" : "bg-emerald-50/50 border-emerald-100")}>
          <p className={cn("text-[10px] font-black uppercase tracking-wider", isDark ? "text-emerald-400" : "text-emerald-700")}>WhatsApp Output Elements:</p>
          <p className={cn("text-[11px] font-medium flex items-center gap-1.5", isDark ? "text-slate-300" : "text-slate-600")}>
            <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
            <span>Product Photo Card (Header)</span>
          </p>
          <p className={cn("text-[11px] font-medium flex items-center gap-1.5", isDark ? "text-slate-300" : "text-slate-600")}>
            <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
            <span>Product Title, Price & Link</span>
          </p>
          <p className={cn("text-[11px] font-medium flex items-center gap-1.5", isDark ? "text-slate-300" : "text-slate-600")}>
            <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
            <span>Interactive <strong>[ 🛒 Buy Now ]</strong> and <strong>[ View Product ]</strong> Buttons</span>
          </p>
        </div>
      </div>
    ) : (type === 'image' || type === 'video') ? (
      <div className="space-y-4">
        <div className={cn(
          "p-3 border rounded-xl",
          isDark ? "bg-purple-950/40 border-purple-800/60 text-purple-300" : "bg-purple-50 border-purple-200 text-purple-900"
        )}>
          <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5", isDark ? "text-purple-400" : "text-purple-700")}>
            {type === 'image' ? <ImageIcon size={14} /> : <Video size={14} />}
            <span>WhatsApp {type === 'image' ? 'Image' : 'Video'} Attachment</span>
          </p>
          <p className={cn("text-xs font-medium", isDark ? "text-purple-200" : "text-purple-800")}>
            {type === 'image'
              ? 'Upload an image or paste a link. This photo will be delivered directly to the customer on WhatsApp/Instagram.'
              : 'Upload an MP4 video or paste a link. This video will be sent directly to the customer on WhatsApp/Instagram.'}
          </p>
        </div>

        {/* Media Preview & Upload */}
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 flex items-center justify-between">
            <span>{type === 'image' ? 'Image File (PNG, JPG, WEBP)' : 'Video File (MP4)'} *</span>
            {mediaUrl && (
              <button
                type="button"
                onClick={() => setMediaUrl('')}
                className="text-[10px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={11} /> Remove Media
              </button>
            )}
          </label>

          {mediaUrl ? (
            <div className={cn("p-3 rounded-2xl border flex flex-col gap-2.5", isDark ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200")}>
              <div className="aspect-video rounded-xl overflow-hidden bg-black/10 border border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
                {type === 'video' ? (
                  <video src={mediaUrl} controls className="w-full h-full object-contain" />
                ) : (
                  <img src={mediaUrl} alt="Preview" className="w-full h-full object-contain" />
                )}
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-emerald-500 font-bold truncate flex items-center gap-1">
                  <CheckCircle2 size={12} className="shrink-0" /> Cloud Media Attached
                </span>
                <button
                  type="button"
                  disabled={uploadingMedia}
                  onClick={() => mediaInputRef.current?.click()}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  {uploadingMedia ? 'Uploading...' : 'Replace'}
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => !uploadingMedia && mediaInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2",
                isDark 
                  ? "border-slate-700 bg-slate-800/50 hover:border-emerald-500 hover:bg-emerald-950/20" 
                  : "border-slate-300 bg-slate-50/60 hover:border-emerald-500 hover:bg-emerald-50/30",
                uploadingMedia ? "opacity-60 pointer-events-none" : ""
              )}
            >
              {uploadingMedia ? (
                <>
                  <Loader2 size={24} className="text-emerald-500 animate-spin" />
                  <p className="text-xs font-bold text-emerald-500">Uploading to Azure Cloud...</p>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    {type === 'image' ? <ImageIcon size={20} /> : <Video size={20} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Click to <span className="text-emerald-500 underline underline-offset-2">Browse {type === 'image' ? 'Image' : 'Video'}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {type === 'image' ? 'PNG, JPG, WEBP, GIF (Up to 10MB)' : 'MP4, MOV, WEBM (Up to 50MB)'}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          <input
            ref={mediaInputRef}
            type="file"
            accept={type === 'image' ? 'image/png,image/jpeg,image/webp,image/gif' : 'video/mp4,video/quicktime,video/webm'}
            onChange={handleMediaUpload}
            className="hidden"
          />

          {uploadError && (
            <p className="text-[11px] text-rose-500 font-bold mt-1.5 flex items-center gap-1">
              <XCircle size={12} /> {uploadError}
            </p>
          )}
        </div>

        {/* Or Direct Public URL Input */}
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block">
            Or Paste Media URL Directly
          </label>
          <input
            type="url"
            value={mediaUrl || ''}
            onChange={e => setMediaUrl(e.target.value)}
            placeholder={type === 'image' ? 'https://example.com/banner.jpg' : 'https://example.com/video.mp4'}
            className={cn(
              "w-full border p-3 rounded-xl text-xs font-semibold focus:border-purple-500 outline-none",
              isDark ? "bg-slate-800/80 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
            )}
          />
        </div>

        {/* Message / Caption */}
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-1.5 block">
            {type === 'image' ? 'Image Caption (Optional)' : 'Video Caption (Optional)'}
          </label>
          <textarea
            value={msg || ''}
            onChange={e => setMsg(e.target.value)}
            rows={3}
            className={cn(
              "w-full border p-3 rounded-xl text-xs font-semibold focus:border-purple-500 outline-none leading-relaxed",
              isDark ? "bg-slate-800/80 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-800"
            )}
            placeholder="Text message sent alongside the media..."
          />
        </div>
      </div>
    ) : null}

    <div className="flex items-center gap-3 pt-2">
      <button onClick={() => onSave({
        message: msg,
        title,
        duration,
        buttons,
        mediaUrl,
        productId: selectedProductId,
        productName: msg,
        productPrice: title,
        ctaText: keyword,
        keyword: triggerMode === 'ALL' ? '*' : keyword,
        triggerMode,
        condition: type === 'condition' ? buildCondition() : (data.condition || ''),
        conditionField,
        conditionOperator,
        conditionValue
      })} className="flex-1 py-3.5 bg-emerald-600 text-white rounded-xl font-black uppercase text-[10px] hover:bg-emerald-700 hover:shadow-lg transition-all cursor-pointer">Save Changes</button>
      {type !== 'trigger' && (
        <button
          onClick={onDelete}
          className={cn(
            "py-3.5 px-4 rounded-xl font-black uppercase text-[10px] transition-all flex items-center gap-1.5 cursor-pointer border shadow-xs",
            isDark
              ? "bg-red-950/50 text-red-400 hover:bg-red-600 hover:text-white border-red-800/60"
              : "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-200"
          )}
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      )}
    </div>
  </div>);
};

const SidebarCategory = ({ title, icon: Icon, expanded, children }) => {
  const { isDark } = useTheme();
  return (
    <div>
      <div className={cn(
        "w-full p-5 flex items-center gap-3",
        isDark ? "bg-slate-900/40 text-emerald-400" : "bg-slate-50/30 text-emerald-600"
      )}>
        <Icon size={18} /><span className="text-xs font-black uppercase tracking-widest">{title}</span>
      </div>
      <div className="overflow-hidden">{children}</div>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, onDragStart, onClick, color = "slate" }) => {
  const { isDark } = useTheme();
  return (
    <div
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onClick={onClick}
      className={cn(
        "w-full p-4 pl-12 flex items-center gap-4 group cursor-grab active:cursor-grabbing transition-all cursor-pointer",
        isDark ? "hover:bg-slate-800/60" : "hover:bg-slate-50"
      )}
    >
      <Icon size={16} className={cn("transition-colors", isDark ? "text-slate-500 group-hover:text-emerald-400" : "text-slate-400 group-hover:text-emerald-600")} />
      <span className={cn(
        "text-[11px] font-bold uppercase tracking-widest transition-colors",
        isDark ? "text-slate-400 group-hover:text-slate-100" : "text-slate-500 group-hover:text-slate-900"
      )}>
        {label}
      </span>
    </div>
  );
};

const WorkflowBuilder = () => (<ReactFlowProvider><WorkflowBuilderInner /></ReactFlowProvider>);

export default WorkflowBuilder;


