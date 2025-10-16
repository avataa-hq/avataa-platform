import styled from '@emotion/styled';
import { Autocomplete } from '@mui/material';

export const GraphSearchOptionContainer = styled.li`
  &.MuiAutocomplete-option {
    display: flex;
    justify-content: space-between;
  }
`;

export const GraphSearchAutocomplete = styled(Autocomplete)`
  min-width: 200px;

  &.MuiAutocomplete-hasPopupIcon .MuiOutlinedInput-root,
  &.MuiAutocomplete-hasClearIcon .MuiOutlinedInput-root {
    padding-right: 6px;
  }

  &.MuiAutocomplete-hasClearIcon.MuiAutocomplete-hasPopupIcon .MuiOutlinedInput-root {
    padding-right: 34px;
  }
` as typeof Autocomplete;
