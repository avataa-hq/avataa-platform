import styled from '@emotion/styled';
import { Select } from '@mui/material';

export const SelectStyled = styled(Select)`
  position: relative;
  width: 60%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  border: none;
  padding: 0;
  height: 24px;

  .MuiInputBase-input {
    border: 1px solid ${(props) => props.theme.palette.neutralVariant.outline};
    padding: 0 10px;
    border-radius: 10px;
    height: 22px;
  }
`;
