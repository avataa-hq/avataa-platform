import styled from '@emotion/styled';
import { Box, BoxProps } from '@mui/material';
import { PropsWithChildren } from 'react';

const AutocompleteWrapperStyled = styled(Box)`
  .MuiAutocomplete-listbox {
    max-height: 210px;
    background-color: ${({ theme }) => theme.palette.background.default};
  }
`;

export const AutocompleteWrapper = ({ children, ...props }: PropsWithChildren<BoxProps>) => {
  return <AutocompleteWrapperStyled {...props}>{children}</AutocompleteWrapperStyled>;
};
