import React, { useMemo } from 'react';
import { Collapse, List, ListItemButton, ListItemText, Paper, Tooltip } from '@mui/material';
import { FieldValues, Control } from 'react-hook-form';
import { EditDashboardKpiData } from '2_pages/adminSystemManagement/model';
import { ModuleSettingsType } from '6_shared';
import { ExpandLess, ExpandMore, PriorityHigh } from '@mui/icons-material';
import { emptyKpi, GroupedKpiSettings } from './GroupedKpiSettings';
import { Events } from '../events/Events';

interface IProps {
  missingKpiSettings: any[];
  handleClick: (el: string) => void;
  open: string;
  hierarchyId: string;
  defaultModuleName: string;
  control: Control<FieldValues, any>;
  editDashboardKpiData: (data: EditDashboardKpiData) => void;
  editRow: ModuleSettingsType[] | null;
  setEditRow: React.Dispatch<React.SetStateAction<ModuleSettingsType[] | null>>;
  setModuleData: React.Dispatch<React.SetStateAction<ModuleSettingsType[] | null>>;
  moduleData: any;
}

const mockMainKpis = {
  'KPI 1': emptyKpi,
  'KPI 2': emptyKpi,
  'KPI 3': emptyKpi,
};

export const MissingKpiSettings = ({
  missingKpiSettings,
  handleClick,
  open,
  hierarchyId,
  defaultModuleName,
  control,
  editDashboardKpiData,
  editRow,
  setEditRow,
  setModuleData,
  moduleData,
}: IProps) => {
  const updatedMissingKpiSettings = useMemo(
    () =>
      missingKpiSettings.map((miss) => ({
        ...miss,
        main_kpis: mockMainKpis,
      })),
    [missingKpiSettings],
  );

  if (!missingKpiSettings) return null;

  return (
    <>
      {updatedMissingKpiSettings.map((el: any) => (
        <Paper sx={{ padding: '0.5rem', margin: '0.5rem' }} key={`${el.tmo_id}-${el.level_id}`}>
          <ListItemButton onClick={() => handleClick(`${el.tmo_id}-${el.level_id}`)}>
            {open === `${el.tmo_id}-${el.level_id}` ? <ExpandLess /> : <ExpandMore />}
            <Tooltip title={`There are no KPI Settings for ${el.name}`}>
              <PriorityHigh color="error" />
            </Tooltip>
            <ListItemText primary={el.name ?? ''} />
          </ListItemButton>

          <Collapse
            in={open === `${el.tmo_id}-${el.level_id}`}
            timeout="auto"
            sx={{ padding: '0 10px' }}
          >
            {open === `${el.tmo_id}-${el.level_id}` && (
              <List
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                  marginLeft: '1rem',
                }}
              >
                <Events
                  kpiSettings={el}
                  setModuleData={setModuleData}
                  hierarchyId={hierarchyId}
                  moduleData={moduleData}
                  defaultModuleName={defaultModuleName}
                />
                <GroupedKpiSettings
                  type="main"
                  defaultModuleName={defaultModuleName}
                  groupName="Gauge events"
                  subgroup="main_kpis"
                  key={`${el.level_id}-main_kpis`}
                  events={el?.clickhouse_settings?.events ?? {}}
                  hierarchyId={hierarchyId}
                  tmoId={el.tmo_id}
                  lvlId={el.level_id}
                  tmoName={el.name}
                  control={control}
                  strings={mockMainKpis}
                  editDashboardKpiData={editDashboardKpiData}
                  editRow={editRow}
                  setEditRow={setEditRow}
                />
                <GroupedKpiSettings
                  type="additional"
                  defaultModuleName={defaultModuleName}
                  groupName="Additional events"
                  subgroup="additional_kpis"
                  key={`${el.level_id}-additional_kpis`}
                  events={el?.clickhouse_settings?.events ?? {}}
                  hierarchyId={hierarchyId}
                  tmoId={el.tmo_id}
                  lvlId={el.level_id}
                  tmoName={el.name}
                  control={control}
                  strings={{}}
                  editDashboardKpiData={editDashboardKpiData}
                  editRow={editRow}
                  setEditRow={setEditRow}
                />
                <GroupedKpiSettings
                  type="additional"
                  defaultModuleName={defaultModuleName}
                  groupName="Child events"
                  subgroup="bottom_kpis"
                  key={`${el.level_id}-bottom_kpis`}
                  events={el?.clickhouse_settings?.events ?? {}}
                  hierarchyId={hierarchyId}
                  tmoId={el.tmo_id}
                  lvlId={el.level_id}
                  tmoName={el.name}
                  control={control}
                  strings={{}}
                  editDashboardKpiData={editDashboardKpiData}
                  editRow={editRow}
                  setEditRow={setEditRow}
                />
              </List>
            )}
          </Collapse>
        </Paper>
      ))}
    </>
  );
};
