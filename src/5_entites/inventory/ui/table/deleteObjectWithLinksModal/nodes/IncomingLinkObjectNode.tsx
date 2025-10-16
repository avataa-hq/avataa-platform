import { Position, Node, NodeProps } from '@xyflow/react';
import { Box } from '6_shared';
import Tooltip from '@mui/material/Tooltip';
import { IncomingLinkObjectNodeStyled } from './Nodes.styled';
import { HandleStyled } from './Handle.styled';

type IncomingLinkObjectNodeType = Node<{
  objectName: 'string';
}>;

export const IncomingLinkObjectNode = ({
  data: { objectName },
}: NodeProps<IncomingLinkObjectNodeType>) => {
  return (
    <IncomingLinkObjectNodeStyled>
      <Tooltip title={objectName}>
        <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>{objectName}</Box>
      </Tooltip>
      <HandleStyled
        style={{ width: '10px', height: '10px' }}
        type="source"
        position={Position.Bottom}
        isConnectableStart={false}
      />
    </IncomingLinkObjectNodeStyled>
  );
};
