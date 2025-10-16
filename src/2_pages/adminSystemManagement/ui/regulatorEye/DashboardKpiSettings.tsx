import { List, ListItemText, Paper } from '@mui/material';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { EditModuleDataType } from '2_pages/adminSystemManagement/model';
import { ModuleSettingsType } from '6_shared';
import { DashboardGroupedKpiSettings } from './DashboardGroupedKpiSettings';

interface IProps {
  settings: {};
  settingsKey: string;
  defaultModuleName: string;
  form: UseFormReturn<FieldValues, any, undefined>;
  editModuleData: ({ defaultModuleName, groupName, key, newValue }: EditModuleDataType) => void;
  editRow: ModuleSettingsType[] | null;
  setEditRow: React.Dispatch<React.SetStateAction<ModuleSettingsType[] | null>>;
  moduleSettings: ModuleSettingsType;
}

export const DashboardKpiSettings = ({
  settings,
  settingsKey,
  defaultModuleName,
  form,
  editModuleData,
  editRow,
  setEditRow,
  moduleSettings,
}: IProps) => {
  if (
    typeof settings !== 'object' ||
    settings === null ||
    !Object.values(settings).some((val) => typeof val === 'object')
  ) {
    return null;
  }

  return (
    <Paper sx={{ padding: '1rem' }}>
      <ListItemText primary={settingsKey} />
      <List
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.3rem',
          marginLeft: '1rem',
        }}
      >
        {Object.entries(settings).map(([nestedKey, nestedValue]) => {
          return (
            <DashboardGroupedKpiSettings
              moduleSettings={moduleSettings}
              parentGroupName={settingsKey}
              defaultModuleName={defaultModuleName}
              groupName={nestedKey}
              key={nestedKey}
              form={form}
              strings={nestedValue}
              editModuleData={editModuleData}
              editRow={editRow}
              setEditRow={setEditRow}
            />
          );
        })}
      </List>
    </Paper>
  );
};
