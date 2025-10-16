import { MutableRefObject } from 'react';
import { GridApiPremium } from '@mui/x-data-grid-premium/models/gridApiPremium';
import { CustomTableToolbar } from '3_widgets';
import { AuditDateRange } from '5_entites/adminAudit/auditDateRange/AuditDateRange';
import { DataAuditHeaderStyled, Top, TopLeft, Bottom } from './DataAuditHeader.styled';

interface IProps {
  apiRef: MutableRefObject<GridApiPremium>;
  onApplyDateFilter: (dateFrom: string | undefined, dateTo: string | undefined) => void;
}

export const DataAuditHeader = ({ apiRef, onApplyDateFilter }: IProps) => {
  return (
    <DataAuditHeaderStyled>
      <Top>
        <TopLeft>
          <CustomTableToolbar
            title="Data audit"
            apiRef={apiRef}
            // isExportLoading={isExportLoading}
            // loadExportFile={loadFile}
            // onAdding={onAddObjectModalOpen}
            // isObjectsActive={isObjectsActive}
            // onObjectActivitySwitch={onObjectActivitySwitch}
            // tmoId={tmoId as number}
            // displayFilterIndicator={getFiltersIndicator()}
            // displayColumnsIndicator={getColumnsIndicator()}
            // displayCustomFilterIndicator={
            //   isCustomFiltersSetActive[tmoId as number] ? 'block' : 'none'
            // }
            // displayCustomColumnIndicator={
            //   isCustomColumnsSetActive[tmoId as number] ? 'block' : 'none'
            // }
            hasCustomFiltersSettingComponent
            // hasCustomColumnsSettingComponent
            // hasAddObjectComponent
            // hasSearchComponent
            hasFilterPanel
            // hasColumnsPanel
            // hasExportComponent
            // hasShowParentsData
            // setDelimiter={(value: string) => setExportDataDelimiter(value)}
            // hasObjectActivitySwitch
            // onSearchClick={(value) => onSearchClick(value)}
            // onCancelClick={onCancelClick}
            // permissions={permissions}
            // isParentsDataShown={isParentsData}
            // onParentsDataSwitch={onParentsDataSwitch}
            // setCustomColumnDimensions={handleSetColumnDimensions}
            // setCustomColumnsOrder={handleSetColumnsOrder}
            // setCustomSorting={setCustomSorting}
            // setCustomVisibleColumns={handleSetColumnsVisibility}
            // setCustomPinnedColumns={handleSetPinnedColumns}
            // setIsCustomColumnsSetActive={handleSetIsActiveCustomColumnsSet}
            // isCustomColumnsSetActive={isCustomColumnsSetActive}
            // setIsDefaultSettingsBlocked={handleSetIsDefaultSettingsBlocked}
            // isDefaultSettingsBlocked={isDefaultSettingsBlocked}
            // refetchData={refetchInventoryRows}
          />
        </TopLeft>
      </Top>
      <Bottom>
        <AuditDateRange onApplyDateRange={onApplyDateFilter} />
      </Bottom>
    </DataAuditHeaderStyled>
  );
};
