import { sourcesManagementApi } from '6_shared';

const { useGetSourceConfigQuery, useGetSourceDataQuery } = sourcesManagementApi;

export const useGetSourceInfo = (sourceId?: number) => {
  const { data: sourceConfig, isFetching: isSourceConfigFetching } = useGetSourceConfigQuery(
    sourceId!,
    { skip: !sourceId },
  );
  const { data: sourceData, isFetching: isSourceDataFetching } = useGetSourceDataQuery(sourceId!, {
    skip: !sourceId,
  });

  return {
    sourceConfig,
    isSourceConfigFetching,
    sourceData,
    isSourceDataFetching,
  };
};
