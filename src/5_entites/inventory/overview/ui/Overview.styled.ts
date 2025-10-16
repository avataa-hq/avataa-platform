import styled from '@emotion/styled';
import { Autocomplete, Box, Button, Typography } from '@mui/material';

export const OverviewStyled = styled(Box)`
  width: 100%;
  height: 100%;
  padding: 20px 20px 30px;
  position: relative;
`;

export const OverviewContent = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const Body = styled(Box)`
  width: 100%;
  height: 90%;
  display: flex;
  flex-grow: 1;
`;

export const Title = styled(Typography)`
  padding-bottom: 10px;
`;

export const LeftContent = styled(Box)`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-right: 1px solid rgba(230, 233, 245, 1);
  padding-right: 38px;
`;

export const RightContent = styled(Box)`
  width: 100%;
  padding-left: 38px;
`;

export const RightContentHeder = styled(Box)`
  width: 100%;
  margin-bottom: 10px;
`;

export const RightContentBody = styled(Box)`
  width: 100%;
  overflow-y: auto;
  height: calc(100% - 50px);
`;

export const AutocompleteStyled = styled(Autocomplete)`
  background-color: ${({ theme }) => theme.palette.neutral.surfaceContainerLowestVariant2};
  border: 1px solid
    ${({ theme }) =>
      theme.palette.mode === 'light'
        ? theme.palette.neutralVariant.outline
        : theme.palette.neutralVariant.outlineVariant30};
  border-radius: 10px;
  width: 273px;
` as typeof Autocomplete;

export const AutocompleteWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 60px;
  width: 100%;
`;

export const Footer = styled(Box)`
  text-align: end;
`;

export const ButtonStyled = styled(Button)`
  height: 38px;
  font-weight: 600;
  font-size: 14px;
`;

export const LoadingContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

export const HiddenInput = styled.input`
  opacity: 0;
  height: 0;
  width: 0;
  line-height: 0;
  overflow: hidden;
  padding: 0;
  margin: 0;
`;
