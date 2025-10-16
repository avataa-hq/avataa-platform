import styled from '@emotion/styled';
import { InputBase, Box } from '@mui/material';

export const ShareStatePopoverContainer = styled(Box)`
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

export const LinkInputContainer = styled(Box)`
  width: 100%;
  border: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 5%;
`;

export const LinkSettingsContainer = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const LinkLifeMinutesInput = styled(InputBase)`
  width: 20%;
  border-bottom: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
  padding: 5px;
  margin-left: auto;
  color: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
`;
