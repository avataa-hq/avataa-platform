import { useMemo, useState } from 'react';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { AddExternalLevel, EditDashboardKpiData } from '2_pages/adminSystemManagement/model';
import { Modal, hierarchyLevels, ModuleSettingsType } from '6_shared';
import { Hierarchy } from '6_shared/api/hierarchy/types';
import { IconButton } from '@mui/material';
import { Add } from '@mui/icons-material';
import { Box } from '@mui/system';
import { ExistingKpiSettings } from './groupedSettings/ExistingKpiSettings';
import { MissingKpiSettings } from './groupedSettings/MissingKpiSettings';
import { ExternalKpiSettings } from './groupedSettings/ExternalKpiSettings';

interface IProps {
  openItemModal: { id: string; type: string } | null;
  setOpenItemModal: (item: { id: string; type: string } | null) => void;
  activeHierarchy: Hierarchy | null;
  settings: Record<string, any>;
  defaultModuleName: string;
  form: UseFormReturn<FieldValues, any, undefined>;
  editDashboardKpiData: (data: EditDashboardKpiData) => void;
  addExternalLevel: (data: AddExternalLevel) => void;
  editRow: ModuleSettingsType[] | null;
  setEditRow: React.Dispatch<React.SetStateAction<ModuleSettingsType[] | null>>;
  setModuleData: React.Dispatch<React.SetStateAction<ModuleSettingsType[] | null>>;
  moduleData: any;
}

export const KpiSettingsModal = ({
  openItemModal,
  setOpenItemModal,
  settings,
  activeHierarchy,
  defaultModuleName,
  form,
  editDashboardKpiData,
  addExternalLevel,
  editRow,
  setEditRow,
  setModuleData,
  moduleData,
}: IProps) => {
  const { useGetLevelsQuery } = hierarchyLevels;

  const [open, setOpen] = useState<string>('false');
  const handleClick = (key: string) => setOpen((prev) => (prev === key ? '' : key));

  const { control } = form;

  const { data: hierarchyLevelsData } = useGetLevelsQuery(activeHierarchy?.id!, {
    skip: !activeHierarchy?.id,
  });

  const requiredKpi = useMemo(() => {
    return hierarchyLevelsData?.map((el) => ({
      tmo_id: el.object_type_id,
      name: el.name,
      level_id: el.id,
    }));
  }, [hierarchyLevelsData]);

  const toRender = useMemo(() => {
    if (!requiredKpi) {
      return {
        existingKpiSettings: [],
        deprecatedKpiSettings: [],
        missingKpiSettings: [],
        externalKpiSettings: [],
      };
    }

    const settingsKeys = settings?.map((el: any) => {
      return { tmo_id: el.tmo_id, level_id: el.level_id };
    });

    const existingKpiSettings: any[] = [];
    const deprecatedKpiSettings: any[] = [];
    const missingKpiSettings: any[] = [];
    const externalKpiSettings: any[] = [];

    requiredKpi?.forEach((kpi) => {
      if (
        settingsKeys.find(
          (el: { tmo_id: string; level_id: string }) =>
            Number(el.tmo_id) === kpi.tmo_id && Number(el.level_id) === kpi.level_id,
        )
      ) {
        existingKpiSettings.push({
          tmo_id: kpi.tmo_id,
          ...settings.find(
            (el: { tmo_id: string; level_id: string }) =>
              Number(el.tmo_id) === kpi.tmo_id && Number(el.level_id) === kpi.level_id,
          ),
        });
      } else {
        missingKpiSettings.push(kpi);
      }
    });

    settingsKeys.forEach((key: { tmo_id: string; level_id: string }) => {
      if (typeof key.tmo_id === 'string' && key.tmo_id.startsWith('ext')) {
        externalKpiSettings.push({
          tmo_id: key.tmo_id,
          ...settings.find((el: any) => el.tmo_id === key.tmo_id && el.level_id === key.level_id),
        });
      }
      const isRequired = requiredKpi?.some(
        (kpi) => kpi.tmo_id.toString() === key.tmo_id && kpi.level_id.toString() === key.level_id,
      );
      if (!isRequired) {
        deprecatedKpiSettings.push({
          tmo_id: key.tmo_id,
          ...settings.find((el: any) => el.tmo_id === key.tmo_id && el.level_id === key.level_id),
        });
      }
    });

    return { existingKpiSettings, deprecatedKpiSettings, missingKpiSettings, externalKpiSettings };
  }, [requiredKpi, settings]);

  const createExternalLevel = () => {
    const maxExternalLevel = Math.max(
      0,
      ...(settings?.filter((el: any) => !!el.external_level).map((el: any) => el.external_level) ||
        []),
    );
    addExternalLevel({
      module: defaultModuleName,
      hierarchyId: String(activeHierarchy?.id || ''),
      name: `External ${maxExternalLevel + 1}`,
      tmoId: `ext-${maxExternalLevel + 1}`,
      levelId: `ext-${maxExternalLevel + 1}`,
      externalLevel: maxExternalLevel + 1,
    });
  };

  return (
    toRender && (
      <Modal open={!!openItemModal} onClose={() => setOpenItemModal(null)} width="80%">
        <ExistingKpiSettings
          existingKpiSettings={toRender?.existingKpiSettings}
          handleClick={handleClick}
          open={open}
          defaultModuleName={defaultModuleName}
          hierarchyId={String(activeHierarchy?.id ?? '')}
          editDashboardKpiData={editDashboardKpiData}
          editRow={editRow}
          control={control}
          setEditRow={setEditRow}
          setModuleData={setModuleData}
          moduleData={moduleData}
        />
        <MissingKpiSettings
          missingKpiSettings={toRender?.missingKpiSettings}
          handleClick={handleClick}
          open={open}
          defaultModuleName={defaultModuleName}
          hierarchyId={String(activeHierarchy?.id ?? '')}
          editDashboardKpiData={editDashboardKpiData}
          editRow={editRow}
          control={control}
          setEditRow={setEditRow}
          setModuleData={setModuleData}
          moduleData={moduleData}
        />
        <ExternalKpiSettings
          externalKpiSettings={toRender?.externalKpiSettings}
          handleClick={handleClick}
          open={open}
          defaultModuleName={defaultModuleName}
          hierarchyId={String(activeHierarchy?.id ?? '')}
          editDashboardKpiData={editDashboardKpiData}
          editRow={editRow}
          control={control}
          setEditRow={setEditRow}
          setModuleData={setModuleData}
          moduleData={moduleData}
        />
        <Box component="div" sx={{ textAlign: 'center' }}>
          <IconButton>
            <Add onClick={createExternalLevel} />
          </IconButton>
        </Box>
      </Modal>
    )
  );
};
