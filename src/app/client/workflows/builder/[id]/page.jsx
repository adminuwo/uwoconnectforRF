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
  MousePointer2, ArrowLeft, CheckCircle2, XCircle, Play, X, Plus, Trash2, Edit3, User, ShoppingBag, ExternalLink
} from 'lucide-react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { templateData } from '../../templateData';
import { API_BASE_URL } from '@/config/apiConfig';


const cn = (...classes) => classes.filter(Boolean).join(' ');

// --- CUSTOM NODE WRAPPER ---
const NodeContainer = ({ children, title, icon: Icon, color, id, isTrigger }) => {
  const { deleteElements } = useReactFlow();
  const onDelete = (e) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden w-64 group relative animate-in fade-in zoom-in duration-200">
      <div className={cn("px-4 py-2.5 flex items-center justify-between border-b border-slate-100", color)}>
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
      <div className="bg-slate-800 rounded-lg p-2.5 border border-slate-700">
        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest truncate">
          {isAnyMessage ? '⚡ Any Incoming Message' : `"${data.keyword || 'Any Keyword'}"`}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 -bottom-1" />
    </div>
  );
};

const PlainNode = ({ id, data = {} }) => (
  <NodeContainer id={id} title="Message" icon={MessageSquare} color="bg-emerald-600">
    <p className="text-xs font-semibold text-slate-700 leading-relaxed line-clamp-3">"{data.message || 'Enter message...'}"</p>
    <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-slate-400 border-2 border-white -top-1" />
    <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-emerald-600 border-2 border-white -bottom-1" />
  </NodeContainer>
);

const ButtonsNode = ({ id, data = {} }) => {
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
      <p className="text-[11px] font-semibold text-slate-700 mb-4 line-clamp-2">"{data.message || 'Options...'}"</p>
      <div className="space-y-2">
        {buttons.map((btn, i) => (
          <div key={i} className="relative">
            <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-[9px] font-bold text-indigo-600 uppercase tracking-widest text-center">{btn}</div>
            <Handle type="source" position={Position.Right} id={`btn-${i}`} className="w-2 h-2 bg-indigo-500 border-2 border-white -right-1" />
          </div>
        ))}
        {buttons.length < 3 && (
          <button
            onClick={handleAddButton}
            className="w-full mt-2 py-1.5 border border-dashed border-indigo-200 rounded-lg text-[9px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1"
          >
            <Plus size={10} strokeWidth={3} /> Add Button
          </button>
        )}
      </div>
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-slate-400 border-2 border-white -top-1" />
    </NodeContainer>
  );
};

const ImageNode = ({ id, data = {} }) => (
  <NodeContainer id={id} title="Image" icon={ImageIcon} color="bg-purple-600">
    <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-2 border border-dashed border-slate-200 overflow-hidden relative">
      {data.mediaUrl ? (
        <img src={data.mediaUrl} alt="Upload preview" className="w-full h-full object-cover" />
      ) : (
        <ImageIcon size={20} className="text-slate-300" />
      )}
    </div>
    <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-slate-400 border-2 border-white -top-1" />
    <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-purple-600 border-2 border-white -bottom-1" />
  </NodeContainer>
);

const VideoNode = ({ id, data = {} }) => (
  <NodeContainer id={id} title="Video" icon={Video} color="bg-rose-600">
    <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center mb-2 border border-dashed border-slate-200 overflow-hidden relative">
      {data.mediaUrl ? (
        <video src={data.mediaUrl} className="w-full h-full object-cover" controls />
      ) : (
        <Video size={20} className="text-slate-300" />
      )}
    </div>
    <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-slate-400 border-2 border-white -top-1" />
    <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-rose-600 border-2 border-white -bottom-1" />
  </NodeContainer>
);

const BranchNode = ({ id, data = {} }) => (
  <NodeContainer id={id} title="Condition" icon={Zap} color="bg-amber-500">
    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3 text-center">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Check Logic</p>
      <p className="text-[10px] font-bold text-slate-700 uppercase">{data.condition || 'IF TAG = VIP'}</p>
    </div>
    <div className="flex justify-between items-center px-2">
      <CheckCircle2 size={16} className="text-emerald-500" />
      <XCircle size={16} className="text-red-500" />
    </div>
    <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-slate-400 border-2 border-white -top-1" />
    <Handle type="source" position={Position.Right} id="true" style={{ top: '75%' }} className="w-2.5 h-2.5 bg-emerald-500 border-2 border-white -right-1" />
    <Handle type="source" position={Position.Right} id="false" style={{ top: '75%', right: '-34px' }} className="w-2.5 h-2.5 bg-red-500 border-2 border-white -right-1" />
  </NodeContainer>
);

