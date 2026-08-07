'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

import Sidebar from '@/components/builder/Sidebar';
import PropertiesPanel from '@/components/builder/PropertiesPanel';
import { TriggerNode, MessageNode, ButtonsNode, ConditionNode, HandoffNode } from '@/components/builder/CustomNodes';

const nodeTypes = {
  trigger: TriggerNode,
  message: MessageNode,
  buttons: ButtonsNode,
  condition: ConditionNode,
  handoff: HandoffNode,
};

let id = 0;
const getId = () => `node_${id++}`;

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = params.id;
  const isNew = workflowId === 'new';

  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  useEffect(() => {
    if (!isNew) {
      fetchWorkflow();
    } else {
      // Add default trigger node
      const defaultTrigger = {
        id: getId(),
        type: 'trigger',
        position: { x: 250, y: 150 },
        data: { label: 'Greeting', keywords: ['hello', 'hi'] },
      };
      setNodes([defaultTrigger]);
    }
  }, [isNew, workflowId]);

  const fetchWorkflow = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/workflows/${workflowId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkflowName(res.data.name);
      
      if (res.data.steps && res.data.steps.nodes) {
        setNodes(res.data.steps.nodes);
        setEdges(res.data.steps.edges || []);
        
        // Find max id to avoid collision
        const maxId = res.data.steps.nodes.reduce((max, node) => {
          const num = parseInt(node.id.replace('node_', ''));
          return num > max ? num : max;
        }, -1);
        id = maxId + 1;
      }
    } catch (error) {
      console.error('Failed to fetch workflow', error);
    } finally {
      setLoading(false);
    }
  };

  const onConnect = useCallback((params) => {
    const edge = {
      ...params,
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
      style: { stroke: '#94a3b8', strokeWidth: 2 },
    };
    setEdges((eds) => addEdge(edge, eds));
  }, [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const handleSave = async () => {
    if (!reactFlowInstance) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const flow = reactFlowInstance.toObject();
      
      const payload = {
        name: workflowName,
        trigger_type: 'KEYWORD',
        // Determine trigger_value from trigger nodes
        trigger_value: flow.nodes.filter(n => n.type === 'trigger').map(n => n.data.keywords).flat().filter(Boolean),
        steps: {
          nodes: flow.nodes,
          edges: flow.edges,
        },
        enabled: true,
      };

      if (isNew) {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/workflows/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        router.replace(`/client/automations/builder/${res.data.id}`);
      } else {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/workflows/${workflowId}/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Error saving workflow', error);
      alert('Failed to save workflow');
    } finally {
      setSaving(false);
    }
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] w-full relative">
        {/* Header */}
        <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm relative">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/client/automations')}
              className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <input 
              type="text" 
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="font-semibold text-lg text-slate-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-brand-500 rounded px-2 py-1 w-64"
              placeholder="Workflow Name"
            />
          </div>
          
          <div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'Saving...' : 'Save Workflow'}
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex overflow-hidden relative">
          <Sidebar />
          
          <div className="flex-1 relative" ref={reactFlowWrapper}>
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                <Loader2 size={32} className="animate-spin text-brand-500" />
              </div>
            ) : (
              <ReactFlowProvider>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onInit={setReactFlowInstance}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onNodeClick={onNodeClick}
                  onPaneClick={onPaneClick}
                  nodeTypes={nodeTypes}
                  fitView
                  className="bg-slate-50"
                  defaultEdgeOptions={{
                    type: 'smoothstep',
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
                    style: { stroke: '#94a3b8', strokeWidth: 2 },
                  }}
                >
                  <Background color="#cbd5e1" gap={20} size={1.5} />
                  <Controls className="bg-white border-slate-200 shadow-sm rounded-lg" />
                </ReactFlow>
              </ReactFlowProvider>
            )}
          </div>

          {/* Properties Panel Overlay */}
          {selectedNodeId && (
            <PropertiesPanel 
              selectedNode={selectedNode} 
              setNodes={setNodes} 
              closePanel={() => setSelectedNodeId(null)} 
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
