import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const EditableTextContainer = styled(Box)`
  .MuiIconButton-root {
    color: ${({ theme }) =>
      // @ts-ignore
      theme.palette.primary.main};
  }
`;
