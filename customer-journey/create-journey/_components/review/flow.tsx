import CustomEdge from "@/components/ui/flows/journey/custom-edge";
import { NeuturalNode } from "@/components/ui/flows/journey/custom-nodes/neutural-node";
import { StepNode } from "@/components/ui/flows/journey/custom-nodes/step-node";
import { ChannelDialog } from "@/components/ui/flows/journey/form-channel/channel-dialog";
import useLayout from "@/components/ui/flows/layout";
import { GraphLabel } from "@dagrejs/dagre";
import {
    Background,
    BackgroundVariant,
    Controls,
    Edge,
    MiniMap,
    Node,
    ReactFlow,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useEffect } from "react";

type NodeData = {
    label?: string;
    icon?: React.ReactNode;
};

const initialNodes = [
    { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
    { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const edgeTypes = {
    "plus-edge": CustomEdge,
    "vanila-edge": CustomEdge,
};

const nodeTypes = {
    create: NeuturalNode,
    entrance: StepNode,
    gate: StepNode,
    callback: StepNode,
    count: StepNode,
    delay: StepNode,
    apply: StepNode,
    send: StepNode,
    repeat: StepNode,
    history: StepNode,
};

const layoutOptions: GraphLabel = {
    rankdir: "TB",
    nodesep: 200,
    ranksep: 100,
    ranker: "network-simplex",
    marginx: 20,
    marginy: 20,
    edgesep: 50,
    acyclicer: "greedy",
};

type FlowNode = Node<NodeData>;
type FlowEdge = Edge;

export default function Flow({ formData }: { formData: any }) {
    const [nodes, setNodes, onNodesChange] =
        useNodesState<FlowNode>(initialNodes);
    const [edges, setEdges, onEdgesChange] =
        useEdgesState<FlowEdge>(initialEdges);

    const layoutedNodes = useLayout(layoutOptions, edges);

    useEffect(() => {
        if (layoutedNodes.length > 0) {
            setNodes(layoutedNodes as FlowNode[]);
        }
    }, [layoutedNodes, setNodes]);

    useEffect(() => {
        const formNodes = formData.nodes;
        const formEdges = formData.edges;
        if (formNodes?.length > 0) {
            setNodes(formNodes);
        } else {
            setNodes(initialNodes);
        }
        if (formEdges?.length > 0) {
            setEdges(formEdges);
        }
    }, [formData]);

    return (
        <div className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                edgeTypes={edgeTypes}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ maxZoom: 1, minZoom: 0.01 }}
                zoomOnDoubleClick={false}
            >
                <Controls />
                <MiniMap />
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={12}
                    size={1}
                />
            </ReactFlow>
            <ChannelDialog
                bankCode={formData.bankCode || ""}
                partnerName={formData.partnerName || ""}
                serviceCode={formData.serviceCode || ""}
                disabled
            />
        </div>
    );
}
