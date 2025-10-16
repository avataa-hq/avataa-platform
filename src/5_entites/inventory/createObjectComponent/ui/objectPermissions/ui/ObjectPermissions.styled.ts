import { Box, Button, Grid } from '@mui/material';
import styled from '@emotion/styled';

export const ObjectPermissionsStyled = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  padding: 30px 20px;
  overflow: hidden;
`;

export const ActionsButtonContent = styled(Box)`
  display: flex;
  flex-direction: row-reverse;
  gap: 15px;
`;

export const LoadingContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const TopGridStyled = styled(Grid)`
  width: 100%;
  margin-left: 0;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  overflow: hidden;
`;

export const GridStyled = styled(Grid)`
  height: 100%;
  flex-grow: 1;
  align-self: start;

  &.MuiGrid-root {
    padding: 0;

    .MuiGrid-item {
      padding: 0;
      height: 100%;
    }
  }
`;

export const GridButtonsStyled = styled(Grid)`
  &.MuiGrid-root {
    padding: 0 11px;
  }
`;

export const ButtonStyled = styled(Button)`
  padding: 10px;
  margin-top: 4px;
  margin-bottom: 4px;
  width: 37px;
  height: 37px;
  border-radius: 10px;
  min-width: 37px;
  font-size: 20px;
`;

export const ActionButton = styled(Button)`
  height: 37px;
`;
