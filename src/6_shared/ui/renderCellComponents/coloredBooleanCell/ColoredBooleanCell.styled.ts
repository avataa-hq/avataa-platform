import styled from '@emotion/styled';
import { Box } from '@mui/material';

interface ColorProps {
  color: string;
}

export const Circle = styled(Box)<ColorProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50px;
  background-color: ${(props) => props.color};
`;
