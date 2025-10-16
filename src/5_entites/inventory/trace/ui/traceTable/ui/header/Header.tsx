import { Box } from '6_shared';
import { MutableRefObject } from 'react';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { CustomTableToolbar } from '3_widgets';
import { IRoute } from '5_entites';
import { StyledHeader } from './Header.styled';

interface HeaderProps {
  title: string;
  setSearchQuery: (value: string) => void;
  traceRouteValue?: IRoute | null;
  apiRef: MutableRefObject<GridApiPremium>;
}

export const Header = ({ title, setSearchQuery, apiRef, traceRouteValue }: HeaderProps) => {
  const onSearchClick = (value: string) => {
    setSearchQuery(value);
  };

  const onCancelClick = () => {
    setSearchQuery('');
  };

  const loadFile = async (file_type: 'xlsx' | 'csv') => {
    if (file_type === 'xlsx') {
      await apiRef.current.exportDataAsExcel({
        fileName: traceRouteValue?.route,
      });
    }

    if (file_type === 'csv') {
      apiRef.current.exportDataAsCsv();
    }
  };

  return (
    <StyledHeader>
      <Box sx={{ width: '80%' }}>
        <CustomTableToolbar
          apiRef={apiRef}
          title={title}
          hasSearchComponent
          onSearchClick={onSearchClick}
          onCancelClick={onCancelClick}
          loadExportFile={loadFile}
          // isExportLoading={isLoading}
          // tmoId={selectedTmo as number}
          displayFilterIndicator="none"
          displayColumnsIndicator="none"
          displayCustomFilterIndicator="none"
          displayCustomColumnIndicator="none"
          hasCustomColumnsSettingComponent={false}
          hasCustomFiltersSettingComponent={false}
          hasAddObjectComponent={false}
          hasFilterPanel
          hasColumnsPanel
          hasExportComponent
          // hasObjectActivitySwitch={isDetailed}
          // isObjectsActive={isObjectsActive}
          // onObjectActivitySwitch={onObjectActivitySwitch}
        />
      </Box>
    </StyledHeader>
  );
};
