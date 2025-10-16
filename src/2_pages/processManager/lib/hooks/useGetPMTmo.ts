import { useEffect, useState } from 'react';
import { HierarchyObject } from '6_shared/api/hierarchy/types';
import { IFilterSetModel } from '6_shared';

interface IProps {
  hierarchyFirstChildren?: HierarchyObject[];
  pmSelectedFilterSet?: IFilterSetModel | null;
}
const useGetPMTmo = ({ hierarchyFirstChildren, pmSelectedFilterSet }: IProps) => {
  const [currentTmo, setCurrentTmo] = useState<number | undefined>();

  useEffect(() => {
    if (pmSelectedFilterSet && pmSelectedFilterSet?.tmo_info.id) {
      setCurrentTmo(pmSelectedFilterSet.tmo_info.id);
    } else if (hierarchyFirstChildren?.length) {
      const tmoId = hierarchyFirstChildren[0].object_type_id;
      setCurrentTmo(tmoId);
    }
  }, [hierarchyFirstChildren, pmSelectedFilterSet]);
  return currentTmo;
};

export default useGetPMTmo;
