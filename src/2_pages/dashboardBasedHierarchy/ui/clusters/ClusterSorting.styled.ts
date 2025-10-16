import styled from '@emotion/styled';
import { Select } from '@mui/material';

const ClusterSortingStyleSelect = styled(Select)`
  height: 100%;
  width: 100%;
  border-radius: 10px;
  background: ${(props) => props.theme.palette.neutral.surfaceContainerLowestVariant2};
  color: ${(props) => props.theme.palette.text.primary};
  font-weight: 600;
`;

export default ClusterSortingStyleSelect;
