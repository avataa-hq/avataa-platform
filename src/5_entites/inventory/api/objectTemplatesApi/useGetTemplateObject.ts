import { objectTemplatesApi } from '6_shared';

interface IProps {
  id: number;
  includeParameters: boolean;
  skip?: boolean;
}

export const useGetTemplateObject = ({ id, includeParameters, skip }: IProps) => {
  const { useGetTemplateObjectQuery } = objectTemplatesApi;

  const { data, isFetching, isError } = useGetTemplateObjectQuery(
    { id, include_parameters: includeParameters },
    { skip },
  );

  return { data, isFetching, isError };
};
