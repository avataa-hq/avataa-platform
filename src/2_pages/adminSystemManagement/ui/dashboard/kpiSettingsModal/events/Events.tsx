import { useEffect, useState, useMemo } from 'react';
import { ColorSelecting, ColorSettings } from '3_widgets';
import {
  colorRangesApi,
  getErrorMessage,
  moduleSettingsApi,
  ModuleSettingsType,
  useTranslate,
  useGetClickhouseTableNames,
  useGetClickhouseTableColumns,
  ClickhouseSettings,
  ClickhouseObjectSettings,
  useTabs,
  useColorsConfigure,
  useConfig,
} from '6_shared';
import { enqueueSnackbar } from 'notistack';
import { TablesResponseType } from '6_shared/api/clickhouse/types';
import { EvenstStyled } from './Events.styled';
import { EventsHeader } from './EventsHeader';
import { EventsTable } from './EventsTable';
import { ExternalLevel } from './ExternalLevel';
import { CalculateStress } from './CalculateStress';

interface Iprops {
  kpiSettings: any;
  setModuleData: React.Dispatch<React.SetStateAction<ModuleSettingsType[] | null>>;
  hierarchyId: string;
  moduleData: any;
  isExternalLevel?: boolean;
  defaultModuleName: string;
}

export const Events = ({
  kpiSettings,
  setModuleData,
  hierarchyId,
  moduleData,
  isExternalLevel,
  defaultModuleName,
}: Iprops) => {
  const { useFindRangesByFilterQuery } = colorRangesApi;
  const { useUpdateModuleSettingsMutation } = moduleSettingsApi;
  const translate = useTranslate();

  const [clickHouseTable, setClickHouseTable] = useState<{ name: string }>({ name: '' });
  const [clickhouseConfig, setClickhouseConfig] = useState<ClickhouseSettings | undefined>();
  const [clickObjectCfg, setClickObjectCfg] = useState<ClickhouseObjectSettings | undefined>();
  const [hasChanges, setHasChanges] = useState(false);

  const {
    config: { _clickhouseUrl, _clickhouseName, _clickhousePass, _clickhouseCorsDisable },
  } = useConfig();

  const { isOpenColorSelecting, setCurrentTmoId } = useColorsConfigure();
  const { selectedAdminTab } = useTabs();

  const pseudoTmoId = useMemo(() => {
    return `${hierarchyId}-${kpiSettings?.level_id ?? 'none'}`;
  }, [kpiSettings, hierarchyId]);

  useEffect(() => {
    setCurrentTmoId({ module: selectedAdminTab, tmoId: pseudoTmoId });
  }, [pseudoTmoId, selectedAdminTab]);

  const [putModuleSettings] = useUpdateModuleSettingsMutation();

  const { data: clickHouseTableData, isLoading } = useGetClickhouseTableNames({
    _clickhouseUrl,
    _clickhouseName,
    _clickhousePass,
    _clickhouseCorsDisable,
  });

  const { data: сlickhouseTableColumnsData, isLoading: isL } = useGetClickhouseTableColumns({
    _clickhouseUrl,
    _clickhouseName,
    _clickhousePass,
    _clickhouseCorsDisable,
    tables: clickHouseTable.name,
  });

  const { data: columnsForExtLevel } = useGetClickhouseTableColumns({
    _clickhouseUrl,
    _clickhouseName,
    _clickhousePass,
    _clickhouseCorsDisable,
    tables: clickObjectCfg?.table_name,
  });

  const filteredClickhouseTableColumnsData = useMemo(() => {
    const excludedTprms = Object.values(clickhouseConfig ?? {});

    return сlickhouseTableColumnsData?.filter(
      (item) => !excludedTprms.includes(item.name),
    ) as TablesResponseType;
  }, [clickhouseConfig, сlickhouseTableColumnsData]);

  const pseudoTprmId = useMemo(() => {
    const kpiForColorRanges =
      filteredClickhouseTableColumnsData?.reduce<
        {
          id: string;
          name: string;
          val_type: string;
        }[]
      >((acc, item) => {
        return [...acc, { id: item.name, name: item.name, val_type: 'number' }];
      }, []) ?? [];

    const allTprms = [{ id: 'Stress', name: 'Stress', val_type: 'number' }, ...kpiForColorRanges];

    return allTprms;
  }, [filteredClickhouseTableColumnsData]);

  const { data: ColorRangesForStress } = useFindRangesByFilterQuery({
    tmo_ids: [pseudoTmoId],
    tprm_ids: pseudoTprmId.map((item) => item.name),
    only_description: false,
    limit: 1000,
  });

  useEffect(() => {
    if (!hasChanges) return;

    if (moduleData && Array.isArray(moduleData)) {
      const updatedModuleData = moduleData.map((module) => {
        if (module.module_name !== defaultModuleName) {
          return module;
        }

        const KPI = module.settings?.['KPI Settings']?.[hierarchyId];
        if (KPI && Array.isArray(KPI)) {
          const kpiIndex = KPI.findIndex((item) => item.name === kpiSettings?.name);

          if (kpiIndex !== -1) {
            const clickHouseElement = KPI[kpiIndex]?.clickhouse_settings;
            const defaultKpi = clickHouseElement?.defaultKpi;
            const defaultKpiFromConfig = clickhouseConfig?.defaultKpi;
            const objectElement = KPI[kpiIndex]?.clickhouse_object_settings;
            const changesDetected =
              JSON.stringify(clickHouseElement) !== JSON.stringify(clickhouseConfig) ||
              JSON.stringify(objectElement) !== JSON.stringify(clickObjectCfg);

            if (changesDetected) {
              const updatedKPI = [...KPI];
              updatedKPI[kpiIndex] = {
                ...updatedKPI[kpiIndex],
                clickhouse_settings: {
                  ...clickhouseConfig,
                  defaultKpi: defaultKpiFromConfig ?? defaultKpi,
                },
                clickhouse_object_settings: { ...clickObjectCfg },
              };

              return {
                ...module,
                settings: {
                  ...module.settings,
                  'KPI Settings': {
                    ...module.settings['KPI Settings'],
                    [hierarchyId]: updatedKPI,
                  },
                },
                dirty: true,
              };
            }
          } else {
            return {
              ...module,
              settings: {
                ...module.settings,
                'KPI Settings': {
                  ...module.settings['KPI Settings'],
                  [hierarchyId]: [
                    ...KPI,
                    {
                      name: kpiSettings?.name,
                      level_id: kpiSettings?.level_id,
                      tmo_id: kpiSettings?.tmo_id,
                      clickhouse_settings: { ...clickhouseConfig },
                      clickhouse_object_settings: { ...clickObjectCfg },
                    },
                  ],
                },
              },
              dirty: true,
            };
          }
        } else {
          return {
            ...module,
            settings: {
              ...module.settings,
              'KPI Settings': {
                ...module.settings['KPI Settings'],
                [hierarchyId]: [
                  {
                    name: kpiSettings?.name,
                    level_id: kpiSettings?.level_id,
                    tmo_id: kpiSettings?.tmo_id,
                    clickhouse_settings: { ...clickhouseConfig },
                    clickhouse_object_settings: { ...clickObjectCfg },
                  },
                ],
              },
            },
            dirty: true,
          };
        }
        return module;
      });

      setModuleData(updatedModuleData);
      setHasChanges(false);

      const modifiedModules = updatedModuleData.filter((module) => module.dirty);

      if (modifiedModules.length === 0) {
        enqueueSnackbar(translate('No changes detected'), { variant: 'info' });
      }

      const promises = modifiedModules.map((module) => putModuleSettings(module));

      Promise.all(promises)
        .then(() => {
          enqueueSnackbar({ variant: 'success', message: translate('Success') });
        })
        .catch((error) => {
          enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
        });
    }
  }, [
    hasChanges,
    clickhouseConfig,
    clickObjectCfg,
    moduleData,
    hierarchyId,
    kpiSettings,
    setModuleData,
    putModuleSettings,
    translate,
    defaultModuleName,
  ]);

  useEffect(() => {
    if (!clickHouseTableData || !kpiSettings?.clickhouse_settings) return;

    const nameFromSettings = kpiSettings.clickhouse_settings.table_name;
    const hasInTableColumns = clickHouseTableData.some((table) => table.name === nameFromSettings);

    const name =
      nameFromSettings && hasInTableColumns ? nameFromSettings : clickHouseTableData[0].name;

    setClickHouseTable({ name });
  }, [clickHouseTableData, kpiSettings]);

  return (
    <EvenstStyled>
      {isExternalLevel && (
        <ExternalLevel
          clickHouseTableData={clickHouseTableData}
          сlickhouseTableColumnsData={columnsForExtLevel}
          clickhouseSettings={kpiSettings?.clickhouse_object_settings || {}}
          clickObjectCfg={clickObjectCfg}
          setClickObjectCfg={setClickObjectCfg}
        />
      )}

      <EventsHeader
        clickHouseTableData={clickHouseTableData}
        clickHouseTable={clickHouseTable}
        setClickHouseTable={setClickHouseTable}
        сlickhouseTableColumnsData={сlickhouseTableColumnsData}
        clickhouseSettings={kpiSettings?.clickhouse_settings || {}}
        setClickhouseConfig={setClickhouseConfig}
      />

      <CalculateStress
        clickhouseSettings={kpiSettings?.clickhouse_settings || {}}
        setClickhouseConfig={setClickhouseConfig}
      />

      <EventsTable
        сlickhouseTableColumnsData={filteredClickhouseTableColumnsData}
        clickhouseSettingsEvents={kpiSettings?.clickhouse_settings?.events || null}
        setClickhouseConfig={setClickhouseConfig}
        setHasChanges={setHasChanges}
      />

      {isOpenColorSelecting.environment && (
        <ColorSelecting
          palettes={ColorRangesForStress}
          settingsOnly
          isFromAdmin
          // selectedPaletteId={selectPaletteId}
          tprms={pseudoTprmId}
        />
      )}
      <ColorSettings isFromAdmin />
    </EvenstStyled>
  );
};
