import React, { useMemo } from 'react';
import { Collapse, List, ListItemButton, ListItemText, Paper, Tooltip } from '@mui/material';
import { FieldValues, Control } from 'react-hook-form';
import { EditDashboardKpiData } from '2_pages/adminSystemManagement/model';
import { ModuleSettingsType } from '6_shared';
import { ExpandLess, ExpandMore, PriorityHigh } from '@mui/icons-material';
import { emptyKpi, GroupedKpiSettings } from './GroupedKpiSettings';
import { Events } from '../events/Events';

interface IProps {
  externalKpiSettings: any[];
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

export const ExternalKpiSettings = ({
  externalKpiSettings,
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
  const updatedExternalKpiSettings = useMemo(
    () =>
      externalKpiSettings.map((miss) => ({
        ...miss,
        main_kpis: miss.main_kpis ?? mockMainKpis,
      })),
    [externalKpiSettings],
  );
  if (!externalKpiSettings) return null;

  return (
    <>
      {updatedExternalKpiSettings.map((el: any) => (
        <Paper sx={{ padding: '0.5rem', margin: '0.5rem' }} key={`${el.tmo_id}-${el.level_id}`}>
          <ListItemButton onClick={() => handleClick(`${el.tmo_id}-${el.level_id}`)}>
            {open === `${el.tmo_id}-${el.level_id}` ? <ExpandLess /> : <ExpandMore />}
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
                  isExternalLevel
                  defaultModuleName={defaultModuleName}
                />
                <GroupedKpiSettings
                  type="main"
                  defaultModuleName={defaultModuleName}
                  key={`${el.level_id}-main_kpis`}
                  groupName="Gauge events"
                  subgroup="main_kpis"
                  hierarchyId={hierarchyId}
                  events={el?.clickhouse_settings?.events ?? {}}
                  tmoId={el.tmo_id}
                  lvlId={el.level_id}
                  tmoName={el.name}
                  control={control}
                  strings={el?.main_kpis ?? {}}
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
                  strings={el?.additional_kpis ?? {}}
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
                  strings={el?.bottom_kpis ?? {}}
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
