import { Position, NodeProps } from '@xyflow/react';
import ErrorIcon from '@mui/icons-material/Error';
import { Box, ParamNodeType } from '6_shared';
import Tooltip from '@mui/material/Tooltip';
import { IncomingLinkParamTypeNodeStyled } from './Nodes.styled';
import { HandleStyled } from './Handle.styled';

export const ConnectorObjectParamTypeNode = ({
  data: { paramTypeName, connectionValidationId, isConnectionBlocked },
}: NodeProps<ParamNodeType>) => {
  return (
    <IncomingLinkParamTypeNodeStyled>
      <Tooltip title={paramTypeName}>
        <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>{paramTypeName}</Box>
      </Tooltip>
      <HandleStyled
        style={{ width: '10px', height: '10px' }}
        type="target"
        position={Position.Left}
        isConnectableStart={false}
        isConnectableEnd={false}
      />
      {!isConnectionBlocked && (
        <HandleStyled
          style={{ width: '10px', height: '10px' }}
          type="source"
          position={Position.Right}
          id={connectionValidationId}
        />
      )}
      {isConnectionBlocked && (
        <Tooltip title="ERROR!">
          <ErrorIcon
            sx={{ position: 'absolute', right: '-10px', cursor: 'pointer' }}
            color="error"
          />
        </Tooltip>
      )}
    </IncomingLinkParamTypeNodeStyled>
  );
};
