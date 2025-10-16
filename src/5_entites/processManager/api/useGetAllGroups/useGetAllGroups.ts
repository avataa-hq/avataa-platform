import { groupApi } from '6_shared';

interface IProps {
  skip?: boolean;
  newOffset: number;
}

export const useGetAllGroups = ({ newOffset, skip }: IProps) => {
  const { useGetGroupsByTypeQuery } = groupApi;

  return useGetGroupsByTypeQuery({ group_type: 'process_group', offset: newOffset }, { skip });
};
