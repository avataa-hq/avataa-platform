import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';

export const HeaderStyled = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Top = styled(Box)<{ isNarrow: boolean }>`
  width: 100%;
  display: ${({ isNarrow }) => (isNarrow ? 'block' : 'flex')};
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-between;
  min-height: 50px;
  gap: 10px;
`;

export const TopLeft = styled(Box)<{ isNarrow: boolean }>`
  min-width: fit-content;
  width: ${({ isNarrow }) => (isNarrow ? '100%' : '50%')};
  height: ${({ isNarrow }) => (isNarrow ? 'fit-content' : '100%')};
  margin-bottom: ${({ isNarrow }) => (isNarrow ? '10px' : '0')};
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.625rem;
`;

export const TopRight = styled(Box)<{ isNarrow: boolean }>`
  width: ${({ isNarrow }) => (isNarrow ? '100%' : '50%')};
  height: ${({ isNarrow }) => (isNarrow ? 'fit-content' : '100%')};
  display: flex;
  justify-content: end;
  align-items: center;
  overflow: hidden;
  flex: 1;
`;

export const Bottom = styled(Box)`
  width: 100%;
  min-height: 50px;
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: space-between;
`;

export const CustomButton = styled(LoadingButton)`
  width: 40px;
  height: 40px;
  min-height: 0;
  min-width: 0;
  border-radius: 0.8rem;
  padding: 0;
  border-color: ${(props) => props.theme.palette.neutralVariant.outline};
  border-width: 1px;
  border-style: solid;
  background-color: ${(props) => props.theme.palette.background.default};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;
