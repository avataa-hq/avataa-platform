import { pipelinesManagementApi } from '6_shared';
import { GetAllPipelinesByFiltersBody } from '6_shared/api/dataview/types';

interface IProps {
  searchQuery: string;
  tags: string[] | null;
  sortOrder: 'asc' | 'desc';
  pagination: {
    limit: number;
    offset: number;
  };
}

export const useGetAllPipelinesByFilters = ({
  searchQuery,
  tags,
  sortOrder,
  pagination,
}: IProps) => {
  const { useGetAllPipelinesByFiltersQuery } = pipelinesManagementApi;

  const body: GetAllPipelinesByFiltersBody = {
    filters: searchQuery
      ? [
          {
            column: 'name',
            rule: 'or',
            filters: [
              {
                operator: 'contains',
                value: searchQuery,
              },
            ],
          },
        ]
      : [],
    tag_filters: tags?.length
      ? {
          tags,
          operator: 'has_all',
        }
      : null,
    sort: {
      columns: ['name'],
      order: sortOrder,
    },
    pagination,
  };

  const {
    data: pipelinesData,
    isFetching: isAllPipelinesFetching,
    isError: isAllPipelinesError,
  } = useGetAllPipelinesByFiltersQuery(body);

  return { pipelinesData, isAllPipelinesFetching, isAllPipelinesError };
};
