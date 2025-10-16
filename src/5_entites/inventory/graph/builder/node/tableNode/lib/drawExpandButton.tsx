import { IGroup, IShape } from '@antv/g6';
import { UnfoldLessRounded, UnfoldMoreRounded } from '@mui/icons-material';
import { renderToString } from 'react-dom/server';
import { Theme } from '@mui/material';
import { TABLE_NODE_COLUMN_HORIZONTAL_PADDING } from '6_shared';

interface IProps {
  group: IGroup;
  type: 'expand' | 'collapse';
  nodeWidth: number;
  theme: Theme;
}

export const drawExpandButton = ({ group, type, nodeWidth, theme }: IProps) => {
  const IconComponent = type === 'expand' ? UnfoldMoreRounded : UnfoldLessRounded;
  const buttonSize = 25;
  const buttonPadding = 5;
  const offsetY = 3;
  const id = '☻';

  let buttonShapes: IShape[] = [];
  buttonShapes.forEach((shape) => {
    group.removeChild(shape);
  });

  const buttonShape = group.addShape('rect', {
    attrs: {
      x: nodeWidth - TABLE_NODE_COLUMN_HORIZONTAL_PADDING - buttonSize,
      y: offsetY,
      height: buttonSize,
      width: buttonSize,
      fill: theme.palette.primary.main,
      radius: buttonSize / 2,
      cursor: 'pointer',
    },
    // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
    name: `${type}-button`,
    id,
  });

  const buttonImage = group.addShape('image', {
    attrs: {
      x: nodeWidth - TABLE_NODE_COLUMN_HORIZONTAL_PADDING - buttonSize + buttonPadding,
      y: offsetY + buttonPadding,
      width: buttonSize - buttonPadding * 2,
      height: buttonSize - buttonPadding * 2,
      cursor: 'pointer',
      img: `data:image/svg+xml;base64,${window.btoa(
        renderToString(
          <IconComponent
            xmlns="http://www.w3.org/2000/svg"
            style={{
              fill: theme.palette.primary.contrastText,
              padding: '5px',
              aspectRatio: 1,
            }}
          />,
        ),
      )}`,
    },
    name: `${type}-button`,
    id,
  });
  buttonShapes = [buttonShape, buttonImage];
};
