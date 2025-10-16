import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
  Position,
} from '@xyflow/react';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import { CustomEdgeType } from '6_shared';

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  data,
}: EdgeProps<CustomEdgeType>) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });
  const edgeColor = data?.edgeColor;
  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={{ stroke: edgeColor }} />
      <EdgeLabelRenderer>
        <IconButton
          size="small"
          color="primary"
          sx={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
          onClick={() => setEdges((edges) => edges.filter((e) => e.id !== id))}
        >
          <CancelIcon fontSize="inherit" sx={{ color: edgeColor }} />
        </IconButton>
      </EdgeLabelRenderer>
    </>
  );
};
