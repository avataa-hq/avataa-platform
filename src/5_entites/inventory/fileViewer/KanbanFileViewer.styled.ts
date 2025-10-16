import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const KanbanFileViewerStyled = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Header = styled(Box)``;

export const Body = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Link = styled.a`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
`;
