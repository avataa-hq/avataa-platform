import styled from '@emotion/styled';
import { Box } from '@mui/material';

interface CellBoxProps {
  background?: string;
  color?: string;
}
export const StatusStyled = styled(Box)<CellBoxProps>`
  color: ${(props) => (props.color ? props.color : 'inherit')};
  background-color: ${(props) => (props.background ? props.background : `${props.color}1A`)};
  width: 100%;
  border-radius: 10px;
  padding: 5px 10px 5px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
  margin: 5px;
`;
