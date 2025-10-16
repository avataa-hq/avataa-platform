import { Position, NodeProps, type Node } from '@xyflow/react';
import Tooltip from '@mui/material/Tooltip';
import { Typography, useTheme } from '@mui/material';
import {
  HandleStyled,
  TreeDataNodeBox,
  TreeDataNodeCircle,
  TreeDataNodeCircleContainer,
  TreeDataNodeBoxLabel,
  TreeDataNodeContainer,
} from './ChildrenFlowchart.styled';

type TreeNodeData = { label: string; isRootParentObject: boolean };
type TreeDataNodeType = Node<TreeNodeData>;

const handleStyle = { top: 30 };

export const TreeDataNode = ({ data }: NodeProps<TreeDataNodeType>) => {
  const { label, isRootParentObject } = data;

  const theme = useTheme();

  return (
    <TreeDataNodeContainer>
      <TreeDataNodeCircleContainer>
        <TreeDataNodeCircle
          sx={{
            backgroundColor: isRootParentObject
              ? theme.palette.success.main
              : `${theme.palette.primary.main}1a`,
          }}
        >
          <Typography>{label.charAt(0)}</Typography>
        </TreeDataNodeCircle>
      </TreeDataNodeCircleContainer>
      <TreeDataNodeBox>
        <Tooltip title={label}>
          <TreeDataNodeBoxLabel>{label}</TreeDataNodeBoxLabel>
        </Tooltip>
      </TreeDataNodeBox>

      <HandleStyled
        type="target"
        position={Position.Top}
        isConnectable={false}
        style={handleStyle}
      />

      <HandleStyled
        type="source"
        position={Position.Top}
        isConnectable={false}
        style={handleStyle}
      />
    </TreeDataNodeContainer>
  );
};
