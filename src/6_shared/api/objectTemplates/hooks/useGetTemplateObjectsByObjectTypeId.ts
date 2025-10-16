import { objectTemplatesApi } from '../objectTemplatesApi';

interface IProps {
  objectTypeId: number;
  skip?: boolean;
}

export const useGetTemplateObjectsByObjectTypeId = ({ objectTypeId, skip }: IProps) => {
  const { useGetTemplateObjectsByObjectTypeIdQuery } = objectTemplatesApi;

  const { data, isFetching, isError } = useGetTemplateObjectsByObjectTypeIdQuery(
    {
      object_type_id: objectTypeId,
    },
    { skip },
  );

  return { data, isFetching, isError };
};
