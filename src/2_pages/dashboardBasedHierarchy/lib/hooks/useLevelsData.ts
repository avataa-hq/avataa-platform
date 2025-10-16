import { hierarchyLevels, ModuleSettingsType, useDashboardBasedHierarchy } from '6_shared';
import { useEffect, useState } from 'react';

const { useGetLevelsQuery } = hierarchyLevels;

interface IProps {
  moduleSettings?: ModuleSettingsType;
  hierarchyID?: number;
}

export const useLevelsData = ({ moduleSettings, hierarchyID }: IProps) => {
  const [levelsObjectTypeIds, setLevelsObjectTypeIds] = useState<number[]>([]);

  const { setCurrentHierarchyLevelId, setHierarchyLevels } = useDashboardBasedHierarchy();

  const { data: hierarchyLevelsData, isFetching: isFetchingHierarchyLevels } = useGetLevelsQuery(
    hierarchyID!,
    { skip: !hierarchyID },
  );
  useEffect(() => {
    if (!hierarchyLevelsData) return;

    const sortedHierarchyLevelsData = hierarchyLevelsData.slice().sort((a, b) => a.level - b.level);
    setHierarchyLevels(sortedHierarchyLevelsData);

    const firstLevel = sortedHierarchyLevelsData[0];
    if (firstLevel) setCurrentHierarchyLevelId(firstLevel.id);

    const tmoSet = new Set<number>();
    sortedHierarchyLevelsData.forEach((level) => {
      tmoSet.add(level.object_type_id);
    });

    setLevelsObjectTypeIds(Array.from(tmoSet));
  }, [hierarchyID, hierarchyLevelsData, moduleSettings?.settings]);

  return { isFetchingHierarchyLevels, levelsObjectTypeIds };
};
