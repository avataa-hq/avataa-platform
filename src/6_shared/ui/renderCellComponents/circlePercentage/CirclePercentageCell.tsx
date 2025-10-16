import { Box } from '@mui/material';

import {
  CirclePercentageCellStyled,
  CircularProgressColored,
  CircularProgressBackground,
  CellBoxColored,
} from './CirclePercentageCell.styled';
import { useGetCellColor } from './useGetCellColor';

interface IProps {
  value: number | 'Null';
  breakPoints: number[];
  colors: string[];
  withBackground?: boolean;
}

export const CirclePercentageCell = ({ value, breakPoints, colors, withBackground }: IProps) => {
  const { color } = useGetCellColor(value, breakPoints, colors);

  const progressValue = value === 'Null' ? 100 : value;

  const circleProgressCell = (
    <CirclePercentageCellStyled>
      <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
        <CircularProgressBackground variant="determinate" size={25} thickness={5} value={100} />
        <CircularProgressColored
          circlecolor={color}
          variant="determinate"
          size={25}
          thickness={5}
          value={progressValue}
        />
      </Box>
      <Box component="div" sx={{ marginLeft: '5px' }}>
        {value === 'Null' ? 'Null' : `${value} %`}
      </Box>
    </CirclePercentageCellStyled>
  );

  if (withBackground)
    return (
      <CellBoxColored background={`${color}1A`} width={110}>
        {circleProgressCell}
      </CellBoxColored>
    );

  return circleProgressCell;
};
