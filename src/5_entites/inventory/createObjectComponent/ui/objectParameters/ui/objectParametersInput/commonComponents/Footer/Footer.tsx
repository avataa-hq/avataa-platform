import styled from '@emotion/styled';
import { Box } from '@mui/material';

const StyledFooter = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface IProps {
  children: React.ReactNode;
}

export const Footer = ({ children }: IProps) => {
  return <StyledFooter>{children}</StyledFooter>;
};
