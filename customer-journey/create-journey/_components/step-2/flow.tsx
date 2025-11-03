import { ChannelSidebar } from "@/components/ui/flows/journey/channel-sidebar";
import CustomEdge from "@/components/ui/flows/journey/custom-edge";
import { NeuturalNode } from "@/components/ui/flows/journey/custom-nodes/neutural-node";
import { StepNode } from "@/components/ui/flows/journey/custom-nodes/step-node";
import { ChannelDialog } from "@/components/ui/flows/journey/form-channel/channel-dialog";
import useLayout from "@/components/ui/flows/layout";
import { useDraft } from "@/contexts/draft-context";
import { GraphLabel } from "@dagrejs/dagre";
import {
    addEdge,
    Background,
    BackgroundVariant,
    ColorMode,
    Connection,
    Controls,
    Edge,
    getConnectedEdges,
    getIncomers,
    getOutgoers,
    MiniMap,
    Node,
    ReactFlow,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { usePageFormContext } from "./form-context";

type NodeData = {
    label?: string;
    icon?: React.ReactNode;
};

type FlowNode = Node<NodeData>;
type FlowEdge = Edge;

interface Nodes {
    id: string;
    type: string;
    data: any;
    position: any;
    deletable?: boolean;
}

const initialNodes: Nodes[] = [
    {
        id: "0",
        type: "entrance",
        data: {
            type: "entrance",
            name: "Entrance",
            id: "0",
            maxRepeat: "1",
            baseOperator: "ALL",
            ruleGroups: [],
        },
        position: { x: 400, y: 50 },
        width: 320,
        deletable: false,
    },
];

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

export default function Flow() {
    const { form } = usePageFormContext();
    const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const layoutedNodes = useLayout(layoutOptions, edges);
    const { draftData } = useDraft();

    const onConnect = useCallback(
        (connection: Connection) => {
            const edge = {
                ...connection,
                type: "plus-edge",
            };
            setEdges(eds => addEdge(edge, eds));
        },
        [setEdges]
    );

    useEffect(() => {
        setTimeout(() => {
            form.reset({
                bankCode: form.getValues("bankCode"),
                partnerName: form.getValues("partnerName"),
                serviceCode: form.getValues("serviceCode"),
                edges,
                nodes,
            });
        });
    }, [nodes, edges]);

    useEffect(() => {
        const formNodes = form.getValues("nodes");
        const formEdges = form.getValues("edges");
        const draftNodes = draftData?.['data']?.nodes;
        const draftEdges = draftData?.['data']?.edges;

        if (draftNodes && draftNodes.length > 0) {
            setNodes(draftNodes);
        } else {
            if (formNodes && formNodes?.length > 0) {
                setNodes(formNodes);
            }
            else setNodes(initialNodes);
        }
        if (draftEdges && draftEdges.length > 0) {
            setEdges(draftEdges);
        } else {
            if (formEdges && formEdges?.length > 0) {
                setEdges(formEdges);
            }
            else setEdges([]);
        }
    }, [setNodes, setEdges, draftData]);

    useEffect(() => {
        if (layoutedNodes.length > 0) {
            setNodes(layoutedNodes as FlowNode[]);
        }
    }, [layoutedNodes, setNodes]);


    const onNodesDelete = useCallback(
        (deleted: FlowNode[]) => {
            setEdges(
                deleted.reduce((acc, node) => {
                    const incomers = getIncomers(node, nodes, edges);
                    const outgoers = getOutgoers(node, nodes, edges);
                    const connectedEdges = getConnectedEdges([node], edges);

                    const remainingEdges = acc.filter(
                        edge => !connectedEdges.includes(edge)
                    );

                    const createdEdges = incomers.flatMap(({ id: source }) =>
                        outgoers.map(({ id: target }) => ({
                            id: `${source}->${target}`,
                            source,
                            target,
                            type: "plus-edge",
                        }))
                    );

                    return [...remainingEdges, ...createdEdges];
                }, edges)
            );
        },
        [nodes, edges, setEdges]
    );

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div
            className="w-full h-full flex overflow-hidden"
            style={{ minHeight: "calc(100vh - 410px)" }}
        >
            <div className="flex-1">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onNodesDelete={onNodesDelete}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    edgeTypes={edgeTypes}
                    nodeTypes={nodeTypes}
                    draggable={false}
                    nodesDraggable={false}
                    fitView
                    fitViewOptions={{ maxZoom: 1, minZoom: 0.01 }}
                    colorMode={(resolvedTheme as ColorMode) || "light"}
                    multiSelectionKeyCode="null"
                    zoomOnDoubleClick={false}
                >
                    <Controls />
                    <MiniMap />
                    <Background
                        className="!bg-[#FEFEFE] dark:!bg-neutral-900 "
                        variant={BackgroundVariant.Dots}
                        color={
                            resolvedTheme === "light" ? "#cecece" : "#606060"
                        }
                        gap={12}
                        size={1}
                    />
                </ReactFlow>
            </div>
            <ChannelSidebar />
            <ChannelDialog
                bankCode={form.getValues("bankCode") || ""}
                partnerName={form.getValues("partnerName") || ""}
                serviceCode={form.getValues("serviceCode") || ""}
                disabled={false}
            />
        </div>
    );
}
