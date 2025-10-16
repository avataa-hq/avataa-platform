import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Link } from '@mui/icons-material';

export const PopoverShareContent = styled(Box)`
  padding: 30px;
  background-color: ${(props) => props.theme.palette.neutral.surfaceContainerLowVariant1};
  backdrop-filter: blur(50px);
  display: flex;
  flex-direction: column;
`;

export const CopyLinkRange = styled(Box)`
  border: 1px solid ${(props) => props.theme.palette.primary.dark};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-left: 5px;
`;

export const LinkIconStyled = styled(Link)`
  width: 20px;
  height: 20px;
  fill: ${({ theme }) => theme.palette.neutralVariant.icon};
`;
