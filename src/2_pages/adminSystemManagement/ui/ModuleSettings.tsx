import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import {
  LoadingContainer,
  getErrorMessage,
  moduleSettingsApi,
  useTranslate,
  ModuleSettingsType,
  KPISetting,
} from '6_shared';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { ModuleSettingsListElement } from './ModuleSettingsListElement';
import { MainViewList } from '../SystemManagement.styled';
import { AddExternalLevel, EditDashboardKpiData, EditModuleDataType } from '../model/types';

export const ModuleSettings = () => {
  const { useGetAllModulesSettingsQuery, useUpdateModuleSettingsMutation } = moduleSettingsApi;

  const translate = useTranslate();
  const [moduleData, setModuleData] = useState<ModuleSettingsType[] | null>([]);
  const [editRow, setEditRow] = useState<ModuleSettingsType[] | null>(null);
  const form = useForm({
    mode: 'onChange',
  });
  const { formState } = form;

  const { data, isError, isFetching } = useGetAllModulesSettingsQuery();
  const [putModuleSettings] = useUpdateModuleSettingsMutation();

  useEffect(() => {
    if (!data?.length) return;

    const sortedData = data
      .slice()
      .sort((a, b) => a.module_name.toLowerCase().localeCompare(b.module_name.toLowerCase()));

    setModuleData(sortedData);
  }, [data]);

  const findModuleIndex = (moduleInfo: ModuleSettingsType[], module: string): number =>
    moduleInfo.findIndex((md: ModuleSettingsType) => md.module_name === module);

  const deepClone = <T extends object>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj));
  };

  const getKpiSettings = (
    module: ModuleSettingsType,
    hierarchyId: string,
  ): KPISetting[] | undefined => {
    return module.settings?.['KPI Settings']?.[hierarchyId];
  };

  const findGroupIndex = (kpiSettings: KPISetting[], groupId: string): number => {
    return kpiSettings.findIndex((group) => `${group.tmo_id}-${group.level_id}` === groupId);
  };

  const addNewGroup = (
    kpiSettings: any[],
    { tmoName, groupId, subgroup, kpiConsecutiveValue, key, newValue, emptyKpi }: any,
  ) => {
    const newGroup = {
      name: tmoName,
      tmo_id: groupId.split('-')[0],
      level_id: groupId.split('-')[1],
      [subgroup]: {
        [kpiConsecutiveValue]: emptyKpi || {
          [key]: newValue,
        },
      },
    };

    kpiSettings.push(newGroup);
  };

  const updateExistingGroup = (
    group: any,
    { subgroup, kpiConsecutiveValue, key, newValue, emptyKpi }: any,
  ) => {
    if (!group[subgroup]) group[subgroup] = {};
    if (!group[subgroup][kpiConsecutiveValue]) group[subgroup][kpiConsecutiveValue] = {};

    if (emptyKpi) {
      group[subgroup][kpiConsecutiveValue] = {
        ...group[subgroup][kpiConsecutiveValue],
        ...emptyKpi,
      };
    } else {
      group[subgroup][kpiConsecutiveValue][key] = newValue;
    }
  };

  const deleteKpiAndMaintainKeys = (
    kpis: Record<number, any>,
    keyToDelete: string,
  ): Record<string, any> => {
    const filteredEntries = Object.entries(kpis).filter(([key]) => {
      return key !== keyToDelete;
    });

    const reindexedKpis = Object.fromEntries(
      filteredEntries.map(([key, value], index) => [
        key.includes('additional') ? key : `KPI ${index + 1}`,
        value,
      ]),
    );

    // return Object.fromEntries(filteredEntries);
    // const reindexedKpis = Object.fromEntries(
    //   filteredEntries.map(([_, value], index) => [`KPI ${index + 1}`, value]),
    // );

    return reindexedKpis;
  };

  const finalizeUpdates = (module: any, kpiSettings: any[], hierarchyId: string) => {
    module.settings['KPI Settings'] = {
      ...module.settings['KPI Settings'],
      [hierarchyId]: kpiSettings,
    };

    module.dirty = true;
  };

  const addExternalLevel = ({
    module,
    hierarchyId,
    tmoId,
    levelId,
    externalLevel,
    name,
  }: AddExternalLevel) => {
    setModuleData((prevModuleData: any) => {
      const moduleIndex = findModuleIndex(prevModuleData, module);
      if (moduleIndex === -1) return prevModuleData;

      const updatedModule = deepClone(prevModuleData[moduleIndex]);
      const kpiSettings = getKpiSettings(updatedModule, hierarchyId) || [];
      const newGroup = {
        name,
        tmo_id: tmoId,
        level_id: levelId,
        external_level: externalLevel,
        main_kpis: {},
        additional_kpis: {},
      };

      kpiSettings.push(newGroup);
      finalizeUpdates(updatedModule, kpiSettings, hierarchyId);

      const updatedModuleData = [...prevModuleData];
      updatedModuleData[moduleIndex] = updatedModule;

      return updatedModuleData;
    });
  };

  const editDashboardKpiData = ({
    module,
    hierarchyId,
    subgroup,
    tmoName,
    groupId,
    kpiConsecutiveValue,
    key,
    newValue,
    emptyKpi,
    action = 'modify',
  }: EditDashboardKpiData) => {
    setModuleData((prevModuleData: any) => {
      const moduleIndex = findModuleIndex(prevModuleData, module);
      if (moduleIndex === -1) return prevModuleData;

      const updatedModule = deepClone(prevModuleData[moduleIndex]);
      const kpiSettings: any = getKpiSettings(updatedModule, hierarchyId);
      const groupIndex = findGroupIndex(kpiSettings, groupId);

      if (groupIndex === -1 && action === 'add') {
        addNewGroup(kpiSettings, {
          tmoName,
          groupId,
          subgroup,
          kpiConsecutiveValue,
          key,
          newValue,
          emptyKpi,
        });
      } else if (groupIndex !== -1) {
        const group = kpiSettings[groupIndex];

        switch (action) {
          case 'add':
          case 'modify':
            updateExistingGroup(group, { subgroup, kpiConsecutiveValue, key, newValue, emptyKpi });
            break;
          case 'delete':
            group[subgroup] = deleteKpiAndMaintainKeys(group[subgroup], kpiConsecutiveValue);
            break;
          default:
            break;
        }
      }

      finalizeUpdates(updatedModule, kpiSettings, hierarchyId);

      const updatedModuleData = [...prevModuleData];
      updatedModuleData[moduleIndex] = updatedModule;
      return updatedModuleData;
    });
  };

  const updateGroupSettings = (
    groupSettings: any,
    key: string,
    newValue: any,
    nestedKey?: string,
    newNestedValue?: any,
  ) => {
    if (
      typeof groupSettings === 'object' &&
      groupSettings !== null &&
      Object.values(groupSettings).some((val) => typeof val === 'object') &&
      nestedKey
    ) {
      return {
        ...groupSettings,
        [key]: { ...(groupSettings[key] as Record<string, any>), [nestedKey]: newNestedValue },
      };
    }
    return { ...(groupSettings as Record<string, any>), [key]: newValue };
  };

  const editModuleData = ({
    defaultModuleName,
    groupName,
    key,
    newValue,
    nestedKey,
    newNestedValue,
  }: EditModuleDataType) => {
    setModuleData((prevModuleData: any): any[] =>
      prevModuleData.map((module: ModuleSettingsType) => {
        if (module.module_name !== defaultModuleName) return module;

        const isUngrouped = groupName === 'Ungrouped';
        const groupSettings = module.settings[groupName];

        const updatedSettings = {
          ...module.settings,
          [groupName]: isUngrouped
            ? { ...(module.settings || {}), [key]: newValue }
            : updateGroupSettings(groupSettings, key, newValue, nestedKey, newNestedValue),
        };

        return { ...module, settings: updatedSettings, dirty: true };
      }),
    );
  };

  const handleSave = () => {
    const modifiedModules = moduleData?.filter((module) => module.dirty);

    if (!modifiedModules || modifiedModules.length === 0) {
      enqueueSnackbar(translate('No changes detected'), { variant: 'info' });
      return;
    }

    const promises = modifiedModules.map((module) => putModuleSettings(module).unwrap());

    Promise.all(promises)
      .then(() => {
        enqueueSnackbar({ variant: 'success', message: translate('Success') });
      })
      .catch((error) => {
        enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
      });

    setEditRow(null);
  };

  return (
    <>
      <MainViewList>
        {isError && <div>{translate('An error has occurred!')}</div>}
        {isFetching && (
          <LoadingContainer>
            <CircularProgress />
          </LoadingContainer>
        )}
        {!!moduleData?.length &&
          moduleData.map((moduleSettings) => {
            return (
              <ModuleSettingsListElement
                key={moduleSettings.module_name}
                moduleSettings={moduleSettings}
                editModuleData={editModuleData}
                editDashboardKpiData={editDashboardKpiData}
                addExternalLevel={addExternalLevel}
                form={form}
                editRow={editRow}
                setEditRow={setEditRow}
                moduleData={moduleData}
                setModuleData={setModuleData}
              />
            );
          })}
      </MainViewList>
      <Box component="div">
        <Button
          sx={{ float: 'right', mt: 2 }}
          variant="contained"
          onClick={handleSave}
          disabled={Object.keys(formState.errors).length > 0}
        >
          {translate('Save')}
        </Button>
      </Box>
    </>
  );
};
