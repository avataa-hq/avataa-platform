import { CellBoxColoredCentered } from '../circlePercentage/CirclePercentageCell.styled';
import { useGetCellColor } from '../circlePercentage/useGetCellColor';

interface IProps {
  value: number | 'Null';
  width: string;
  breakPoints: number[];
  colors: string[];
}

export const ColoredNumericCell = ({ value, width, breakPoints, colors }: IProps) => {
  const { color } = useGetCellColor(value, breakPoints, colors);

  return (
    <CellBoxColoredCentered color={color} width={width}>
      {value}
    </CellBoxColoredCentered>
  );
};
