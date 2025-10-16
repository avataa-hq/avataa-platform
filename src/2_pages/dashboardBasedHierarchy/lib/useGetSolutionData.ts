import { useEffect, useMemo, useRef, useState } from 'react';
import { DateRange } from '@mui/x-date-pickers-pro';
import { Dayjs } from 'dayjs';

import { useGetReturnableParamTypes } from '5_entites';
import { InventoryAndHierarchyObjectTogether, InventoryParameterTypesModel } from '6_shared';
import { ChildCountType, StressPerDataModel } from '6_shared/api/clickhouse/types';
import { useEventsData } from './useEventData';
import { useGetStressData } from './useGetStressData';
import { getLastDayDateRange } from './utilityFunctions';

const parseFormattedNumber = (input: string): number => {
  // Удалим пробелы и приведем к нормальной строке
  const cleaned = input.trim().replace(/\s/g, '');

  // 🇪🇺 Если есть "," как десятичный разделитель
  if (/,\d{1,2}$/.test(cleaned)) {
    // Убираем точки как разделители тысяч, заменяем запятую на точку
    const normalized = cleaned.replace(/\./g, '').replace(',', '.');
    return parseFloat(normalized);
  }

  // 🇺🇸 Если есть "." как десятичный, а "," как тысячный
  if (/\.\d{1,2}$/.test(cleaned) && cleaned.includes(',')) {
    const normalized = cleaned.replace(/,/g, '');
    return parseFloat(normalized);
  }

  // 🧼 В остальных случаях просто убираем все точки и запятые
  const normalized = cleaned.replace(/[.,]/g, '');
  return Number(normalized);
};

const getCorrectValue = (val: string | undefined | number | null): number => {
  if (val == null) return NaN;
  if (typeof val === 'number') return +val;

  return +parseFormattedNumber(val);
};

const updateObjectWithKpiData = (
  tableSpeedData: {
    [kpiName: string]: { [objId: string]: { value?: number | string | undefined } };
  },
  prevObj: InventoryAndHierarchyObjectTogether,
  returnableParamTypes?: InventoryParameterTypesModel[],
  stressData?: StressPerDataModel[],
) => {
  const { key } = prevObj;

  const newObj = { ...prevObj };

  if (returnableParamTypes) {
    returnableParamTypes.forEach((paramType) => {
      const paramValue = prevObj.parameters?.[paramType.id];
      if (paramValue !== undefined) {
        newObj[`mo_${paramType.name}`] = paramValue;
      }
    });
  }

  // Add table speed data
  Object.entries(tableSpeedData).forEach(([kpiName, kpiData]) => {
    if (kpiData[key] && 'value' in kpiData[key]) {
      newObj[kpiName] = getCorrectValue(kpiData[key].value);
    }
  });

  // Add stress data
  if (stressData) {
    const matchingStress = stressData.find((stressItem) => stressItem.key === key);
    if (matchingStress && matchingStress.stressData?.length > 0) {
      newObj.AVG_Stress = +matchingStress.stressData[0].stress.toFixed(2);
    }
  }

  return newObj;
};

interface IProps {
  hierarchyInventoryObjects?: InventoryAndHierarchyObjectTogether[];
  dateRange: DateRange<Dayjs>;
  isReal?: boolean;
  currentHierarchyLevelId: number;
  childCount?: ChildCountType[];
}

export const useGetSolutionData = ({
  hierarchyInventoryObjects,
  dateRange,
  isReal = false,
  currentHierarchyLevelId,
  childCount,
}: IProps) => {
  const [solutionData, setSolutionData] = useState<
    (InventoryAndHierarchyObjectTogether & Record<string, any>)[]
  >([]);
  const latestRequestRef = useRef(0);

  const objectKeys = useMemo(() => {
    return hierarchyInventoryObjects?.map(({ key }) => key) ?? [];
  }, [hierarchyInventoryObjects]);

  const tmoId = useMemo(() => {
    return isReal ? hierarchyInventoryObjects?.[0]?.object_type_id : undefined;
  }, [hierarchyInventoryObjects, isReal]);

  const { returnableParamTypes } = useGetReturnableParamTypes({
    pmTmoId: tmoId,
  });

  const { speedometersData, loading: isLoadingSpeedometers } = useEventsData({
    dateRange,
    objIds: objectKeys,
    eventType: 'bottom_kpis',
    withPrevious: true,
    levelID: currentHierarchyLevelId,
  });

  const { stressData, isLoadingStressData } = useGetStressData({
    dateRange: getLastDayDateRange(dateRange),
    objectKeys,
    granularity: 'day',
    levelID: currentHierarchyLevelId,
  });

  useEffect(() => {
    const currentRequestId = ++latestRequestRef.current;
    const res: (InventoryAndHierarchyObjectTogether & Record<string, any>)[] = [];

    hierarchyInventoryObjects?.forEach((obj) => {
      const newObj = updateObjectWithKpiData(
        speedometersData,
        obj,
        returnableParamTypes,
        stressData,
      );

      const childInfo = childCount?.find((c) => c.parentKey === obj.key);
      newObj.child_count = childInfo ? Number(childInfo.count) : newObj.child_count;

      res.push(newObj);
    });

    if (latestRequestRef.current === currentRequestId) {
      setSolutionData(res);
    }
  }, [speedometersData, hierarchyInventoryObjects, returnableParamTypes, stressData, childCount]);

  return {
    solutionData,
  };
};
