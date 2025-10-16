import { Position, NodeProps } from '@xyflow/react';
import { Box, ObjectNodeType } from '6_shared';
import Tooltip from '@mui/material/Tooltip';
import { IncomingLinkObjectNodeStyled } from './Nodes.styled';
import { HandleStyled } from './Handle.styled';

export const ObjectOutLinkNode = ({
  data: { objectName, connectionValidationId },
}: NodeProps<ObjectNodeType>) => {
  return (
    <IncomingLinkObjectNodeStyled>
      <Tooltip title={objectName}>
        <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>{objectName}</Box>
      </Tooltip>
      <HandleStyled
        style={{ width: '10px', height: '10px' }}
        type="target"
        position={Position.Left}
        isConnectableStart={false}
        id={connectionValidationId}
      />
    </IncomingLinkObjectNodeStyled>
  );
};
