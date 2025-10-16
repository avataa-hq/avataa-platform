import { Position, NodeProps, useReactFlow } from '@xyflow/react';
import { AutocompleteValue, Box, ObjectNodeType, useDeleteObjectWithLinks } from '6_shared';
import { Tooltip, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SelectObjectAutocompleteWithDynamicOptions } from '../SelectObjectAutocompleteWithDynamicOptions';
import { ConnectorObjectNodeStyled } from './Nodes.styled';
import { HandleStyled } from './Handle.styled';

export const ObjectNode = ({ data: { objectName, moId, tmoId } }: NodeProps<ObjectNodeType>) => {
  const theme = useTheme();
  const { getNodes, deleteElements, getEdges, setNodes, setEdges } = useReactFlow();

  const { addedConnectorNodesList, setAddedConnectorNodesList } = useDeleteObjectWithLinks();

  const [objectBeforeChangeId, setObjectBeforeChangeId] = useState<number | null>(moId);

  const [value, setValue] = useState<AutocompleteValue | null>(null);

  useEffect(() => {
    if (moId && objectName) {
      setValue({ id: moId, label: objectName });
    }
  }, [moId, objectName]);

  const nodes = useMemo(() => getNodes(), [getNodes]);
  const edges = useMemo(() => getEdges(), [getEdges]);

  const setNewValue = (newValue: AutocompleteValue) => {
    if (value?.id && value.id !== newValue?.id) {
      setObjectBeforeChangeId(value.id);
    }

    setValue(newValue || { id: null, label: '' });
  };

  useEffect(() => {
    if (!value?.id || objectBeforeChangeId === value.id) return;

    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id.includes(String(objectBeforeChangeId))) {
          return {
            ...node,
            id: node.id.replace(String(objectBeforeChangeId), String(value.id)),
            data: {
              ...node.data,
              objectId: value.id,
              objectName: value.label,
            },
          };
        }
        return node;
      }),
    );

    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        const updatedEdge = { ...edge };

        if (edge.source.includes(String(objectBeforeChangeId))) {
          updatedEdge.source = edge.source.replace(String(objectBeforeChangeId), String(value.id));
        }

        if (edge.target.includes(String(objectBeforeChangeId))) {
          updatedEdge.target = edge.target.replace(String(objectBeforeChangeId), String(value.id));
        }

        if (edge.id.includes(String(objectBeforeChangeId))) {
          updatedEdge.id = edge.id.replace(String(objectBeforeChangeId), String(value.id));
        }

        // @ts-expect-error
        if (edge?.data?.logical && edge?.data?.logical.objectId === objectBeforeChangeId) {
          // @ts-expect-error
          edge.data.logical.objectId = value.id;
        }

        return updatedEdge;
      }),
    );

    const newConnectorNodesList = addedConnectorNodesList.map((id) =>
      id === objectBeforeChangeId ? (value.id as number) : id,
    );
    setAddedConnectorNodesList(newConnectorNodesList);
  }, [objectBeforeChangeId, setNodes, setEdges, value, addedConnectorNodesList]);

  const onDelete = useCallback(() => {
    const relatedNodes = nodes.flatMap((node) => {
      if (!node.id.includes(String(moId))) return [];

      return { id: node.id };
    });

    const relatedEdges = edges.flatMap((edge) => {
      if (!edge.id.includes(String(moId))) return [];

      return { id: edge.id };
    });

    deleteElements({ nodes: relatedNodes, edges: relatedEdges });

    const newConnectorNodesList = addedConnectorNodesList.filter((id) => id !== moId);
    setAddedConnectorNodesList(newConnectorNodesList);
  }, [nodes, edges, deleteElements, addedConnectorNodesList, setAddedConnectorNodesList, moId]);

  return (
    <Tooltip title={objectName} sx={{ width: '100%', height: '40px' }}>
      <ConnectorObjectNodeStyled>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: '10px',
              top: '2px',
              width: '90%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <SelectObjectAutocompleteWithDynamicOptions
              tmoId={tmoId as number}
              value={value}
              setValue={(newValue: AutocompleteValue) => setNewValue(newValue)}
            />
            <DeleteIcon
              sx={{ cursor: 'pointer', color: theme.palette.background.paper }}
              onClick={onDelete}
            />
          </Box>

          <Box
            sx={{
              width: '100%',
              height: '100%',
              padding: '5px',
              overflow: 'hidden',
            }}
            className="custom-drag-handle"
          >
            <HandleStyled
              style={{ width: '10px', height: '10px' }}
              type="target"
              position={Position.Left}
              isConnectableStart={false}
            />
            <HandleStyled
              style={{ width: '10px', height: '10px', left: 20 }}
              type="source"
              position={Position.Bottom}
            />
          </Box>
        </Box>
      </ConnectorObjectNodeStyled>
    </Tooltip>
  );
};
