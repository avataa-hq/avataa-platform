import styled from '@emotion/styled';
import { Box } from '@mui/material';

const SettingsObjectsBodyStyled = styled(Box)`
  display: flex;
  height: calc(100% - 60px);

  .rd3t-link {
    stroke: ${({ theme }) => theme.palette.primary.light};
  }

  .hierarchy-builder-diagram-svg {
    overflow: visible;
    z-index: 1;
  }
`;

export default SettingsObjectsBodyStyled;
