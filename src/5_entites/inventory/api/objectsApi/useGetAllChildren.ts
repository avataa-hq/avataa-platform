import { objectsApi } from '6_shared';

const { useGetAllChildrenQuery } = objectsApi;

interface IProps {
  moId: number;
  skip?: boolean;
}

export const useGetAllChildren = ({ moId, skip }: IProps) => {
  const {
    data: childObjects,
    isFetching: isChildObjects,
    isSuccess: isChildObjectsSuccess,
    isError: isChildObjectsError,
  } = useGetAllChildrenQuery(moId, { skip: !moId || skip });

  return {
    childObjects,
    isChildObjects,
    isChildObjectsSuccess,
    isChildObjectsError,
  };
};
