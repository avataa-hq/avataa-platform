import * as React from 'react';
import {
  GridPanelWrapper,
  GridPanelWrapperProps,
  useGridRootProps,
} from '@mui/x-data-grid-premium';
import { GridColumnsManagement } from './GridColumnsManagement';

interface GridColumnsPanelProps extends GridPanelWrapperProps {}

const GridColumnsPanelWithGroups = (props: GridColumnsPanelProps) => {
  const rootProps = useGridRootProps();
  return (
    <GridPanelWrapper {...props}>
      {/* @ts-expect-error */}
      <GridColumnsManagement {...rootProps.slotProps?.columnsManagement} />
    </GridPanelWrapper>
  );
};

export { GridColumnsPanelWithGroups };
