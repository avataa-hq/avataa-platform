import styled from '@emotion/styled';
import { Box, IconButton, Typography, alpha } from '@mui/material';
import { InsertDriveFile, AccountTreeRounded } from '@mui/icons-material';

const IconSizeMixin = `
  width: 20px;
  height: 20px;
`;

export const BottomControlsStyled = styled(Box)`
  width: 100%;
  /* height: 6%; */
  display: flex;
  align-items: center;
`;

export const ControlsBody = styled(Box)`
  display: flex;
  align-items: center;
  padding: 5px;
  gap: 20px;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
`;

export const ButtonStyled = styled(IconButton)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  // color: ${({ theme }) => theme.palette.text.primary};
  border-radius: 10px;
  & svg {
    transition: transform 250ms linear;
    &:hover,
    &:focus {
      transform: scale(1.1);
    }
  }
`;

export const FilesIconStyled = styled(InsertDriveFile)`
  ${IconSizeMixin};
`;

export const DetailsIconStyled = styled(AccountTreeRounded)`
  ${IconSizeMixin};
`;

export const DocumentsCountBox = styled(Box)`
  position: absolute;
  top: -2px;
  right: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${({ theme }) => alpha(theme.palette.primary.main, 0.7)};
  box-shadow: 0 2px 4px ${({ theme }) => alpha(theme.palette.primary.main, 0.6)};
`;

export const DocumentsCountText = styled(Typography)`
  line-height: 1;
  font-size: 10px;
`;
