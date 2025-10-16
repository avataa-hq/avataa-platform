import styled from '@emotion/styled';
import { StyledDataGrid } from '5_entites/inventory/ui/table/Table.styled';

export const TraceTableStyled = styled(StyledDataGrid)`
  height: 100%;

  .MuiDataGrid-row {
    padding-left: 0;
  }

  .MuiDataGrid-columnHeadersInner {
    padding-left: 0;
  }
`;
