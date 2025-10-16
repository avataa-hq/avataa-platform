import { useEffect, useState } from 'react';
import {
  IColorRangeModel,
  IColorRangeFindByFilterBody,
  colorRangesApi,
  useColorsConfigure,
} from '6_shared';

const { useFindRangesByFilterQuery } = colorRangesApi;

interface IProps {
  params: IColorRangeFindByFilterBody;
  skip?: boolean;
}

export const useGetColorRangesData = ({ params, skip }: IProps) => {
  const [colorRangesData, setColorRangesData] = useState<IColorRangeModel[]>([]);
  const { isOnlyPrivateColors } = useColorsConfigure();

  const { data, ...rest } = useFindRangesByFilterQuery(params, { skip });

  useEffect(() => {
    if (!data) return;
    setColorRangesData(data);
  }, [data, isOnlyPrivateColors]);

  return { colorRangesData, ...rest };
};
