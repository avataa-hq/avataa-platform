import styled from '@emotion/styled';
import { Box } from '6_shared';
import { IconButton, TextField, Select } from '@mui/material';

export const PaginationContainer = styled(Box)`
  .MuiInputBase-input {
    padding: 0;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 0 20px;
`;

export const PaginationBlock = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PaginationSelect = styled(Select)`
  width: 80px;
  padding: 10px;
  margin-right: 10px;
  height: 37px;
  border: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};

  // .MuiInputBase-root {
  //   padding: 0;
  //   &:hover {
  //     border: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
  //     outline-color: solid ${({ theme }) => theme.palette.neutralVariant.outline} !important;
  //   }
  // }
  //
  // &:hover {
  //   border: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
  //   outline-color: solid ${({ theme }) => theme.palette.neutralVariant.outline} !important;
  // }
`;

export const PaginationButton = styled(IconButton)`
  border-radius: 0;
  height: 35px;
  width: 35px;
  padding: 0;
  color: black;
  border: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
  opacity: ${(props) => (props.disabled ? 0.2 : 1)};
  &:hover {
    border: 1px solid ${({ theme }) => theme.palette.primary.main};
  }
`;

export const PaginationButtonLeft = styled(PaginationButton)`
  border-radius: 10px 0 0 10px;
`;

export const PaginationButtonRight = styled(PaginationButton)`
  border-radius: 0 10px 10px 0;
`;

export const PaginationInput = styled(TextField)`
  height: 35px;
  width: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.palette.neutralVariant.outline};
  border-radius: 0;
  &:hover {
    border: 1px solid ${({ theme }) => theme.palette.primary.main};
  }
  .MuiInputBase-input {
    border-radius: 0;
    padding: 5px 5px 5px 10px;
  }
`;
