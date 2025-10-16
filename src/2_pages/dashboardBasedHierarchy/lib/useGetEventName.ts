import { useEffect, useMemo, useState } from 'react';
import { useDashboardBasedHierarchy } from '6_shared';

export const useGetEventNames = (levelID?: number) => {
  const [events, setEvents] = useState<Record<string, string>>({});

  const {
    selectedHierarchy,
    kpiData: kpiSettings,
    currentHierarchyLevelId,
  } = useDashboardBasedHierarchy();

  const hierarchyLvlId = useMemo(
    () => levelID ?? currentHierarchyLevelId,
    [levelID, currentHierarchyLevelId],
  );

  useEffect(() => {
    if (!Object.keys(kpiSettings).length || !selectedHierarchy || hierarchyLvlId == null) {
      setEvents({});
      return;
    }

    const currentKpiSettings = kpiSettings[+selectedHierarchy.hierarchy_id];
    const currentLevelKpiSettings = currentKpiSettings?.find(
      (el) => String(el.level_id) === String(hierarchyLvlId),
    );

    const clickSettings = currentLevelKpiSettings?.clickhouse_settings;

    const extractedEvents = Object.entries(clickSettings?.events ?? {}).reduce(
      (acc, [key, value]) => {
        acc[key] = value?.name ?? key;
        return acc;
      },
      {} as Record<string, any>,
    );

    setEvents(extractedEvents);
  }, [hierarchyLvlId, kpiSettings, selectedHierarchy]);

  return events;
};
