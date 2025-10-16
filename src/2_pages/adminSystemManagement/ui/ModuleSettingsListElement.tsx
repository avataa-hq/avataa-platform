import { useMemo, useState } from 'react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { CircularProgress, Collapse, List, ListItemButton, ListItemText } from '@mui/material';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { useTranslate, searchApiV2, ModuleSettingsType } from '6_shared';
import { GroupedSettings } from './GroupedSettings';
import { AddExternalLevel, EditDashboardKpiData, EditModuleDataType } from '../model';
import { ModuleSettingsListItem } from './ModuleSettingsListItem';
import { Card } from './ModuleSettingsListElement.styled';

interface IProps {
  moduleSettings: ModuleSettingsType;
  form: UseFormReturn<FieldValues, any, undefined>;
  editModuleData: (data: EditModuleDataType) => void;
  editDashboardKpiData: (data: EditDashboardKpiData) => void;
  addExternalLevel: (data: AddExternalLevel) => void;
  editRow: ModuleSettingsType[] | null;
  setEditRow: React.Dispatch<React.SetStateAction<ModuleSettingsType[] | null>>;
  moduleData: ModuleSettingsType[] | null;
  setModuleData: React.Dispatch<React.SetStateAction<ModuleSettingsType[] | null>>;
}

const separateSettings = (settings: Record<string, any>) => {
  return Object.entries(settings).reduce(
    (acc, [key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        acc.objects[key] = value;
      } else if (typeof value === 'string') {
        acc.strings[key] = value;
      }
      return acc;
    },
    { objects: {} as Record<string, any>, strings: {} as Record<string, string> },
  );
};

export const ModuleSettingsListElement = ({
  moduleSettings,
  form,
  editModuleData,
  editDashboardKpiData,
  addExternalLevel,
  editRow,
  setEditRow,
  setModuleData,
  moduleData,
}: IProps) => {
  const { useGetAllHierarchyQuery } = searchApiV2;

  const translate = useTranslate();

  const [open, setOpen] = useState(false);
  const [openItemModal, setOpenItemModal] = useState<{ id: string; type: string } | null>(null);

  const { data: hierarchies, isFetching: isHierarchiesFetching } = useGetAllHierarchyQuery({});

  const { module_name: defaultModuleName, settings } = moduleSettings;

  const { objects, strings } = useMemo(() => separateSettings(settings), [settings]);

  const handleClick = () => setOpen((prev) => !prev);

  const testId = defaultModuleName.replace(/\s+/g, '-').toLowerCase();

  return (
    <Card style={{ height: 'auto', padding: 0 }}>
      <ListItemButton onClick={handleClick} data-testid={`admin-module-settings__${testId}`}>
        {open ? <ExpandLess /> : <ExpandMore />}
        {/* @ts-ignore */}
        <ListItemText primary={translate(defaultModuleName)} />
        {isHierarchiesFetching && <CircularProgress size={20} />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" sx={{ padding: '0 10px' }}>
        {open && Object.keys(objects).length > 0 && (
          <List sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {Object.entries(objects).map(([key, value]) => (
              <ModuleSettingsListItem
                key={key}
                groupName={key}
                value={value}
                defaultModuleName={defaultModuleName}
                form={form}
                editModuleData={editModuleData}
                editDashboardKpiData={editDashboardKpiData}
                addExternalLevel={addExternalLevel}
                editRow={editRow}
                setEditRow={setEditRow}
                openItemModal={openItemModal}
                setOpenItemModal={setOpenItemModal}
                hierarchies={hierarchies}
                setModuleData={setModuleData}
                moduleData={moduleData}
                objects={objects}
              />
            ))}
          </List>
        )}
        {open && Object.keys(strings).length > 0 && (
          <GroupedSettings
            defaultModuleName={defaultModuleName}
            groupName="Ungrouped"
            strings={strings}
            form={form}
            editModuleData={editModuleData}
            editRow={editRow}
            setEditRow={setEditRow}
          />
        )}
      </Collapse>
    </Card>
  );
};
