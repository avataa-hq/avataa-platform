import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

export const RightPanelHeaderStyled = styled(Box)`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
  padding-right: 15px;

  .custom-date-picker .MuiInputBase-root {
    padding: 0;
  }

  .custom-date-picker .MuiButtonBase-root {
    margin: 0;
    padding: 4px;
  }

  .custom-date-picker .MuiInputBase-input {
    padding: 8.5px 0 8.5px 8px;
    font-size: 12px;
  }

  .custom-date-picker .MuiSvgIcon-root {
    width: 20px;
    height: 20px;
  }

  .custom-date-picker .MuiInputAdornment-root {
    margin: 0;
  }
`;

export const DatePickerContent = styled(Box)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-grow: 1;
`;

export const Header = styled(Box)`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const Body = styled(Box)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 10px;
  column-gap: 30px;
`;

export const ErrorText = styled(Typography)`
  position: absolute;
  bottom: -10px;
  left: 0;
  font-size: 8px;
  color: ${({ theme }) => theme.palette.error.main};
`;