const HandoffNode = ({ id, data = {} }) => (
  <NodeContainer id={id} title="Talk to Human" icon={User} color="bg-rose-500">
    <p className="text-xs font-semibold text-slate-700 leading-relaxed line-clamp-3">"{data.message || 'Connecting you to a human agent. Please wait...'}"</p>
    <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-slate-400 border-2 border-white -top-1" />
  </NodeContainer>
);

const GoogleMeetNode = ({ id, data = {} }) => (
  <NodeContainer id={id} title="Google Meet & Calendar" icon={Video} color="bg-blue-600">
    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-2">
      <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">📅 Schedule Meeting</p>
      <p className="text-xs font-semibold text-slate-700 leading-relaxed truncate">"{data.title || 'Product Demo Call'}"</p>
      <div className="mt-2 flex items-center justify-between text-[9px] text-slate-500 font-bold">
        <span>⏱️ {data.duration || 30} mins</span>
        <span className="text-blue-600">📹 Auto Meet Link</span>
      </div>
    </div>
    <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-slate-400 border-2 border-white -top-1" />
    <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-blue-600 border-2 border-white -bottom-1" />
  </NodeContainer>
);

const CatalogProductNode = ({ id, data = {} }) => (
  <NodeContainer id={id} title="Send Catalog Product" icon={ShoppingBag} color="bg-emerald-600">
    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 mb-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">🛍️ Catalog Item</span>
        <span className="text-xs font-black text-slate-900">${data.productPrice || '29.99'}</span>
      </div>
      <p className="text-xs font-bold text-slate-800 truncate mb-1">"{data.productName || 'Select Product...'}"</p>
      <div className="bg-emerald-50 text-emerald-800 p-1.5 rounded text-[10px] font-semibold flex items-center justify-between">
        <span>🔗 [{data.ctaText || 'View Product'}]</span>
        <ExternalLink size={10} />
      </div>
    </div>
    <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-slate-400 border-2 border-white -top-1" />
    <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-emerald-600 border-2 border-white -bottom-1" />
  </NodeContainer>
);

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
        style={{ ...style, strokeWidth: 3, stroke: '#94a3b8', cursor: 'pointer' }}
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
            className="w-5 h-5 bg-white border border-slate-300 text-slate-400 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer hover:scale-125"
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
  const { id } = useParams();
  const router = useRouter();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflow, setWorkflow] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [deploymentChannels, setDeploymentChannels] = useState(['WHATSAPP']); // WHATSAPP, INSTAGRAM, FACEBOOK
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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
            position: n.position || {x:0, y:0},
            type: (!n.type || n.type === 'default') ? 'plain' : n.type
          })));
          setEdges(Array.isArray(tData.edges) ? tData.edges : []);
        } else {
          setNodes([{ id: 'start', type: 'trigger', position: {x:250, y:50}, data: { keyword: 'Any Keyword' } }]);
        }
      } else {
        const token = localStorage.getItem('uwo_token');
        const res = await axios.get(`${API_BASE_URL}/api/workflows/${id}/`, { headers: { Authorization: `Bearer ${token}` } });
        setWorkflow(res.data);
        setDeploymentChannels(res.data.channels || ['WHATSAPP']);
        let steps = res.data.steps;
        if (typeof steps === 'string') try { steps = JSON.parse(steps); } catch(e) { steps = {}; }
        if (steps && Array.isArray(steps.nodes) && steps.nodes.length > 0) {
          setNodes(steps.nodes.map(n => ({ 
            ...n, 
            data: n.data || {}, 
            position: n.position || {x:0, y:0}, 
            type: (!n.type || n.type === 'default') ? 'plain' : n.type 
          })));
          setEdges(Array.isArray(steps.edges) ? steps.edges : []);
        } else {
          setNodes([{ id: 'start', type: 'trigger', position: {x:250, y:50}, data: { keyword: 'Any Keyword' } }]);
        }
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

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-emerald-600" size={30} /></div>;
  const isShared = deploymentChannels.length > 1 || (workflow && workflow.is_shared);

  return (
    <div className="h-screen w-full bg-[#f8fafc] flex flex-col overflow-hidden font-sans text-slate-900">
      {/* Responsive Top Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:px-6 md:py-0 md:h-16 bg-white border-b border-slate-200 z-10 gap-4 shrink-0 shadow-sm">
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/client/workflows')} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-widest transition-colors shrink-0">
              <ArrowLeft size={14} /> <span className="hidden sm:inline">Go back</span>
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors shrink-0"
              title="Toggle actions panel"
            >
              <List size={16} />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-xs sm:text-sm font-bold tracking-tight text-slate-800 uppercase truncate">{workflow?.name}</h1>
              {isShared && (
                <span className="text-[9px] font-black uppercase bg-slate-900 text-white px-2 py-0.5 rounded tracking-wider shrink-0 hidden sm:inline">
                  Shared
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Current Deployment Selector */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 w-full md:w-auto">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider w-full sm:w-auto">Deployment:</span>
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
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
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
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
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
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

        <button onClick={handleSave} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-50 flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto shrink-0">
          {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={14} />} Save Workflow
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar Overlay */}
        {isSidebarOpen && (
          <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-xs md:hidden" />
        )}

        {/* Collapsible Left Sidebar */}
        <div className={cn(
          "w-72 bg-white border-r border-slate-200 flex flex-col overflow-y-auto transition-all duration-300 shrink-0",
          "fixed md:static inset-y-0 left-0 z-30 md:z-auto",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <div className="p-4 border-b border-slate-100 flex items-center justify-between md:hidden bg-slate-50">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Actions Menu</span>
            <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-slate-900"><X size={18} /></button>
          </div>
          <div className="p-5 border-b border-slate-100 bg-slate-50/50"><h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Actions</h3></div>
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
               <SidebarItem icon={Zap} label="Set a Condition" onDragStart={(e) => onDragStart(e, 'condition')} onClick={() => { handleAddNodeDirectly('condition'); setIsSidebarOpen(false); }} color="amber" />
             </div>
             <div className="px-4 py-2">
               <SidebarItem icon={User} label="Talk to Human" onDragStart={(e) => onDragStart(e, 'handoff')} onClick={() => { handleAddNodeDirectly('handoff'); setIsSidebarOpen(false); }} color="rose" />
             </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative bg-[#f1f5f9]" ref={reactFlowWrapper}>
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
            <Background color="#cbd5e1" gap={25} size={1} variant="dots" />
            <Controls className="bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden m-4 sm:m-8" />
          </ReactFlow>
        </div>

        {/* Responsive Edit Drawer */}
        {selectedNode && (
          <>
            <div onClick={() => setSelectedNode(null)} className="fixed inset-0 z-20 bg-slate-900/20 backdrop-blur-xs sm:hidden" />
            <div className="w-full sm:w-[400px] bg-white border-l border-slate-200 shadow-2xl flex flex-col z-30 fixed sm:absolute inset-y-0 right-0 max-h-screen overflow-y-auto">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-sm font-black uppercase tracking-widest">Edit Step</h3>
                <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-900"><X size={20} /></button>
              </div>
              <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
                <MessageForm 
                  key={selectedNode.id} 
                  data={selectedNode.data} 
                  type={selectedNode.type} 
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
const MessageForm = ({ data, type, onSave, onDelete }) => {
  const [msg, setMsg] = useState(data.message || '');
  const [title, setTitle] = useState(data.title || 'Product Demo Call');
  const [duration, setDuration] = useState(data.duration || '30');
  const [buttons, setButtons] = useState(data.buttons || ['Option 1']);
  const [mediaUrl, setMediaUrl] = useState(data.mediaUrl || null);
  const [keyword, setKeyword] = useState(data.keyword || '');
  const [conditionField, setConditionField] = useState(data.conditionField || 'tag');
  const [conditionOperator, setConditionOperator] = useState(data.conditionOperator || '=');
  const [conditionValue, setConditionValue] = useState(data.conditionValue || '');
  const [condition, setCondition] = useState(data.condition || '');

  const [triggerMode, setTriggerMode] = useState(data.triggerMode || (data.keyword === '*' ? 'ALL' : 'KEYWORDS'));

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
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
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                setTriggerMode('KEYWORDS');
                if (keyword === '*') setKeyword('hi, hello');
              }}
              className={cn(
                "py-2.5 px-3 rounded-lg text-xs font-bold transition-all",
                triggerMode === 'KEYWORDS' 
                  ? "bg-white text-emerald-600 shadow-sm border border-slate-200" 
                  : "text-slate-500 hover:text-slate-900"
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
                "py-2.5 px-3 rounded-lg text-xs font-bold transition-all",
                triggerMode === 'ALL' 
                  ? "bg-white text-emerald-600 shadow-sm border border-slate-200" 
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              ⚡ Any Message
            </button>
          </div>
        </div>

        {triggerMode === 'KEYWORDS' ? (
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Trigger Keywords</label>
            <p className="text-[10px] text-slate-500 mb-2">Enter keywords separated by commas (e.g. mall, offer, hi)</p>
            <input 
              value={keyword === '*' ? '' : keyword} 
              onChange={e => setKeyword(e.target.value)} 
              className="w-full bg-slate-50 border p-4 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none text-slate-800 placeholder:text-slate-400" 
              placeholder="e.g. hi, hello, hospital..." 
            />
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
              <Zap size={14} className="text-emerald-600 fill-emerald-600" />
              All Messages Trigger Enabled
            </p>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
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
            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700 focus:border-emerald-500 outline-none"
          >
            <option value="tag" className="text-slate-700 bg-white">Tag</option>
            <option value="name" className="text-slate-700 bg-white">Name</option>
            <option value="phone" className="text-slate-700 bg-white">Phone</option>
            <option value="message" className="text-slate-700 bg-white">Message</option>
            <option value="keyword" className="text-slate-700 bg-white">Keyword</option>
            <option value="custom" className="text-slate-700 bg-white">Custom Field</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Operator</label>
          <select 
            value={conditionOperator} 
            onChange={e => setConditionOperator(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700 focus:border-emerald-500 outline-none"
          >
            <option value="=" className="text-slate-700 bg-white">=  (Equals)</option>
            <option value="!=" className="text-slate-700 bg-white">!=  (Not Equals)</option>
            <option value="contains" className="text-slate-700 bg-white">Contains</option>
            <option value="starts_with" className="text-slate-700 bg-white">Starts With</option>
            <option value="ends_with" className="text-slate-700 bg-white">Ends With</option>
            <option value="is_empty" className="text-slate-700 bg-white">Is Empty</option>
            <option value="is_not_empty" className="text-slate-700 bg-white">Is Not Empty</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Value</label>
          <input 
            value={conditionValue} 
            onChange={e => setConditionValue(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm font-bold text-slate-700 focus:border-emerald-500 outline-none" 
            placeholder="e.g. VIP, Premium, etc." 
          />
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-[10px] font-black uppercase text-amber-600 mb-1">Preview</p>
          <p className="text-sm font-bold text-amber-800">{buildCondition()}</p>
        </div>
      </div>
    ) : (
      <div>
        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Message Content</label>
        <textarea value={msg} onChange={e => setMsg(e.target.value)} className="w-full bg-slate-50 border p-4 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none text-slate-800 placeholder:text-slate-400" rows={4} placeholder="Type your message here..." />
      </div>
    )}
    
    {type === 'buttons' && (
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-[10px] font-black uppercase text-slate-400 block mb-0">Buttons</label>
          {buttons.length < 3 && (
            <button onClick={handleAddButton} className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest flex items-center gap-1">
              <Plus size={10} strokeWidth={3} /> Add Button
            </button>
          )}
        </div>
        <div className="space-y-3">
          {buttons.map((btn, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={btn} onChange={(e) => handleButtonChange(i, e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs font-bold text-slate-700 focus:border-emerald-500 outline-none" />
              <button onClick={() => handleRemoveButton(i)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors rounded-xl border border-transparent hover:border-red-100">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {buttons.length === 0 && <p className="text-xs text-slate-400 font-semibold italic">No buttons added.</p>}
        </div>
      </div>
    )}

    {(type === 'image' || type === 'video') && (
      <div>
        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Upload Media</label>
        <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
          <input 
            type="file" 
            accept={type === 'image' ? 'image/*' : 'video/*'} 
            onChange={handleFileUpload} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          />
          {mediaUrl ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 size={24} className="text-emerald-500" />
              <span className="text-xs font-bold text-slate-700">Media selected</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Plus size={24} className="text-slate-400" />
              <span className="text-xs font-bold text-slate-500">Click to browse or drag & drop</span>
            </div>
          )}
        </div>
      </div>
    )}

    {type === 'google_meet' || type === 'calendar' ? (
      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Meeting Title / Subject</label>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="w-full bg-slate-50 border p-3 rounded-xl text-sm font-bold focus:border-blue-500 outline-none text-slate-800" 
            placeholder="e.g. Product Demo Call" 
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Meeting Duration (Minutes)</label>
          <select 
            value={duration} 
            onChange={e => setDuration(e.target.value)} 
            className="w-full bg-slate-50 border p-3 rounded-xl text-sm font-bold focus:border-blue-500 outline-none text-slate-800"
          >
            <option value="15">15 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="45">45 Minutes</option>
            <option value="60">60 Minutes (1 Hour)</option>
          </select>
        </div>
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">📹 Automatic Feature</p>
          <p className="text-xs text-blue-800 font-medium">When a customer reaches this step, Google Meet will generate a video link and schedule it on Google Calendar with automated reminders!</p>
        </div>
      </div>
    ) : type === 'catalog_product' ? (
      <div className="space-y-4">
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-1">🛍️ Send Catalog Product</p>
          <p className="text-xs text-emerald-900 font-medium">Select product from your UWOConnect Catalog to send directly to customer on WhatsApp.</p>
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Product Name *</label>
          <input 
            value={msg || data.productName || ''} 
            onChange={e => setMsg(e.target.value)} 
            className="w-full bg-slate-50 border p-3 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none text-slate-800" 
            placeholder="e.g. AI Automation Book" 
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Price ($)</label>
            <input 
              value={title || data.productPrice || '29.99'} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full bg-slate-50 border p-3 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none text-slate-800" 
              placeholder="29.99" 
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">CTA Button Text</label>
            <input 
              value={keyword || data.ctaText || 'View Product'} 
              onChange={e => setKeyword(e.target.value)} 
              className="w-full bg-slate-50 border p-3 rounded-xl text-sm font-bold focus:border-emerald-500 outline-none text-slate-800" 
              placeholder="View Product" 
            />
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-100">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Send Included Elements:</p>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-emerald-600 rounded" /> ☑ Image
          </label>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-emerald-600 rounded" /> ☑ Product Link
          </label>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-emerald-600 rounded" /> ☑ CTA Button [ View Product ]
          </label>
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
        <button onClick={onDelete} className="py-3.5 px-4 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl font-black uppercase text-[10px] transition-all flex items-center gap-1.5 cursor-pointer border border-red-200 shadow-xs">
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      )}
    </div>
  </div>);
};

const SidebarCategory = ({ title, icon: Icon, expanded, children }) => (
  <div>
    <div className="w-full p-5 flex items-center gap-3 bg-slate-50/30 text-emerald-600">
      <Icon size={18} /><span className="text-xs font-black uppercase tracking-widest">{title}</span>
    </div>
    <div className="overflow-hidden">{children}</div>
  </div>
);

const SidebarItem = ({ icon: Icon, label, onDragStart, onClick, color = "slate" }) => (
  <div 
    draggable={!!onDragStart} 
    onDragStart={onDragStart} 
    onClick={onClick}
    className="w-full p-4 pl-12 flex items-center gap-4 group cursor-grab active:cursor-grabbing hover:bg-slate-50 transition-all cursor-pointer"
  >
    <Icon size={16} className={cn("text-slate-400 group-hover:text-emerald-600")} />
    <span className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 uppercase tracking-widest">{label}</span>
  </div>
);

const WorkflowBuilder = () => (<ReactFlowProvider><WorkflowBuilderInner /></ReactFlowProvider>);

export default WorkflowBuilder;


