import { Position, NodeProps } from '@xyflow/react';
import { Box, ParamNodeType } from '6_shared';
import Tooltip from '@mui/material/Tooltip';
import { IncomingLinkParamTypeNodeStyled } from './Nodes.styled';
import { HandleStyled } from './Handle.styled';

export const IncomingLinkParamTypeNode = ({
  data: { paramTypeName },
}: NodeProps<ParamNodeType>) => {
  return (
    <IncomingLinkParamTypeNodeStyled>
      <Tooltip title={paramTypeName}>
        <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>{paramTypeName}</Box>
      </Tooltip>
      <HandleStyled
        style={{ width: '10px', height: '10px' }}
        type="target"
        position={Position.Top}
        isConnectableStart={false}
        isConnectableEnd={false}
      />
      <HandleStyled
        style={{ width: '10px', height: '10px' }}
        type="source"
        position={Position.Right}
      />
    </IncomingLinkParamTypeNodeStyled>
  );
};
