import { objectTemplatesApi } from '6_shared';

interface IProps {
  objectTypeId: number;
  skip?: boolean;
}

export const useGetTemplatesByFilter = ({ objectTypeId, skip }: IProps) => {
  const { useGetTemplatesByFilterQuery } = objectTemplatesApi;

  const { data, isFetching, isError } = useGetTemplatesByFilterQuery(
    { object_type_id: objectTypeId },
    { skip },
  );

  return { data, isFetching, isError };
};
