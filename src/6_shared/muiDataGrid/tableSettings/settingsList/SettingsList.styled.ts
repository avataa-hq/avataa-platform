import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const SettingsListTitleBlock = styled(Box)`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
`;
export const SettingsListHeader = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-around;
  flex-wrap: wrap;
`;
export const SettingsListStyled = styled(Box)`
  position: relative;
  width: 100%;
  height: 200px;
  overflow-x: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const LoadingContainer = styled(Box)`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
