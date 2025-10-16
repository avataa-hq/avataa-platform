import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse, List, ListItemButton, ListItemText, Paper } from '@mui/material';
import { FieldValues, Control } from 'react-hook-form';
import { EditDashboardKpiData } from '2_pages/adminSystemManagement/model';
import { ClickhouseSettings, KpiData, ModuleSettingsType } from '6_shared';
import { GroupedKpiSettings } from './GroupedKpiSettings';
import { Events } from '../events/Events';

type KpiSetting = {
  tmo_id: string;
  name: string;
  level_id: string;
  main_kpis?: Record<string, KpiData>;
  additional_kpis?: Record<string, KpiData>;
  bottom_kpis?: Record<string, KpiData>;
  clickhouse_settings?: ClickhouseSettings;
};

export type KpiDetails = {
  ID: string;
  min: string;
  max: string;
  'Granularity ID': string;
  decimals: string;
  direction: string;
};

interface IProps {
  existingKpiSettings: KpiSetting[];
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

export const ExistingKpiSettings = ({
  existingKpiSettings,
  open,
  hierarchyId,
  defaultModuleName,
  editRow,
  control,
  editDashboardKpiData,
  handleClick,
  setEditRow,
  setModuleData,
  moduleData,
}: IProps) => {
  if (!existingKpiSettings) return null;

  return (
    <>
      {existingKpiSettings.map((el) => {
        const key = `${el.tmo_id}-${el.level_id}`;

        return (
          <Paper sx={{ padding: '0.5rem', margin: '0.5rem' }} key={key}>
            <ListItemButton onClick={() => handleClick(key)}>
              {open === key ? <ExpandLess /> : <ExpandMore />}

              <ListItemText primary={el.name ?? ''} />
            </ListItemButton>

            <Collapse in={open === key} timeout="auto" sx={{ padding: '0 10px' }}>
              {open === key && (
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
                  {defaultModuleName !== 'Top View Dashboard' && (
                    <>
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
                        hierarchyId={hierarchyId}
                        events={el?.clickhouse_settings?.events ?? {}}
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
                        hierarchyId={hierarchyId}
                        events={el?.clickhouse_settings?.events ?? {}}
                        tmoId={el.tmo_id}
                        lvlId={el.level_id}
                        tmoName={el.name}
                        control={control}
                        strings={el?.bottom_kpis ?? {}}
                        editDashboardKpiData={editDashboardKpiData}
                        editRow={editRow}
                        setEditRow={setEditRow}
                      />
                    </>
                  )}
                </List>
              )}
            </Collapse>
          </Paper>
        );
      })}
    </>
  );
};
