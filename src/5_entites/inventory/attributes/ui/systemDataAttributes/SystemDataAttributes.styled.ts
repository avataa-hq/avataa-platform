import styled from '@emotion/styled';
import { Autocomplete } from '@mui/material';

export const SystemDataAutocompleteStyled = styled(Autocomplete)`
  background-color: ${({ theme }) => theme.palette.neutral.surfaceContainerLowestVariant2};
  border: 1px solid
    ${({ theme }) =>
      theme.palette.mode === 'light'
        ? theme.palette.neutralVariant.outline
        : theme.palette.neutralVariant.outlineVariant30};
  border-radius: 10px;
` as typeof Autocomplete;
