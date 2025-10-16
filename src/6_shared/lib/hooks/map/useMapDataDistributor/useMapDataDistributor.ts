import { useCallback, useEffect, useState } from 'react';
import type { IDistributorDataModel, GeneralMapDataModel } from './types';
import { WorkerFactory } from '../../../utils';
import { workerMapDataDistributor } from './workerMapDataDistributor';

const { worker: workerInstance } = new WorkerFactory(workerMapDataDistributor);

interface IProps<T extends GeneralMapDataModel> {
  data?: T[];
}

export const useMapDataDistributor = <T extends GeneralMapDataModel>({
  data,
}: IProps<T>): {
  distributorData: IDistributorDataModel<T>;
  isLoadingDistributorData: boolean;
  isErrorDistributorData: boolean;
} => {
  const [isLoadingDistributorData, setIsLoadingDistributorData] = useState(false);
  const [isErrorDistributorData, setIsErrorDistributorData] = useState(false);

  const [distributorData, setDistributorData] = useState<IDistributorDataModel<T>>({});

  const objectsDistribution = useCallback((mapData: T[] = []) => {
    if (workerInstance) {
      setIsLoadingDistributorData(true);
      setIsErrorDistributorData(false);

      workerInstance.postMessage({ mapData });

      workerInstance.onmessage = (ev) => {
        if (ev.data) {
          const workerData = ev.data;
          setDistributorData(workerData);
        }

        setIsLoadingDistributorData(false);
      };
      workerInstance.onerror = (e) => {
        setIsLoadingDistributorData(false);
        setIsErrorDistributorData(true);
        return e;
      };
    }
  }, []);

  useEffect(() => {
    try {
      objectsDistribution(data);
    } catch (error) {
      console.error('ERROR WHEN DISTRIBUTING DATA', error);
      setIsErrorDistributorData(true);
    }
  }, [data]);

  return { distributorData, isLoadingDistributorData, isErrorDistributorData };
};
