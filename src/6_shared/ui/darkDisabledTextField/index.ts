import styled from '@emotion/styled';
import { TextField } from '@mui/material';

export const DarkDisabledTextField = styled(TextField)`
  .Mui-disabled {
    color: ${(props) => props.theme.palette.text.primary};
    -webkit-text-fill-color: ${(props) => props.theme.palette.text.primary} !important;
  }
  color: #${(props) => props.theme.palette.primary.main};
  -webkit-text-fill-color: ${(props) => props.theme.palette.primary.main};
`;
