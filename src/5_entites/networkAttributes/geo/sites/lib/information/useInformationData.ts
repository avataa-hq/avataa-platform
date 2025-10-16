import { useEffect, useState } from 'react';
import { transformData } from './transformData';

interface IProps {
  siteInformationData?: Record<string, any>;
  exclusion?: string[];
}

export const useInformationData = ({ siteInformationData, exclusion }: IProps) => {
  const [infoData, setInfoData] = useState<Record<string, any>>([]);

  useEffect(() => {
    if (!siteInformationData) return;
    const data = transformData(siteInformationData, exclusion);
    setInfoData(data);
  }, [siteInformationData, exclusion]);

  return { infoData };
};
