import styled from '@emotion/styled';
import { Box, alpha, BoxProps } from '@mui/material';

interface IProps extends BoxProps {
  isedit: string;
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
export const HeaderStyled = styled(Box)<IProps>`
  width: 100%;
  min-height: 55px;
  padding: 10px;
  border-radius: 5px;
  overflow: hidden;
  overflow-wrap: anywhere;
  font-size: 22px;
  font-weight: 700;
  background: ${({ isedit, theme }) =>
    isedit === 'true' ? alpha(theme.palette.neutralVariant.outline, 0.6) : 'transparent'};
  box-shadow: ${({ isedit }) => (isedit === 'true' ? '0 0 10px -5px #00000040' : '0')};

  &:hover {
    background: ${({ theme, isedit }) =>
      isedit === 'false'
        ? alpha(theme.palette.neutralVariant.outline, 0.3)
        : alpha(theme.palette.neutralVariant.outline, 0.6)};
  }
`;

export const NameActionsContainer = styled.div`
  width: 100%;
  justify-content: end;
`;
