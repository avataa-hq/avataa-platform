import styled from '@emotion/styled';
import { Box, IconButton, Typography, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export const ObjectModelStyled = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const Title = styled(Typography)`
  margin-bottom: 10px;
  padding: 0 10px;
`;

export const RightContentTitleWrapper = styled(Box)`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const AddIconSmallStyled = styled(AddIcon)`
  border-radius: 50%;
  background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
  fill: ${({ theme }) => theme.palette.primary.main};
  padding: 2px;
  width: 20px;
  height: 20px;
`;

export const UploadArea = styled(IconButton)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 5px;
  min-width: 510px;
  max-height: 80%;
  width: 100%;
  border: 1px solid
    ${({ theme }) =>
      theme.palette.mode === 'light'
        ? theme.palette.neutralVariant.outline
        : theme.palette.neutralVariant.outlineVariant30};
  border-radius: 20px;
`;

export const AddIconStyled = styled(AddIcon)`
  border-radius: 50%;
  background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.1)};
  fill: ${({ theme }) => theme.palette.primary.main};
  padding: 6px;
  width: 30px;
  height: 30px;
`;

export const UploadAreaText = styled(Typography)`
  width: 120px;
  font-weight: 400;
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
