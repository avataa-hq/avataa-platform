import { objectTemplatesApi } from '6_shared';

interface IProps {
  templateId: number;
  depth: number;
  includeParameters: boolean;
  parentId?: number;
  skip?: boolean;
}

export const useGetTemplateObjects = ({
  templateId,
  depth,
  includeParameters,
  parentId,
  skip,
}: IProps) => {
  const { useGetTemplateObjectsQuery } = objectTemplatesApi;

  const { data, isFetching, isError } = useGetTemplateObjectsQuery(
    {
      template_id: templateId,
      depth,
      include_parameters: includeParameters,
      parent_id: parentId,
    },
    { skip },
  );

  return { data, isFetching, isError };
};
