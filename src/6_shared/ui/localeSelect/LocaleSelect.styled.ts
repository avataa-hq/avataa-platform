import { styled } from '@mui/material';
import TextField from '@mui/material/TextField';

export const LocaleSelectStyled = styled(TextField)`
  align-self: center;

  .MuiOutlinedInput-root {
    &:hover {
      .MuiOutlinedInput-notchedOutline {
        border-color: ${({ theme }) => theme.palette.components.sidebar.outline};
      }
    }
  }
  .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.palette.components.sidebar.outline};
    transition: border-color 0.12s ease-in-out;
  }
`;
