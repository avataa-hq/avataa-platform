import { useMemo } from 'react';
import { useGetAllChildrenTmoIdByTmo } from '5_entites/inventory/api';

interface IProps {
  tmoId: number;
  skip?: boolean;
}

export const useGetTemplatesDepth = ({ tmoId, skip }: IProps) => {
  const { data: allChildrenTmoIdByTmo } = useGetAllChildrenTmoIdByTmo({ tmoId, skip });

  const templateDepth = useMemo(
    () => (allChildrenTmoIdByTmo?.length ? allChildrenTmoIdByTmo.length + 1 : 1),
    [allChildrenTmoIdByTmo],
  );

  return { templateDepth };
};
