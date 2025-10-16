import { useMemo } from 'react';
import { LevelSettings, ModuleSettingsType } from '6_shared';
import { HierarchyObject } from '6_shared/api/hierarchy/types';

interface IProps {
  moduleSettings?: ModuleSettingsType;
  hierarchyID?: number;

  currentLevelId?: number | null;
  parentLevelId?: number | null;

  selectedHierarchyNodeObject?: HierarchyObject | null;
}

export const useKpiDataByLevel = ({
  moduleSettings,
  hierarchyID,

  currentLevelId,
  parentLevelId,

  selectedHierarchyNodeObject,
}: IProps) => {
  const kpiSettings = useMemo(() => {
    if (!moduleSettings?.settings?.['KPI Settings']) return undefined;
    return moduleSettings.settings['KPI Settings'];
  }, [moduleSettings?.settings]);

  const currentLevelKpiSettings = useMemo(() => {
    if (!kpiSettings) return undefined;

    const hierarchyId = hierarchyID ?? -1;
    const levelId = currentLevelId ?? -1;

    return kpiSettings[hierarchyId]?.find((el) => {
      return (
        String(el.level_id) === String(levelId) ||
        String(el.external_level) === String(levelId - 1000000)
      );
    }) as LevelSettings | undefined;
  }, [kpiSettings, hierarchyID, currentLevelId]);

  const parentNodeLevelKpiSettings = useMemo(() => {
    if (!kpiSettings) return undefined;

    const hierarchyId = hierarchyID ?? -1;
    const levelId = parentLevelId ?? -1;

    return kpiSettings[hierarchyId]?.find((el) => {
      return (
        String(el.level_id) === String(levelId) ||
        String(el.external_level) === String(levelId - 1000000)
      );
    }) as LevelSettings | undefined;
  }, [kpiSettings, hierarchyID, parentLevelId]);

  const selectedHierarchyNodeObjectLevelKpiSettings = useMemo(() => {
    if (!kpiSettings || !selectedHierarchyNodeObject) return undefined;

    return kpiSettings?.[selectedHierarchyNodeObject.hierarchy_id]?.find(
      (lvl) => Number(selectedHierarchyNodeObject?.level_id || 0) - 1000000 === lvl?.external_level,
    ) as LevelSettings | undefined;
  }, [kpiSettings, selectedHierarchyNodeObject]);

  const selectedHierarchyNodeObjectChildLevelKpiSettings = useMemo(() => {
    if (!kpiSettings || !selectedHierarchyNodeObject) return undefined;
    return kpiSettings[selectedHierarchyNodeObject.hierarchy_id ?? -1]?.find(
      (lvl) =>
        Number(selectedHierarchyNodeObject?.child_level_id || 0) - 1000000 === lvl?.external_level,
    ) as LevelSettings | undefined;
  }, [kpiSettings, selectedHierarchyNodeObject]);

  return {
    currentLevelKpiSettings,
    parentNodeLevelKpiSettings,
    selectedHierarchyNodeObjectLevelKpiSettings,
    selectedHierarchyNodeObjectChildLevelKpiSettings,
  };
};
