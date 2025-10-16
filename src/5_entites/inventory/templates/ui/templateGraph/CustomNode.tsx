import { useTheme } from '@emotion/react';
import { Handle, Position } from '@xyflow/react';
import { Tooltip } from '@mui/material';
import { ICustomTemplateGraphNode, NODE_HEIGHT, NODE_WIDTH } from '../../model';

type CustomNodeProps = {
  data: ICustomTemplateGraphNode['data'];
};

export const CustomNode = ({ data }: CustomNodeProps) => {
  const { palette } = useTheme();

  const nodeColor = data?.isValid ? palette.primary.main : palette.error.main;

  return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <div
        style={{
          borderRadius: '50%',
          background: nodeColor,
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 0 8px ${nodeColor}55`,
          position: 'relative',
        }}
      >
        <Handle type="source" position={Position.Bottom} style={{ opacity: '0' }} />
        <Handle type="target" position={Position.Top} style={{ opacity: '0' }} />

        <Tooltip placement="top" title={data?.label.length > 20 ? data?.label : ''}>
          <p
            style={{
              margin: 0,
              width: '80px',
              padding: '2px 6px',
              borderRadius: 6,
              background: palette.neutralVariant.outline,
              color: palette.text.primary,
              fontSize: 8,
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              lineHeight: '1.3',
              position: 'absolute',
              top: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              wordBreak: 'break-word',
            }}
          >
            {data?.label || 'No label'}
          </p>
        </Tooltip>
      </div>
    </div>
  );
};
