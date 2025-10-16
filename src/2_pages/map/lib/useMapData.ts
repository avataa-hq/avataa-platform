import { addAdditionalParamsToData, dataGroupingWorker } from '3_widgets';
import {
  IColorRangeModel,
  IInventoryObjectModel,
  IInventorySearchObjectModel,
  WorkerFactory,
} from '6_shared';
import { useEffect, useMemo, useState } from 'react';

const { worker: workerInstanceTransformation } = new WorkerFactory(addAdditionalParamsToData);
const { worker: workerInstanceGrouping } = new WorkerFactory(dataGroupingWorker);

interface IProps {
  generalMapData: Record<string, any>[];
  objectTypesData: IInventorySearchObjectModel[];
  hierarchyData?: IInventoryObjectModel[];
  additionalParams?: Record<string, any>;
  tprmColorData?: Record<string, IColorRangeModel>;
}
export const useMapData = ({
  generalMapData,
  hierarchyData,
  objectTypesData,
  additionalParams,
  tprmColorData,
}: IProps) => {
  const [isDataProcessingLoading, setIsDataProcessingLoading] = useState(false);

  const collectedMapData = useMemo(() => {
    if (hierarchyData) {
      return [...generalMapData, ...objectTypesData, ...hierarchyData];
    }

    return [...generalMapData, ...objectTypesData];
  }, [generalMapData, objectTypesData, hierarchyData]);

  // ======================================================================================

  const [dataWithAdditionalParams, setDataWithAdditionalParams] = useState<Record<string, any>[]>(
    [],
  );
  const addAdditional = (
    data: Record<string, any>[],
    additionalData: Record<string, any> = {},
    colorData: Record<string, IColorRangeModel> = {},
  ) => {
    if (workerInstanceTransformation) {
      setIsDataProcessingLoading(true);
      workerInstanceTransformation.postMessage({
        mapData: data,
        additionalParams: additionalData,
        colorData,
      });

      workerInstanceTransformation.onmessage = (ev) => {
        setIsDataProcessingLoading(false);
        if (ev.data) {
          const { newData } = ev.data;
          if (newData) setDataWithAdditionalParams(newData);
        }
        return null;
      };
      workerInstanceTransformation.onerror = () => {
        setIsDataProcessingLoading(false);
      };
    }
  };

  useEffect(() => {
    addAdditional(collectedMapData, additionalParams, tprmColorData);
  }, [additionalParams, collectedMapData, tprmColorData]);

  // ====================================================================================

  // Данные будут сгруппированы по определенным алгоритамам
  const [groupedData, setGroupedData] = useState<Record<string, any>[]>([]);

  const groupingProcess = (data: Record<string, any>[]) => {
    setIsDataProcessingLoading(true);
    if (workerInstanceGrouping) {
      workerInstanceGrouping.postMessage({
        mapData: data,
      });

      workerInstanceGrouping.onmessage = (ev) => {
        setIsDataProcessingLoading(false);
        if (ev.data) {
          const { newData } = ev.data;
          if (newData) setGroupedData(newData);
        }
        return null;
      };
      workerInstanceGrouping.onerror = () => {
        setIsDataProcessingLoading(false);
      };
    }
  };

  useEffect(() => {
    groupingProcess(dataWithAdditionalParams);
  }, [dataWithAdditionalParams]);

  return { dataWithAdditionalParams: groupedData, isDataProcessingLoading };
};
