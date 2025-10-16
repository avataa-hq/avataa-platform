import { TABLE_NODE_COLUMN_HORIZONTAL_PADDING } from '6_shared';
import { IGroup } from '@antv/g6';
import { Theme } from '@mui/material';

interface IProps {
  group: IGroup;
  height: number;
  width: number;
  radius: number;
  theme: Theme;
  label: unknown;
}

export const drawHeader = ({ group, radius, width, height, theme, label }: IProps) => {
  const text = typeof label === 'string' && label.length > 26 ? `${label?.slice(0, 24)}...` : label;
  const fill = theme.palette.neutral.surfaceContainerHigh;

  const header = group.addShape('rect', {
    attrs: { fill, height, width, radius: [radius, radius, 0, 0], opacity: 0.8 },
    draggable: true,
  });

  group.addShape('text', {
    attrs: {
      y: 22,
      x: TABLE_NODE_COLUMN_HORIZONTAL_PADDING,
      fill: theme.palette.text.primary,
      text,
      fontSize: 16,
      fontWeight: 600,
      fontFamily: theme.typography.fontFamily,
    },
  });

  return { header };
};
