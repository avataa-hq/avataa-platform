import styled from '@emotion/styled';
import { ICheckboxSelection } from '5_entites/inventory/ui/table/Table.styled';
import { Checkbox } from '@mui/material';

export const DetailedTableLoadContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

export const DetailedTableCenteredContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;
