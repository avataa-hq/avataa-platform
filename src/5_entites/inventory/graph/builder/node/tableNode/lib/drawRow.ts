import { ICustomTableRow } from '6_shared';
import { IGroup } from '@antv/g6';
import { Theme } from '@mui/material';

interface IProps {
  group: IGroup;
  row: ICustomTableRow;
  x: number;
  y: number;
  id: string;
  name: string;
  width: number;
  height: number;
  shapeFill: string;
  text: string;
  theme: Theme;
}

export const drawRow = ({
  group,
  row,
  name,
  y,
  x,
  id,
  height,
  width,
  shapeFill,
  text,
  theme,
}: IProps) => {
  const columnPaddingX = 10;
  const columnPaddingY = 23;
  const columnShape = group.addShape('rect', {
    id,
    name,
    draggable: true,
    key: row.key,
    attrs: {
      x,
      y,
      width,
      height,
      lineWidth: 1,
      cursor: 'pointer',
      fill: shapeFill,
      opacity: 0.8,
    },
  });

  const textX = x + columnPaddingX;
  const textY = y + columnPaddingY;
  const textName = `${name}_col_text`;
  const columnShapeText = group.addShape('text', {
    id,
    capture: false,
    name: textName,
    key: row.key,
    attrs: {
      x: textX,
      y: textY,
      text,
      fontSize: 14,
      fill: theme.palette.text.primary,
      fontFamily: theme.typography.fontFamily,
      full: row,
      fontWeight: 100,
      cursor: 'pointer',
    },
  });
  return { columnShape, columnShapeText };
};
