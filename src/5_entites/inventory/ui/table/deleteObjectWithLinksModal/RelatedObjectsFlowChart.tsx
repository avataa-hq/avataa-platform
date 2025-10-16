import { useCallback, useEffect, useMemo, MouseEvent } from 'react';
import {
  Background,
  Controls,
  ReactFlow,
  MarkerType,
  addEdge,
  type Node,
  type Edge,
  type OnConnect,
  useNodesState,
  useEdgesState,
  Panel,
  OnReconnect,
  Connection,
  reconnectEdge,
  IsValidConnection,
  ConnectionState,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import {
  Box,
  CustomEdgeType,
  IInventoryObjectModel,
  MoLinkInfoModel,
  ObjectNodeType,
  OutMoLinkData,
  ParamNodeType,
  useDeleteObjectWithLinks,
} from '6_shared';
import { Button, useTheme } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import {
  useAddNewConnectorNode,
  useChangeEdgeColor,
  useGetInitialEdges,
  useGetInitialNodes,
  useGetLinkedObjectsInitialValues,
  useGetObjectParamPairs,
  useReassignLinksAndDeleteObject,
} from '5_entites/inventory/lib/deleteObjectWithLinksModal';
import { ObjectNode } from './nodes/ObjectNode';
import { CustomEdge } from './edges/CustomEdge';
import { ObjectOutLinkNode } from './nodes/ObjectOutLinkNode';
import { IncomingLinkObjectNode } from './nodes/IncomingLinkObjectNode';
import { IncomingLinkParamTypeNode } from './nodes/IncomingLinkParamTypeNode';
import { AddObjectNodePanel } from './AddObjectNodePanel';
import { ConnectorObjectParamTypeNode } from './nodes/ConnectorObjectParamTypeNode';

interface IProps {
  objId: number;
  tmoId: number;
  incMoLinkInfo?: MoLinkInfoModel[];
  outMoLinkInfo?: OutMoLinkData[];
  inventoryObjectData?: IInventoryObjectModel;
  refetchLinkValues: () => void;
  handleClose?: () => void;
}

const nodeTypes: { [key: string]: any } = {
  incomingLinkObjectNode: IncomingLinkObjectNode,
  incomingLinkParamTypeNode: IncomingLinkParamTypeNode,
  objectNode: ObjectNode,
  connectorObjectParamTypeNode: ConnectorObjectParamTypeNode,
  objectOutLinkNode: ObjectOutLinkNode,
};

const edgeTypes: { [key: string]: any } = { customEdge: CustomEdge };

const isParamNode = (node: Node | ParamNodeType): node is ParamNodeType => {
  return (node as ParamNodeType).data.logical != null;
};

const isObjectNode = (node: Node | ObjectNodeType): node is ObjectNodeType => {
  return (node as ObjectNodeType).data.objectName != null;
};

const isCustomEdge = (edge: Edge | CustomEdgeType): edge is CustomEdgeType => {
  return (edge as CustomEdgeType).data!.logical != null;
};

export const RelatedObjectsFlowChart = ({
  objId,
  tmoId,
  incMoLinkInfo,
  outMoLinkInfo,
  inventoryObjectData,
  refetchLinkValues,
  handleClose,
}: IProps) => {
  const theme = useTheme();

  // React-flow state
  const [nodes, setNodes, onNodesChange] = useNodesState<Node | ParamNodeType | ObjectNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdgeType>([]);

  const { setAddedConnectorNodesList } = useDeleteObjectWithLinks();

  const { outgoingLinkObjectInitialValues, outgoingLinkObjectToDeleteInitialValues } =
    useGetLinkedObjectsInitialValues({
      objId,
      incMoLinkInfo,
      outMoLinkInfo,
    });

  const initialNodes = useGetInitialNodes({
    incMoLinkInfo,
    outMoLinkInfo,
    moId: objId,
    inventoryObjectData,
    // tmoId,
    outgoingLinkObjectToDeleteInitialValues,
  });

  // Set initial nodes
  useEffect(() => {
    if (!incMoLinkInfo && !outMoLinkInfo) return;

    setNodes(initialNodes);
  }, [initialNodes, incMoLinkInfo, outMoLinkInfo, setNodes]);

  // Common custom edge props
  const colorMain = theme.palette.text.secondary;
  const colorOnHover = theme.palette.error.main;

  const customEdgeProps = useMemo(
    () => ({
      type: 'customEdge',
      markerEnd: { type: MarkerType.ArrowClosed },
      animated: true,
      data: { edgeColor: colorMain },
    }),
    [colorMain],
  );

  // Set initial edges
  const initialEdges = useGetInitialEdges({
    incMoLinkInfo,
    outMoLinkInfo,
    moId: objId,
    customEdgeProps,
    outgoingLinkObjectToDeleteInitialValues,
  });

  useEffect(() => {
    if (!incMoLinkInfo && !outMoLinkInfo) return;

    // @ts-ignore
    setEdges(initialEdges);
  }, [initialEdges, incMoLinkInfo, outMoLinkInfo, setEdges]);

  // Set node connection with edges
  const onConnect: OnConnect = useCallback(
    (params) => {
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);
      const { data, ...rest } = customEdgeProps;

      // ToDo fix TS errors
      if (sourceNode && targetNode && isParamNode(sourceNode) && isObjectNode(targetNode)) {
        const { initialValues, objectId, tprmId, multiple } = sourceNode.data.logical;

        // @ts-expect-error
        const edge: CustomEdgeType = {
          ...params,
          data: {
            ...data,
            logical: {
              initialValues,
              objectId,
              new_values: [
                {
                  tprm_id: tprmId,
                  new_value: targetNode?.data.moId,
                },
              ],
              multiple,
            },
          },
          ...rest,
        };

        setEdges((eds) => addEdge(edge, eds));
      }
    },
    [customEdgeProps, nodes, setEdges],
  );

  // Set node reconnection with edges
  const onReconnect: OnReconnect<CustomEdgeType> = useCallback(
    (oldEdge, newConnection: Connection) => {
      const targetNode = nodes.find((node) => node.id === newConnection.target);
      if (targetNode && isCustomEdge(oldEdge) && isObjectNode(targetNode)) {
        oldEdge.data!.logical.new_values[0].new_value = targetNode.data.moId;
        setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
      }
    },
    [setEdges, nodes],
  );

  // Adding new node
  const onNewConnectorNodeAdd = useAddNewConnectorNode({
    outMoLinkInfo,
    outgoingLinkObjectInitialValues,
    setNodes,
    setEdges,
  });

  // Connection validation
  const isValidConnection: IsValidConnection = (connection) => {
    const { sourceHandle, targetHandle } = connection;
    return sourceHandle === targetHandle;
  };

  const { incomingObjectParamPairs, outgoingObjectParamPairs } = useGetObjectParamPairs({
    incMoLinkInfo,
    outMoLinkInfo,
    objId,
  });

  // Reassign Links and Delete
  const reassignLinksAndDelete = useReassignLinksAndDeleteObject({
    edges,
    objId,
    incomingObjectParamPairs,
    outgoingObjectParamPairs,
    refetchLinkValues,
  });

  const onClick = async () => {
    await reassignLinksAndDelete();
    setAddedConnectorNodesList([]);

    handleClose?.();
  };

  // Hide React Flow logo
  const proOptions = { hideAttribution: true };

  // Change edge color
  const changeEdgeColor = useChangeEdgeColor();

  return (
    <Box sx={{ width: '80%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        proOptions={proOptions}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        style={{ borderRadius: '0' }}
        onEdgeMouseEnter={(_: MouseEvent, edge: CustomEdgeType) => {
          changeEdgeColor({ id: edge.id, color: colorOnHover, setEdges });
        }}
        onEdgeMouseLeave={(_: MouseEvent, edge: CustomEdgeType) => {
          changeEdgeColor({ id: edge.id, color: colorMain, setEdges });
        }}
        onReconnect={onReconnect}
        isValidConnection={isValidConnection}
        // @ts-expect-error
        onReconnectEnd={(
          _: MouseEvent,
          _1: CustomEdgeType,
          _2: 'source' | 'target',
          connectionState: Omit<ConnectionState, 'inProgress'>,
        ) => {
          if (!connectionState.isValid)
            enqueueSnackbar({ variant: 'error', message: 'Parameter types are incompatible' });
        }}
      >
        <Background
          color={theme.palette.neutral.surfaceContainerLowVariant2}
          style={{ backgroundColor: theme.palette.neutral.surfaceContainerLowVariant2 }}
        />
        <Panel>
          <AddObjectNodePanel tmoId={tmoId} onObjectAdd={onNewConnectorNodeAdd} />
        </Panel>
        <Controls />
      </ReactFlow>
      <Button
        variant="contained"
        sx={{ position: 'absolute', bottom: '50px', right: '170px' }}
        onClick={onClick}
      >
        Reassign links and delete
      </Button>
    </Box>
  );
};
