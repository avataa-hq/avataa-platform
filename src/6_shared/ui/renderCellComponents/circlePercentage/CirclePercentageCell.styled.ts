import { Box, CircularProgress } from '@mui/material';
import styled from '@emotion/styled';

export const CirclePercentageCellStyled = styled(Box)`
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  .MuiCircularProgress-circle {
    stroke-linecap: round;
  }
`;

interface ICircularProgress {
  circlecolor: string;
}

export const CircularProgressColored = styled(CircularProgress)<ICircularProgress>`
  color: ${(props) => props.circlecolor};
`;

export const CircularProgressBackground = styled(CircularProgress)`
  position: absolute;
  color: ${({ theme }) => theme.palette.text.primary};
  opacity: 0.1;
`;

interface CellBoxProps {
  background?: string;
  color?: string;
}
export const CellBoxColored = styled(Box)<CellBoxProps>`
  color: ${(props) => (props.color ? props.color : 'inherit')};
  background-color: ${(props) => (props.background ? props.background : `${props.color}1A`)};
  border-radius: 10px;
  padding: 5px 10px 5px 10px;
  max-height: 30px;
`;

export const CellBoxColoredCentered = styled(CellBoxColored)`
  display: flex;
  justify-content: center;
  align-items: center;
`;
